/**
 * Validation utilities
 */

/**
 * Validate file type
 */
export const isValidFileType = (file) => {
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const validExtensions = ['.pdf', '.docx', '.txt'];
  
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  
  return validTypes.includes(file.type) || validExtensions.includes(extension);
};

/**
 * Validate file size
 */
export const isValidFileSize = (file, maxSize = 10485760) => {
  return file.size <= maxSize;
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate question is not empty
 */
export const isValidQuestion = (question) => {
  return question && question.trim().length > 0;
};
