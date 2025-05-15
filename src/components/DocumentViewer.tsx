import React from 'react';
import { Download, Heart, Star, X } from 'lucide-react';
import { Document } from '../types';

interface DocumentViewerProps {
  document: Document | null;
  onClose: () => void;
  onFavorite: (id: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  document, 
  onClose, 
  onFavorite 
}) => {
  if (!document) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Preview component based on file type
  const renderPreview = () => {
    const type = document.fileType.toLowerCase();
    
    if (type.includes('pdf')) {
      return (
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden h-[60vh]">
          <iframe 
            src={document.fileUrl} 
            className="w-full h-full" 
            title={document.title}
          />
        </div>
      );
    }
    
    if (type.includes('image')) {
      return (
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center h-[60vh]">
          <img 
            src={document.fileUrl} 
            alt={document.title}
            className="max-w-full max-h-full object-contain" 
          />
        </div>
      );
    }
    
    // For other file types, show a download prompt
    return (
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Preview not available
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This file type cannot be previewed directly. Please download the file to view its contents.
          </p>
          <a
            href={document.fileUrl}
            download
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Download File
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6">
            <div className="mb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {document.title}
                </h2>
                <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{document.fileType.toUpperCase()} • {formatFileSize(document.fileSize)}</span>
                  <span className="mx-2">•</span>
                  <span>Updated {formatDate(document.updatedAt)}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onFavorite(document.id)}
                  className={`p-2 rounded-full ${
                    document.isFavorite 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${document.isFavorite ? 'fill-red-500' : ''}`} />
                </button>
                <a 
                  href={document.fileUrl} 
                  download
                  className="p-2 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Download className="h-5 w-5" />
                </a>
              </div>
            </div>

            {document.description && (
              <div className="mb-4 text-gray-700 dark:text-gray-300">
                <p>{document.description}</p>
              </div>
            )}

            <div className="mb-4 flex flex-wrap">
              {document.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="mr-2 mb-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;