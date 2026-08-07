/**
 * Document Model
 * Handles document operations in MongoDB
 */

import { getDocumentsCollection } from '../utils/mongodb.js';

/**
 * Create a new document
 */
export async function createDocument(documentData) {
  const collection = await getDocumentsCollection();
  
  const document = {
    ...documentData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await collection.insertOne(document);
  return { ...document, _id: result.insertedId };
}

/**
 * Get document by ID
 */
export async function getDocumentById(id) {
  const collection = await getDocumentsCollection();
  return await collection.findOne({ _id: id });
}

/**
 * Get all documents
 */
export async function getAllDocuments() {
  const collection = await getDocumentsCollection();
  const documents = await collection.find({}).sort({ createdAt: -1 }).toArray();
  
  // Transform MongoDB documents to API format
  return documents.map(doc => ({
    id: doc._id.toString(),
    filename: doc.filename,
    type: doc.type,
    size: doc.size,
    pageCount: doc.pageCount,
    uploadDate: doc.createdAt.toISOString(),
    textLength: doc.extractedText.length,
  }));
}

/**
 * Delete document by ID
 */
export async function deleteDocument(id) {
  const collection = await getDocumentsCollection();
  const result = await collection.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

/**
 * Get document by ID (for deletion)
 */
export async function getDocumentForDeletion(id) {
  const collection = await getDocumentsCollection();
  return await collection.findOne({ _id: id });
}

/**
 * Get all documents with full text content (for AI processing)
 */
export async function getAllDocumentsWithContent() {
  const collection = await getDocumentsCollection();
  return await collection.find({}).sort({ createdAt: -1 }).toArray();
}

/**
 * Update document
 */
export async function updateDocument(id, updates) {
  const collection = await getDocumentsCollection();
  const result = await collection.updateOne(
    { _id: id },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    }
  );
  return result.modifiedCount > 0;
}
