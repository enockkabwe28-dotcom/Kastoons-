import React, { useState } from 'react';
import { AnimeProject } from '../types';
import { Plus, Video, Trash2, Search, Calendar, Film, ArrowRight, Sparkles } from 'lucide-react';

interface ProjectListProps {
  projects: AnimeProject[];
  onSelectProject: (p: AnimeProject) => void;
  onDeleteProject: (id: string) => void;
  onOpenWizard: () => void;
}

const GENRES = [
  'All', 'Action', 'Adventure', 'Fantasy', 'Romance', 
  'Comedy', 'Sci-Fi', 'Horror', 'Mystery', 'Sports', 'Slice of Life'
];

export default function ProjectList({
  projects,
  onSelectProject,
  onDeleteProject,
  onOpenWizard,
}: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proj.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || proj.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      {/* Upper Area: Promotional Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-violet-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/10">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
          <Film className="w-96 h-96" />
        </div>
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI Rendering Server Online</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white leading-tight">
            Animate Your Imagination Instantly
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 font-light">
            AnimeVerse AI translates simple text prompts into screenplays, character voices, backgrounds, and full-length episodes. Publish automatically to linked platforms in a secure studio ecosystem.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenWizard}
              className="px-5 py-2.5 bg-white text-indigo-900 font-semibold rounded-xl text-sm hover:bg-indigo-50 hover:scale-[1.02] transition-all flex items-center space-x-2 shadow-lg shadow-black/10 cursor-pointer"
              id="start-project-hero-btn"
            >
              <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>Create New Anime Series</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search anime title, script prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            id="project-search-input"
          />
        </div>

        {/* Genre Tags Scroll */}
        <div className="overflow-x-auto flex items-center space-x-2 py-1 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                selectedGenre === genre
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              id={`genre-filter-${genre.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-900">
          <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-display">No anime projects found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedGenre !== 'All' 
              ? "No titles match your current search and filters. Try clearing them to see existing titles."
              : "Let's create your very first anime film or multi-episode series! Tap below to launch the wizard."}
          </p>
          <div className="mt-5">
            <button
              onClick={onOpenWizard}
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-xl text-sm hover:bg-purple-700 transition-colors inline-flex items-center space-x-2 cursor-pointer"
              id="no-proj-wizard-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create Anime Series</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Prompt Card (Always First in Grid if no searches) */}
          {!searchTerm && selectedGenre === 'All' && (
            <button
              onClick={onOpenWizard}
              className="group border-2 border-dashed border-gray-200 hover:border-purple-400 dark:border-gray-800 dark:hover:border-purple-500 bg-linear-to-b from-gray-50/50 to-white dark:from-gray-900/20 dark:to-gray-900 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-4 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1 transition-all min-h-[260px] cursor-pointer"
              id="grid-create-new-card"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <span className="font-display font-bold text-gray-900 dark:text-white text-base">
                  Start New Production
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
                  Describe a world, characters, or upload raw frames to begin.
                </p>
              </div>
            </button>
          )}

          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500/80 shadow-xs hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden"
              id={`project-card-${project.id}`}
            >
              {/* Card Header & Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                      {project.genre}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                      {project.animationStyle}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    title="Delete Project"
                    id={`delete-btn-${project.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-bold text-gray-950 dark:text-white text-lg tracking-tight group-hover:text-purple-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-mono flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {project.description || "No synopsis available yet. Open editor to generate storylines and screenplays."}
                </p>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {project.episodes?.length || 0} {project.episodes?.length === 1 ? 'Episode' : 'Episodes'}
                </span>

                <button
                  onClick={() => onSelectProject(project)}
                  className="px-3.5 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium hover:bg-purple-600 dark:hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                  id={`open-workspace-btn-${project.id}`}
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
