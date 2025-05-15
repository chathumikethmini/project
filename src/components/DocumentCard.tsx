import React from 'react';
import { Clock, Download, FileText, Heart, MoreVertical, Trash } from 'lucide-react';
import { Document } from '../types';

interface DocumentCardProps {
  document: Document;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onFavorite, 
  onDelete, 
  onView 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = () => {
    const type = document.fileType.toLowerCase();
    if (type.includes('pdf')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    if (type.includes('doc')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    if (type.includes('xls')) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    if (type.includes('ppt')) return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    if (type.includes('image')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center ${getFileIcon()}`}>
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <button 
                onClick={() => onView(document.id)}
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-[200px] text-left"
              >
                {document.title}
              </button>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {document.fileType.toUpperCase()} • {formatFileSize(document.fileSize)}
                </span>
              </div>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10">
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => { onView(document.id); setShowMenu(false); }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Document
                    </button>
                  </li>
                  <li>
                    <a 
                      href={document.fileUrl} 
                      download
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setShowMenu(false)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </li>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => { onFavorite(document.id); setShowMenu(false); }}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${document.isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
                      {document.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400"
                      onClick={() => { onDelete(document.id); setShowMenu(false); }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {document.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
            {document.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-1">
            {document.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{document.tags.length - 2}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(document.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex border-t border-gray-200 dark:border-gray-700">
        <button 
          className="flex-1 py-2 text-xs text-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          onClick={() => onView(document.id)}
        >
          View
        </button>
        <button 
          className="flex-1 py-2 text-xs text-center border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          onClick={() => onFavorite(document.id)}
        >
          {document.isFavorite ? (
            <span className="flex items-center justify-center text-red-500">
              <Heart className="h-3 w-3 mr-1 fill-red-500" />
              Favorited
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Heart className="h-3 w-3 mr-1" />
              Favorite
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;