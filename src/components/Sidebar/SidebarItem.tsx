import React from 'react';
import Folder from '@/ui/Folder';
import ProjectButton from '@/ui/ProjectButton';
import ProjectOptionsMenu, {
  type MenuAction,
} from '@/ui/subui/ProjectOptionsMenu';
import RenameInput from '@/ui/subui/RenameInput';
import VerticalDotsIcon from '@/assets/menu/vertical_dots.svg';
import { type FileSystemItem } from '@/types';

interface SidebarItemProps {
  item: FileSystemItem;
  renamingId: string | null;
  isCollapsed: boolean;
  activeMenu: { id: string; x: number; y: number } | null;
  // Handlers
  setRenamingId: (id: string | null) => void;
  onRenameSubmit: (id: string, name: string) => void;
  onToggleFolder: (id: string) => void;
  onMenuClick: (e: React.MouseEvent, item: FileSystemItem) => void;
  onMenuAction: (action: MenuAction) => void;
  onCloseMenu: () => void;
  onDragStart: (e: React.DragEvent, item: FileSystemItem) => void;
  onDropOnFolder: (e: React.DragEvent, folderId: string) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  renamingId,
  isCollapsed,
  activeMenu,
  setRenamingId,
  onRenameSubmit,
  onToggleFolder,
  onMenuClick,
  onMenuAction,
  onCloseMenu,
  onDragStart,
  onDropOnFolder,
}) => {
  const isRenaming = item.id === renamingId;

  if (item.type === 'folder') {
    return (
      <Folder
        key={item.id}
        item={item}
        depth={0}
        renamingId={renamingId}
        onRenameSubmit={onRenameSubmit}
        onCancelRename={() => setRenamingId(null)}
        onToggle={onToggleFolder}
        onMenuClick={onMenuClick}
        onItemClick={(i) => console.log('Open File:', i.name)}
        onDragStart={onDragStart}
        onDropOnFolder={onDropOnFolder}
        activeMenu={activeMenu}
        onMenuAction={onMenuAction}
        onCloseMenu={onCloseMenu}
      />
    );
  } else {
    // Root-level File
    return (
      <div
        key={item.id}
        draggable={!isRenaming}
        onDragStart={(e) => onDragStart(e, item)}
        title={isCollapsed ? item.name : undefined}
        style={{ paddingRight: '8px' }}
      >
        {isRenaming ? (
          <div style={{ padding: '6px 16px' }}>
            <RenameInput
              initialValue={item.name}
              onSave={(newName) => onRenameSubmit(item.id, newName)}
              onCancel={() => setRenamingId(null)}
            />
          </div>
        ) : (
          <ProjectButton
            text={item.name}
            icon={<img src={VerticalDotsIcon} alt="menu" />}
            onMenuClick={(e) => onMenuClick(e, item)}
            menuComponent={
              activeMenu?.id === item.id ? (
                <ProjectOptionsMenu
                  onAction={onMenuAction}
                  onClose={onCloseMenu}
                  hideMove={false}
                />
              ) : null
            }
          />
        )}
      </div>
    );
  }
};
