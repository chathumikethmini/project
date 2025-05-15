import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import DocumentCard from './components/DocumentCard';
import UploadModal from './components/UploadModal';
import DocumentViewer from './components/DocumentViewer';
import { Document, SearchFilters } from './types';
import { Plus } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Project Proposal',
    description: 'A comprehensive proposal for the new document retrieval system project outlining scope, timeline, and budget.',
    fileUrl: 'https://static.pexels.com/photos/1.pdf',
    fileType: 'pdf',
    fileSize: 2500000,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-02-01T14:45:00Z',
    tags: ['Important', 'Work', 'Project'],
    isFavorite: true
  },
  {
    id: '2',
    title: 'System Architecture',
    description: 'Technical documentation detailing the architecture of the document retrieval system.',
    fileUrl: 'https://static.pexels.com/photos/2.docx',
    fileType: 'docx',
    fileSize: 1800000,
    createdAt: '2025-01-20T09:15:00Z',
    updatedAt: '2025-01-25T11:30:00Z',
    tags: ['Technical', 'Architecture'],
    isFavorite: false
  },
  {
    id: '3',
    title: 'User Research Results',
    description: 'Analysis of user research conducted for the document retrieval system project.',
    fileUrl: 'https://static.pexels.com/photos/3.xlsx',
    fileType: 'xlsx',
    fileSize: 3200000,
    createdAt: '2025-01-10T13:45:00Z',
    updatedAt: '2025-01-18T16:20:00Z',
    tags: ['Research', 'User Experience'],
    isFavorite: true
  },
  {
    id: '4',
    title: 'Design Mockups',
    description: 'Visual design mockups for the document retrieval system interface.',
    fileUrl: 'https://static.pexels.com/photos/4.jpg',
    fileType: 'image',
    fileSize: 4500000,
    createdAt: '2025-01-22T15:10:00Z',
    updatedAt: '2025-01-30T10:45:00Z',
    tags: ['Design', 'UI/UX'],
    isFavorite: false
  },
  {
    id: '5',
    title: 'Meeting Notes - Jan 15',
    description: 'Notes from project kickoff meeting with stakeholders.',
    fileUrl: 'https://static.pexels.com/photos/5.pdf',
    fileType: 'pdf',
    fileSize: 1200000,
    createdAt: '2025-01-15T16:30:00Z',
    updatedAt: '2025-01-15T18:00:00Z',
    tags: ['Meetings', 'Work'],
    isFavorite: false
  },
  {
    id: '6',
    title: 'Budget Forecast',
    description: 'Financial forecast and budget allocation for the project.',
    fileUrl: 'https://static.pexels.com/photos/6.xlsx',
    fileType: 'xlsx',
    fileSize: 1900000,
    createdAt: '2025-01-28T11:20:00Z',
    updatedAt: '2025-02-02T09:15:00Z',
    tags: ['Financial', 'Work'],
    isFavorite: false
  }
];

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: []
  });

  // Extract all unique tags from documents
  const allTags = [...new Set(documents.flatMap(doc => doc.tags))];
  
  // Extract all unique file types from documents
  const allFileTypes = [...new Set(documents.map(doc => doc.fileType))];
  
  useEffect(() => {
    // Apply filters
    let result = [...documents];
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        (doc.description && doc.description.toLowerCase().includes(query)) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(doc => 
        filters.tags.some(tag => doc.tags.includes(tag))
      );
    }
    
    if (filters.fileTypes && filters.fileTypes.length > 0) {
      result = result.filter(doc => 
        filters.fileTypes!.includes(doc.fileType)
      );
    }
    
    if (filters.dateRange) {
      if (filters.dateRange.from) {
        const fromDate = new Date(filters.dateRange.from);
        result = result.filter(doc => new Date(doc.updatedAt) >= fromDate);
      }
      
      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999); // End of day
        result = result.filter(doc => new Date(doc.updatedAt) <= toDate);
      }
    }
    
    setFilteredDocuments(result);
  }, [documents, filters]);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleUpload = (file: File, title: string, description: string, tags: string[]) => {
    const newDocument: Document = {
      id: (documents.length + 1).toString(),
      title,
      description,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type.split('/')[1] || file.name.split('.').pop() || 'unknown',
      fileSize: file.size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags,
      isFavorite: false
    };
    
    setDocuments([newDocument, ...documents]);
  };

  const handleFavorite = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
    ));
    
    if (selectedDocument && selectedDocument.id === id) {
      setSelectedDocument({
        ...selectedDocument,
        isFavorite: !selectedDocument.isFavorite
      });
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    
    if (selectedDocument && selectedDocument.id === id) {
      setSelectedDocument(null);
    }
  };

  const handleView = (id: string) => {
    const doc = documents.find(doc => doc.id === id) || null;
    setSelectedDocument(doc);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Documents</h1>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors md:hidden"
                >
                  <Plus className="h-5 w-5" />
                  <span>Upload</span>
                </button>
              </div>
              
              <div className="mb-6">
                <SearchBar 
                  onSearch={handleSearch} 
                  availableTags={allTags}
                  availableFileTypes={allFileTypes} 
                />
              </div>
              
              {filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.id} 
                      document={doc} 
                      onFavorite={handleFavorite}
                      onDelete={handleDelete}
                      onView={handleView}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      No documents found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {filters.query || filters.tags.length > 0 || (filters.fileTypes && filters.fileTypes.length > 0)
                        ? "No documents match your search criteria. Try adjusting your filters."
                        : "Upload your first document to get started."}
                    </p>
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                    >
                      Upload Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
        
        <UploadModal 
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
          availableTags={allTags}
        />
        
        <DocumentViewer 
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onFavorite={handleFavorite}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;