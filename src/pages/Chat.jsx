/**
 * Chat Page
 * Main chat interface for asking questions about study materials
 */

import { useChat } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';
import ChatInterface from '../components/Chat/ChatInterface';
import { AlertCircle, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chat = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const { documents } = useDocuments();

  if (documents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Study Materials Uploaded
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to upload at least one document before you can start asking questions.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Documents</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Study Coach
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask questions about your {documents.length} uploaded document{documents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Chat Interface */}
        <div className="h-[calc(100vh-200px)]">
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            onClearChat={clearChat}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
