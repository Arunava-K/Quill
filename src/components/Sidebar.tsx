import { Note } from "../types";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onCreateNote: () => void;
  notes: Note[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ currentView, onViewChange, onCreateNote, notes, isOpen, onToggle }: SidebarProps) {
  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'starred',
      label: 'Starred',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      id: 'quick-notes',
      label: 'Quick Notes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'search',
      label: 'Search',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    }
  ];

  const workspaceFolders = [
    { id: 'folder-1', name: 'Folder 1', count: Math.floor(notes.length * 0.3) },
    { id: 'folder-2', name: 'Folder 2', count: Math.floor(notes.length * 0.25) },
    { id: 'folder-3', name: 'Folder 3', count: Math.floor(notes.length * 0.2) },
    { id: 'folder-4', name: 'Folder 4', count: Math.floor(notes.length * 0.25) }
  ];

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Floating Sidebar */}
      <div className={`
        fixed top-3 left-3 h-[calc(100vh-24px)] z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:top-0 lg:left-0 lg:h-full lg:translate-x-0
      `}>
         <div 
           className="w-80 h-full backdrop-blur-xl rounded-18 flex flex-col shadow-2xl lg:shadow-soft"
           style={{ 
             backgroundColor: 'var(--color-surface)',
             border: '1px solid var(--color-neutral-300)'
           }}
         >
          {/* Header */}
          <div 
            className="p-6 border-b"
            style={{ borderColor: 'var(--color-neutral-300)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-text-primary)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Quill
                </h1>
              </div>
              
              {/* Close button for mobile */}
              <button
                onClick={onToggle}
                className="lg:hidden p-2 rounded-lg transition-all duration-200"
                style={{ 
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* New Note Button */}
            <button
              onClick={() => {
                onCreateNote();
                // Auto-close sidebar on mobile after creating note
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className="w-full px-4 py-3 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-soft hover:shadow-medium transform hover:scale-105 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-neutral-800)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-text-primary)';
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
            
            <p 
              className="text-sm leading-relaxed mt-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Capture your thoughts and ideas in beautiful, organized notes
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Main Navigation */}
            <div className="p-4 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    // Auto-close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                  style={{
                    backgroundColor: currentView === item.id ? 'var(--color-neutral-200)' : 'transparent',
                    color: currentView === item.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    if (currentView !== item.id) {
                      e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentView !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }
                  }}
                >
                  <span style={{ 
                    color: currentView === item.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' 
                  }}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Workspace Section */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-3">
                <h3 
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Workspace
                </h3>
                <button 
                  className="p-1 rounded transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                {workspaceFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onViewChange(folder.id);
                      // Auto-close sidebar on mobile after navigation
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                      currentView === folder.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="text-sm font-medium">{folder.name}</span>
                    </div>
                    {folder.count > 0 && (
                      <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">
                        {folder.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-primary-100/50 space-y-1">
            <button
              onClick={() => {
                onViewChange('trash');
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                currentView === 'trash'
                  ? 'bg-red-50 text-red-700'
                  : 'text-neutral-500 hover:bg-neutral-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm font-medium">Trash</span>
            </button>
            <button
              onClick={() => {
                onViewChange('settings');
                if (window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                currentView === 'settings'
                  ? 'bg-neutral-100 text-neutral-700'
                  : 'text-neutral-500 hover:bg-neutral-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
