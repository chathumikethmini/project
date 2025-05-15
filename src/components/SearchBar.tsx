import React, { useState } from 'react';
import { Calendar, ChevronDown, Filter, Search, X } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  availableTags: string[];
  availableFileTypes: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  availableTags, 
  availableFileTypes 
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    fileTypes: [],
    dateRange: {
      from: '',
      to: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, query: e.target.value });
  };

  const toggleTag = (tag: string) => {
    if (filters.tags.includes(tag)) {
      setFilters({
        ...filters,
        tags: filters.tags.filter(t => t !== tag)
      });
    } else {
      setFilters({
        ...filters,
        tags: [...filters.tags, tag]
      });
    }
  };

  const toggleFileType = (type: string) => {
    if (filters.fileTypes?.includes(type)) {
      setFilters({
        ...filters,
        fileTypes: filters.fileTypes.filter(t => t !== type)
      });
    } else {
      setFilters({
        ...filters,
        fileTypes: [...(filters.fileTypes || []), type]
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      tags: [],
      fileTypes: [],
      dateRange: {
        from: '',
        to: ''
      }
    });
    setIsAdvancedOpen(false);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search documents by title, content, or tags..."
            className="block w-full pl-10 pr-16 py-3 border-0 focus:ring-0 text-gray-900 dark:text-white bg-transparent"
            value={filters.query}
            onChange={handleQueryChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button 
              type="button" 
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-sm">Filters</span>
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {isAdvancedOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                        ${filters.tags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File Types</h3>
                <div className="flex flex-wrap gap-2">
                  {availableFileTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleFileType(type)}
                      className={`px-3 py-1 rounded-full text-xs font-medium uppercase transition-colors
                        ${filters.fileTypes?.includes(type)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={filters.dateRange?.from || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, from: e.target.value }
                    })}
                    placeholder="From"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={filters.dateRange?.to || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, to: e.target.value }
                    })}
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400 flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Reset Filters
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;