import { useState } from 'react';
import { type FileSystemItem } from '@/types';
import { type MenuAction } from '@/ui/subui/ProjectOptionsMenu';

export const useSidebar = () => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [draggedItem, setDraggedItem] = useState<FileSystemItem | null>(null);
  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FileSystemItem | null>(null);
  const [itemToMove, setItemToMove] = useState<FileSystemItem | null>(null);

  // --- Mock Data ---
  const [items, setItems] = useState<FileSystemItem[]>([
    { id: '1', name: 'UmagineTN 2026 iTNT Hub', type: 'file', parentId: null },
    {
      id: 'folder-1',
      name: 'Documentation',
      type: 'folder',
      isOpen: true,
      parentId: null,
      children: [
        {
          id: '2',
          name: 'Technical rewriting',
          type: 'file',
          parentId: 'folder-1',
        },
        { id: '3', name: 'Doc Analysis', type: 'file', parentId: 'folder-1' },
      ],
    },
    { id: '4', name: 'Health Monitoring System', type: 'file', parentId: null },
    {
      id: 'folder-2',
      name: 'Archives',
      type: 'folder',
      isOpen: false,
      parentId: null,
      children: [],
    },
  ]);

  // --- Logic: Toggling & Layout ---
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleToggleFolder = (folderId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === folderId ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  // --- Logic: Drag & Drop ---
  const handleDragStart = (e: React.DragEvent, item: FileSystemItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const moveFile = (fileId: string, targetParentId: string | null) => {
    setItems((prevItems) => {
      let movedFile: FileSystemItem | null = null;

      const removeFromList = (list: FileSystemItem[]): FileSystemItem[] => {
        return list.reduce((acc, item) => {
          if (item.id === fileId) {
            movedFile = { ...item, parentId: targetParentId };
            return acc;
          }
          if (item.children) {
            return [
              ...acc,
              { ...item, children: removeFromList(item.children) },
            ];
          }
          return [...acc, item];
        }, [] as FileSystemItem[]);
      };

      const cleanList = removeFromList(prevItems);
      if (!movedFile) return prevItems;

      if (targetParentId === null) {
        return [...cleanList, movedFile!];
      } else {
        return cleanList.map((item) => {
          if (item.id === targetParentId && item.type === 'folder') {
            return {
              ...item,
              children: [...(item.children || []), movedFile!],
            };
          }
          return item;
        });
      }
    });
  };

  const handleDropOnFolder = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItem) return;
    if (draggedItem.type === 'folder') return;
    if (draggedItem.parentId === targetFolderId) return;
    moveFile(draggedItem.id, targetFolderId);
    setDraggedItem(null);
  };

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;
    if (!draggedItem.parentId) return;
    moveFile(draggedItem.id, null);
  };

  // --- Logic: CRUD Operations ---
  const handleRenameSubmit = (id: string, newName: string) => {
    setItems((prevItems) => {
      const updateRecursive = (list: FileSystemItem[]): FileSystemItem[] => {
        return list.map((item) => {
          if (item.id === id) return { ...item, name: newName };
          if (item.children)
            return { ...item, children: updateRecursive(item.children) };
          return item;
        });
      };
      return updateRecursive(prevItems);
    });
    setRenamingId(null);
  };

  const handleCreateFolder = () => {
    setItems((prevItems) => {
      const baseName = 'New Folder';
      let newName = baseName;
      let counter = 1;
      const existingNames = new Set(
        prevItems.filter((i) => i.parentId === null).map((i) => i.name)
      );
      while (existingNames.has(newName)) {
        newName = `${baseName} ${counter}`;
        counter++;
      }
      const newFolder: FileSystemItem = {
        id: `folder-${Date.now()}`,
        name: newName,
        type: 'folder',
        children: [],
        isOpen: true,
        parentId: null,
      };
      return [newFolder, ...prevItems];
    });
  };

  // --- Logic: Menus ---
  const handleMenuClick = (e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setActiveMenu({ id: item.id, x: rect.right + 10, y: rect.top });
  };

  const handleMenuAction = (action: MenuAction) => {
    if (!activeMenu) return;

    const findItem = (list: FileSystemItem[]): FileSystemItem | undefined => {
      for (const item of list) {
        if (item.id === activeMenu.id) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
    };

    const item = findItem(items);
    if (!item) return;

    if (action === 'delete') setItemToDelete(item);
    if (action === 'move') setItemToMove(item);
    if (action === 'rename') setRenamingId(item.id);
    if (action === 'share') console.log('Trigger Share for', item.name);

    setActiveMenu(null);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setItems((prev) => {
      const removeRecursive = (list: FileSystemItem[]): FileSystemItem[] => {
        return list
          .filter((i) => i.id !== itemToDelete.id)
          .map((i) => ({
            ...i,
            children: i.children ? removeRecursive(i.children) : [],
          }));
      };
      return removeRecursive(prev);
    });
    setItemToDelete(null);
  };

  // ... inside useSidebar return object, add this function:

  const handleMoveToFolder = (
    itemToMove: FileSystemItem,
    folderName: string,
    isNew: boolean
  ) => {
    setItems((prevItems) => {
      // 1. Determine Target Folder ID
      let targetFolderId: string | null = null;

      if (isNew) {
        // Create new folder logic inline
        const newFolderId = `folder-${Date.now()}`;
        const newFolder: FileSystemItem = {
          id: newFolderId,
          name: folderName,
          type: 'folder',
          children: [],
          isOpen: true,
          parentId: null,
        };

        // Add new folder to root, then proceed to move item into it
        // We will "inject" this new folder into the list during the move logic below
        targetFolderId = newFolderId;

        // Slight optimization: We need the list to include the new folder before we "move" the file into it
        // But since our moveFile logic (below) reconstructs the tree, we can just handle the "Add Folder" + "Move File"
        // by modifying the result of the move.

        // Actually, let's reuse the existing move logic structure but simpler:
        // recursive remove -> then add to target.
      } else {
        // Find existing folder ID by name (simplistic lookup)
        // Note: This only looks at root level or needs a deep search.
        // For this mock, let's assume flat search or simple search.
        const findFolder = (list: FileSystemItem[]): string | undefined => {
          for (const item of list) {
            if (
              item.type === 'folder' &&
              item.name.toLowerCase() === folderName.toLowerCase()
            )
              return item.id;
            if (item.children) {
              const found = findFolder(item.children);
              if (found) return found;
            }
          }
        };
        targetFolderId = findFolder(prevItems) || null;
      }

      if (!targetFolderId && !isNew) return prevItems; // Folder not found error

      // 2. Remove Item from old location
      let movedItem: FileSystemItem | null = null;

      const removeRecursive = (list: FileSystemItem[]): FileSystemItem[] => {
        return list.reduce((acc, item) => {
          if (item.id === itemToMove.id) {
            movedItem = { ...item, parentId: targetFolderId };
            return acc;
          }
          if (item.children) {
            return [
              ...acc,
              { ...item, children: removeRecursive(item.children) },
            ];
          }
          return [...acc, item];
        }, [] as FileSystemItem[]);
      };

      let newList = removeRecursive(prevItems);

      if (!movedItem) return prevItems;

      // 3. Add to New Location
      // If we created a new folder, we need to add that folder to the root AND put the file inside it
      if (isNew) {
        const newFolder: FileSystemItem = {
          id: targetFolderId!,
          name: folderName,
          type: 'folder',
          isOpen: true,
          parentId: null,
          children: [movedItem], // Put the file directly inside
        };
        return [newFolder, ...newList];
      }

      // If existing folder
      const addToFolderRecursive = (
        list: FileSystemItem[]
      ): FileSystemItem[] => {
        return list.map((item) => {
          if (item.id === targetFolderId) {
            return {
              ...item,
              children: [...(item.children || []), movedItem!],
            };
          }
          if (item.children) {
            return { ...item, children: addToFolderRecursive(item.children) };
          }
          return item;
        });
      };

      return addToFolderRecursive(newList);
    });
  };

  // Don't forget to return this function in the hook return
  // return { ..., handleMoveToFolder }

  return {
    items,
    renamingId,
    setRenamingId,
    isCollapsed,
    activeMenu,
    setActiveMenu,
    itemToDelete,
    setItemToDelete,
    itemToMove,
    setItemToMove,
    draggedItem,
    // Methods
    toggleSidebar,
    handleToggleFolder,
    handleDragStart,
    handleDropOnFolder,
    handleDropOnRoot,
    handleRenameSubmit,
    handleCreateFolder,
    handleMenuClick,
    handleMenuAction,
    confirmDelete,
    handleMoveToFolder,
  };
};
