/**
 * Home Page
 * Landing page with hero section and feature highlights
 */

import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageSquare, Sparkles, Zap, Shield, Upload } from 'lucide-react';
import FileUpload from '../components/Upload/FileUpload';
import { useDocuments } from '../hooks/useDocuments';
import { incrementDocumentsUploaded } from '../utils/storage';

const Home = () => {
  const { documents, addDocument } = useDocuments();

  const handleUploadSuccess = (result) => {
    addDocument(result);
    incrementDocumentsUploaded();
  };

  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Upload PDF, DOCX, or TXT files with drag-and-drop simplicity',
    },
    {
      icon: MessageSquare,
      title: 'AI-Powered Chat',
      description: 'Ask questions and get instant answers from your study materials',
    },
    {
      icon: Sparkles,
      title: 'Smart Context',
      description: 'Advanced AI understands context and provides accurate responses',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant responses powered by the latest AI technology',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your documents are processed securely and never shared',
    },
    {
      icon: BookOpen,
      title: 'Learn Better',
      description: 'Transform how you study with personalized AI assistance',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-slate-200/[0.3] dark:bg-grid-slate-800/[0.3] bg-[size:20px_20px]" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Learning Assistant</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Transform Your Study Materials into
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {' '}Interactive Learning
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your documents and ask questions. Get instant, accurate answers powered by advanced AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/chat"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-medium transition-colors"
              >
                <span>Start Learning</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-medium border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <span>View Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Upload Your Study Materials
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Get started by uploading your documents. Support for PDF, DOCX, and TXT files.
              </p>
            </div>
            
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            
            {documents.length > 0 && (
              <div className="mt-6 text-center">
                <Link
                  to="/chat"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  <span>Start chatting with your {documents.length} document{documents.length !== 1 ? 's' : ''}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Learn Smarter
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to enhance your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning smarter with AI Study Coach
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-medium transition-colors"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
