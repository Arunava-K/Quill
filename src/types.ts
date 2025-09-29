export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  folder_id?: number | null;
  is_starred: boolean;
}

export interface Folder {
  id: number;
  name: string;
  parent_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
  expanded?: boolean;
}
