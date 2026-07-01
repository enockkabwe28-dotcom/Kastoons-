import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, Mic, Image as ImageIcon, Volume2, Film } from 'lucide-react';

interface ProjectWizardProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    prompt: string;
    genre: string;
    animationStyle: string;
    episodeCount: number;
  }) => Promise<void>;
}

const STYLES = [
  { name: 'Classic Shonen', desc: 'Vibrant colors, bold dynamic lineart, expressive facial expressions (e.g., Naruto, Hunter x Hunter)' },
  { name: 'Cyberpunk Neon', desc: 'Sleek, highly detailed dark techwear, high contrast pink & blue lights, volumetric smog (e.g., Akira, Edgerunners)' },
  { name: 'Ghibli Whimsical', desc: 'Soft hand-painted watercolor look, detailed foliage, nostalgic rustic color palettes (e.g., Totoro, Mononoke)' },
  { name: 'Dark Fantasy', desc: 'Muted dark oil colors, heavy crosshatched shadows, gothic architectures (e.g., Berserk, Claymore)' },
  { name: 'Modern Shoujo', desc: 'Delicate pastel shading, sparkles, beautiful glowing background lights, thin line weights (e.g., Sailor Moon, Kimi ni Todoke)' }
];

const GENRES = ['Action', 'Adventure', 'Fantasy', 'Romance', 'Comedy', 'Sci-Fi', 'Horror', 'Mystery', 'Sports', 'Slice of Life'];

const LOADING_STEPS = [
  'Whispering the prompt ideas to the Muse of Anime...',
  'Generating screenplay dialogues and screenplay script drafts...',
  'Fusing traditional Japanese pencil work with glowing digital canvas inks...',
  'Summoning virtual voice actors and preparing micro-expression lipsync arrays...',
  'Composing epic cinematic opening scores and lo-fi synthesizer ending motifs...',
  'Rendering environments, action sequences, and sound effect layers...'
];

export default function ProjectWizard({ onClose, onSubmit }: ProjectWizardProps) {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Fantasy');
  const [animationStyle, setAnimationStyle] = useState('Classic Shonen');
  const [episodeCount, setEpisodeCount] = useState(2);
  
  // Simulated features
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Cycle through loading steps to provide clean visual reassurance
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    setIsGenerating(true);
    setLoadingStepIndex(0);

    try {
      await onSubmit({
        title,
        prompt: prompt + (uploadedImage ? " [With referenced image avatar]" : ""),
        genre,
        animationStyle,
        episodeCount,
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setPrompt((prev) => (prev ? prev + " " : "") + "An epic crossover event featuring elements of time-travel, cyber-samurais, and traditional spirits.");
      setIsRecording(false);
    }, 2500);
  };

  const simulateImageUpload = () => {
    // Standard mock avatar image
    setUploadedImage("image_reference");
    setPrompt((prev) => (prev ? prev + " " : "") + "Character wearing glowing tactical vest with spiky hair.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl transition-all max-h-[90vh] flex flex-col">
        
        {/* Generative Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-gray-950/95 flex flex-col items-center justify-center text-center p-8 z-50 animate-fade-in text-white space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin"></div>
              <Sparkles className="w-6 h-6 text-yellow-300 absolute inset-0 m-auto animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight">
                Creating Your Anime Universe...
              </h3>
              <p className="text-xs text-purple-300 font-mono tracking-wider uppercase animate-pulse">
                Step {loadingStepIndex + 1} of {LOADING_STEPS.length}
              </p>
              <div className="h-1.5 w-48 bg-purple-950/50 rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-violet-500 to-pink-500 transition-all duration-[3500ms]"
                  style={{ width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-300 italic min-h-[40px] px-4 font-light leading-relaxed animate-pulse">
                &ldquo;{LOADING_STEPS[loadingStepIndex]}&rdquo;
              </p>
            </div>

            <div className="border border-purple-900/40 bg-purple-950/20 rounded-xl px-4 py-2 text-[11px] font-mono text-purple-400 max-w-sm">
              Note: This complex process leverages server-side Gemini 3.5 models to bundle dialogues, scripts, local backup schedules, and visual prompts securely.
            </div>
          </div>
        )}

        {/* Wizard Header */}
        <div className="px-6 py-4 border-b border-gray-150 dark:border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                AI Production Wizard
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Outlines stories, character cards, themes, and screenplays.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white transition-colors cursor-pointer"
            id="close-wizard-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-sm">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Anime Title / Code Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chrono Slayers: Horizon Edge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              id="wizard-title-input"
            />
          </div>

          {/* Prompt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Describe the Anime Concept
              </label>
              
              {/* Voice / Image helpers */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={simulateVoiceInput}
                  disabled={isRecording}
                  className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-200 text-red-500 animate-pulse'
                      : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  title="Simulate Speech Input"
                  id="wizard-voice-input-btn"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecording ? 'Listening...' : 'Voice Prompt'}</span>
                </button>

                <button
                  type="button"
                  onClick={simulateImageUpload}
                  className="px-2 py-1 rounded-md text-xs font-medium border bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 flex items-center space-x-1.5 cursor-pointer"
                  title="Simulate Character Art Reference"
                  id="wizard-image-input-btn"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{uploadedImage ? 'Art Loaded' : 'Art Reference'}</span>
                </button>
              </div>
            </div>

            <textarea
              required
              rows={3}
              placeholder="e.g. In a floating archipelago of sky islands, a young pilot discovers a wind-powered mecha. Together with a renegade royal scholar, they defend their homeland against an armada of metallic sky-dreadnoughts."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors leading-relaxed"
              id="wizard-prompt-input"
            />
            {uploadedImage && (
              <div className="flex items-center space-x-2 p-2 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 rounded-lg text-xs text-purple-700 dark:text-purple-300 animate-fade-in">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span>Uploaded sketch: <strong>character_reference.png</strong> (AI will adapt generated characters to match this reference profile)</span>
                <button 
                  type="button" 
                  onClick={() => setUploadedImage(null)} 
                  className="ml-auto text-purple-400 hover:text-purple-600 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Genre and Episode Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Select Genre Category
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                id="wizard-genre-select"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Generate Episodes count
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setEpisodeCount(num)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      episodeCount === num
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/15'
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                    }`}
                    id={`episode-count-btn-${num}`}
                  >
                    {num} {num === 1 ? 'Ep' : 'Eps'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Animation Styles */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Choose Visual Art Style
            </label>
            <div className="space-y-2 max-h-[160px] overflow-y-auto border border-gray-150 dark:border-gray-800/80 rounded-xl p-2.5 bg-gray-50/50 dark:bg-gray-950/20">
              {STYLES.map((style) => (
                <label
                  key={style.name}
                  className={`flex items-start p-2.5 rounded-lg border transition-all cursor-pointer ${
                    animationStyle === style.name
                      ? 'bg-purple-50/70 border-purple-300 dark:bg-purple-950/20 dark:border-purple-800/80'
                      : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                  id={`style-label-${style.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <input
                    type="radio"
                    name="styleRadio"
                    value={style.name}
                    checked={animationStyle === style.name}
                    onChange={() => setAnimationStyle(style.name)}
                    className="mt-1 mr-3 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <span className="block font-semibold text-xs text-gray-900 dark:text-white">
                      {style.name}
                    </span>
                    <span className="block text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                      {style.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-150 dark:border-gray-800/80 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer"
              id="wizard-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl text-xs hover:shadow-lg hover:shadow-purple-500/15 transition-all flex items-center space-x-2 cursor-pointer"
              id="wizard-submit-btn"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>Generate Anime with Gemini</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
