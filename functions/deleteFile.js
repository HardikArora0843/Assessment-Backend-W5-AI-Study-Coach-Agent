/**
 * Delete File Endpoint
 * Handles deletion of uploaded documents and their knowledge data using Netlify Blobs
 */

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

    // Find the knowledge file in Netlify Blobs
    const knowledgeKey = `knowledge/${fileId}.json`;
    
    try {
      const blobData = await store.get(knowledgeKey);
      
      if (!blobData) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'File not found' }),
        };
      }

      const knowledge = JSON.parse(blobData);
      
      // Delete the knowledge file from Blobs
      await store.delete(knowledgeKey);

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
      if (error.message.includes('not found') || error.statusCode === 404) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'File not found' }),
        };
      }
      throw error;
    }

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
