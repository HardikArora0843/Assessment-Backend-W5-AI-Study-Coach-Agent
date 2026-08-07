/**
 * Settings Page
 * Application settings and preferences
 */

import { useState } from 'react';
import { Trash2, Moon, Sun, Clock, FileText } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clearAppStorage, getStats } from '../utils/storage';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const stats = getStats();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all local data? This will remove your chat history and cached documents.')) {
      setIsClearing(true);
      try {
        clearAppStorage();
        toast.success('All local data cleared successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch {
        toast.error('Failed to clear data');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          label: 'Theme',
          description: 'Switch between light and dark mode',
          icon: theme === 'dark' ? Moon : Sun,
          action: toggleTheme,
          actionLabel: theme === 'dark' ? 'Switch to Light' : 'Switch to Dark',
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          label: 'Clear Local Data',
          description: 'Remove chat history and cached documents from browser',
          icon: Trash2,
          action: handleClearData,
          actionLabel: 'Clear Data',
          danger: true,
        },
      ],
    },
    {
      title: 'Statistics',
      items: [
        {
          label: 'Questions Asked',
          description: stats.questionsAsked.toString(),
          icon: FileText,
          noAction: true,
        },
        {
          label: 'Documents Uploaded',
          description: stats.documentsUploaded.toString(),
          icon: FileText,
          noAction: true,
        },
        {
          label: 'Total Tokens Used',
          description: stats.totalTokensUsed.toLocaleString(),
          icon: Clock,
          noAction: true,
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your application preferences and data
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${item.danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <item.icon className={`h-5 w-5 ${item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {!item.noAction && (
                      <button
                        onClick={item.action}
                        disabled={isClearing}
                        className={`
                          px-4 py-2 text-sm font-medium rounded-lg transition-colors
                          ${item.danger
                            ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400'
                            : 'bg-primary-600 hover:bg-primary-700 text-white disabled:bg-primary-400'
                          }
                          disabled:cursor-not-allowed
                        `}
                      >
                        {isClearing && item.danger ? 'Clearing...' : item.actionLabel}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>AI Study Coach v1.0.0</p>
          <p className="mt-1">Built with React, Vite, and OpenAI</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
