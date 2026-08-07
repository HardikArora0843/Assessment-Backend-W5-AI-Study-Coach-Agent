/**
 * Upload Endpoint
 * Handles file uploads, text extraction, and storage using Netlify Blobs
 */

import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  // Initialize Netlify Blobs store
  const store = getStore({
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });

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

    // Generate unique ID
    const fileId = uuidv4();
    
    // Extract text based on file type using the file buffer from formidable
    let extractedText = '';
    let pageCount = 0;

    if (fileExt === '.pdf') {
      const fs = await import('fs-extra');
      const dataBuffer = await fs.readFile(file.filepath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
      pageCount = pdfData.numpages;
    } else if (fileExt === '.docx') {
      const fs = await import('fs-extra');
      const dataBuffer = await fs.readFile(file.filepath);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      extractedText = result.value;
      pageCount = 1; // DOCX doesn't have page count in the same way
    } else if (fileExt === '.txt') {
      // For txt files, read the content from the file path
      const fs = await import('fs-extra');
      extractedText = await fs.readFile(file.filepath, 'utf-8');
      pageCount = 1;
    }

    // Clean and validate extracted text
    extractedText = extractedText.trim();
    
    if (!extractedText || extractedText.length < 10) {
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

    // Store knowledge metadata in Netlify Blobs
    const knowledge = {
      id: fileId,
      filename: file.originalFilename,
      type: fileExt,
      size: file.size,
      extractedText: extractedText,
      pageCount: pageCount,
      uploadDate: new Date().toISOString(),
    };

    // Save knowledge metadata as JSON in Blobs
    await store.set(`knowledge/${fileId}.json`, JSON.stringify(knowledge, null, 2), {
      contentType: 'application/json',
    });

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
