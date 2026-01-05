import React, { useState } from 'react';
import styles from './FileExplorer.module.css';

// --- Types ---
type FileType = 'folder' | 'file' | 'image' | 'pdf';

interface FileNode {
  id: string;
  name: string;
  type: FileType;
  children?: FileNode[];
  isOpen?: boolean;
}

// --- Reusable Icon Component ---
// Uses CSS variables to handle the mix of State (React) and Hover (CSS) logic
const Icon = ({
  name,
  className,
  filled,
}: {
  name: string;
  className?: string;
  filled: boolean;
}) => (
  <span
    className={`material-symbols-rounded ${className || ''} ${styles.iconBase}`}
    style={
      {
        '--icon-fill': filled ? 1 : 0,
        fontVariationSettings: `'FILL' var(--icon-fill)`,
      } as React.CSSProperties
    }
  >
    {name}
  </span>
);

// --- Initial Mock Data ---
const initialData: FileNode = {
  id: 'root',
  name: 'Code Base',
  type: 'folder',
  isOpen: true,
  children: [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      children: [],
    },
    {
      id: '2',
      name: 'assets',
      type: 'folder',
      children: [],
    },
    {
      id: '3',
      name: 'documentation.pdf',
      type: 'pdf',
    },
    {
      id: '4',
      name: 'design_mockup.png',
      type: 'image',
    },
  ],
};

// --- Recursive Node Component ---
const FileNodeItem: React.FC<{
  node: FileNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onAdd: (parentId: string, type: 'file' | 'folder', name: string) => void;
}> = ({ node, depth, selectedId, onSelect, onToggle, onAdd }) => {
  const isSelected = node.id === selectedId;

  // Logic: Filled if Selected OR (Folder is Collapsed)
  // Hover fill is handled in CSS
  const isFilledState = isSelected || (node.type === 'folder' && !node.isOpen);

  const handleAdd = (e: React.MouseEvent, type: 'file' | 'folder') => {
    e.stopPropagation();
    const name = window.prompt(`Enter name for new ${type}:`);
    if (name) onAdd(node.id, type, name);
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
    if (node.type === 'folder') {
      onToggle(node.id);
    }
  };

  const getIconConfig = (type: FileType, isOpen?: boolean) => {
    switch (type) {
      case 'folder':
        return {
          // Standard: Open folder shows 'folder_open', Closed shows 'folder'
          // But user wants filled behavior specific to state.
          // We can stick to the generic 'folder' shape for both states if we rely solely on FILL to distinguish,
          // OR switch shapes. Standard UX usually switches shapes.
          // Let's use 'folder' for closed and 'folder_open' for open, but apply the FILL logic requested.
          name: isOpen ? 'folder_open' : 'folder',
          className: styles.folderIcon,
        };
      case 'pdf':
        return { name: 'picture_as_pdf', className: styles.pdfIcon };
      case 'image':
        return { name: 'image', className: styles.imgIcon };
      default:
        return { name: 'description', className: styles.fileIcon };
    }
  };

  const iconConfig = getIconConfig(node.type, node.isOpen);

  return (
    <div>
      <div
        className={`${styles.nodeRow} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={handleNodeClick}
      >
        <div className={styles.nodeContent}>
          {/* Chevron for Folders */}
          <span className={styles.chevronContainer}>
            {node.type === 'folder' && (
              <Icon
                name={node.isOpen ? 'expand_more' : 'chevron_right'}
                className={styles.chevron}
                filled={false} // Chevrons usually don't fill
              />
            )}
          </span>

          {/* Main Icon */}
          <Icon
            name={iconConfig.name}
            className={iconConfig.className}
            filled={isFilledState}
          />

          <span className={styles.nodeText}>{node.name}</span>
        </div>

        {/* Hover Actions */}
        {node.type === 'folder' && (
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={(e) => handleAdd(e, 'file')}
              title="New File"
            >
              <Icon name="note_add" filled={false} />
            </button>
            <button
              className={styles.actionBtn}
              onClick={(e) => handleAdd(e, 'folder')}
              title="New Folder"
            >
              <Icon name="create_new_folder" filled={false} />
            </button>
          </div>
        )}
      </div>

      {/* Children */}
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
            onAdd={onAdd}
          />
        ))}
    </div>
  );
};

// --- Main Explorer Component ---
export const FileExplorer: React.FC = () => {
  const [data, setData] = useState<FileNode>(initialData);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateTree = (
    nodes: FileNode,
    targetId: string,
    updateFn: (node: FileNode) => FileNode
  ): FileNode => {
    if (nodes.id === targetId) {
      return updateFn(nodes);
    }
    if (nodes.children) {
      return {
        ...nodes,
        children: nodes.children.map((child) =>
          updateTree(child, targetId, updateFn)
        ),
      };
    }
    return nodes;
  };

  const toggleFolder = (id: string) => {
    setData((prev) =>
      updateTree(prev, id, (node) => ({ ...node, isOpen: !node.isOpen }))
    );
  };

  const addItem = (parentId: string, type: 'file' | 'folder', name: string) => {
    const newItem: FileNode = {
      id: Date.now().toString(),
      name,
      type:
        type === 'folder'
          ? 'folder'
          : name.endsWith('.pdf')
          ? 'pdf'
          : name.endsWith('.png') || name.endsWith('.jpg')
          ? 'image'
          : 'file',
      children: type === 'folder' ? [] : undefined,
      isOpen: true,
    };

    setData((prev) =>
      updateTree(prev, parentId, (node) => ({
        ...node,
        isOpen: true,
        children: [...(node.children || []), newItem].sort((a, b) => {
          if (a.type === 'folder' && b.type !== 'folder') return -1;
          if (a.type !== 'folder' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
        }),
      }))
    );
  };

  return (
    <div className={styles.explorerContainer}>
      <FileNodeItem
        node={data}
        depth={0}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onToggle={toggleFolder}
        onAdd={addItem}
      />
    </div>
  );
};
