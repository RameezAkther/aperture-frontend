// src/ui/explorer/FileIcon.tsx
import React from 'react';
// Import specific icons to keep bundle size small
import {
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiReact,
  SiPython,
  SiRust,
  SiJson,
  SiDocker,
  SiGit,
  SiMarkdown,
  SiNodedotjs,
  SiGo,
  SiCplusplus,
} from 'react-icons/si';
import {
  VscJson,
  VscFileMedia,
  VscFilePdf,
  VscFolder,
  VscFolderOpened,
  VscFile,
} from 'react-icons/vsc';

interface IconConfig {
  icon: React.ElementType;
  color: string;
}

// 1. Extension Map: Maps file extensions to icons
const extensionMap: Record<string, IconConfig> = {
  // Web
  ts: { icon: SiTypescript, color: '#3178c6' },
  tsx: { icon: SiReact, color: '#61dafb' },
  js: { icon: SiJavascript, color: '#f7df1e' },
  jsx: { icon: SiReact, color: '#61dafb' },
  html: { icon: SiHtml5, color: '#e34c26' },
  css: { icon: SiCss3, color: '#1572b6' },
  json: { icon: VscJson, color: '#f1c40f' },

  // Backend / System
  py: { icon: SiPython, color: '#3776ab' },
  rs: { icon: SiRust, color: '#000000' }, // Rust is usually B/W or Orange
  go: { icon: SiGo, color: '#00add8' },
  cpp: { icon: SiCplusplus, color: '#00599c' },
  c: { icon: SiCplusplus, color: '#555555' },

  // Config / Tools
  md: { icon: SiMarkdown, color: '#ffffff' },
  yml: { icon: VscFile, color: '#666666' },
  yaml: { icon: VscFile, color: '#666666' },

  // Media (using Generic VS Code icons)
  pdf: { icon: VscFilePdf, color: '#e74c3c' },
  png: { icon: VscFileMedia, color: '#2ecc71' },
  jpg: { icon: VscFileMedia, color: '#2ecc71' },
  jpeg: { icon: VscFileMedia, color: '#2ecc71' },
  gif: { icon: VscFileMedia, color: '#2ecc71' },
  svg: { icon: VscFileMedia, color: '#e67e22' },
};

// 2. File Name Map: High priority specific files
const fileMap: Record<string, IconConfig> = {
  'package.json': { icon: SiNodedotjs, color: '#339933' },
  'tsconfig.json': { icon: SiTypescript, color: '#3178c6' },
  'readme.md': { icon: SiMarkdown, color: '#3eaf7c' }, // Slightly different color for emphasis
  dockerfile: { icon: SiDocker, color: '#2496ed' },
  '.gitignore': { icon: SiGit, color: '#f05032' },
  '.gitattributes': { icon: SiGit, color: '#f05032' },
};

// 3. Folder Map: Contextual folder icons
const folderMap: Record<string, IconConfig> = {
  src: { icon: VscFolder, color: '#44aa44' }, // Greenish
  components: { icon: VscFolder, color: '#ff9900' },
  tests: { icon: VscFolder, color: '#66ccff' },
  '.git': { icon: SiGit, color: '#f05032' },
  node_modules: { icon: SiNodedotjs, color: '#777777' }, // Greyed out
};

interface FileIconProps {
  name: string;
  type?: 'folder' | 'file' | 'image' | 'pdf'; // Fallback to explicitly known type
  isOpen?: boolean;
}

export const FileIcon: React.FC<FileIconProps> = ({ name, type, isOpen }) => {
  // A. Handle Folders
  if (type === 'folder') {
    const lowerName = name.toLowerCase();
    // Check specific folder names first
    if (folderMap[lowerName]) {
      const { icon: Icon, color } = folderMap[lowerName];
      // If it's a special folder (like src), we might keep the color but toggle the icon shape
      // For simplicity, we just use the colored folder logic or standard open/closed
      return <Icon style={{ color, fontSize: '18px' }} />;
    }
    // Default Folder
    return isOpen ? (
      <VscFolderOpened style={{ color: '#dcb67a', fontSize: '18px' }} />
    ) : (
      <VscFolder style={{ color: '#dcb67a', fontSize: '18px' }} />
    );
  }

  const lowerName = name.toLowerCase();

  // B. Handle Exact Filename Matches (Priority 1)
  if (fileMap[lowerName]) {
    const { icon: Icon, color } = fileMap[lowerName];
    return <Icon style={{ color, fontSize: '16px' }} />;
  }

  // C. Handle Extensions
  const parts = lowerName.split('.');

  // Check Compound Extension (e.g., .test.tsx) -> Priority 2
  if (parts.length > 2) {
    const compoundExt = parts.slice(-2).join('.');
    if (extensionMap[compoundExt]) {
      const { icon: Icon, color } = extensionMap[compoundExt];
      return <Icon style={{ color, fontSize: '16px' }} />;
    }
  }

  // Check Single Extension -> Priority 3
  if (parts.length > 1) {
    const ext = parts[parts.length - 1];
    if (extensionMap[ext]) {
      const { icon: Icon, color } = extensionMap[ext];
      return <Icon style={{ color, fontSize: '16px' }} />;
    }
  }

  // D. Fallback based on provided type prop (if extension parsing failed)
  if (type === 'image')
    return <VscFileMedia style={{ color: '#2ecc71', fontSize: '16px' }} />;
  if (type === 'pdf')
    return <VscFilePdf style={{ color: '#e74c3c', fontSize: '16px' }} />;

  // E. Generic Default
  return <VscFile style={{ color: '#cccccc', fontSize: '16px' }} />;
};
