/**
 * Dashboard Page
 * Main dashboard with stats, document list, and quick actions
 */

import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Plus, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { getStats } from '../utils/storage';
import StatsCard from '../components/Dashboard/StatsCard';
import DocumentList from '../components/Documents/DocumentList';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Dashboard = () => {
  const { documents, isLoading, refreshDocuments } = useDocuments();
  const stats = getStats();

  const recentDocuments = documents.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your learning progress and documents
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Documents"
          value={documents.length}
          icon={FileText}
          color="primary"
        />
        <StatsCard
          title="Questions Asked"
          value={stats.questionsAsked}
          icon={MessageSquare}
          color="accent"
        />
        <StatsCard
          title="Tokens Used"
          value={stats.totalTokensUsed.toLocaleString()}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Study Sessions"
          value={Math.ceil(stats.questionsAsked / 5)}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Documents Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Documents
              </h2>
              <button
                onClick={refreshDocuments}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Refresh
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" text="Loading documents..." />
              </div>
            ) : (
              <DocumentList 
                documents={recentDocuments} 
                onDelete={refreshDocuments}
              />
            )}
            
            {documents.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  <span>View all {documents.length} documents</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Start Chat Card */}
          <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Start Chatting</h3>
            </div>
            <p className="text-white/90 mb-4">
              Ask questions about your uploaded study materials and get instant AI-powered answers.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <span>Open Chat</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Upload Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Plus className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload More
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add more study materials to expand your knowledge base.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <span>Upload Files</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Empty State Info */}
          {documents.length === 0 && !isLoading && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Getting Started
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Upload your first document to start using AI Study Coach. We support PDF, DOCX, and TXT files.
              </p>
              <Link
                to="/"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Learn how it works →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
