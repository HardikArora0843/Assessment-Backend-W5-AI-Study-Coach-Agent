/**
 * Delete File Endpoint
 * Handles deletion of uploaded documents using MongoDB
 */

import { ObjectId } from 'mongodb';
import { deleteDocument, getDocumentForDeletion } from './models/Document.js';
import { closeMongoDB } from './utils/mongodb.js';

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

    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(fileId);
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid file ID format' }),
      };
    }

    // Get document info before deletion
    const document = await getDocumentForDeletion(objectId);
    
    if (!document) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'File not found' }),
      };
    }

    // Delete the document from MongoDB
    const deleted = await deleteDocument(objectId);

    if (!deleted) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'File not found' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'File deleted successfully',
        filename: document.filename,
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
  } finally {
    // Close MongoDB connection
    await closeMongoDB();
  }
};
