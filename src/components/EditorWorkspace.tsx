import React, { useState, useEffect, useRef } from 'react';
import { AnimeProject, AnimeEpisode, AnimeCharacter, Scene, ScreenplayLine, StoryBranch, StyleReferenceImage } from '../types';
import { 
  Play, Volume2, Film, Sliders, Music, MessageSquare, Languages, 
  Sparkles, Check, RotateCcw, Plus, Trash2, Camera, ShieldCheck, 
  HelpCircle, ChevronRight, Wand2, RefreshCw, Layers, Edit2, AlertCircle,
  Palette, GitBranch, Upload, ArrowRight, ArrowLeftRight, Share2
} from 'lucide-react';

interface EditorWorkspaceProps {
  project: AnimeProject;
  onUpdateProject: (updated: AnimeProject) => Promise<void>;
  onTriggerBackup: (deviceName: string, deviceType: 'smartphone' | 'tablet' | 'computer') => Promise<void>;
  onPostVideo: (projectId: string, episodeId: string) => Promise<{ success: boolean; error?: string; message?: string; post?: any }>;
  subscription: any;
}

type TabType = 'script' | 'characters' | 'storyboard' | 'audio' | 'localization' | 'style-editor' | 'branches';

// Procedural vector storyboard art rendering to make scenes look high-fidelity
function AnimeSceneArt({ type, title, stylePreset, characterStyle }: { type: string; title: string; stylePreset?: string; characterStyle?: 'anime' | 'realistic' }) {
  const getStyleOverlay = () => {
    switch (stylePreset) {
      case 'Classic Shonen':
        return (
          <div className="absolute inset-0 border-3 border-red-500/20 pointer-events-none flex items-start justify-end p-2 z-10">
            <span className="text-[8px] bg-red-600 text-white font-bold font-mono px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">Shonen active</span>
          </div>
        );
      case 'Magical Girl':
        return (
          <div className="absolute inset-0 border-3 border-pink-400/20 pointer-events-none flex items-start justify-end p-2 z-10">
            <span className="text-[8px] bg-pink-500 text-white font-bold font-mono px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">Sparkle Filter</span>
          </div>
        );
      case 'Cyberpunk Noir':
        return (
          <div className="absolute inset-0 bg-purple-950/10 border-3 border-cyan-500/20 pointer-events-none flex items-start justify-end p-2 z-10">
            <span className="text-[8px] bg-cyan-600 text-white font-bold font-mono px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">Neon Noir active</span>
          </div>
        );
      case 'Iyashikei':
        return (
          <div className="absolute inset-0 bg-green-500/5 border-3 border-green-500/10 pointer-events-none flex items-start justify-end p-2 z-10">
            <span className="text-[8px] bg-green-600 text-white font-bold font-mono px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">Iyashikei Tone</span>
          </div>
        );
      case 'Retro 80s':
        return (
          <div className="absolute inset-0 bg-indigo-950/10 border-3 border-purple-500/20 pointer-events-none flex items-start justify-end p-2 overflow-hidden z-10">
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-transparent bg-[size:100%_4px]" />
            <span className="text-[8px] bg-purple-600 text-white font-bold font-mono px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">80s Scanline</span>
          </div>
        );
      case 'Ghibli Whimsical':
        return (
          <div className="absolute inset-0 bg-amber-500/5 border-3 border-sky-400/15 pointer-events-none flex items-start justify-end p-2 z-10">
            <span className="text-[8px] bg-sky-600 text-white font-bold font-mono px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">Whimsical Sky</span>
          </div>
        );
      case 'Chibi Playful':
        return (
          <div className="absolute inset-0 border-3 border-yellow-400/20 pointer-events-none flex items-start justify-end p-2 z-10">
            <span className="text-[8px] bg-yellow-500 text-gray-900 font-bold font-mono px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">Chibi Mode</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getArt = () => {
    switch (type) {
      case 'rooftop_rain':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="220" fill="#0A0F24"/>
            {/* Skyscrapers */}
            <rect x="30" y="80" width="60" height="140" fill="#141C3C" opacity="0.8"/>
            <rect x="110" y="50" width="70" height="170" fill="#18244D"/>
            <rect x="200" y="100" width="50" height="120" fill="#141C3C" opacity="0.6"/>
            <rect x="270" y="70" width="90" height="150" fill="#1F2E63"/>
            {/* Glowing neon billboards */}
            <rect x="120" y="70" width="30" height="40" rx="3" fill="#EC4899" opacity="0.8"/>
            <rect x="290" y="90" width="40" height="25" rx="2" fill="#06B6D4" opacity="0.8"/>
            <circle cx="60" cy="110" r="12" fill="#F59E0B" opacity="0.6"/>
            {/* Tokyo Tower far away */}
            <line x1="380" y1="220" x2="380" y2="40" stroke="#EF4444" strokeWidth="2"/>
            {/* Rain Lines */}
            <line x1="10" y1="10" x2="0" y2="40" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4"/>
            <line x1="100" y1="20" x2="90" y2="50" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4"/>
            <line x1="240" y1="5" x2="230" y2="35" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4"/>
            <line x1="320" y1="30" x2="310" y2="60" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4"/>
            {/* Floor rain rings */}
            <ellipse cx="200" cy="210" rx="40" ry="5" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3"/>
            <ellipse cx="80" cy="215" rx="25" ry="3" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3"/>
            {/* Title watermark */}
            <text x="15" y="25" fill="#94A3B8" fontSize="10" fontFamily="monospace" opacity="0.5">PROCEDURAL STORYBOARD // ROOFTOP</text>
          </svg>
        );
      case 'hacking_den':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="220" fill="#0B1313"/>
            <circle cx="200" cy="110" r="80" fill="#0F766E" opacity="0.15"/>
            {/* Terminals */}
            <rect x="40" y="30" width="110" height="70" rx="6" fill="#111B1B" stroke="#0D9488" strokeWidth="1.5"/>
            <rect x="250" y="40" width="110" height="80" rx="6" fill="#111B1B" stroke="#F59E0B" strokeWidth="1.5"/>
            <rect x="130" y="110" width="140" height="90" rx="6" fill="#111B1B" stroke="#4F46E5" strokeWidth="1.5"/>
            {/* Wire lines */}
            <path d="M 150 150 C 150 100, 250 100, 250 80" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3"/>
            <path d="M 80 100 C 100 130, 110 130, 130 150" stroke="#F59E0B" strokeWidth="1"/>
            {/* Mock code lines */}
            <line x1="50" y1="45" x2="100" y2="45" stroke="#0D9488" strokeWidth="2"/>
            <line x1="50" y1="55" x2="80" y2="55" stroke="#0D9488" strokeWidth="2"/>
            <line x1="50" y1="65" x2="120" y2="65" stroke="#0D9488" strokeWidth="2"/>
            <line x1="140" y1="130" x2="220" y2="130" stroke="#4F46E5" strokeWidth="2"/>
            <line x1="140" y1="145" x2="190" y2="145" stroke="#4F46E5" strokeWidth="2"/>
            <circle cx="300" cy="80" r="15" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2"/>
            <text x="15" y="25" fill="#0D9488" fontSize="10" fontFamily="monospace" opacity="0.6">NETRUN MATRIX BUFFER // DATA_CELL</text>
          </svg>
        );
      case 'golden_matrix':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="220" fill="#090514"/>
            {/* Matrix grid lines */}
            <line x1="200" y1="0" x2="200" y2="220" stroke="#D97706" strokeWidth="0.5" opacity="0.3"/>
            <line x1="0" y1="110" x2="400" y2="110" stroke="#D97706" strokeWidth="0.5" opacity="0.3"/>
            <line x1="0" y1="0" x2="400" y2="220" stroke="#D97706" strokeWidth="0.5" opacity="0.2"/>
            <line x1="400" y1="0" x2="0" y2="220" stroke="#D97706" strokeWidth="0.5" opacity="0.2"/>
            {/* Golden virtual rings */}
            <circle cx="200" cy="110" r="45" stroke="#F59E0B" strokeWidth="2" opacity="0.8"/>
            <circle cx="200" cy="110" r="70" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5 5" opacity="0.6"/>
            <circle cx="200" cy="110" r="15" fill="#D97706" opacity="0.4"/>
            {/* Binary data floating */}
            <text x="80" y="60" fill="#F59E0B" fontSize="8" fontFamily="monospace" opacity="0.5">10110</text>
            <text x="280" y="70" fill="#F59E0B" fontSize="8" fontFamily="monospace" opacity="0.5">00101</text>
            <text x="60" y="160" fill="#F59E0B" fontSize="8" fontFamily="monospace" opacity="0.5">11011</text>
            <text x="290" y="170" fill="#F59E0B" fontSize="8" fontFamily="monospace" opacity="0.5">01110</text>
            <text x="15" y="25" fill="#F59E0B" fontSize="10" fontFamily="monospace" opacity="0.6">VIRTUAL QUANTUM_SERVER // CLOUD_SYNC</text>
          </svg>
        );
      case 'shattered_valley':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="220" fill="#2E1065"/>
            {/* Glowing sunset sky */}
            <circle cx="200" cy="150" r="110" fill="#F43F5E" opacity="0.6"/>
            <circle cx="200" cy="150" r="70" fill="#F59E0B" opacity="0.8"/>
            {/* Mountains */}
            <path d="M -20 220 L 80 120 L 160 220 Z" fill="#1E1B4B"/>
            <path d="M 120 220 L 220 90 L 320 220 Z" fill="#312E81"/>
            <path d="M 260 220 L 330 140 L 420 220 Z" fill="#1E1B4B"/>
            {/* Fantasy sparkles */}
            <polygon points="100,50 102,55 107,55 103,58 105,63 100,60 95,63 97,58 93,55 98,55" fill="#FFF" opacity="0.9"/>
            <polygon points="280,40 281,43 284,43 282,45 283,48 280,46 277,48 278,45 276,43 279,43" fill="#FFF" opacity="0.8"/>
            <text x="15" y="25" fill="#DDD" fontSize="10" fontFamily="monospace" opacity="0.6">BACKGROUND SKY // SHATTERED_VALLEY</text>
          </svg>
        );
      case 'desolate_crater':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="220" fill="#18181B"/>
            <rect y="160" width="400" height="60" fill="#27272A"/>
            {/* Obsidian Pillars */}
            <rect x="40" y="60" width="25" height="100" fill="#09090B"/>
            <polygon points="40,60 52,40 65,60" fill="#09090B"/>
            <rect x="330" y="80" width="30" height="80" fill="#09090B"/>
            <polygon points="330,80 345,55 360,80" fill="#09090B"/>
            {/* Volcanic Lava cracks */}
            <path d="M 20 180 Q 150 165, 380 185" stroke="#EF4444" strokeWidth="4" opacity="0.8"/>
            <path d="M 20 180 Q 150 165, 380 185" stroke="#F59E0B" strokeWidth="1.5" opacity="0.9"/>
            <circle cx="150" cy="172" r="6" fill="#F59E0B" opacity="0.7"/>
            {/* Purple eerie background fog */}
            <ellipse cx="200" cy="110" rx="140" ry="40" fill="#701A75" opacity="0.2"/>
            <text x="15" y="25" fill="#888" fontSize="10" fontFamily="monospace" opacity="0.6">ANIME ZONE 9 // CRATER_OUTPOST</text>
          </svg>
        );
      default:
        return (
          <svg className="w-full h-full" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fallbackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5"/>
                <stop offset="50%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#EC4899"/>
              </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#fallbackGrad)" opacity="0.9"/>
            <circle cx="200" cy="110" r="30" fill="#FFF" opacity="0.2"/>
            <path d="M 150 130 L 200 80 L 250 130 Z" fill="#FFF" opacity="0.15"/>
            <text x="200" y="115" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="sans-serif" opacity="0.9">{title || "Background Art Render"}</text>
            <text x="15" y="25" fill="#FFF" fontSize="10" fontFamily="monospace" opacity="0.5">STORYBOARD PLACEHOLDER // GENERIC_SHOT</text>
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-xs border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-950 flex items-center justify-center relative">
      {getArt()}
      {getStyleOverlay()}
      {characterStyle === 'realistic' && (
        <div className="absolute bottom-3 left-3 bg-linear-to-r from-teal-500/90 to-emerald-600/90 backdrop-blur-md text-white font-mono font-bold text-[9px] px-2 py-1 rounded-lg border border-teal-400/30 flex items-center space-x-1 shadow-md z-20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
          <span>REALISTIC CHARACTER ENGINE ACTIVE</span>
        </div>
      )}
    </div>
  );
}

