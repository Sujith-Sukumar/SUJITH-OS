import React from 'react';
import {
  User,
  Briefcase,
  FolderKanban,
  Cpu,
  FileText,
  Send,
  Terminal,
  Settings,
  Code2,
  Sparkles,
  LucideProps
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/BrandIcons';

export const getAppIcon = (iconNameOrAppId: string, props: LucideProps = {}): React.ReactNode => {
  const normalized = iconNameOrAppId.toLowerCase();

  switch (normalized) {
    case 'about':
    case 'user':
      return <User {...props} />;
    case 'experience':
    case 'briefcase':
      return <Briefcase {...props} />;
    case 'projects':
    case 'folderkanban':
    case 'folder':
      return <FolderKanban {...props} />;
    case 'project-detail':
    case 'code2':
    case 'layers':
      return <Code2 {...props} />;
    case 'skills':
    case 'cpu':
      return <Cpu {...props} />;
    case 'terminal':
      return <Terminal {...props} />;
    case 'resume':
    case 'filetext':
      return <FileText {...props} />;
    case 'contact':
    case 'send':
      return <Send {...props} />;
    case 'settings':
      return <Settings {...props} />;
    case 'github':
      return <GithubIcon className={props.className} />;
    case 'linkedin':
      return <LinkedinIcon className={props.className} />;
    default:
      return <Sparkles {...props} />;
  }
};
