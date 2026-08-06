/**
 * List Files Endpoint
 * Returns list of all uploaded documents
 */

import fs from 'fs-extra';
import path from 'path';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge');

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Ensure knowledge directory exists
    await fs.ensureDir(KNOWLEDGE_DIR);

    // Read all knowledge files
    const knowledgeFiles = await fs.readdir(KNOWLEDGE_DIR);
    const documents = [];

    for (const file of knowledgeFiles) {
      if (file.endsWith('.json')) {
        const filePath = path.join(KNOWLEDGE_DIR, file);
        const data = await fs.readJson(filePath);
        
        // Return only metadata, not the full text
        documents.push({
          id: data.id,
          filename: data.filename,
          type: data.type,
          size: data.size,
          pageCount: data.pageCount,
          uploadDate: data.uploadDate,
          textLength: data.extractedText.length,
        });
      }
    }

    // Sort by upload date (newest first)
    documents.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        documents: documents,
        total: documents.length,
      }),
    };

  } catch (error) {
    console.error('List files error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to list files: ' + error.message 
      }),
    };
  }
};
