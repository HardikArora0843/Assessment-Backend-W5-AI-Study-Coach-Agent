/**
 * Delete File Endpoint
 * Handles deletion of uploaded documents and their knowledge data
 */

import fs from 'fs-extra';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge');

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { fileId } = JSON.parse(event.body);

    if (!fileId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'File ID is required' }),
      };
    }

    // Find the knowledge file
    const knowledgePath = path.join(KNOWLEDGE_DIR, `${fileId}.json`);
    
    if (!(await fs.pathExists(knowledgePath))) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'File not found' }),
      };
    }

    // Read knowledge to get the file path
    const knowledge = await fs.readJson(knowledgePath);
    
    // Delete the uploaded file
    if (await fs.pathExists(knowledge.path)) {
      await fs.remove(knowledge.path);
    }

    // Delete the knowledge file
    await fs.remove(knowledgePath);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'File deleted successfully',
        filename: knowledge.filename,
      }),
    };

  } catch (error) {
    console.error('Delete error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to delete file: ' + error.message 
      }),
    };
  }
};
