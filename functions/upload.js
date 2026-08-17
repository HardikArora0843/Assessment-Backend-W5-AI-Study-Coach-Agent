/**
 * Upload Endpoint
 * Handles file uploads, text extraction, and storage using MongoDB
 */

import path from 'path';
import { Readable } from 'stream';
import formidable from 'formidable';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { createDocument } from './models/Document.js';
import { closeMongoDB } from './utils/mongodb.js';

export const handler = async (event) => {
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
    // Validate MongoDB connection
    if (!process.env.MONGODB_URI) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error:
            'MongoDB URI is not configured. Please set MONGODB_URI environment variable.',
        }),
      };
    }

    // Parse the multipart form data.
    // The default is 4 MB, matching the frontend and Netlify-safe
    // application upload limit.
    const form = formidable({
      maxFileSize:
        parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 4194304,
      keepExtensions: true,
    });

    const formData = await parseForm(event, form);
    const file = getFirstFile(formData.files.file);

    if (!file) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'No file uploaded',
        }),
      };
    }

    // Validate file size again after parsing.
    const maxUploadSize =
      parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 4194304;

    if (file.size > maxUploadSize) {
      return {
        statusCode: 413,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: `File too large. Maximum allowed size is ${formatBytes(
            maxUploadSize
          )}. Please choose a smaller file.`,
        }),
      };
    }

    // Validate file type
    const fileExt = path
      .extname(file.originalFilename)
      .toLowerCase();

    const supportedTypes = ['.pdf', '.docx', '.txt'];

    if (!supportedTypes.includes(fileExt)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error:
            'Unsupported file type. Please upload PDF, DOCX, or TXT files.',
        }),
      };
    }

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
      const result = await mammoth.extractRawText({
        buffer: dataBuffer,
      });

      extractedText = result.value;
      pageCount = 1;
    } else if (fileExt === '.txt') {
      const fs = await import('fs-extra');

      extractedText = await fs.readFile(
        file.filepath,
        'utf-8'
      );

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
          error:
            'Could not extract sufficient text from the file. Please try a different file.',
        }),
      };
    }

    // Store document metadata in MongoDB
    const documentData = {
      filename: file.originalFilename,
      type: fileExt,
      size: file.size,
      extractedText: extractedText,
      pageCount: pageCount,
    };

    try {
      const savedDocument = await createDocument(
        documentData
      );

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          id: savedDocument._id.toString(),
          filename: file.originalFilename,
          type: fileExt,
          size: file.size,
          pages: pageCount,
          pageCount,
          uploadDate:
            savedDocument.createdAt.toISOString(),
          textLength: extractedText.length,
        }),
      };
    } catch (error) {
      console.error(
        'Failed to store document in MongoDB:',
        error
      );

      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error:
            'Failed to store document in MongoDB.',
          details: error.message,
        }),
      };
    }
  } catch (error) {
    console.error('Upload error:', error);

    // Handle files rejected by formidable because they exceed
    // the configured maximum file size.
    if (
      error?.code === 'LIMIT_FILE_SIZE' ||
      error?.httpCode === 413 ||
      error?.status === 413
    ) {
      const maxUploadSize =
        parseInt(process.env.MAX_UPLOAD_SIZE, 10) ||
        4194304;

      return {
        statusCode: 413,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: `File too large. Maximum allowed size is ${formatBytes(
            maxUploadSize
          )}. Please choose a smaller file.`,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Upload failed: ' + error.message,
      }),
    };
  } finally {
    // Close MongoDB connection
    await closeMongoDB();
  }
};

// Helper function to parse form data from Netlify event
async function parseForm(event, form) {
  return new Promise((resolve, reject) => {
    if (!event.body) {
      reject(new Error('Invalid body format'));
      return;
    }

    const contentType =
      event.headers['content-type'] ||
      event.headers['Content-Type'];

    if (!contentType) {
      reject(new Error('Missing Content-Type header'));
      return;
    }

    const buffer = Buffer.isBuffer(event.body)
      ? event.body
      : Buffer.from(
          event.body,
          event.isBase64Encoded
            ? 'base64'
            : 'utf-8'
        );

    const request = Readable.from([buffer]);

    request.headers = {
      'content-type': contentType,
      'content-length': buffer.length,
    };

    request.method = event.httpMethod;
    request.url = event.path || '/upload';

    form.parse(
      request,
      (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            fields,
            files,
          });
        }
      }
    );
  });
}

function getFirstFile(fileOrFiles) {
  return Array.isArray(fileOrFiles)
    ? fileOrFiles[0]
    : fileOrFiles;
}

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const units = [
    'Bytes',
    'KB',
    'MB',
    'GB',
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${Number(value.toFixed(2))} ${units[index]}`;
}