function StylePresetPreview({ styleName }: { styleName: string }) {
  const getPreviewSvg = () => {
    switch (styleName) {
      case 'Classic Shonen':
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#EF4444" />
            <path d="M 0 120 L 150 0 L 300 120 Z" fill="#F59E0B" opacity="0.8" />
            <line x1="10" y1="10" x2="140" y2="55" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
            <line x1="290" y1="10" x2="160" y2="55" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
            <line x1="10" y1="110" x2="140" y2="65" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
            <line x1="290" y1="110" x2="160" y2="65" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
            <path d="M 120 90 L 130 50 L 140 60 L 150 20 L 160 60 L 170 50 L 180 90 Z" fill="#1E293B" />
            <text x="150" y="110" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">CLASSIC SHONEN</text>
          </svg>
        );
      case 'Magical Girl':
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#FCE7F3" />
            <circle cx="150" cy="55" r="35" fill="#F472B6" opacity="0.3" />
            <circle cx="150" cy="55" r="20" fill="#F472B6" opacity="0.5" />
            <polygon points="150,15 151,20 156,20 152,23 153,28 150,25 147,28 148,23 144,20 149,20" fill="#FBBF24" />
            <path d="M 100 80 C 100 76, 104 76, 104 80 C 104 84, 100 87, 100 89 C 100 87, 96 84, 96 80 C 96 76, 100 76, 100 80 Z" fill="#F43F5E" />
            <text x="150" y="110" textAnchor="middle" fill="#DB2777" fontSize="10" fontWeight="bold" fontFamily="sans-serif">MAGICAL GIRL</text>
          </svg>
        );
      case 'Cyberpunk Noir':
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#020617" />
            <rect x="20" y="30" width="40" height="90" fill="#1E1B4B" />
            <rect x="80" y="10" width="55" height="110" fill="#0F172A" stroke="#EC4899" strokeWidth="0.5" />
            <rect x="150" y="40" width="45" height="80" fill="#1E1B4B" />
            <rect x="210" y="20" width="60" height="100" fill="#0F172A" stroke="#06B6D4" strokeWidth="0.5" />
            <line x1="0" y1="95" x2="300" y2="95" stroke="#06B6D4" strokeWidth="1" opacity="0.4" />
            <text x="150" y="110" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="bold" fontFamily="monospace">CYBERPUNK NOIR</text>
          </svg>
        );
      case 'Iyashikei':
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#F0FDF4" />
            <path d="M -20 120 Q 80 80, 180 120 Z" fill="#BBF7D0" />
            <path d="M 120 120 Q 220 60, 320 120 Z" fill="#86EFAC" />
            <circle cx="230" cy="70" r="10" fill="#15803D" />
            <rect x="228" y="80" width="4" height="15" fill="#78350F" />
            <text x="150" y="110" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold" fontFamily="sans-serif">IYASHIKEI</text>
          </svg>
        );
      case 'Retro 80s':
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#1E1B4B" />
            <circle cx="150" cy="80" r="35" fill="#F43F5E" />
            <circle cx="150" cy="80" r="25" fill="#F59E0B" />
            <rect x="90" y="80" width="120" height="40" fill="#1E1B4B" />
            <line x1="150" y1="80" x2="20" y2="120" stroke="#8B5CF6" strokeWidth="1" />
            <line x1="150" y1="80" x2="80" y2="120" stroke="#8B5CF6" strokeWidth="1" />
            <line x1="150" y1="80" x2="150" y2="120" stroke="#8B5CF6" strokeWidth="1" />
            <line x1="150" y1="80" x2="220" y2="120" stroke="#8B5CF6" strokeWidth="1" />
            <line x1="150" y1="80" x2="280" y2="120" stroke="#8B5CF6" strokeWidth="1" />
            <text x="150" y="110" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold" fontFamily="monospace">RETRO 80S</text>
          </svg>
        );
      case 'Ghibli Whimsical':
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#BAE6FD" />
            <circle cx="80" cy="40" r="20" fill="#FFFFFF" />
            <circle cx="120" cy="35" r="25" fill="#FFFFFF" />
            <circle cx="160" cy="45" r="18" fill="#FFFFFF" />
            <rect y="80" width="300" height="40" fill="#4ADE80" />
            <text x="150" y="110" textAnchor="middle" fill="#0369A1" fontSize="10" fontWeight="bold" fontFamily="sans-serif">GHIBLI WHIMSICAL</text>
          </svg>
        );
      case 'Chibi Playful':
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#FEF08A" />
            <circle cx="50" cy="40" r="12" fill="#67E8F9" opacity="0.6" />
            <circle cx="240" cy="30" r="15" fill="#F472B6" opacity="0.6" />
            <circle cx="150" cy="50" r="18" fill="#FFFFFF" />
            <circle cx="143" cy="48" r="3" fill="#000" />
            <circle cx="157" cy="48" r="3" fill="#000" />
            <path d="M 148 54 Q 150 56, 152 54" stroke="#000" strokeWidth="1" fill="none" />
            <text x="150" y="110" textAnchor="middle" fill="#854D0E" fontSize="10" fontWeight="bold" fontFamily="sans-serif">CHIBI PLAYFUL</text>
          </svg>
        );
      case 'Realistic Cinematic':
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#0F172A" />
            <circle cx="150" cy="50" r="30" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
            <path d="M 135 48 C 135 42, 142 42, 142 48" stroke="#F1F5F9" strokeWidth="1.5" />
            <path d="M 158 48 C 158 42, 165 42, 165 48" stroke="#F1F5F9" strokeWidth="1.5" />
            <circle cx="138.5" cy="47" r="2" fill="#38BDF8" />
            <circle cx="161.5" cy="47" r="2" fill="#38BDF8" />
            <path d="M 150 45 L 150 56 L 148 56" stroke="#94A3B8" strokeWidth="1" />
            <path d="M 144 65 Q 150 62, 156 65" stroke="#F1F5F9" strokeWidth="1.5" />
            <rect x="0" y="90" width="300" height="30" fill="#1E293B" opacity="0.8" />
            <text x="150" y="110" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">REALISTIC CINEMATIC</text>
          </svg>
        );
      default:
        return (
          <svg className="w-full h-32 rounded-xl" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="120" fill="#E2E8F0" />
            <text x="150" y="60" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="bold">CUSTOM</text>
          </svg>
        );
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
      {getPreviewSvg()}
    </div>
  );
}

