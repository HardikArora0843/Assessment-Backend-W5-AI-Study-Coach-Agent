/**
 * Documents Hook
 * Manages document state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { listFiles } from '../services/api';
import { getDocumentsCache, setDocumentsCache } from '../utils/storage';
import toast from 'react-hot-toast';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await listFiles();
      setDocuments(response.documents || []);
      setDocumentsCache(response.documents || []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load documents');
      
      // Fall back to cache
      const cached = getDocumentsCache();
      setDocuments(cached);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load from cache first for instant display
    const cached = getDocumentsCache();
    if (cached.length > 0) {
      setDocuments(cached);
      setIsLoading(false);
    }
    
    // Then fetch fresh data
    fetchDocuments();
  }, [fetchDocuments]);

  const addDocument = useCallback((document) => {
    setDocuments(prev => [document, ...prev]);
  }, []);

  const removeDocument = useCallback((fileId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== fileId));
  }, []);

  const refreshDocuments = useCallback(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    error,
    addDocument,
    removeDocument,
    refreshDocuments,
  };
};
