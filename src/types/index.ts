export interface Document {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
}

export interface SearchFilters {
  query: string;
  tags: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  fileTypes?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}