export default function EditorWorkspace({
  project,
  onUpdateProject,
  onTriggerBackup,
  onPostVideo,
  subscription
}: EditorWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabType>('script');
  const [activeEpisodeId, setActiveEpisodeId] = useState<string>(
    project.episodes[0]?.id || ''
  );
  
  const currentEpisode = project.episodes.find((e) => e.id === activeEpisodeId) || project.episodes[0];

  // Post to Profile handling state
  const [isPosting, setIsPosting] = useState(false);

  const handlePostToProfile = async (episode: AnimeEpisode) => {
    if (isPosting) return;
    setIsPosting(true);
    try {
      const result = await onPostVideo(project.id, episode.id);
      if (result.success) {
        alert(`Successfully posted "Episode ${episode.episodeNumber}: ${episode.title}" right to your public creator profile portfolio!`);
      } else {
        alert(result.message || result.error || "Failed to post video to your profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server.");
    } finally {
      setIsPosting(false);
    }
  };

  // Copilot Drawer State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCopilotGenerating, setIsCopilotGenerating] = useState(false);
  const [pacingScore, setPacingScore] = useState<number>(project.promotionalContent?.pacingScore || 85);
  const [recommendations, setRecommendations] = useState<string[]>(
    project.promotionalContent?.recommendations || [
      "Review Dialogue transitions for Sakura's network hacking scenes.",
      "Check pacing timing inside Episode 1 scene 2 background description.",
      "Synchronize voiceover tags to support Kore prebuilt voice triggers."
    ]
  );

  // Text-To-Speech Playback State
  const [playingLineId, setPlayingLineId] = useState<string | null>(null);
  
  // Soundtrack visualizer playback state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicWaveform, setMusicWaveform] = useState<number[]>([12, 18, 30, 45, 12, 8, 22, 35, 40, 24, 18, 28, 48, 12, 9, 20]);
  const waveformInterval = useRef<NodeJS.Timeout | null>(null);

  // Localization translator languages
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'JA' | 'ES' | 'FR' | 'KO'>('JA');
  const [isTranslating, setIsTranslating] = useState(false);

  // Backup trigger device state
  const [selectedDeviceName, setSelectedDeviceName] = useState(project.localBackups[0]?.deviceName || 'Kenji\'s iPhone 15 Pro');

  // Visual Style Editor State
  const [selectedStylePreset, setSelectedStylePreset] = useState<string>(
    project.visualStyleConfig?.selectedPreset || project.animationStyle || 'Classic Shonen'
  );
  const [styleDescription, setStyleDescription] = useState<string>(
    project.visualStyleConfig?.customDescription || ''
  );
  const [styleReferenceImages, setStyleReferenceImages] = useState<StyleReferenceImage[]>(
    project.visualStyleConfig?.referenceImages || []
  );
  const [isGeneratingStyle, setIsGeneratingStyle] = useState<boolean>(false);

  // Story Branching State
  const [selectedDivergenceLineId, setSelectedDivergenceLineId] = useState<string>('');
  const [branchChoiceText, setBranchChoiceText] = useState<string>('');
  const [isGeneratingBranch, setIsGeneratingBranch] = useState<boolean>(false);

  // Keep divergence line id updated when activeEpisodeId changes
  useEffect(() => {
    if (currentEpisode && currentEpisode.screenplay && currentEpisode.screenplay.length > 0) {
      setSelectedDivergenceLineId(currentEpisode.screenplay[currentEpisode.screenplay.length - 1].id);
    } else {
      setSelectedDivergenceLineId('');
    }
  }, [activeEpisodeId]);

  // Sync state if project changes
  useEffect(() => {
    if (project.visualStyleConfig) {
      setSelectedStylePreset(project.visualStyleConfig.selectedPreset || project.animationStyle || 'Classic Shonen');
      setStyleDescription(project.visualStyleConfig.customDescription || '');
      setStyleReferenceImages(project.visualStyleConfig.referenceImages || []);
    }
  }, [project]);

  const handleSaveStyleConfig = async (preset: string, desc: string, referenceImg: StyleReferenceImage[]) => {
    const updatedStyleConfig = {
      selectedPreset: preset,
      customDescription: desc,
      referenceImages: referenceImg,
      lastUpdated: new Date().toISOString()
    };

    const animStyleMap: Record<string, 'Classic Shonen' | 'Cyberpunk Neon' | 'Ghibli Whimsical' | 'Dark Fantasy' | 'Modern Shoujo' | 'Realistic Cinematic'> = {
      'Classic Shonen': 'Classic Shonen',
      'Magical Girl': 'Modern Shoujo',
      'Cyberpunk Noir': 'Cyberpunk Neon',
      'Iyashikei': 'Ghibli Whimsical',
      'Retro 80s': 'Cyberpunk Neon',
      'Ghibli Whimsical': 'Ghibli Whimsical',
      'Chibi Playful': 'Modern Shoujo',
      'Realistic Cinematic': 'Realistic Cinematic'
    };

    const updatedProject = {
      ...project,
      animationStyle: animStyleMap[preset] || 'Classic Shonen',
      visualStyleConfig: updatedStyleConfig
    };

    await onUpdateProject(updatedProject);
  };

  const handleUploadReferenceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const newImg: StyleReferenceImage = {
        id: `ref-img-${Date.now()}`,
        name: file.name,
        dataUrl: base64String
      };
      
      const updatedRefImgs = [...styleReferenceImages, newImg];
      setStyleReferenceImages(updatedRefImgs);
      await handleSaveStyleConfig(selectedStylePreset, styleDescription, updatedRefImgs);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteReferenceImage = async (imgId: string) => {
    const updatedRefImgs = styleReferenceImages.filter(img => img.id !== imgId);
    setStyleReferenceImages(updatedRefImgs);
    await handleSaveStyleConfig(selectedStylePreset, styleDescription, updatedRefImgs);
  };

  const handleGenerateStoryBranch = async () => {
    if (!currentEpisode || !branchChoiceText.trim() || !selectedDivergenceLineId) return;

    setIsGeneratingBranch(true);
    try {
      const selectedLine = currentEpisode.screenplay.find(l => l.id === selectedDivergenceLineId);
      const response = await fetch('/api/generate/branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          divergenceLineText: selectedLine ? `${selectedLine.characterName}: ${selectedLine.text}` : 'Unknown Line',
          choiceText: branchChoiceText,
          characters: project.characters,
          stylePreset: selectedStylePreset,
          genre: project.genre,
          projectTitle: project.title
        })
      });

      const branchData = await response.json();
      
      const newBranch: StoryBranch = {
        id: `branch-${Date.now()}`,
        divergencePointLineId: selectedDivergenceLineId,
        choiceText: branchChoiceText,
        title: branchData.title || `Alternative: ${branchChoiceText}`,
        description: branchData.description || 'An alternative story trajectory.',
        screenplay: branchData.screenplay || [],
        scenes: branchData.scenes || [],
        outcomeSummary: branchData.outcomeSummary || 'The story follows a unique dramatic course.'
      };

      const updatedEpisode = {
        ...currentEpisode,
        storyBranches: [...(currentEpisode.storyBranches || []), newBranch]
      };

      const updatedEpisodes = project.episodes.map(ep => ep.id === currentEpisode.id ? updatedEpisode : ep);
      await onUpdateProject({ ...project, episodes: updatedEpisodes });
      
      setBranchChoiceText(''); // clear input
    } catch (err) {
      console.error("Failed to generate story branch:", err);
    } finally {
      setIsGeneratingBranch(false);
    }
  };

  const promoteBranchToMain = async (branch: StoryBranch) => {
    if (!currentEpisode) return;

    const oldScreenplay = [...currentEpisode.screenplay];
    const oldScenes = [...currentEpisode.scenes];

    const swappedBranch: StoryBranch = {
      ...branch,
      choiceText: `Original Timeline`,
      title: `Original Main Path`,
      description: `This was the main screenplay path before being swapped with the branch choice.`,
      screenplay: oldScreenplay,
      scenes: oldScenes,
      outcomeSummary: `Restores the original flow of the episode.`
    };

    const updatedBranches = (currentEpisode.storyBranches || []).map(b => 
      b.id === branch.id ? swappedBranch : b
    );

    const updatedEpisode = {
      ...currentEpisode,
      screenplay: branch.screenplay,
      scenes: branch.scenes,
      storyBranches: updatedBranches
    };

    const updatedEpisodes = project.episodes.map(ep => ep.id === currentEpisode.id ? updatedEpisode : ep);
    await onUpdateProject({ ...project, episodes: updatedEpisodes });
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!currentEpisode) return;
    const updatedBranches = (currentEpisode.storyBranches || []).filter(b => b.id !== branchId);
    const updatedEpisode = {
      ...currentEpisode,
      storyBranches: updatedBranches
    };
    const updatedEpisodes = project.episodes.map(ep => ep.id === currentEpisode.id ? updatedEpisode : ep);
    await onUpdateProject({ ...project, episodes: updatedEpisodes });
  };

  // Sync music visualizer mock animation
  useEffect(() => {
    if (isPlayingMusic) {
      waveformInterval.current = setInterval(() => {
        setMusicWaveform(Array.from({ length: 16 }).map(() => Math.floor(Math.random() * 45) + 5));
      }, 150);
    } else {
      if (waveformInterval.current) clearInterval(waveformInterval.current);
    }
    return () => {
      if (waveformInterval.current) clearInterval(waveformInterval.current);
    };
  }, [isPlayingMusic]);

  // Audio Playback with Web Speech Fallback + Real Server TTS
  const triggerVoiceover = async (line: ScreenplayLine) => {
    if (playingLineId) return; // Prevent double play
    setPlayingLineId(line.id);

    // Find characters voice preset
    const character = project.characters.find(c => c.id === line.characterId);
    const voice = character?.voiceName || 'Zephyr';

    try {
      const response = await fetch('/api/generate/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: line.text,
          voiceName: voice,
          characterName: line.characterName
        })
      });
      const data = await response.json();

      if (data.audioData) {
        // Real Base64 voice data returned from Gemini
        console.log("Playing real audio block returned by Gemini 3.1 TTS!");
        const binaryString = window.atob(data.audioData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        // Since Gemini 3.1 tts returns raw PCM wave style or audio container depending on API configurations,
        // we can utilize a Blob and standard Audio play!
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.onended = () => setPlayingLineId(null);
        await audio.play();
      } else {
        // High-quality localized Web Speech synthesis simulation inside browser iFrame
        console.log("Falling back to client-side SpeechSynthesis");
        const utterance = new SpeechSynthesisUtterance(line.text);
        
        // Match voices loosely to character roles
        if (window.speechSynthesis) {
          const voices = window.speechSynthesis.getVoices();
          if (voice === 'Kore') {
            const femaleVoice = voices.find(v => v.name.includes('Google US English') || v.lang.startsWith('en-US') && v.name.toLowerCase().includes('female'));
            if (femaleVoice) utterance.voice = femaleVoice;
          } else {
            const maleVoice = voices.find(v => v.name.includes('Google UK English') || v.lang.startsWith('en-GB') && v.name.toLowerCase().includes('male'));
            if (maleVoice) utterance.voice = maleVoice;
          }
          
          utterance.rate = 1.05;
          utterance.pitch = voice === 'Kore' ? 1.2 : 0.95;
          utterance.onend = () => setPlayingLineId(null);
          utterance.onerror = () => setPlayingLineId(null);
          window.speechSynthesis.speak(utterance);
        } else {
          // If browser speech is totally locked
          setTimeout(() => setPlayingLineId(null), 2500);
        }
      }
    } catch (err) {
      console.error(err);
      setPlayingLineId(null);
    }
  };

  // Co-pilot AI Script Analysis Trigger (Real server API)
  const runAiDoctor = async () => {
    if (!currentEpisode) return;
    setIsCopilotGenerating(true);

    const screenplayText = currentEpisode.screenplay.map(l => `${l.characterName}: ${l.text}`).join('\n');

    try {
      const response = await fetch('/api/generate/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenplayText,
          title: project.title,
          genre: project.genre
        })
      });
      const data = await response.json();
      
      setPacingScore(data.pacingScore || 90);
      setRecommendations(data.recommendations || ["Pacing is highly balanced.", "Check character dialogue transitions."]);
      
      // Update project model state with new doctor info
      const updatedProject = {
        ...project,
        promotionalContent: {
          ...project.promotionalContent,
          id: project.promotionalContent?.id || "promo-main",
          posterPrompt: project.promotionalContent?.posterPrompt || "",
          posterUrl: project.promotionalContent?.posterUrl || "",
          thumbnailPrompt: project.promotionalContent?.thumbnailPrompt || "",
          thumbnailUrl: project.promotionalContent?.thumbnailUrl || "",
          trailerPrompt: project.promotionalContent?.trailerPrompt || "",
          trailerScript: project.promotionalContent?.trailerScript || "",
          pacingScore: data.pacingScore || 90,
          recommendations: data.recommendations || []
        }
      };
      await onUpdateProject(updatedProject);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCopilotGenerating(false);
      setIsCopilotOpen(true);
    }
  };

  // Screenplay edits handler
  const handleScriptLineChange = async (lineId: string, updatedText: string) => {
    if (!currentEpisode) return;
    const updatedScreenplay = currentEpisode.screenplay.map((line) => {
      if (line.id === lineId) {
        return { ...line, text: updatedText };
      }
      return line;
    });

    const updatedEpisodes = project.episodes.map((ep) => {
      if (ep.id === currentEpisode.id) {
        return { ...ep, screenplay: updatedScreenplay };
      }
      return ep;
    });

    await onUpdateProject({ ...project, episodes: updatedEpisodes });
  };

  // Storyboard Scene description edits
  const handleSceneValueChange = async (sceneId: string, field: keyof Scene, value: any) => {
    if (!currentEpisode) return;
    const updatedScenes = currentEpisode.scenes.map((scene) => {
      if (scene.id === sceneId) {
        return { ...scene, [field]: value };
      }
      return scene;
    });

    const updatedEpisodes = project.episodes.map((ep) => {
      if (ep.id === currentEpisode.id) {
        return { ...ep, scenes: updatedScenes };
      }
      return ep;
    });

    await onUpdateProject({ ...project, episodes: updatedEpisodes });
  };

  // Character updates
  const handleCharacterChange = async (charId: string, field: keyof AnimeCharacter, value: any) => {
    const updatedChars = project.characters.map((char) => {
      if (char.id === charId) {
        return { ...char, [field]: value };
      }
      return char;
    });

    // Also update matching screenplay character names if they change
    let updatedEpisodes = [...project.episodes];
    if (field === 'name') {
      updatedEpisodes = project.episodes.map((ep) => {
        const updatedScreenplay = ep.screenplay.map((line) => {
          if (line.characterId === charId) {
            return { ...line, characterName: value };
          }
          return line;
        });
        return { ...ep, screenplay: updatedScreenplay };
      });
    }

    await onUpdateProject({ ...project, characters: updatedChars, episodes: updatedEpisodes });
  };

  // Simulated subtitle translations
  const translateSubtitles = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
    }, 1800);
  };

  // Local device sync trigger
  const handleSyncBackup = async () => {
    await onTriggerBackup(selectedDeviceName, 'smartphone');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start relative pb-12">
      
      {/* Sidebar: Navigation tabs and Episode Selector */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Episode Selector */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl space-y-3">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Episode Selection
          </label>
          <div className="space-y-2">
            {project.episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setActiveEpisodeId(ep.id)}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                  activeEpisodeId === ep.id
                    ? 'bg-purple-50 dark:bg-purple-950/25 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                id={`episode-select-btn-${ep.episodeNumber}`}
              >
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-purple-500">Episode {ep.episodeNumber}</span>
                  <span className="block truncate text-gray-900 dark:text-white">{ep.title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-mono ${
                  ep.scriptStatus === 'completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                }`}>
                  {ep.scriptStatus}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Studio Panel Tabs Navigation */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl space-y-1">
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-3">
            Studio Workspaces
          </label>
          
          <button
            onClick={() => setActiveTab('script')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
              activeTab === 'script'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            id="tab-script"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Story & Screenplay</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
              activeTab === 'characters'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            id="tab-characters"
          >
            <Layers className="w-4 h-4" />
            <span>Characters Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboard')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
              activeTab === 'storyboard'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            id="tab-storyboard"
          >
            <Film className="w-4 h-4" />
            <span>Visual Storyboard</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            id="tab-audio"
          >
            <Music className="w-4 h-4" />
            <span>Music & Theme Sounds</span>
          </button>

          <button
            onClick={() => setActiveTab('localization')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
              activeTab === 'localization'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            id="tab-localization"
          >
            <Languages className="w-4 h-4" />
            <span>Localization Dub</span>
          </button>

          <button
            onClick={() => setActiveTab('style-editor')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
              activeTab === 'style-editor'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            id="tab-style-editor"
          >
            <Palette className="w-4 h-4" />
            <span>Visual Style Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            id="tab-branches"
          >
            <GitBranch className="w-4 h-4" />
            <span>Interactive Branches</span>
          </button>
        </div>

        {/* AI Script Doctor Quick Trigger */}
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900 border border-violet-100 dark:border-indigo-950/80 p-4 rounded-2xl space-y-3">
          <div className="flex items-start space-x-2.5">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse mt-0.5" />
            <div className="space-y-0.5">
              <span className="block font-bold text-xs text-gray-900 dark:text-white font-display">AI Co-pilot Analysis</span>
              <span className="block text-[11px] text-gray-500 dark:text-gray-400">Scan scripts and screenplay pacing.</span>
            </div>
          </div>
          <button
            onClick={runAiDoctor}
            disabled={isCopilotGenerating}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-indigo-500/10"
            id="trigger-ai-doctor-btn"
          >
            {isCopilotGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning Screenplay...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Audit Pacing & Dialogue</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Main Workspace Frame */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Dynamic Tab Panels */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs min-h-[500px]">
          
          {/* 1. SCREENPLAY PANEL */}
          {activeTab === 'script' && currentEpisode && (
            <div className="space-y-6 animate-fade-in" id="panel-script">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                    Episode {currentEpisode.episodeNumber}: screenplay Script
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Describe action prompts or dialogues. Tap <Volume2 className="w-3.5 h-3.5 inline text-purple-500" /> to render real character voiceovers using Gemini.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePostToProfile(currentEpisode)}
                    disabled={isPosting}
                    className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-md shadow-purple-500/10 transition-all disabled:opacity-50"
                    id="post-to-profile-btn"
                  >
                    {isPosting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    <span>Post to Public Profile</span>
                  </button>
                </div>
              </div>

              {/* Episode Character Rendering Mode Select */}
              <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/10 dark:to-indigo-950/10 border border-purple-100 dark:border-purple-950/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white font-display">Episode Character Style Preset</span>
                    <span className="px-1.5 py-0.5 text-[8px] bg-purple-600 text-white font-bold font-mono rounded uppercase">Kastoons CGI v3</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Switch rendering style specifically for this episode. Enable high-fidelity realistic rendering for human character designs.
                  </p>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800 self-start sm:self-center">
                  <button
                    onClick={() => {
                      const updatedEpisodes = project.episodes.map(ep => 
                        ep.id === currentEpisode.id ? { ...ep, characterStyle: 'anime' as const } : ep
                      );
                      onUpdateProject({ ...project, episodes: updatedEpisodes });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      currentEpisode.characterStyle !== 'realistic'
                        ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 shadow-sm font-bold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    id="char-style-anime-btn"
                  >
                    <span>🎨 Classic Anime</span>
                  </button>
                  <button
                    onClick={() => {
                      const updatedEpisodes = project.episodes.map(ep => 
                        ep.id === currentEpisode.id ? { ...ep, characterStyle: 'realistic' as const } : ep
                      );
                      onUpdateProject({ ...project, episodes: updatedEpisodes });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      currentEpisode.characterStyle === 'realistic'
                        ? 'bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-300 shadow-sm font-bold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    id="char-style-realistic-btn"
                  >
                    <span>✨ Realistic CGI</span>
                  </button>
                </div>
              </div>

              {/* Screenplay Timeline lines */}
              <div className="space-y-4">
                {currentEpisode.screenplay.map((line, idx) => {
                  const isAction = line.characterId === null;
                  return (
                    <div 
                      key={line.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        isAction 
                          ? 'bg-gray-50/50 dark:bg-gray-950/20 border-dashed border-gray-200 dark:border-gray-800/80' 
                          : 'bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800/60 shadow-xs hover:border-purple-300 dark:hover:border-purple-900/60'
                      }`}
                      id={`script-line-${line.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center space-x-2.5">
                          {isAction ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-mono tracking-wider bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                              Action Beat
                            </span>
                          ) : (
                            <>
                              <span className="font-display font-bold text-xs text-purple-600 dark:text-purple-400">
                                {line.characterName}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-mono tracking-wider bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                {line.emotion}
                              </span>
                            </>
                          )}
                        </div>

                        {!isAction && (
                          <button
                            onClick={() => triggerVoiceover(line)}
                            disabled={playingLineId !== null}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center space-x-1.5 text-xs ${
                              playingLineId === line.id
                                ? 'bg-purple-600 text-white border-purple-600 animate-pulse'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                            }`}
                            title="Play Dialogue Speech Dub"
                            id={`speech-btn-${line.id}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase tracking-wider font-mono">
                              {playingLineId === line.id ? 'Speaking...' : 'Render Voice'}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Text editor */}
                      <div className="mt-2.5 relative">
                        <textarea
                          rows={2}
                          value={line.text}
                          onChange={(e) => handleScriptLineChange(line.id, e.target.value)}
                          className="w-full p-2 rounded-xl bg-transparent text-gray-800 dark:text-gray-200 text-xs focus:outline-hidden focus:bg-gray-100/50 dark:focus:bg-gray-800/30 leading-relaxed border border-transparent hover:border-gray-200/50 dark:hover:border-gray-800 transition-all resize-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CHARACTERS PANEL */}
          {activeTab === 'characters' && (
            <div className="space-y-6 animate-fade-in" id="panel-characters">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  Character Design & Voices
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Customize character personas, appearance, and voiceover tones.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.characters.map((char) => (
                  <div 
                    key={char.id}
                    className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950/10 space-y-4"
                    id={`character-studio-${char.id}`}
                  >
                    {/* Role header */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-mono font-semibold ${
                        char.role === 'main' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                          : char.role === 'supporting'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                      }`}>
                        {char.role} Role
                      </span>
                      
                      <div className="flex items-center space-x-1 text-xs text-gray-500 font-mono">
                        <Volume2 className="w-3.5 h-3.5 text-purple-500" />
                        <span>Voice: {char.voiceName}</span>
                      </div>
                    </div>

                    {/* Character Card Info */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">Character Name</label>
                        <input
                          type="text"
                          value={char.name}
                          onChange={(e) => handleCharacterChange(char.id, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">Age</label>
                          <input
                            type="text"
                            value={char.age}
                            onChange={(e) => handleCharacterChange(char.id, 'age', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">Voice Preset</label>
                          <select
                            value={char.voiceName}
                            onChange={(e) => handleCharacterChange(char.id, 'voiceName', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                          >
                            {['Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'].map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">Personality</label>
                        <textarea
                          rows={2}
                          value={char.personality}
                          onChange={(e) => handleCharacterChange(char.id, 'personality', e.target.value)}
                          className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-850 dark:text-gray-200 focus:outline-hidden resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">Visual Design description</label>
                        <textarea
                          rows={2}
                          value={char.visualDescription}
                          onChange={(e) => handleCharacterChange(char.id, 'visualDescription', e.target.value)}
                          className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-850 dark:text-gray-200 focus:outline-hidden resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. STORYBOARD PANEL */}
          {activeTab === 'storyboard' && currentEpisode && (
            <div className="space-y-6 animate-fade-in" id="panel-storyboard">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  Storyboard Frame Sequences
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Every screenplay scene generates a vector storyboard frame detailing art prompts and camera angles.
                </p>
              </div>

              {/* Episode Character Rendering Mode Select */}
              <div className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/10 dark:to-indigo-950/10 border border-purple-100 dark:border-purple-950/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white font-display">Episode Character Style Preset</span>
                    <span className="px-1.5 py-0.5 text-[8px] bg-purple-600 text-white font-bold font-mono rounded uppercase">Kastoons CGI v3</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Switch rendering style specifically for this episode. Enable high-fidelity realistic rendering for human character designs.
                  </p>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800 self-start sm:self-center">
                  <button
                    onClick={() => {
                      const updatedEpisodes = project.episodes.map(ep => 
                        ep.id === currentEpisode.id ? { ...ep, characterStyle: 'anime' as const } : ep
                      );
                      onUpdateProject({ ...project, episodes: updatedEpisodes });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      currentEpisode.characterStyle !== 'realistic'
                        ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 shadow-sm font-bold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    id="char-style-anime-storyboard-btn"
                  >
                    <span>🎨 Classic Anime</span>
                  </button>
                  <button
                    onClick={() => {
                      const updatedEpisodes = project.episodes.map(ep => 
                        ep.id === currentEpisode.id ? { ...ep, characterStyle: 'realistic' as const } : ep
                      );
                      onUpdateProject({ ...project, episodes: updatedEpisodes });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      currentEpisode.characterStyle === 'realistic'
                        ? 'bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-300 shadow-sm font-bold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    id="char-style-realistic-storyboard-btn"
                  >
                    <span>✨ Realistic CGI</span>
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {currentEpisode.scenes.map((scene) => (
                  <div 
                    key={scene.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-6 p-5 border border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-gray-950/10 rounded-2xl items-center"
                    id={`storyboard-scene-${scene.id}`}
                  >
                    {/* Left: Vector Storyboard Frame Preview */}
                    <div className="md:col-span-2 h-[220px]">
                      <AnimeSceneArt type={scene.backgroundUrl} title={scene.title} stylePreset={selectedStylePreset} characterStyle={currentEpisode.characterStyle} />
                    </div>

                    {/* Right: Scene values */}
                    <div className="md:col-span-3 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-mono font-semibold tracking-wider text-purple-600">Scene #{scene.sceneNumber}: {scene.title}</span>
                        <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-mono">
                          <Camera className="w-3.5 h-3.5 text-gray-400" />
                          <span>Angle: {scene.cameraAngle}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Background Art Prompt</label>
                          <input
                            type="text"
                            value={scene.backgroundPrompt}
                            onChange={(e) => handleSceneValueChange(scene.id, 'backgroundPrompt', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Action Description</label>
                          <input
                            type="text"
                            value={scene.actionText}
                            onChange={(e) => handleSceneValueChange(scene.id, 'actionText', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Sound Effects Prompt</label>
                          <input
                            type="text"
                            value={scene.soundEffectPrompt}
                            onChange={(e) => handleSceneValueChange(scene.id, 'soundEffectPrompt', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Camera Angle Direction</label>
                          <input
                            type="text"
                            value={scene.cameraAngle}
                            onChange={(e) => handleSceneValueChange(scene.id, 'cameraAngle', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Duration (sec)</label>
                          <input
                            type="number"
                            value={scene.durationSeconds}
                            onChange={(e) => handleSceneValueChange(scene.id, 'durationSeconds', parseInt(e.target.value) || 5)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SOUNDTRACK AND MUSIC PANEL */}
          {activeTab === 'audio' && (
            <div className="space-y-6 animate-fade-in" id="panel-audio">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  Soundtracks & Orchestral Themes
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  AI renders complete soundtracks based on prompts. Tap Play to synthesize simulated soundtrack clips.
                </p>
              </div>

              {/* Music Waves Player mockup */}
              <div className="p-6 bg-linear-to-r from-violet-600 to-indigo-700 rounded-3xl text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-indigo-200 tracking-wider">Active Studio Track</span>
                    <h4 className="font-display font-bold text-lg">Epic Anime Opening Theme Orchestra</h4>
                  </div>
                  <button
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    className="w-12 h-12 rounded-full bg-white text-indigo-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                    id="play-soundtrack-btn"
                  >
                    <Play className={`w-5 h-5 fill-indigo-900 translate-x-0.5 ${isPlayingMusic ? 'animate-ping' : ''}`} />
                  </button>
                </div>

                {/* Animated waveform bars */}
                <div className="h-16 flex items-end justify-center space-x-1.5 bg-indigo-950/30 rounded-2xl px-4 py-3">
                  {musicWaveform.map((height, idx) => (
                    <div
                      key={idx}
                      className="w-2 rounded-full bg-linear-to-t from-violet-400 to-pink-300 transition-all duration-150"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>

                <p className="text-xs text-indigo-200 font-light leading-relaxed">
                  <strong>Active Prompts:</strong> &ldquo;{project.openingThemePrompt}&rdquo;
                </p>
              </div>

              {/* Sound prompt forms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 space-y-2">
                  <span className="font-semibold block text-gray-900 dark:text-white">Opening Theme Prompt</span>
                  <textarea
                    rows={3}
                    value={project.openingThemePrompt}
                    onChange={(e) => onUpdateProject({ ...project, openingThemePrompt: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 focus:outline-hidden"
                  />
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 space-y-2">
                  <span className="font-semibold block text-gray-900 dark:text-white">Ambient Background Prompt</span>
                  <textarea
                    rows={3}
                    value={project.ambientMusicPrompt}
                    onChange={(e) => onUpdateProject({ ...project, ambientMusicPrompt: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 focus:outline-hidden"
                  />
                </div>

                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 space-y-2">
                  <span className="font-semibold block text-gray-900 dark:text-white">Ending Theme Prompt</span>
                  <textarea
                    rows={3}
                    value={project.endingThemePrompt}
                    onChange={(e) => onUpdateProject({ ...project, endingThemePrompt: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. LOCALIZATION PANEL */}
          {activeTab === 'localization' && currentEpisode && (
            <div className="space-y-6 animate-fade-in" id="panel-localization">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                    Subtitles & Multilingual Dubs
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Align subtitles with generated scenes. Translate instantly to reach international audiences.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                    id="loc-lang-select"
                  >
                    <option value="JA">Japanese (日本語)</option>
                    <option value="ES">Spanish (Español)</option>
                    <option value="FR">French (Français)</option>
                    <option value="KO">Korean (한국어)</option>
                    <option value="EN">English</option>
                  </select>
                  
                  <button
                    onClick={translateSubtitles}
                    disabled={isTranslating}
                    className="px-3 py-1.5 bg-purple-600 text-white font-medium rounded-lg text-xs hover:bg-purple-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
                    id="loc-translate-btn"
                  >
                    {isTranslating ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Translating...</span>
                      </>
                    ) : (
                      <>
                        <Languages className="w-3 h-3" />
                        <span>Run Translation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Subtitle scene display screen */}
              <div className="relative rounded-2xl overflow-hidden aspect-video max-w-xl mx-auto border border-gray-200 dark:border-gray-800 shadow-md">
                <AnimeSceneArt type={currentEpisode.scenes[0]?.backgroundUrl} title="" stylePreset={selectedStylePreset} characterStyle={currentEpisode.characterStyle} />
                
                {/* Subtitle black container strip on top of storyboard art */}
                <div className="absolute inset-x-0 bottom-0 bg-black/70 py-3.5 px-4 text-center">
                  {isTranslating ? (
                    <div className="text-xs text-gray-400 font-mono animate-pulse">Running neural localization engine...</div>
                  ) : (
                    <p className="text-xs sm:text-sm font-sans font-medium text-yellow-300 leading-normal">
                      {selectedLanguage === 'JA' && "「ネオンは光るが、東京の中は真っ暗だ。コーポレーションは記憶を盗んだ...しかし私の鉄は消せなかった！」"}
                      {selectedLanguage === 'ES' && "“El neón brilla, pero Tokio está completamente oscuro por dentro. La corporación robó nuestros recuerdos... ¡pero se olvidaron de borrar mi acero!”"}
                      {selectedLanguage === 'FR' && "« Le néon brille, mais Tokyo est complètement sombre à l'intérieur. La corporation a volé nos souvenirs... mais ils ont oublié de supprimer mon acier ! »"}
                      {selectedLanguage === 'KO' && "“네온은 빛나지만 도쿄 내부의 어둠은 짙다. 기업들은 우리의 기억을 훔쳤지만... 내 검은 지우지 못했다!”"}
                      {selectedLanguage === 'EN' && "“The neon glows, but Tokyo is pitch black inside. The corporation stole our ancestors' memories... but they forgot to delete my steel.”"}
                    </p>
                    
                  )}
                  <span className="block text-[9px] text-gray-400 uppercase font-mono tracking-widest mt-1">SUBTITLE LOCALIZATION // {selectedLanguage} OVERLAY</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. VISUAL STYLE EDITOR PANEL */}
          {activeTab === 'style-editor' && (
            <div className="space-y-6 animate-fade-in" id="panel-style-editor">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                    Visual Style & Artistic Direction
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Define artistic presets, upload reference images, and instruct the AI on visual rendering guidelines.
                  </p>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  Active Style: <span className="font-bold text-purple-600 uppercase">{selectedStylePreset}</span>
                </div>
              </div>

              {/* Predefined Style presets grid */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Select Artistic Preset</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    'Classic Shonen',
                    'Magical Girl',
                    'Cyberpunk Noir',
                    'Iyashikei',
                    'Retro 80s',
                    'Ghibli Whimsical',
                    'Chibi Playful',
                    'Realistic Cinematic'
                  ].map((preset) => {
                    const isActive = selectedStylePreset === preset;
                    return (
                      <button
                        key={preset}
                        onClick={async () => {
                          setSelectedStylePreset(preset);
                          await handleSaveStyleConfig(preset, styleDescription, styleReferenceImages);
                        }}
                        className={`text-left rounded-2xl p-2 border-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                          isActive
                            ? 'border-purple-600 bg-purple-500/5 shadow-md'
                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                        id={`btn-preset-${preset.toLowerCase().replace(' ', '-')}`}
                      >
                        <StylePresetPreview styleName={preset} />
                        <div className="mt-2 px-1 pb-1 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{preset}</span>
                          {isActive && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Reference images & instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Custom Guidelines */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950/20 space-y-3">
                    <span className="block font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider font-mono">Artistic Co-pilot Instructions</span>
                    <textarea
                      rows={5}
                      value={styleDescription}
                      placeholder="e.g., Use high-contrast dynamic cel-shading with dark vignettes, atmospheric lens flares, and soft watercolor textures in the backgrounds..."
                      onChange={(e) => setStyleDescription(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-hidden leading-relaxed"
                    />
                    <button
                      onClick={async () => {
                        setIsGeneratingStyle(true);
                        await handleSaveStyleConfig(selectedStylePreset, styleDescription, styleReferenceImages);
                        setTimeout(() => setIsGeneratingStyle(false), 800);
                      }}
                      disabled={isGeneratingStyle}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                      id="btn-save-style-guidelines"
                    >
                      {isGeneratingStyle ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Syncing Art Matrix...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Update Style Matrix</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Drag and drop / file input style upload */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/10 dark:bg-gray-950/10 flex flex-col items-center justify-center text-center p-6 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadReferenceImage}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      id="style-file-upload-input"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-gray-900 dark:text-white">Upload Reference Aesthetics</span>
                        <p className="text-[10px] text-gray-500">Drag & drop or click to upload local imagery to guide the AI</p>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded items list */}
                  {styleReferenceImages.length > 0 && (
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Reference Library ({styleReferenceImages.length})</span>
                      <div className="grid grid-cols-2 gap-3 max-h-44 overflow-y-auto pr-1">
                        {styleReferenceImages.map((img) => (
                          <div
                            key={img.id}
                            className="flex items-center space-x-2.5 p-2 rounded-xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 group"
                          >
                            <img
                              src={img.dataUrl}
                              alt={img.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-950"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-gray-900 dark:text-white truncate">{img.name}</span>
                              <span className="block text-[9px] text-gray-400 font-mono">Uploaded</span>
                            </div>
                            <button
                              onClick={() => handleDeleteReferenceImage(img.id)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 cursor-pointer"
                              title="Delete Reference"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 7. INTERACTIVE STORY BRANCHING PANEL */}
          {activeTab === 'branches' && currentEpisode && (
            <div className="space-y-6 animate-fade-in" id="panel-story-branches">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                    Interactive Narrative Branching Studio
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Identify key divergence points in the screenplay, model decision routes, and let the AI generate alternative endings.
                  </p>
                </div>
                <div className="px-2.5 py-1 text-[10px] font-mono bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-lg font-bold">
                  Active Paths: {1 + (currentEpisode.storyBranches?.length || 0)}
                </div>
              </div>

              {/* Story Branch Generator Form */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-linear-to-br from-violet-500/5 to-purple-500/5 space-y-4">
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider font-mono">Create Narrative Divergence Path</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Script Divergence point */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Identify Divergence Line</label>
                    <select
                      value={selectedDivergenceLineId}
                      onChange={(e) => setSelectedDivergenceLineId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                      id="branch-divergence-line-select"
                    >
                      {currentEpisode.screenplay.map((line) => (
                        <option key={line.id} value={line.id}>
                          {line.characterName || 'Narration'}: {line.text.substring(0, 50)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Define Branch Choice input */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Define Decision/Choice Text</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={branchChoiceText}
                        placeholder="e.g. Kenji stands firm and activates his high-frequency blade..."
                        onChange={(e) => setBranchChoiceText(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                        id="branch-choice-text-input"
                      />
                      <button
                        onClick={handleGenerateStoryBranch}
                        disabled={isGeneratingBranch || !branchChoiceText.trim() || !selectedDivergenceLineId}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition-colors cursor-pointer shrink-0"
                        id="btn-generate-branch"
                      >
                        {isGeneratingBranch ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Branching...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>Branch Path</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* List of narrative paths */}
              <div className="space-y-4">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Narrative Trajectories Map</span>

                {/* Base main flow line */}
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
                  <div className="space-y-1 flex-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-mono text-[8px] font-bold uppercase rounded">Main path</span>
                      <span className="font-bold text-xs text-gray-900 dark:text-white">The Prime Timeline</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      The original, standard generated screenplay sequence for this anime episode.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-gray-400 shrink-0">
                    {currentEpisode.screenplay.length} script lines // {currentEpisode.scenes.length} scene storyboard
                  </div>
                </div>

                {/* List of alternative branches */}
                {currentEpisode.storyBranches && currentEpisode.storyBranches.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {currentEpisode.storyBranches.map((branch) => {
                      return (
                        <div
                          key={branch.id}
                          className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 hover:border-purple-600/30 transition-all"
                          id={`branch-card-${branch.id}`}
                        >
                          {/* Title block */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="px-1.5 py-0.5 bg-purple-600 text-white font-mono text-[8px] font-bold uppercase rounded">Alternative path</span>
                                <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm">{branch.title}</h4>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                &ldquo;{branch.choiceText}&rdquo;
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => promoteBranchToMain(branch)}
                                className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 dark:text-purple-300 font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors"
                                title="Swap this alternative branch with the prime screenplay timeline"
                              >
                                <ArrowLeftRight className="w-3.5 h-3.5" />
                                <span>Promote to Prime Path</span>
                              </button>

                              <button
                                onClick={() => handleDeleteBranch(branch.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl cursor-pointer"
                                title="Delete Branch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Divergence description */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-3.5 rounded-xl bg-gray-50/50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-850">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Narrative Shift</span>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{branch.description}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Alternative Outcome</span>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{branch.outcomeSummary}</p>
                            </div>
                          </div>

                          {/* Interactive collapsible preview */}
                          <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-gray-850">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Branch Screenplay Outline</span>
                            <div className="space-y-2">
                              {branch.screenplay.map((bLine, bIdx) => (
                                <div key={bLine.id || bIdx} className="flex items-start space-x-3 text-xs pl-2 border-l-2 border-purple-500/30">
                                  <span className="font-bold text-gray-900 dark:text-white shrink-0 min-w-24">{bLine.characterName || 'Narration'}:</span>
                                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">&ldquo;{bLine.text}&rdquo;</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {branch.scenes && branch.scenes.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Branch Storyboard Preview</span>
                              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center p-3 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/10 dark:bg-gray-950/10">
                                <div className="sm:col-span-2 h-[120px]">
                                  <AnimeSceneArt type={branch.scenes[0].backgroundUrl} title={branch.scenes[0].title} stylePreset={selectedStylePreset} characterStyle={currentEpisode.characterStyle} />
                                </div>
                                <div className="sm:col-span-3 space-y-1.5 text-xs">
                                  <div className="font-bold text-gray-950 dark:text-white uppercase font-mono tracking-wider">
                                    Scene: {branch.scenes[0].title}
                                  </div>
                                  <p className="text-[11px] text-gray-500 leading-relaxed">
                                    <strong>Camera Angle:</strong> {branch.scenes[0].cameraAngle} <br/>
                                    <strong>Visual Prompt:</strong> {branch.scenes[0].backgroundPrompt}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-150 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
                    <GitBranch className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <span className="block text-xs font-bold text-gray-800 dark:text-white">No alternative paths defined yet</span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1">
                      Choose a screenplay point and define a decision prompt above to start modeling diverging narrative paths.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Sync Backups panel inside editor */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm flex items-center space-x-2">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
              <span>Secure Cloud Backups & Device Sync</span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Synchronize script databases and art outlines across your authorized smartphones or stations.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <select
              value={selectedDeviceName}
              onChange={(e) => setSelectedDeviceName(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              id="editor-backup-device-select"
            >
              {project.localBackups.length > 0 ? (
                project.localBackups.map((bk) => (
                  <option key={bk.id} value={bk.deviceName}>{bk.deviceName}</option>
                ))
              ) : (
                <option value="Kenji's iPhone 15 Pro">Kenji's iPhone 15 Pro</option>
              )}
            </select>

            <button
              onClick={handleSyncBackup}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-850 dark:hover:bg-gray-800 text-white font-semibold rounded-xl flex items-center space-x-2 cursor-pointer transition-colors"
              id="editor-backup-sync-btn"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Back Up Now</span>
            </button>
          </div>
        </div>

      </div>

      {/* Floating co-pilot AI recommendation overlay drawer */}
      {isCopilotOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl p-6 flex flex-col justify-between animate-slide-in">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-base">Script Doctor Audit</h3>
              </div>
              <button 
                onClick={() => setIsCopilotOpen(false)} 
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white font-mono text-xs p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                id="close-doctor-btn"
              >
                Close
              </button>
            </div>

            {/* Pacing Score display */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900/60 dark:to-gray-950/60 p-4 rounded-2xl border border-indigo-100 dark:border-purple-950/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-mono tracking-wider">Cinematic Pacing Score</span>
                <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">{pacingScore}/100</span>
              </div>
              <div className="h-2 w-full bg-indigo-950/20 dark:bg-purple-950/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                  style={{ width: `${pacingScore}%` }}
                ></div>
              </div>
              <span className="block text-[10px] text-gray-500 dark:text-gray-400 italic">Pacing is calculated based on script length, scene density, and transition contrast.</span>
            </div>

            {/* AI Bullet point suggestions */}
            <div className="space-y-3 text-xs">
              <span className="block font-semibold text-gray-900 dark:text-white">Recommendations from Gemini 3.5:</span>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2.5 text-gray-700 dark:text-gray-300 leading-normal">
                    <span className="text-purple-500 mt-1">●</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-150 dark:border-gray-800 pt-4">
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              id="apply-doctor-btn"
            >
              Acknowledge & Apply Edits
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
