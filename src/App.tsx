import React, { useState, useEffect } from 'react';
import { AnimeProject, LinkedDevice, LinkedAccount, CreatorProfile, UserSubscription } from './types';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import ProjectWizard from './components/ProjectWizard';
import EditorWorkspace from './components/EditorWorkspace';
import PublishingHub from './components/PublishingHub';
import ProfileHub from './components/ProfileHub';
import { Film, Radio, Layers, CloudLightning, ShieldCheck, HelpCircle, User } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeView, setActiveView] = useState<'studio' | 'publishing' | 'profile'>('studio');
  const [projects, setProjects] = useState<AnimeProject[]>([]);
  const [devices, setDevices] = useState<LinkedDevice[]>([]);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  
  // Selected project for editing
  const [selectedProject, setSelectedProject] = useState<AnimeProject | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);

  // Apply dark/light class to HTML tag for Tailwind v4 compatibility
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#030712'; // Slate-950
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#F9FAFB'; // Gray-50
    }
  }, [theme]);

  // Simulate rotating online team collaborators dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(() => Math.floor(Math.random() * 3) + 2); // 2 to 4 collaborators
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial data from Express full-stack server
  const loadData = async () => {
    try {
      const projRes = await fetch('/api/projects');
      const projData = await projRes.json();
      setProjects(projData.projects || []);

      const devRes = await fetch('/api/devices');
      const devData = await devRes.json();
      setDevices(devData.devices || []);

      const accRes = await fetch('/api/accounts');
      const accData = await accRes.json();
      setAccounts(accData.accounts || []);

      const profRes = await fetch('/api/profile');
      const profData = await profRes.json();
      setProfile(profData.profile || null);
      setSubscription(profData.subscription || null);
    } catch (err) {
      console.error("Failed to fetch initial database values from server:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync selectedProject from database edits to keep state unified
  const syncSelectedProjectState = (updatedList: AnimeProject[]) => {
    if (selectedProject) {
      const match = updatedList.find(p => p.id === selectedProject.id);
      if (match) setSelectedProject(match);
    }
  };

  // CREATE: Submit new project prompt (Calls server-side Gemini generation!)
  const handleWizardSubmit = async (data: {
    title: string;
    prompt: string;
    genre: string;
    animationStyle: string;
    episodeCount: number;
  }) => {
    try {
      // Call server storyline generator
      const genRes = await fetch('/api/generate/storyline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const genData = await genRes.json();

      // Bundle into new database project structure
      const newProjPayload = {
        title: genData.title || data.title,
        prompt: data.prompt,
        genre: data.genre,
        animationStyle: data.animationStyle,
        description: genData.description || `A compelling ${data.genre} saga in the style of ${data.animationStyle}.`,
        characters: genData.characters || [],
        episodes: genData.episodes || [],
        ambientMusicPrompt: genData.ambientMusicPrompt || '',
        openingThemePrompt: genData.openingThemePrompt || '',
        endingThemePrompt: genData.endingThemePrompt || '',
        status: 'draft' as const
      };

      // Save to server database
      const saveRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjPayload)
      });
      const saveData = await saveRes.json();

      if (saveData.project) {
        setProjects((prev) => [saveData.project, ...prev]);
        setShowWizard(false);
        // Automatically open the editing workspace for the newly created anime series!
        setSelectedProject(saveData.project);
      }
    } catch (err) {
      console.error("Failed to submit anime wizard parameters:", err);
    }
  };

  // UPDATE: Project values (screenplays, dialogues, soundtracks)
  const handleUpdateProject = async (updatedProject: AnimeProject) => {
    try {
      const res = await fetch(`/api/projects/${updatedProject.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject)
      });
      const data = await res.json();
      if (data.project) {
        setProjects((prev) => {
          const newList = prev.map(p => p.id === data.project.id ? data.project : p);
          syncSelectedProjectState(newList);
          return newList;
        });
      }
    } catch (err) {
      console.error("Failed to update project database:", err);
    }
  };

  // DELETE: Remove project
  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter(p => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // DEVICE OPERATIONS
  const handleAddDevice = async (name: string, type: string, os: string) => {
    try {
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, os })
      });
      const data = await res.json();
      if (data.device) {
        setDevices((prev) => [...prev, data.device]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDevice = async (id: string) => {
    try {
      const res = await fetch(`/api/devices/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.device) {
        setDevices((prev) => prev.map(d => d.id === id ? data.device : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    try {
      await fetch(`/api/devices/${id}`, { method: 'DELETE' });
      setDevices((prev) => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // PLATFORMS TOGGLE
  const handleToggleAccount = async (id: string) => {
    try {
      const res = await fetch(`/api/accounts/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.account) {
        setAccounts((prev) => prev.map(a => a.id === id ? data.account : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // SCHEDULING OPERATIONS
  const handleAddSchedule = async (projectId: string, platform: string, scheduledAt: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, scheduledAt })
      });
      const data = await res.json();
      if (data.schedule) {
        setProjects((prev) => {
          const newList = prev.map((p) => {
            if (p.id === projectId) {
              return { ...p, schedules: data.schedules };
            }
            return p;
          });
          syncSelectedProjectState(newList);
          return newList;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelSchedule = async (projectId: string, schId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/schedule/${schId}/cancel`, { method: 'POST' });
      const data = await res.json();
      setProjects((prev) => {
        const newList = prev.map((p) => {
          if (p.id === projectId) {
            return { ...p, schedules: data.schedules };
          }
          return p;
        });
        syncSelectedProjectState(newList);
        return newList;
      });
    } catch (err) {
      console.error(err);
    }
  };

  // BACKUP OPERATIONS (Simulates secure cloud syncing from local station)
  const handleTriggerBackup = async (deviceName: string, deviceType: 'smartphone' | 'tablet' | 'computer') => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/backup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceName, deviceType })
      });
      const data = await res.json();
      if (data.backup) {
        setProjects((prev) => {
          const newList = prev.map((p) => {
            if (p.id === selectedProject.id) {
              return { ...p, localBackups: data.backups };
            }
            return p;
          });
          syncSelectedProjectState(newList);
          return newList;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // PROMOTIONAL CAMPAIGN GENERATOR (Gemini 3.5 integrations)
  const handleGeneratePromoContent = async (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    const charactersText = proj.characters.map(c => `${c.name} (Age ${c.age}, ${c.role})`).join(', ');

    try {
      const res = await fetch('/api/generate/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: proj.title,
          genre: proj.genre,
          style: proj.animationStyle,
          charactersText
        })
      });
      const data = await res.json();
      
      const updatedProject = {
        ...proj,
        promotionalContent: {
          id: proj.promotionalContent?.id || "promo-main",
          posterPrompt: data.posterPrompt,
          posterUrl: data.posterUrl,
          thumbnailPrompt: data.thumbnailPrompt,
          thumbnailUrl: data.thumbnailUrl,
          trailerPrompt: data.trailerPrompt,
          trailerScript: data.trailerScript,
          pacingScore: proj.promotionalContent?.pacingScore || 88,
          recommendations: proj.promotionalContent?.recommendations || []
        }
      };

      await handleUpdateProject(updatedProject);
    } catch (err) {
      console.error("Promo asset generation error:", err);
    }
  };

  // PROFILE & SUBSCRIPTION DISPATCHERS
  const handleUpdateProfile = async (updates: any) => {
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleUpgradeSubscription = async (planId: string, cardBrand?: string, cardLast4?: string) => {
    try {
      const res = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, cardBrand, cardLast4 })
      });
      const data = await res.json();
      if (data.subscription) {
        setSubscription(data.subscription);
        
        // Reload full profile stats
        const profRes = await fetch('/api/profile');
        const profData = await profRes.json();
        setProfile(profData.profile);
        return { success: true, subscription: data.subscription };
      }
    } catch (err) {
      console.error("Failed to upgrade subscription:", err);
    }
    return { success: false, subscription: null };
  };

  const handleCancelSubscription = async () => {
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' });
      const data = await res.json();
      if (data.subscription) {
        setSubscription(data.subscription);
        
        // Reload profile metrics
        const profRes = await fetch('/api/profile');
        const profData = await profRes.json();
        setProfile(profData.profile);
        return true;
      }
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
    }
    return false;
  };

  const handlePostVideo = async (projectId: string, episodeId: string) => {
    try {
      const res = await fetch('/api/profile/post-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, episodeId })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.profile) setProfile(data.profile);
        if (data.subscription) setSubscription(data.subscription);
        return { success: true, post: data.post };
      } else {
        return { success: false, error: data.error, message: data.message };
      }
    } catch (err) {
      console.error("Failed to post video:", err);
      return { success: false, error: "Network Error", message: "Failed to connect to the server." };
    }
  };

  const handleDeleteVideo = async (postId: string) => {
    try {
      const res = await fetch('/api/profile/delete-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
      if (data.subscription) setSubscription(data.subscription);
      return true;
    } catch (err) {
      console.error("Failed to delete video:", err);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 antialiased font-sans">
      
      {/* Top Application Bar */}
      <Header
        theme={theme}
        setTheme={setTheme}
        activeProjectTitle={selectedProject?.title}
        onExitProject={() => setSelectedProject(null)}
        onlineCount={onlineCount}
      />

      {/* Main Studio Frame Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {selectedProject ? (
          // Active Editor Workspace
          <EditorWorkspace
            project={selectedProject}
            onUpdateProject={handleUpdateProject}
            onTriggerBackup={handleTriggerBackup}
            onPostVideo={handlePostVideo}
            subscription={subscription}
          />
        ) : (
          // General Studio Dashboard Area
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Left navigation sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl space-y-1">
                <span className="block text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono tracking-wider mb-2.5 px-2">Navigation</span>
                
                <button
                  onClick={() => setActiveView('studio')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 cursor-pointer transition-all ${
                    activeView === 'studio'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  id="nav-studio-btn"
                >
                  <Film className="w-4 h-4" />
                  <span>Anime Workspace</span>
                </button>

                <button
                  onClick={() => setActiveView('publishing')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 cursor-pointer transition-all ${
                    activeView === 'publishing'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  id="nav-publishing-btn"
                >
                  <Radio className="w-4 h-4" />
                  <span>Publish & Devices</span>
                </button>

                <button
                  onClick={() => setActiveView('profile')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 cursor-pointer transition-all ${
                    activeView === 'profile'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/15'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  id="nav-profile-btn"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile & Subscriptions</span>
                </button>
              </div>

              {/* Status bar */}
              <div className="p-4 border border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl space-y-2 text-xs">
                <span className="font-semibold block text-gray-900 dark:text-white font-display">System Integrity</span>
                <div className="space-y-1.5 font-mono text-[10px] text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Cloud Sync status:</span>
                    <span className="text-emerald-500 font-bold">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Copyright Vault:</span>
                    <span className="text-emerald-500 font-bold">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Storage:</span>
                    <span>12.4 GB / 100 GB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Primary View Content */}
            <div className="lg:col-span-3">
              {activeView === 'studio' ? (
                <ProjectList
                  projects={projects}
                  onSelectProject={setSelectedProject}
                  onDeleteProject={handleDeleteProject}
                  onOpenWizard={() => setShowWizard(true)}
                />
              ) : activeView === 'publishing' ? (
                <PublishingHub
                  projects={projects}
                  devices={devices}
                  accounts={accounts}
                  onToggleDevice={handleToggleDevice}
                  onDeleteDevice={handleDeleteDevice}
                  onAddDevice={handleAddDevice}
                  onToggleAccount={handleToggleAccount}
                  onAddSchedule={handleAddSchedule}
                  onCancelSchedule={handleCancelSchedule}
                  onGeneratePromo={handleGeneratePromoContent}
                />
              ) : (
                <ProfileHub
                  profile={profile}
                  subscription={subscription}
                  onUpdateProfile={handleUpdateProfile}
                  onUpgradeSubscription={handleUpgradeSubscription}
                  onCancelSubscription={handleCancelSubscription}
                  onDeleteVideo={handleDeleteVideo}
                />
              )}
            </div>

          </div>
        )}
      </main>

      {/* Production Wizard Modal Overlay */}
      {showWizard && (
        <ProjectWizard
          onClose={() => setShowWizard(false)}
          onSubmit={handleWizardSubmit}
        />
      )}
    </div>
  );
}
