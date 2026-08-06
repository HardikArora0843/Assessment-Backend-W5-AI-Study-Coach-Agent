/**
 * Loading Spinner Component
 * Displays a loading animation
 */

import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', text }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  return (
    <div className="flex items-center space-x-2">
      <Loader2 className={`animate-spin text-primary-600 ${sizeClasses[size]}`} />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
