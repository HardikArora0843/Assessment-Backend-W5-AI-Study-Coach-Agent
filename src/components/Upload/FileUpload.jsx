/**
 * File Upload Component
 * Handles drag-and-drop and file selection for document uploads
 */

import { useState, useCallback } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { uploadFile } from '../../services/api';
import { isValidFileType, isValidFileSize } from '../../utils/validation';
import { formatFileSize } from '../../utils/formatters';
import toast from 'react-hot-toast';

const FileUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const MAX_FILE_SIZE = 4194304; // 4 MB

  const processFiles = useCallback(async (files) => {
    const validFiles = files.filter(file => {
      if (!isValidFileType(file)) {
        toast.error(`Invalid file type: ${file.name}. Please upload PDF, DOCX, or TXT files.`);
        return false;
      }
      if (!isValidFileSize(file, MAX_FILE_SIZE)) {
        toast.error(`File too large: ${file.name}. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    for (const file of validFiles) {
      try {
        const result = await uploadFile(file);
        
        setUploadedFiles(prev => [...prev, { ...result, file }]);
        toast.success(`Successfully uploaded ${file.name}`);
        
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    setIsUploading(false);
  }, [onUploadSuccess]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, [processFiles]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  }, [processFiles]);

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`
              p-4 rounded-full transition-colors
              ${isDragging ? 'bg-primary-100 dark:bg-primary-800' : 'bg-gray-100 dark:bg-gray-800'}
            `}>
              <Upload className={`h-8 w-8 ${isDragging ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'}`} />
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isDragging ? 'Drop your files here' : 'Upload study materials'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Drag and drop files here, or click to browse
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">PDF</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">DOCX</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">TXT</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">Max {formatFileSize(MAX_FILE_SIZE)}</span>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • {file.pages} page{file.pages !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isUploading && (
        <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="animate-spin">
            <Upload className="h-5 w-5" />
          </div>
          <span>Uploading and processing files...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
