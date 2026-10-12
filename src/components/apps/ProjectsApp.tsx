import React, { useState } from 'react';
import { projectsData } from '../../data/projects';
import { ProjectItem } from '../../types/os';
import { useWindowStore } from '../../store/windowStore';
import {
  Folder,
  FolderOpen,
  Search,
  Grid,
  List,
  ChevronRight,
  HardDrive,
  Code2,
} from 'lucide-react';
import { playSystemSound } from '../../utils/sound';

export const ProjectsApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectsData[0].id);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = projectsData.filter((proj) => {
    const matchesCategory = filterCategory === 'all' || proj.category === filterCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      proj.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedProject = projectsData.find((p) => p.id === selectedProjectId) || projectsData[0];

  const handleOpenDetail = (project: ProjectItem) => {
    openWindow('project-detail', {
      title: `${project.title} — Specification`,
      data: project,
    });
  };

  const handleSelect = (project: ProjectItem) => {
    setSelectedProjectId(project.id);
    playSystemSound('click');
  };

  return (
    <div className="h-full flex flex-col bg-surface text-txt-primary select-none">
      {/* Explorer Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-surface-secondary border-b border-border">
        {/* Breadcrumb address path */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border text-xs font-mono text-txt-secondary min-w-[220px]">
          <HardDrive className="w-3.5 h-3.5 text-txt-muted" />
          <span className="text-txt-muted">vol0:</span>
          <span>/sujith/projects/</span>
          {filterCategory !== 'all' && (
            <span className="text-txt-primary font-semibold">{filterCategory.toLowerCase()}/</span>
          )}
        </div>

        {/* Search input & View toggles */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-txt-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter repositories..."
              className="pl-8 pr-2.5 py-1 rounded-md bg-surface border border-border text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-border-hover w-40 sm:w-52 transition-colors"
            />
          </div>

          <div className="flex items-center rounded-md bg-surface border border-border p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${
                viewMode === 'grid' ? 'bg-surface-secondary text-txt-primary font-medium' : 'text-txt-muted hover:text-txt-primary'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${
                viewMode === 'table' ? 'bg-surface-secondary text-txt-primary font-medium' : 'text-txt-muted hover:text-txt-primary'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden divide-x divide-border">
        {/* Left Navigation Sidebar */}
        <div className="w-48 sm:w-52 flex-shrink-0 bg-surface-secondary/40 p-3 flex flex-col justify-between hidden sm:flex">
          <div>
            <div className="text-[10px] font-mono uppercase text-txt-muted tracking-wider mb-2 px-1 font-semibold">
              DIRECTORIES
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setFilterCategory('all')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  filterCategory === 'all'
                    ? 'bg-surface text-txt-primary font-semibold border border-border shadow-sm'
                    : 'text-txt-secondary hover:bg-surface-hover hover:text-txt-primary'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-txt-muted" />
                <span>All Projects</span>
                <span className="ml-auto text-[10px] font-mono text-txt-muted">4</span>
              </button>
              <button
                onClick={() => setFilterCategory('Full Stack')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  filterCategory === 'Full Stack'
                    ? 'bg-surface text-txt-primary font-semibold border border-border shadow-sm'
                    : 'text-txt-secondary hover:bg-surface-hover hover:text-txt-primary'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-txt-muted" />
                <span>Full Stack (MERN)</span>
                <span className="ml-auto text-[10px] font-mono text-txt-muted">3</span>
              </button>
              <button
                onClick={() => setFilterCategory('Frontend')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  filterCategory === 'Frontend'
                    ? 'bg-surface text-txt-primary font-semibold border border-border shadow-sm'
                    : 'text-txt-secondary hover:bg-surface-hover hover:text-txt-primary'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-txt-muted" />
                <span>Frontend Systems</span>
                <span className="ml-auto text-[10px] font-mono text-txt-muted">1</span>
              </button>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="p-2.5 rounded-lg bg-surface border border-border text-[11px] text-txt-muted font-mono">
            Double-click a project to view its architectural specification.
          </div>
        </div>

        {/* Center Explorer Grid/List */}
        <div className="flex-1 p-4 overflow-y-auto bg-surface">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProjects.map((project) => {
                const isSelected = selectedProjectId === project.id;
                return (
                  <div
                    key={project.id}
                    onClick={() => handleSelect(project)}
                    onDoubleClick={() => handleOpenDetail(project)}
                    className={`group relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-surface border-border-hover shadow-sm ring-1 ring-border'
                        : 'bg-surface-secondary/50 border-border hover:bg-surface hover:border-border-hover'
                    }`}
                  >
                    <div>
                      {/* Top icon and version badge */}
                      <div className="flex items-start justify-between mb-2.5">
                        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-txt-secondary group-hover:text-txt-primary transition-colors">
                          {isSelected ? (
                            <FolderOpen className="w-4 h-4" />
                          ) : (
                            <Folder className="w-4 h-4" />
                          )}
                        </div>
                        <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface border border-border text-txt-muted">
                          {project.version}
                        </span>
                      </div>

                      <h3 className="font-semibold text-xs text-txt-primary">
                        {project.title}
                      </h3>
                      <p className="text-xs text-txt-secondary line-clamp-2 mt-1 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Footer tech stack chips */}
                    <div className="mt-3.5 pt-2.5 border-t border-border-subtle flex items-center justify-between">
                      <div className="flex items-center gap-1 overflow-hidden">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface border border-border-subtle text-txt-muted whitespace-nowrap"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(project);
                        }}
                        className="text-xs text-txt-primary hover:underline flex items-center gap-0.5 font-medium ml-2"
                      >
                        <span>Open</span>
                        <ChevronRight className="w-3 h-3 text-txt-muted" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="w-full text-xs font-mono">
              <div className="grid grid-cols-12 gap-2 pb-2 border-b border-border text-txt-muted text-[10px] uppercase tracking-wider px-2 font-semibold">
                <span className="col-span-5">Name</span>
                <span className="col-span-3">Category</span>
                <span className="col-span-2">Version</span>
                <span className="col-span-2 text-right">Status</span>
              </div>
              <div className="divide-y divide-border-subtle">
                {filteredProjects.map((project) => {
                  const isSelected = selectedProjectId === project.id;
                  return (
                    <div
                      key={project.id}
                      onClick={() => handleSelect(project)}
                      onDoubleClick={() => handleOpenDetail(project)}
                      className={`grid grid-cols-12 gap-2 py-2 px-2 rounded-lg items-center cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-surface-secondary text-txt-primary font-medium'
                          : 'hover:bg-surface-hover text-txt-secondary'
                      }`}
                    >
                      <div className="col-span-5 flex items-center gap-2 truncate">
                        <Folder className="w-3.5 h-3.5 text-txt-muted flex-shrink-0" />
                        <span className="font-sans font-medium text-txt-primary truncate">
                          {project.title}
                        </span>
                      </div>
                      <div className="col-span-3 text-txt-muted truncate">
                        {project.category}
                      </div>
                      <div className="col-span-2 text-txt-muted">{project.version}</div>
                      <div className="col-span-2 text-right text-status-success font-medium">
                        {project.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Info Inspector Panel */}
        {selectedProject && (
          <div className="w-64 bg-surface-secondary/40 p-4 flex flex-col justify-between hidden lg:flex">
            <div>
              <div className="text-[10px] font-mono uppercase text-txt-muted tracking-wider mb-2 font-semibold">
                DIRECTORY METADATA
              </div>

              <div className="p-3 rounded-lg bg-surface border border-border mb-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Code2 className="w-3.5 h-3.5 text-txt-muted" />
                  <span className="font-semibold text-xs text-txt-primary">
                    {selectedProject.title}
                  </span>
                </div>
                <p className="text-[11px] text-txt-secondary leading-relaxed">
                  {selectedProject.tagline}
                </p>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-txt-muted">TYPE:</span>
                  <span className="text-txt-secondary">{selectedProject.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-txt-muted">VERSION:</span>
                  <span className="text-txt-secondary">{selectedProject.version}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-txt-muted">STATUS:</span>
                  <span className="text-status-success font-medium">{selectedProject.status}</span>
                </div>
              </div>

              <div className="mt-3.5">
                <div className="text-[10px] font-mono text-txt-muted uppercase tracking-wider mb-1.5 font-semibold">
                  CORE TECH
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.technologies.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-txt-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenDetail(selectedProject)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-txt-primary text-bg font-medium text-xs transition-opacity hover:opacity-90 shadow-sm"
            >
              <span>View Specifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Explorer Bottom Status Bar */}
      <div className="px-4 py-1.5 bg-surface-secondary border-t border-border text-[11px] font-mono text-txt-muted flex items-center justify-between">
        <span>{filteredProjects.length} objects listed</span>
        <span>Selected: {selectedProject ? selectedProject.title : 'None'}</span>
      </div>
    </div>
  );
};
