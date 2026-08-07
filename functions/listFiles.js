/**
 * List Files Endpoint
 * Returns list of all uploaded documents using Netlify Blobs
 */

import { getStore } from '@netlify/blobs';

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
    // Initialize Netlify Blobs store
    let store;
    try {
      store = getStore({
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_ACCESS_TOKEN,
      });
    } catch (error) {
      console.error('Failed to initialize Netlify Blobs:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Netlify Blobs is not properly configured. Please enable Blobs in your Netlify dashboard.',
          details: 'Go to Site settings → Functions → Blobs and enable Blobs with store ID: study-coach-uploads'
        }),
      };
    }

    // List all knowledge files from Netlify Blobs
    const documents = [];
    
    try {
      const blobs = await store.list({ prefix: 'knowledge/' });
      
      for (const blob of blobs.blobs) {
        if (blob.key.endsWith('.json')) {
          const blobData = await store.get(blob.key);
          if (blobData) {
            const data = JSON.parse(blobData);
            
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
      }
    } catch (error) {
      console.error('Error listing files from Blobs:', error);
      // If no files exist yet, return empty array
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
        error: 'Failed to list files: ' + error.message,
        details: 'Make sure Netlify Blobs is enabled in your Netlify dashboard'
      }),
    };
  }
};
