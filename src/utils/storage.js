/**
 * Local storage utilities
 */

const STORAGE_KEYS = {
  CHAT_HISTORY: 'study_coach_chat_history',
  DOCUMENTS_CACHE: 'study_coach_documents_cache',
  THEME: 'study_coach_theme',
  STATS: 'study_coach_stats',
};

/**
 * Get item from local storage
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Set item in local storage
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

/**
 * Remove item from local storage
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all app data from local storage
 */
export const clearAppStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Chat history operations
 */
export const getChatHistory = () => {
  return getStorageItem(STORAGE_KEYS.CHAT_HISTORY, []);
};

export const saveChatHistory = (history) => {
  setStorageItem(STORAGE_KEYS.CHAT_HISTORY, history);
};

export const addToChatHistory = (message) => {
  const history = getChatHistory();
  history.push(message);
  // Keep only last 100 messages
  if (history.length > 100) {
    history.shift();
  }
  saveChatHistory(history);
};

export const clearChatHistory = () => {
  setStorageItem(STORAGE_KEYS.CHAT_HISTORY, []);
};

/**
 * Documents cache operations
 */
export const getDocumentsCache = () => {
  return getStorageItem(STORAGE_KEYS.DOCUMENTS_CACHE, []);
};

export const setDocumentsCache = (documents) => {
  setStorageItem(STORAGE_KEYS.DOCUMENTS_CACHE, documents);
};

/**
 * Theme operations
 */
export const getTheme = () => {
  return getStorageItem(STORAGE_KEYS.THEME, 'light');
};

export const setTheme = (theme) => {
  setStorageItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Stats operations
 */
export const getStats = () => {
  return getStorageItem(STORAGE_KEYS.STATS, {
    questionsAsked: 0,
    documentsUploaded: 0,
    totalTokensUsed: 0,
  });
};

export const updateStats = (updates) => {
  const stats = getStats();
  const newStats = { ...stats, ...updates };
  setStorageItem(STORAGE_KEYS.STATS, newStats);
};

export const incrementQuestionsAsked = () => {
  const stats = getStats();
  updateStats({ questionsAsked: stats.questionsAsked + 1 });
};

export const incrementDocumentsUploaded = () => {
  const stats = getStats();
  updateStats({ documentsUploaded: stats.documentsUploaded + 1 });
};

export const addTokensUsed = (tokens) => {
  const stats = getStats();
  updateStats({ totalTokensUsed: stats.totalTokensUsed + tokens });
};
