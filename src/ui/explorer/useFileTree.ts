import { useState, useCallback } from 'react';
import type { FileNode, ParsingStatus, FileType } from './types';

const initialData: FileNode = {
  id: 'root',
  name: 'Project Root',
  type: 'folder',
  isOpen: true,
  children: [],
};

export const useFileTree = () => {
  const [data, setData] = useState<FileNode>(initialData);

  // --- Helpers ---

  const updateNode = (
    root: FileNode,
    targetId: string,
    transform: (node: FileNode) => FileNode
  ): FileNode => {
    if (root.id === targetId) return transform(root);
    if (root.children) {
      return {
        ...root,
        children: root.children.map((child) =>
          updateNode(child, targetId, transform)
        ),
      };
    }
    return root;
  };

  const removeNode = (
    root: FileNode,
    nodeId: string
  ): { newRoot: FileNode; node: FileNode | null } => {
    if (root.children) {
      const foundIndex = root.children.findIndex((c) => c.id === nodeId);
      if (foundIndex !== -1) {
        const node = root.children[foundIndex];
        const newChildren = [...root.children];
        newChildren.splice(foundIndex, 1);
        return { newRoot: { ...root, children: newChildren }, node };
      }
      let foundNode: FileNode | null = null;
      const newChildren = root.children.map((child) => {
        const result = removeNode(child, nodeId);
        if (result.node) foundNode = result.node;
        return result.newRoot;
      });
      return { newRoot: { ...root, children: newChildren }, node: foundNode };
    }
    return { newRoot: root, node: null };
  };

  // --- Actions ---

  const toggleFolder = useCallback((id: string) => {
    setData((prev) =>
      updateNode(prev, id, (node) => ({ ...node, isOpen: !node.isOpen }))
    );
  }, []);

  const addNode = useCallback((parentId: string, newNode: FileNode) => {
    setData((prev) =>
      updateNode(prev, parentId, (node) => ({
        ...node,
        isOpen: true,
        children: [...(node.children || []), newNode].sort((a, b) => {
          if (a.type === 'folder' && b.type !== 'folder') return -1;
          if (a.type !== 'folder' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
        }),
      }))
    );
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setData((prev) => {
      if (nodeId === 'root') return prev;
      const { newRoot } = removeNode(prev, nodeId);
      return newRoot;
    });
  }, []);

  const moveNode = useCallback((draggedId: string, targetFolderId: string) => {
    if (draggedId === targetFolderId) return;
    setData((prev) => {
      const { newRoot: tempRoot, node } = removeNode(prev, draggedId);
      if (!node) return prev;
      return updateNode(tempRoot, targetFolderId, (target) => ({
        ...target,
        isOpen: true,
        children: [...(target.children || []), node],
      }));
    });
  }, []);

  const updateStatus = useCallback((nodeId: string, status: ParsingStatus) => {
    setData((prev) =>
      updateNode(prev, nodeId, (node) => ({ ...node, status }))
    );
  }, []);

  // --- FIXED BATCH IMPORT ---
  const batchImportFiles = useCallback(
    (targetFolderId: string, files: FileList) => {
      // 1. Generate IDs and prepare data structures beforehand
      const filesToProcess: {
        id: string;
        pathParts: string[];
        fileObj: File;
      }[] = [];

      Array.from(files).forEach((file) => {
        const pathParts = file.webkitRelativePath
          ? file.webkitRelativePath.split('/')
          : [file.name];

        filesToProcess.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          pathParts,
          fileObj: file,
        });
      });

      // 2. Update State: Build Tree & Add Files (Status: Processing)
      setData((prev) => {
        const cloneTree = JSON.parse(JSON.stringify(prev));

        // Find Target Node
        let targetNode: FileNode | null = null;
        const findNode = (node: FileNode) => {
          if (node.id === targetFolderId) targetNode = node;
          if (node.children) node.children.forEach(findNode);
        };
        findNode(cloneTree);

        if (!targetNode || (targetNode as FileNode).type !== 'folder') {
          targetNode = cloneTree;
        }

        // Build Structure
        filesToProcess.forEach(({ id, pathParts, fileObj }) => {
          let currentLevel = targetNode as FileNode;

          // Create folders if missing
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i];
            let existingFolder = currentLevel.children?.find(
              (c) => c.name === folderName && c.type === 'folder'
            );

            if (!existingFolder) {
              const newFolder: FileNode = {
                id: 'folder-' + Date.now() + Math.random(),
                name: folderName,
                type: 'folder',
                isOpen: true,
                children: [],
              };
              currentLevel.children = [
                ...(currentLevel.children || []),
                newFolder,
              ];
              existingFolder = newFolder;
            }
            currentLevel = existingFolder;
          }

          // Add File
          const fileName = pathParts[pathParts.length - 1];
          const isPdf = fileName.endsWith('.pdf');
          const isImage = fileName.match(/\.(jpeg|jpg|png|gif)$/i);

          const newFile: FileNode = {
            id: id, // Use pre-generated ID
            name: fileName,
            type: isPdf ? 'pdf' : isImage ? 'image' : 'file',
            status: 'processing', // Initial Status
            path: fileObj.webkitRelativePath || fileName,
          };

          currentLevel.children?.push(newFile);
        });

        return cloneTree;
      });

      // 3. Simulate Async Parsing (Update to Success)
      // We update the specific IDs we just created after a delay
      setTimeout(() => {
        setData((prev) => {
          let clone = JSON.parse(JSON.stringify(prev));

          // Helper to bulk update specific IDs in the tree
          const updateBulkStatus = (node: FileNode) => {
            const targetFile = filesToProcess.find((f) => f.id === node.id);
            if (targetFile) {
              node.status = 'success'; // Mark as success
            }
            if (node.children) {
              node.children.forEach(updateBulkStatus);
            }
          };

          updateBulkStatus(clone);
          return clone;
        });
      }, 1500); // 1.5 second delay to show the spinner
    },
    []
  );

  return {
    data,
    toggleFolder,
    addNode,
    deleteNode,
    moveNode,
    updateStatus,
    batchImportFiles,
  };
};
