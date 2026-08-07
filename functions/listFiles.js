/**
 * List Files Endpoint
 * Returns list of all uploaded documents using MongoDB
 */

import { getAllDocuments } from './models/Document.js';
import { closeMongoDB } from './utils/mongodb.js';

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
    // Validate MongoDB connection
    if (!process.env.MONGODB_URI) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'MongoDB URI is not configured. Please set MONGODB_URI environment variable.' 
        }),
      };
    }

    // Get all documents from MongoDB
    const documents = await getAllDocuments();

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
  } finally {
    // Close MongoDB connection
    await closeMongoDB();
  }
};
