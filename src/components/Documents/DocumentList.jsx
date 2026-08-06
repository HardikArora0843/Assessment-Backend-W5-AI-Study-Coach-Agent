/**
 * Document List Component
 * Displays uploaded documents with delete functionality
 */

import { FileText, Trash2, Calendar, File } from 'lucide-react';
import { formatFileSize, formatRelativeTime, getFileIcon, getFileColor } from '../../utils/formatters';
import { deleteFile } from '../../services/api';
import toast from 'react-hot-toast';

const DocumentList = ({ documents, onDelete }) => {
  const handleDelete = async (fileId, filename) => {
    try {
      await deleteFile(fileId);
      toast.success(`Deleted ${filename}`);
      if (onDelete) onDelete(fileId);
    } catch (error) {
      toast.error(`Failed to delete file: ${error.message}`);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No documents uploaded
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          Upload your study materials to start asking questions and learning.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const Icon = getFileIcon(doc.type);
        const colorClass = getFileColor(doc.type);
        
        return (
          <div
            key={doc.id}
            className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* File Icon */}
              <div className={`p-3 bg-gray-100 dark:bg-gray-700 rounded-lg ${colorClass}`}>
                <Icon className="h-6 w-6" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {doc.filename}
                </h4>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <File className="h-3 w-3 mr-1" />
                    {doc.type.toUpperCase()}
                  </span>
                  <span>•</span>
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{doc.pageCount} page{doc.pageCount !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatRelativeTime(doc.uploadDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleDelete(doc.id, doc.filename)}
              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all"
              aria-label="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentList;
