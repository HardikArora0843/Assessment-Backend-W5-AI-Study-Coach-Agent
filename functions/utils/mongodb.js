/**
 * MongoDB Connection Utility
 * Handles MongoDB connection management for Netlify Functions
 */

import { MongoClient } from 'mongodb';

// Global variable to hold the connection
let client = null;
let db = null;

/**
 * Get MongoDB connection
 * Reuses existing connection if available
 */
export async function getMongoDB() {
  if (client && db) {
    return db;
  }

  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db('study-coach');
    
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB: ' + error.message);
  }
}

/**
 * Close MongoDB connection
 * Called when function execution completes
 */
export async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

/**
 * Get documents collection
 */
export async function getDocumentsCollection() {
  const db = await getMongoDB();
  return db.collection('documents');
}
