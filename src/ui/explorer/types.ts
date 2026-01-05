// src/ui/explorer/types.ts

export type FileType = 'folder' | 'file' | 'image' | 'pdf';
export type ParsingStatus = 'success' | 'failed' | 'processing' | 'idle';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  children?: FileNode[]; // Only for folders
  isOpen?: boolean; // Only for folders
  status?: ParsingStatus; // Only for files
  path?: string; // Simulated path or relative path
}

export interface DragItem {
  id: string;
  type: FileType;
}
