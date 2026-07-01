export interface AnimeCharacter {
  id: string;
  name: string;
  age: string;
  role: 'main' | 'supporting' | 'antagonist';
  voiceName: 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir';
  personality: string;
  visualDescription: string;
  backstory: string;
  avatarUrl?: string; // Custom SVG/CSS based or base64
}

export interface ScreenplayLine {
  id: string;
  characterId: string | null; // null represents action description / narration
  characterName: string; // Saved for quick rendering
  text: string;
  emotion: string;
  pacingNotes?: string;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  backgroundPrompt: string;
  backgroundUrl: string; // Generated SVG/CSS style descriptor or placeholder
  cameraAngle: string;
  lipSyncSpeed: 'normal' | 'fast' | 'slow';
  actionText: string;
  soundEffectPrompt: string;
  durationSeconds: number;
}

export interface StyleReferenceImage {
  id: string;
  name: string;
  dataUrl: string;
}

export interface VisualStyleConfig {
  selectedPreset: string;
  customDescription: string;
  referenceImages: StyleReferenceImage[];
}

export interface StoryBranch {
  id: string;
  divergencePointLineId: string;
  choiceText: string;
  title: string;
  description: string;
  screenplay: ScreenplayLine[];
  scenes: Scene[];
  outcomeSummary: string;
  isMainPath?: boolean;
}

export interface AnimeEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  scriptStatus: 'draft' | 'completed' | 'generating';
  screenplay: ScreenplayLine[];
  scenes: Scene[];
  storyBranches?: StoryBranch[];
  characterStyle?: 'anime' | 'realistic';
}

export interface CollaborativeMember {
  id: string;
  name: string;
  email: string;
  role: 'Creator' | 'Writer' | 'Editor' | 'Voice Actor';
  online: boolean;
}

export interface DeviceBackup {
  id: string;
  deviceName: string;
  deviceType: 'smartphone' | 'tablet' | 'computer' | 'cloud_drive';
  timestamp: string;
  status: 'synced' | 'pending';
}

export interface PublishSchedule {
  id: string;
  platform: 'youtube' | 'tiktok' | 'facebook' | 'instagram' | 'gdrive' | 'dropbox';
  scheduledAt: string; // ISO string or human-readable
  status: 'scheduled' | 'published' | 'draft';
  targetDeviceName?: string;
}

export interface PromotionalContent {
  id: string;
  posterPrompt: string;
  posterUrl: string;
  thumbnailPrompt: string;
  thumbnailUrl: string;
  trailerPrompt: string;
  trailerScript: string;
  pacingScore: number; // 0-100 rating
  recommendations: string[];
}

export interface AnimeProject {
  id: string;
  title: string;
  genre: 'Action' | 'Adventure' | 'Fantasy' | 'Romance' | 'Comedy' | 'Sci-Fi' | 'Horror' | 'Mystery' | 'Sports' | 'Slice of Life';
  animationStyle: 'Classic Shonen' | 'Cyberpunk Neon' | 'Ghibli Whimsical' | 'Dark Fantasy' | 'Modern Shoujo' | 'Realistic Cinematic';
  prompt: string;
  description: string;
  status: 'draft' | 'ready' | 'rendering' | 'completed';
  createdAt: string;
  episodes: AnimeEpisode[];
  characters: AnimeCharacter[];
  ambientMusicPrompt: string;
  openingThemePrompt: string;
  endingThemePrompt: string;
  localBackups: DeviceBackup[];
  collaborators: CollaborativeMember[];
  schedules: PublishSchedule[];
  promotionalContent?: PromotionalContent;
  visualStyleConfig?: VisualStyleConfig;
}

export interface LinkedAccount {
  id: string;
  platform: 'youtube' | 'tiktok' | 'facebook' | 'instagram' | 'gdrive' | 'dropbox';
  accountName: string;
  status: 'authorized' | 'unauthorized';
  iconName: string;
}

export interface LinkedDevice {
  id: string;
  name: string;
  type: 'smartphone' | 'tablet' | 'computer' | 'smart_tv';
  os: string;
  status: 'authorized' | 'unauthorized';
  lastSynced: string;
}

export interface CreatorVideoPost {
  id: string;
  projectId: string;
  projectTitle: string;
  episodeId: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeDescription: string;
  postedAt: string;
  views: number;
  likes: number;
  thumbnailUrl: string;
  genre: string;
  animationStyle: string;
}

export interface UserSubscription {
  planId: string | null;
  status: 'active' | 'inactive';
  planName: string;
  price: number;
  billingCycle: 'none' | 'weekly' | 'monthly';
  videoLimit: number;
  videosPostedThisCycle: number;
  currentPeriodEnd: string | null;
  cardBrand: string;
  cardLast4: string;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  postedVideos: CreatorVideoPost[];
}
