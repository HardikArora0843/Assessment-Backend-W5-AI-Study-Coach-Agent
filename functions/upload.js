/**
 * Upload Endpoint
 * Handles file uploads, text extraction, and storage
 */

import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Configure storage paths
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge');

export const handler = async (event) => {
  // Ensure directories exist
  await fs.ensureDir(UPLOAD_DIR);
  await fs.ensureDir(KNOWLEDGE_DIR);
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the multipart form data
    const form = formidable({
      maxFileSize: parseInt(process.env.MAX_UPLOAD_SIZE) || 10485760, // 10MB default
      keepExtensions: true,
    });

    const formData = await parseForm(event, form);
    const file = formData.files.file;

    if (!file) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'No file uploaded' }),
      };
    }

    // Validate file type
    const fileExt = path.extname(file.originalFilename).toLowerCase();
    const supportedTypes = ['.pdf', '.docx', '.txt'];
    
    if (!supportedTypes.includes(fileExt)) {
      await fs.remove(file.filepath);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' 
        }),
      };
    }

    // Generate unique ID and new filename
    const fileId = uuidv4();
    const newFilename = `${fileId}${fileExt}`;
    const uploadPath = path.join(UPLOAD_DIR, newFilename);
    
    // Move file to uploads directory
    await fs.move(file.filepath, uploadPath);

    // Extract text based on file type
    let extractedText = '';
    let pageCount = 0;

    if (fileExt === '.pdf') {
      const dataBuffer = await fs.readFile(uploadPath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
      pageCount = pdfData.numpages;
    } else if (fileExt === '.docx') {
      const dataBuffer = await fs.readFile(uploadPath);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      extractedText = result.value;
      pageCount = 1; // DOCX doesn't have page count in the same way
    } else if (fileExt === '.txt') {
      extractedText = await fs.readFile(uploadPath, 'utf-8');
      pageCount = 1;
    }

    // Clean and validate extracted text
    extractedText = extractedText.trim();
    
    if (!extractedText || extractedText.length < 10) {
      await fs.remove(uploadPath);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Could not extract sufficient text from the file. Please try a different file.' 
        }),
      };
    }

    // Store knowledge metadata
    const knowledge = {
      id: fileId,
      filename: file.originalFilename,
      type: fileExt,
      size: file.size,
      extractedText: extractedText,
      pageCount: pageCount,
      uploadDate: new Date().toISOString(),
      path: uploadPath,
    };

    // Save knowledge to JSON file
    const knowledgePath = path.join(KNOWLEDGE_DIR, `${fileId}.json`);
    await fs.writeJson(knowledgePath, knowledge, { spaces: 2 });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        id: fileId,
        filename: file.originalFilename,
        type: fileExt,
        size: file.size,
        pages: pageCount,
        uploadDate: knowledge.uploadDate,
        textLength: extractedText.length,
      }),
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Upload failed: ' + error.message 
      }),
    };
  }
};

// Helper function to parse form data from Netlify event
async function parseForm(event, form) {
  return new Promise((resolve, reject) => {
    // Check if body is a buffer or string
    let buffer;
    if (Buffer.isBuffer(event.body)) {
      buffer = event.body;
    } else if (typeof event.body === 'string') {
      buffer = Buffer.from(event.body, 'base64');
    } else {
      reject(new Error('Invalid body format'));
      return;
    }

    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    
    form.parse(
      { 
        headers: { 'content-type': contentType },
        buffer: buffer
      },
      (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      }
    );
  });
}
