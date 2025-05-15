import React, { useState } from 'react';
import { 
  Clock, 
  FileBox, 
  FolderOpen, 
  Heart, 
  Home, 
  Plus, 
  Star, 
  Tag, 
  Trash,
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  active = false, 
  badge,
  onClick 
}) => (
  <button 
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left text-sm
      ${active 
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    onClick={onClick}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className="flex-1">{label}</span>
    {badge !== undefined && (
      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        {badge}
      </span>
    )}
  </button>
);

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [tags] = useState(['Important', 'Work', 'Personal', 'Archive']);

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-800 overflow-y-auto p-4">
      <div className="mb-6">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200">
          <Plus className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <nav className="space-y-1">
        <SidebarItem 
          icon={<Home className="h-5 w-5" />} 
          label="Home" 
          active={activeItem === 'home'} 
          onClick={() => setActiveItem('home')}
        />
        <SidebarItem 
          icon={<Clock className="h-5 w-5" />} 
          label="Recent" 
          active={activeItem === 'recent'} 
          onClick={() => setActiveItem('recent')}
          badge={3}
        />
        <SidebarItem 
          icon={<Star className="h-5 w-5" />} 
          label="Favorites" 
          active={activeItem === 'favorites'} 
          onClick={() => setActiveItem('favorites')}
        />
        <SidebarItem 
          icon={<FileBox className="h-5 w-5" />} 
          label="All Documents" 
          active={activeItem === 'documents'} 
          onClick={() => setActiveItem('documents')}
          badge={24}
        />
      </nav>

      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          FOLDERS
        </h3>
        <div className="mt-2 space-y-1">
          <SidebarItem 
            icon={<FolderOpen className="h-5 w-5" />} 
            label="Work Projects" 
            active={activeItem === 'work'} 
            onClick={() => setActiveItem('work')}
          />
          <SidebarItem 
            icon={<FolderOpen className="h-5 w-5" />} 
            label="Personal" 
            active={activeItem === 'personal'} 
            onClick={() => setActiveItem('personal')}
          />
          <SidebarItem 
            icon={<FolderOpen className="h-5 w-5" />} 
            label="Research" 
            active={activeItem === 'research'} 
            onClick={() => setActiveItem('research')}
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          TAGS
        </h3>
        <div className="mt-2 space-y-1">
          {tags.map((tag) => (
            <SidebarItem 
              key={tag}
              icon={<Tag className="h-5 w-5" />} 
              label={tag} 
              active={activeItem === `tag-${tag}`} 
              onClick={() => setActiveItem(`tag-${tag}`)}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <SidebarItem 
          icon={<Trash className="h-5 w-5" />} 
          label="Trash" 
          active={activeItem === 'trash'} 
          onClick={() => setActiveItem('trash')}
        />
      </div>
    </aside>
  );
};

export default Sidebar;