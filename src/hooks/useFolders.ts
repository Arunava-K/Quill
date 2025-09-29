import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Folder, FolderTreeNode } from "../types";

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all folders from the backend
  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedFolders = await invoke<Folder[]>("get_folders");
      setFolders(fetchedFolders);
    } catch (err) {
      console.error("Failed to load folders:", err);
      setError(err as string);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  // Create a new folder
  const createFolder = useCallback(
    async (name: string, parentId?: number | null): Promise<Folder> => {
      try {
        const newFolder = await invoke<Folder>("create_folder", {
          name,
          parentId: parentId || null,
        });
        setFolders((prev) => [...prev, newFolder]);
        return newFolder;
      } catch (err) {
        console.error("Failed to create folder:", err);
        throw err;
      }
    },
    []
  );

  // Update an existing folder
  const updateFolder = useCallback(
    async (
      id: number,
      name: string,
      parentId?: number | null
    ): Promise<Folder> => {
      try {
        const updatedFolder = await invoke<Folder>("update_folder", {
          id,
          name,
          parentId: parentId || null,
        });
        setFolders((prev) =>
          prev.map((folder) => (folder.id === id ? updatedFolder : folder))
        );
        return updatedFolder;
      } catch (err) {
        console.error("Failed to update folder:", err);
        throw err;
      }
    },
    []
  );

  // Delete a folder
  const deleteFolder = useCallback(async (id: number): Promise<void> => {
    try {
      await invoke("delete_folder", { id });
      setFolders((prev) => prev.filter((folder) => folder.id !== id));
    } catch (err) {
      console.error("Failed to delete folder:", err);
      throw err;
    }
  }, []);

  // Build folder tree structure
  const buildFolderTree = useCallback(
    (parentId: number | null = null): FolderTreeNode[] => {
      return folders
        .filter((folder) => folder.parent_id === parentId)
        .map((folder) => ({
          ...folder,
          children: buildFolderTree(folder.id),
          expanded: false,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    [folders]
  );

  // Get folder tree
  const folderTree = buildFolderTree();

  // Get folder by ID
  const getFolderById = useCallback(
    (id: number): Folder | undefined => {
      return folders.find((folder) => folder.id === id);
    },
    [folders]
  );

  // Get folder path (breadcrumb trail)
  const getFolderPath = useCallback(
    (folderId: number): Folder[] => {
      const path: Folder[] = [];
      let currentId: number | null | undefined = folderId;

      while (currentId) {
        const folder = getFolderById(currentId);
        if (!folder) break;
        path.unshift(folder);
        currentId = folder.parent_id;
      }

      return path;
    },
    [getFolderById]
  );

  return {
    folders,
    folderTree,
    loading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    loadFolders,
    getFolderById,
    getFolderPath,
  };
}
