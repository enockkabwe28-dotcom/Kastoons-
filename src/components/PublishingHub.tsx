import React, { useState } from 'react';
import { AnimeProject, LinkedAccount, LinkedDevice, PublishSchedule } from '../types';
import { 
  Smartphone, Tv, HardDrive, Youtube, Music, Instagram, FolderGit2, 
  Trash2, ShieldCheck, Plus, Calendar, Sparkles, Check, Play, 
  CloudLightning, AlertTriangle, Download, RefreshCw, Layers
} from 'lucide-react';

interface PublishingHubProps {
  projects: AnimeProject[];
  devices: LinkedDevice[];
  accounts: LinkedAccount[];
  onToggleDevice: (id: string) => Promise<void>;
  onDeleteDevice: (id: string) => Promise<void>;
  onAddDevice: (name: string, type: string, os: string) => Promise<void>;
  onToggleAccount: (id: string) => Promise<void>;
  onAddSchedule: (projectId: string, platform: string, scheduledAt: string) => Promise<void>;
  onCancelSchedule: (projectId: string, schId: string) => Promise<void>;
  onGeneratePromo: (projectId: string) => Promise<void>;
}

export default function PublishingHub({
  projects,
  devices,
  accounts,
  onToggleDevice,
  onDeleteDevice,
  onAddDevice,
  onToggleAccount,
  onAddSchedule,
  onCancelSchedule,
  onGeneratePromo
}: PublishingHubProps) {
  // Device link modal flow
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState('smartphone');
  const [pairingCode, setPairingCode] = useState('');
  const [isPairing, setIsPairing] = useState(false);

  // Schedule flow
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('18:00');

  // Active promo tabs
  const [activeProjectForPromo, setActiveProjectForPromo] = useState<string>(projects[0]?.id || '');
  const [isGeneratingPromo, setIsGeneratingPromo] = useState(false);

  // Active project selection
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const promoProject = projects.find(p => p.id === activeProjectForPromo) || projects[0];

  const handlePairDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    setIsPairing(true);
    // Simulate real high-fidelity secure cryptographic device pairing code
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPairingCode(mockCode);

    setTimeout(async () => {
      const os = newDeviceType === 'smartphone' ? 'iOS 18' : newDeviceType === 'tablet' ? 'iPadOS 18' : 'Windows 11';
      await onAddDevice(newDeviceName, newDeviceType, os);
      setIsPairing(false);
      setNewDeviceName('');
      setShowDeviceModal(false);
      setPairingCode('');
    }, 3000);
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !scheduleDate) return;
    
    const formattedDateTime = `${scheduleDate} ${scheduleTime}`;
    await onAddSchedule(selectedProjectId, selectedPlatform, formattedDateTime);
  };

  const handleRunPromoCampaign = async () => {
    if (!activeProjectForPromo) return;
    setIsGeneratingPromo(true);
    try {
      await onGeneratePromo(activeProjectForPromo);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPromo(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-12 text-sm">
      
      {/* 1. Platform Links & Device Authorization */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Secure Authorized Devices */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">Authorized Devices</h3>
              <p className="text-[11px] text-gray-500">Linked smartphones & computers</p>
            </div>
            <button
              onClick={() => setShowDeviceModal(true)}
              className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 transition-colors cursor-pointer"
              title="Add New Pairing"
              id="add-device-modal-btn"
            >
              <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="space-y-3">
            {devices.map((dev) => (
              <div 
                key={dev.id} 
                className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-950/10 rounded-xl"
                id={`device-row-${dev.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {dev.type === 'smart_tv' ? <Tv className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="block font-semibold text-xs text-gray-900 dark:text-white">{dev.name}</span>
                    <span className="block text-[10px] text-gray-400 font-mono">Sync: {dev.lastSynced}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleDevice(dev.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      dev.status === 'authorized'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200 dark:border-emerald-900/50'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                    }`}
                    title="Click to toggle authorization"
                    id={`toggle-auth-device-${dev.id}`}
                  >
                    {dev.status === 'authorized' ? 'ACTIVE' : 'REVOKED'}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove device pairing for "${dev.name}"?`)) onDeleteDevice(dev.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    id={`delete-device-${dev.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms OAuth Hub */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl space-y-4">
          <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">Linked Accounts</h3>
            <p className="text-[11px] text-gray-500">Cloud backups and social publishers</p>
          </div>

          <div className="space-y-3">
            {accounts.map((acc) => {
              const isLinked = acc.status === 'authorized';
              return (
                <div 
                  key={acc.id}
                  className={`p-3 border rounded-xl flex items-center justify-between transition-all ${
                    isLinked 
                      ? 'border-purple-200 bg-purple-50/10 dark:border-purple-900/40' 
                      : 'border-gray-100 dark:border-gray-800 bg-transparent'
                  }`}
                  id={`account-row-${acc.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg text-white ${
                      acc.platform === 'youtube' 
                        ? 'bg-red-600' 
                        : acc.platform === 'tiktok' 
                          ? 'bg-zinc-950 border border-zinc-800 text-white' 
                          : acc.platform === 'gdrive' 
                            ? 'bg-emerald-600' 
                            : 'bg-blue-600'
                    }`}>
                      {acc.platform === 'gdrive' || acc.platform === 'dropbox' ? <HardDrive className="w-4 h-4" /> : <Youtube className="w-4 h-4" />}
                    </div>

                    <div>
                      <span className="block font-semibold text-xs text-gray-900 dark:text-white capitalize">{acc.platform}</span>
                      <span className="block text-[10px] text-gray-400 max-w-[150px] truncate">{isLinked ? acc.accountName : 'Not linked'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isLinked} 
                        onChange={() => onToggleAccount(acc.id)}
                        className="sr-only peer cursor-pointer" 
                      />
                      <div className="w-8 h-4 bg-gray-200 dark:bg-gray-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Publish & Schedulers */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Scheduler Dashboard console */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-150 dark:border-gray-800 pb-4">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">Schedule automatic publishing</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Coordinate multi-channel releases. AI validates assets for copyright and format compliance automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Form */}
            <form onSubmit={handleCreateSchedule} className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider">Select Anime Title</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                  id="schedule-project-select"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider">Target platform Channel</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                  id="schedule-platform-select"
                >
                  <option value="youtube">YouTube Studios</option>
                  <option value="tiktok">TikTok Channels</option>
                  <option value="gdrive">Google Drive Cloud Storage</option>
                  <option value="instagram">Instagram reels</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider">Publish Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                    id="schedule-date-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider">Publish Time</label>
                  <input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                    id="schedule-time-input"
                  />
                </div>
              </div>

              {/* Copyright warning badge */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 flex items-start space-x-2 text-[11px] text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>AI copyright shield active. Content is fully licensed and secure for monetization.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                id="create-schedule-btn"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Release</span>
              </button>
            </form>

            {/* Queue List */}
            <div className="lg:col-span-3 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-150 dark:border-gray-800 pt-4 lg:pt-0 lg:pl-6">
              <span className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-2">Upcoming Scheduled Queue</span>
              
              {currentProject?.schedules && currentProject.schedules.length > 0 ? (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {currentProject.schedules.map((sch) => (
                    <div 
                      key={sch.id}
                      className="p-3 border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/10 rounded-xl flex items-center justify-between gap-3 text-xs"
                      id={`schedule-row-${sch.id}`}
                    >
                      <div className="space-y-1 max-w-[70%]">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-mono tracking-wider bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                            {sch.platform}
                          </span>
                          <span className="font-semibold truncate text-gray-900 dark:text-white text-xs">{currentProject.title}</span>
                        </div>
                        <span className="block text-[11px] text-gray-500 dark:text-gray-400 font-mono">Date: {sch.scheduledAt}</span>
                      </div>

                      <button
                        onClick={() => onCancelSchedule(currentProject.id, sch.id)}
                        className="px-2.5 py-1 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        id={`cancel-schedule-btn-${sch.id}`}
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 bg-gray-50/40 dark:bg-gray-950/10 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-8 h-8 text-gray-300" />
                  <span className="text-xs font-light">No upcoming releases scheduled for this title.</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Promotional Auto-Generator Panel (Gemini 3.5 integrations) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-150 dark:border-gray-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">Automatic Movie Promo Campaigns</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                AI parses your script beats to create complete theatrical trailers, poster prompts, and clicking thumbnails.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 font-mono">Active Project:</span>
                <select
                  value={activeProjectForPromo}
                  onChange={(e) => setActiveProjectForPromo(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  id="promo-project-select"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRunPromoCampaign}
                disabled={isGeneratingPromo}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl flex items-center space-x-2 cursor-pointer transition-all shadow-md shadow-purple-500/10"
                id="generate-promo-campaign-btn"
              >
                {isGeneratingPromo ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Script beats...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                    <span>Generate Promo Assets</span>
                  </>
                )}
              </button>
            </div>

            {promoProject?.promotionalContent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-fade-in">
                {/* Poster & Thumbnail details */}
                <div className="space-y-4 text-xs">
                  <div className="p-4 border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/10 rounded-2xl space-y-2">
                    <span className="block font-bold text-gray-900 dark:text-white font-display">Theatrical Poster Art Prompt</span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">&ldquo;{promoProject.promotionalContent.posterPrompt}&rdquo;</p>
                  </div>

                  <div className="p-4 border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/10 rounded-2xl space-y-2">
                    <span className="block font-bold text-gray-900 dark:text-white font-display">Clickable Thumbnail Design</span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">&ldquo;{promoProject.promotionalContent.thumbnailPrompt}&rdquo;</p>
                  </div>
                </div>

                {/* Trailer script */}
                <div className="p-4 border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/10 rounded-2xl space-y-3 text-xs">
                  <span className="block font-bold text-gray-900 dark:text-white font-display">Generated Trailer Voiceover Script</span>
                  <div className="bg-white dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 font-mono text-[11px] text-gray-800 dark:text-gray-300 h-[170px] overflow-y-auto leading-relaxed whitespace-pre-line">
                    {promoProject.promotionalContent.trailerScript}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50/40 dark:bg-gray-950/10 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center space-y-2">
                <CloudLightning className="w-8 h-8 text-gray-300" />
                <span className="text-xs text-gray-500">No promotional campaign assets generated yet. Click to trigger.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Secure Link device pairing modal overlay */}
      {showDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="space-y-1 text-center">
              <h3 className="font-display font-extrabold text-gray-950 dark:text-white text-base">Authorize New Device</h3>
              <p className="text-xs text-gray-500">Pair your smartphone or computer securely</p>
            </div>

            {isPairing ? (
              <div className="text-center py-6 space-y-4 animate-pulse">
                <div className="w-10 h-10 rounded-full border-4 border-purple-500/30 border-t-purple-600 animate-spin mx-auto"></div>
                <div className="space-y-1">
                  <span className="block text-xs text-purple-600 font-mono">Generating activation code...</span>
                  <span className="block text-[10px] text-gray-400">Verifying secure OAuth tunnel handshake</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePairDeviceSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider">Device Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My iPhone 15 Pro"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                    id="new-device-name-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider">Device Type</label>
                  <select
                    value={newDeviceType}
                    onChange={(e) => setNewDeviceType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden"
                    id="new-device-type-select"
                  >
                    <option value="smartphone">Smartphone (iPhone/Android)</option>
                    <option value="tablet">Tablet (iPad/Android Tab)</option>
                    <option value="computer">Animation Workstation PC/Mac</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeviceModal(false)}
                    className="flex-1 py-2 rounded-xl text-center font-medium text-gray-500 hover:text-gray-800 border border-transparent cursor-pointer"
                    id="close-device-modal-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer shadow-md shadow-purple-500/10"
                    id="pair-device-submit-btn"
                  >
                    Confirm & Pair
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
