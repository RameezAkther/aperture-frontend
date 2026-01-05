// src/ui/explorer/FileNodeItem.tsx
import React, { useState, useRef } from 'react';
import styles from './FileExplorer.module.css';
import type { FileNode, ParsingStatus, FileType } from './types';
import { FileIcon } from './FileIcon';

interface FileNodeItemProps {
  node: FileNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onAddFile: (parentId: string, file: File) => void;
  onAddFolder: (parentId: string, name: string) => void;
  onDelete: (id: string) => void;
  onMove: (draggedId: string, targetId: string) => void;
}

export const FileNodeItem: React.FC<FileNodeItemProps> = ({
  node,
  depth,
  selectedId,
  onSelect,
  onToggle,
  onAddFile,
  onAddFolder,
  onDelete,
  onMove,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const getStatusIcon = (status?: ParsingStatus) => {
    switch (status) {
      case 'success':
        return (
          <span
            className={`material-symbols-rounded ${styles.statusIcon} ${styles.success}`}
          >
            check_circle
          </span>
        );

      case 'failed':
        return (
          <span
            className={`material-symbols-rounded ${styles.statusIcon} ${styles.error}`}
          >
            error
          </span>
        );

      case 'processing':
        return (
          <span
            className={`material-symbols-rounded ${styles.statusIcon} ${styles.loading}`}
          >
            progress_activity
          </span>
        );

      default:
        return null;
    }
  };

  // --- Drag & Drop ---
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/react-dnd-id', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (node.type === 'folder') {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedId = e.dataTransfer.getData('application/react-dnd-id');
    if (draggedId && node.type === 'folder') {
      onMove(draggedId, node.id);
    }
  };

  // --- Inline Creation Logic ---
  const startCreating = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreating(true);
    // Timeout to focus after render
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCreateSubmit = () => {
    if (newTypeName.trim()) {
      onAddFolder(node.id, newTypeName);
    }
    setIsCreating(false);
    setNewTypeName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateSubmit();
    if (e.key === 'Escape') setIsCreating(false);
  };

  // --- File Inputs (Hidden) ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => onAddFile(node.id, file));
    }
    e.target.value = ''; // Reset
  };

  return (
    <div className={styles.nodeContainer}>
      {/* Hidden Inputs for Native Selection */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileImport}
      />

      {/* Node Row */}
      <div
        className={`${styles.nodeRow} ${
          selectedId === node.id ? styles.selected : ''
        } ${isDragOver ? styles.dragOver : ''}`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
          if (node.type === 'folder') onToggle(node.id);
        }}
        draggable={node.id !== 'root'}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.nodeContent}>
          <div
            style={{
              marginRight: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FileIcon name={node.name} type={node.type} isOpen={node.isOpen} />
          </div>
          <span className={styles.nodeText}>{node.name}</span>
          {getStatusIcon(node.status)}
        </div>

        {/* Hover Actions */}
        {node.type === 'folder' && (
          <div className={styles.actions}>
            <button
              title="New Folder"
              onClick={startCreating}
              className={styles.actionBtn}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: '16px' }}
              >
                create_new_folder
              </span>
            </button>
            <button
              title="Import Files"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className={styles.actionBtn}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: '16px' }}
              >
                upload_file
              </span>
            </button>
            {/* Root cannot be deleted */}
            {node.id !== 'root' && (
              <button
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
                className={styles.actionBtn}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: '16px' }}
                >
                  delete
                </span>
              </button>
            )}
          </div>
        )}
        {/* Delete for files */}
        {node.type !== 'folder' && (
          <div className={styles.actions}>
            <button
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              className={styles.actionBtn}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: '16px' }}
              >
                delete
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Inline Input for New Folder */}
      {isCreating && (
        <div
          className={styles.nodeRow}
          style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: '20px', color: '#dcb67a' }}
          >
            folder
          </span>
          <input
            ref={inputRef}
            className={styles.inlineInput}
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            onBlur={handleCreateSubmit}
            onKeyDown={handleKeyDown}
            placeholder="Folder Name"
          />
        </div>
      )}

      {/* Children Recursion */}
      {node.isOpen &&
        node.children &&
        node.children.map((child) => (
          <FileNodeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
            onToggle={onToggle}
            onAddFile={onAddFile}
            onAddFolder={onAddFolder}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
    </div>
  );
};
