interface HeaderProps {
  onToggleSidebar: () => void;
  currentView: string;
}

export default function Header({ onToggleSidebar, currentView }: HeaderProps) {
  const getViewTitle = (view: string) => {
    switch (view) {
      case 'home':
        return 'Home';
      case 'starred':
        return 'Starred Notes';
      case 'quick-notes':
        return 'Quick Notes';
      case 'search':
        return 'Search';
      case 'trash':
        return 'Trash';
      case 'settings':
        return 'Settings';
      case 'editor':
        return 'Editor';
      default:
        if (view.startsWith('folder-')) {
          const folderNumber = view.split('-')[1];
          return `Folder ${folderNumber}`;
        }
        return 'Quill';
    }
  };

  return (
    <header 
      className="lg:hidden sticky top-0 z-30 backdrop-blur-xl border-b px-3 py-3"
      style={{ 
        backgroundColor: 'rgba(245, 244, 241, 0.9)',
        borderColor: 'var(--color-neutral-300)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl transition-all duration-200"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-text-primary)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h1 
              className="text-lg font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {getViewTitle(currentView)}
            </h1>
          </div>
        </div>

        {/* Search button for mobile */}
        <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
