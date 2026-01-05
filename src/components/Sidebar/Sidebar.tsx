import React from 'react';
import styles from './Sidebar.module.css';
import classNames from 'classnames';

// Hooks & Components
import { useSidebar } from './useSidebar';
import { SidebarItem } from './SidebarItem';

// UI Components
import IconButton from '@/ui/IconButton';
import ProjectOptionsMenu from '@/ui/subui/ProjectOptionsMenu';
import DeleteConfirmDialog from '@/ui/subui/DeleteConfirmDialog';
import MoveToFolderDialog from '@/ui/subui/MoveToFolderDialog';

// Assets
import newProjectIcon from '@/assets/new_project/new_project.svg';
import newProjectFillIcon from '@/assets/new_project/new_project_fill.svg';
import VerticalLineIcon from '@/assets/menu/vertical_lines.svg';
import NewFolderIcon from '@/assets/new_folder/new_folder.svg';
import NewFolderFillIcon from '@/assets/new_folder/new_folder_fill.svg';
import SearchIcon from '@/assets/search/search.svg';
import SettingsIcon from '@/assets/settings/settings.svg';
import SettingsFillIcon from '@/assets/settings/settings_fill.svg';
import ApertureLogo from '@/assets/aperture_logo.svg';

export const Sidebar: React.FC = () => {
  const {
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
  } = useSidebar();

  return (
    <>
      <nav
        className={classNames(styles.sidebar, {
          [styles.collapsed]: isCollapsed,
          [styles.expanded]: !isCollapsed,
        })}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnRoot}
      >
        {/* Header */}
        <div className={isCollapsed ? styles.header : styles.header2}>
          {!isCollapsed && (
            <div className={styles.logoContainer}>
              <img src={ApertureLogo} className={styles.logoIcon} alt="Logo" />
              <span className={styles.brandName}>APERTURE</span>
            </div>
          )}
          <button onClick={toggleSidebar} className={styles.menuBtn}>
            <img
              src={VerticalLineIcon}
              className={styles.menuBtnIcon}
              alt="Menu"
            />
          </button>
        </div>

        {/* Main Navigation */}
        <div className={styles.navSection}>
          <IconButton
            text="New Project"
            icon={
              <img src={newProjectIcon} width={16} height={11} alt="icon" />
            }
            iconHover={
              <img src={newProjectFillIcon} width={16} height={11} alt="icon" />
            }
            mode={isCollapsed ? 'icon' : 'default'}
            fullWidth={true}
          />
          <IconButton
            text="Search"
            icon={<img src={SearchIcon} width={16} height={11} alt="icon" />}
            iconHover={
              <img src={SearchIcon} width={16} height={11} alt="icon" />
            }
            mode={isCollapsed ? 'icon' : 'default'}
            fullWidth={true}
          />
          <IconButton
            text="New Folder"
            icon={<img src={NewFolderIcon} width={16} height={11} alt="icon" />}
            iconHover={
              <img src={NewFolderFillIcon} width={16} height={11} alt="icon" />
            }
            mode={isCollapsed ? 'icon' : 'default'}
            fullWidth={true}
            onClick={handleCreateFolder}
          />
        </div>

        {/* Projects List */}
        <div className={styles.projectsHeader}>
          {!isCollapsed && 'Projects'}
        </div>

        <div className={styles.projectList}>
          {!isCollapsed
            ? items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  renamingId={renamingId}
                  isCollapsed={isCollapsed}
                  activeMenu={activeMenu}
                  setRenamingId={setRenamingId}
                  onRenameSubmit={handleRenameSubmit}
                  onToggleFolder={handleToggleFolder}
                  onMenuClick={handleMenuClick}
                  onMenuAction={handleMenuAction}
                  onCloseMenu={() => setActiveMenu(null)}
                  onDragStart={handleDragStart}
                  onDropOnFolder={handleDropOnFolder}
                />
              ))
            : items.map((item) => (
                <div key={item.id} className={styles.collapsedItem} />
              ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <IconButton
            text="Settings"
            icon={<img src={SettingsIcon} width={16} height={11} alt="icon" />}
            iconHover={
              <img src={SettingsFillIcon} width={16} height={11} alt="icon" />
            }
            mode={isCollapsed ? 'icon' : 'default'}
            fullWidth={true}
          />
        </div>
      </nav>

      {/* --- Modals & Absolute Menus --- */}
      {activeMenu &&
        items.find((i) => i.id === activeMenu.id)?.type === 'folder' && (
          <div
            style={{
              position: 'fixed',
              top: activeMenu.y,
              left: activeMenu.x,
              zIndex: 100,
            }}
          >
            <ProjectOptionsMenu
              onAction={handleMenuAction}
              onClose={() => setActiveMenu(null)}
              hideMove={true}
            />
          </div>
        )}

      <DeleteConfirmDialog
        isOpen={!!itemToDelete}
        projectName={itemToDelete?.name || ''}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <MoveToFolderDialog
        isOpen={!!itemToMove}
        projectName={itemToMove?.name || ''}
        onClose={() => setItemToMove(null)}
        onMove={(folderName, isNew) => {
          if (itemToMove) {
            handleMoveToFolder(itemToMove, folderName, isNew);
          }
          setItemToMove(null);
        }}
      />
    </>
  );
};
