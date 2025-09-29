import { useState } from "react";
import { FolderTreeNode } from "../types";
import { useDroppable } from "@dnd-kit/core";

interface FolderTreeProps {
  folders: FolderTreeNode[];
  selectedFolderId?: number | null;
  onSelectFolder: (folderId: number | null) => void;
  onCreateFolder?: (parentId?: number) => void;
  onEditFolder?: (folderId: number) => void;
  onDeleteFolder?: (folderId: number) => void;
}

interface FolderNodeProps {
  folder: FolderTreeNode;
  level: number;
  selectedFolderId?: number | null;
  onSelectFolder: (folderId: number | null) => void;
  onToggleExpand: (folderId: number) => void;
  expandedFolders: Set<number>;
  onCreateFolder?: (parentId?: number) => void;
  onEditFolder?: (folderId: number) => void;
  onDeleteFolder?: (folderId: number) => void;
}

function FolderNode({
  folder,
  level,
  selectedFolderId,
  onSelectFolder,
  onToggleExpand,
  expandedFolders,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
}: FolderNodeProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isExpanded = expandedFolders.has(folder.id);
  const isSelected = selectedFolderId === folder.id;
  const hasChildren = folder.children.length > 0;

  // Make folder droppable
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
    data: {
      type: "folder",
      folder: folder,
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectFolder(folder.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(folder.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(true);
  };

  return (
    <div>
      <div
        ref={setNodeRef}
        className={`group flex items-center px-3 py-2 rounded-xl cursor-pointer transition-all relative ${
          isSelected
            ? "font-medium"
            : "hover:bg-neutral-100"
        }`}
        style={{
          paddingLeft: `${12 + level * 20}px`,
          backgroundColor: isOver 
            ? "var(--color-primary-100)" 
            : isSelected 
              ? "var(--color-neutral-200)" 
              : "transparent",
          color: isOver
            ? "var(--color-primary-700)"
            : isSelected 
              ? "var(--color-text-primary)" 
              : "var(--color-text-secondary)",
          border: isOver ? "2px dashed var(--color-primary-500)" : "2px solid transparent",
        }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {/* Expand/Collapse Icon */}
        <button
          onClick={handleToggle}
          className="mr-1 p-1 hover:bg-neutral-200 rounded transition-colors"
          style={{ 
            visibility: hasChildren ? "visible" : "hidden",
            minWidth: "20px"
          }}
        >
          <svg
            className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Folder Icon */}
        <svg
          className={`w-4 h-4 mr-2 flex-shrink-0 ${isExpanded ? "text-primary-500" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isExpanded
                ? "M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                : "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            }
          />
        </svg>

        {/* Folder Name */}
        <span className="flex-1 text-sm truncate">{folder.name}</span>

        {/* Context Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-200 rounded transition-all ml-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div
              className="absolute right-2 top-full mt-1 bg-white rounded-xl shadow-medium border border-neutral-200 py-1 z-20 min-w-[160px]"
              onClick={(e) => e.stopPropagation()}
            >
              {onCreateFolder && (
                <button
                  onClick={() => {
                    onCreateFolder(folder.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 transition-colors flex items-center"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Subfolder
                </button>
              )}
              {onEditFolder && (
                <button
                  onClick={() => {
                    onEditFolder(folder.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 transition-colors flex items-center"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Rename
                </button>
              )}
              {onDeleteFolder && (
                <button
                  onClick={() => {
                    if (confirm(`Delete folder "${folder.name}"? Notes in this folder will be moved to the root.`)) {
                      onDeleteFolder(folder.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 transition-colors flex items-center text-red-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Render Children */}
      {isExpanded && hasChildren && (
        <div>
          {folder.children.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              onToggleExpand={onToggleExpand}
              expandedFolders={expandedFolders}
              onCreateFolder={onCreateFolder}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
}: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  const handleToggleExpand = (folderId: number) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <FolderNode
          key={folder.id}
          folder={folder}
          level={0}
          selectedFolderId={selectedFolderId}
          onSelectFolder={onSelectFolder}
          onToggleExpand={handleToggleExpand}
          expandedFolders={expandedFolders}
          onCreateFolder={onCreateFolder}
          onEditFolder={onEditFolder}
          onDeleteFolder={onDeleteFolder}
        />
      ))}
    </div>
  );
}
