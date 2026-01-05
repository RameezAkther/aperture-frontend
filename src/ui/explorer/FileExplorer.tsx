import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useFileTree } from './useFileTree';
import { FileNodeItem } from './FileNodeItem';
import styles from './FileExplorer.module.css';
import type { FileNode } from './types';

// Define the interface for the Ref
export interface FileExplorerRef {
  triggerImport: () => void;
}

export const FileExplorer = forwardRef<FileExplorerRef, {}>((props, ref) => {
  const {
    data,
    toggleFolder,
    addNode,
    deleteNode,
    moveNode,
    updateStatus,
    batchImportFiles,
  } = useFileTree();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Hidden input ref
  const folderInputRef = useRef<HTMLInputElement>(null);

  // --- Expose Method to Parent ---
  useImperativeHandle(ref, () => ({
    triggerImport: () => {
      // Trigger the hidden input click
      folderInputRef.current?.click();
    },
  }));

  // --- Handlers ---

  const handleAddFolder = (parentId: string, name: string) => {
    const newNode: FileNode = {
      id: Date.now().toString(),
      name: name,
      type: 'folder',
      children: [],
      isOpen: true,
    };
    addNode(parentId, newNode);
  };

  const handleAddFile = (parentId: string, file: File) => {
    // Create a FileList-like object (array of 1) to reuse batch logic
    const dt = new DataTransfer();
    dt.items.add(file);
    batchImportFiles(parentId, dt.files);

    // Simulation of parsing (optional hook update)
    // Note: Since batchImport generates random IDs, we'd need a real backend
    // or a smarter ID system to track status updates perfectly.
    // For UI demo, we skip the status update simulation here to keep logic clean.
  };

  const handleFolderSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 100) {
      const confirm = window.confirm(
        `Importing ${files.length} files. Continue?`
      );
      if (!confirm) {
        e.target.value = '';
        return;
      }
    }

    // Determine Target: Selected Folder OR Root
    // If selectedId is a file, we find its parent?
    // Simplification: If a file is selected, we usually import to Root or the File's parent.
    // Since our hook doesn't easily expose "getParent(id)", let's default to:
    // If selected is Folder -> Import there.
    // Else -> Import to Root.

    // We need to find the node type for selectedId.
    // A quick tree traversal helper or passing the selected Node type would work.
    // For now, let's just attempt to import to 'root' if nothing selected,
    // or rely on batchImportFiles to fallback to root if target is invalid.

    const target = selectedId || 'root';
    batchImportFiles(target, files);

    e.target.value = ''; // Reset
  };

  return (
    <div className={styles.explorerContainer}>
      {/* Hidden Global Folder Input */}
      <input
        type="file"
        ref={folderInputRef}
        style={{ display: 'none' }}
        // @ts-ignore
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFolderSelected}
      />

      {/* Removed Toolbar Header */}

      <FileNodeItem
        node={data}
        depth={0}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onToggle={toggleFolder}
        onAddFile={handleAddFile}
        onAddFolder={handleAddFolder}
        onDelete={deleteNode}
        onMove={moveNode}
      />
    </div>
  );
});

FileExplorer.displayName = 'FileExplorer';
