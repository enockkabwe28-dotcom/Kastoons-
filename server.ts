import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// DB File configuration
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Default high-fidelity seed database
const DEFAULT_DATABASE = {
  projects: [
    {
      id: "project-seed-1",
      title: "Neo-Tokyo Cyber Samurai",
      genre: "Sci-Fi",
      animationStyle: "Cyberpunk Neon",
      prompt: "A traditional samurai cybernetically enhanced fights an evil AI megacorporation in 2099 Tokyo to restore humanity's memories.",
      description: "In the cybernetic sprawl of 2099 Neo-Tokyo, a traditional samurai with high-tech sword augmentations battles the AI megacorporation 'AetherCorp' to restore humanity's deleted memories.",
      status: "completed",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      ambientMusicPrompt: "cyberpunk industrial synthwave with heavy analog bass and retro drum machines, building epic tension",
      openingThemePrompt: "high-energy futuristic J-Rock with digital guitar riffs, screaming synth lead, and lightning-fast drums",
      endingThemePrompt: "melancholic lo-fi vaporwave synth with gentle vinyl crackles, soft female vocals, and distant Tokyo rain soundscapes",
      characters: [
        {
          id: "char-1",
          name: "Kenji Takahashi",
          age: "24",
          role: "main",
          voiceName: "Zephyr",
          personality: "Stoic, fiercely disciplined, haunted by his past but deeply loyal to the resistance. Speaks with brief, impactful honor-bound words.",
          visualDescription: "Spiky dark hair with blue cybernetic streaks, wearing a battle-torn dark indigo kimono over brushed chrome cybernetic limbs. His right arm houses a plasma converter that charges his sword.",
          backstory: "A former corporate elite guard who witnessed AetherCorp's total deletion of his home district's history. He vowed to retrieve the physical backup servers."
        },
        {
          id: "char-2",
          name: "Sakura Lin",
          age: "21",
          role: "supporting",
          voiceName: "Kore",
          personality: "Highly energetic, brilliantly sarcastic, fast-talking netrunner who conceals her vulnerability behind witty banter and tech-savviness.",
          visualDescription: "Bright purple holographic ponytail, glowing yellow tactical visor covering her eyes, wearing an oversized techwear yellow jacket covered in interactive digital pins.",
          backstory: "Orphaned in the under-grid of Neo-Tokyo. She built her own deck out of recycled AetherCorp server scraps and has been hacking corporate databases since she was twelve."
        },
        {
          id: "char-3",
          name: "Lord Kurogane",
          age: "45",
          role: "antagonist",
          voiceName: "Charon",
          personality: "Ruthless, calculating, cold, sees humanity as a messy, temporary database that needs to be organized, optimized, and compressed under his control.",
          visualDescription: "Sleek matte-black corporate cyber-armor, an artificial obsidian skullplate with single glowing dark crimson eye-slit. Speaks with an echoing, synthetic deep baritone.",
          backstory: "The founding CEO of AetherCorp who replaced his own organs with quantum servers to directly interface with 'Omnis', the all-controlling city AI."
        }
      ],
      episodes: [
        {
          id: "ep-1",
          episodeNumber: 1,
          title: "The Plasma Blade Ignites",
          description: "Kenji infiltrates the lower vaults of AetherCorp to retrieve a deleted memory module, but Sakura detects an elite cyber-ambush heading his way.",
          scriptStatus: "completed",
          characterStyle: "anime",
          screenplay: [
            {
              id: "scr-1-1",
              characterId: null,
              characterName: "Scene Narration",
              text: "Heavy cyber-rain pours down on the sleek chrome rooftop. Towering holographic geishas hum advertisements in the background. Kenji Takahashi stands motionless, clutching his uncharged sheath.",
              emotion: "neutral"
            },
            {
              id: "scr-1-2",
              characterId: "char-1",
              characterName: "Kenji Takahashi",
              text: "The neon glows, but Tokyo is pitch black inside. The corporation stole our ancestors' memories... but they forgot to delete my steel.",
              emotion: "resolute"
            },
            {
              id: "scr-1-3",
              characterId: "char-2",
              characterName: "Sakura Lin",
              text: "Kenji! Static on the line! I'm seeing corporate heavy-mechs climbing up from the waste ducts. You're walking straight into an absolute killzone! Pull back, now!",
              emotion: "panicked"
            },
            {
              id: "scr-1-4",
              characterId: "char-1",
              characterName: "Kenji Takahashi",
              text: "A samurai does not turn back from a promised path. Sakura, override the security partition. Leave the mechs to me.",
              emotion: "calm"
            }
          ],
          scenes: [
            {
              id: "scene-1-1",
              sceneNumber: 1,
              title: "Rooftop Infiltration",
              backgroundPrompt: "Neo-Tokyo rooftop at night under torrential rain, giant pink and cyan holographic billboards, futuristic skyscrapers fading into heavy smog",
              backgroundUrl: "rooftop_rain",
              cameraAngle: "Low-angle wide tracking Kenji's silhouette against holographic glow",
              lipSyncSpeed: "normal",
              actionText: "Kenji grabs his sword handle. The plasma edge crackles to life, casting an amber orange light over the pouring rain.",
              soundEffectPrompt: "Heavy rain pattering on metal, low electric katana hum, distant police sirens",
              durationSeconds: 8
            },
            {
              id: "scene-1-2",
              sceneNumber: 2,
              title: "The Hacking Den",
              backgroundPrompt: "Sakura's underground netrunner hideout, cramped, wall-to-wall floating bright amber holographic screens, dense hardware racks, neon wiring everywhere",
              backgroundUrl: "hacking_den",
              cameraAngle: "Extreme close-up on Sakura's face reflecting glowing terminal matrix data",
              lipSyncSpeed: "fast",
              actionText: "Sakura clicks her mechanical keys with insane speed, glowing virtual rings expanding from her fingertips.",
              soundEffectPrompt: "Rapid high-tech typing, security breach warning alarms, digital synth whooshing",
              durationSeconds: 6
            }
          ]
        },
        {
          id: "ep-2",
          episodeNumber: 2,
          title: "Netrun into the Void",
          description: "Sakura plugs herself directly into AetherCorp's core matrix while Kenji holds off Lord Kurogane's elite cybernetic hunters in the server chambers.",
          scriptStatus: "draft",
          characterStyle: "realistic",
          screenplay: [
            {
              id: "scr-2-1",
              characterId: null,
              characterName: "Scene Narration",
              text: "Sakura is suspended in an anti-gravity tank, glowing fiber cables connected to her neural port. The digital world unfolds around her.",
              emotion: "neutral"
            },
            {
              id: "scr-2-2",
              characterId: "char-2",
              characterName: "Sakura Lin",
              text: "Wow... it's beautiful. The whole city's history is floating here in golden code lines. They didn't destroy it... they just locked it away.",
              emotion: "awed"
            },
            {
              id: "scr-2-3",
              characterId: "char-3",
              characterName: "Lord Kurogane",
              text: "Unlicensed consciousness detected. You are searching for memories that no longer serve a purpose. Restructuring sequence: initiated.",
              emotion: "threatening"
            }
          ],
          scenes: [
            {
              id: "scene-2-1",
              sceneNumber: 1,
              title: "The Golden Matrix",
              backgroundPrompt: "Infinite golden cyber void, floating cubes of digital code, glowing geometric grids stretching forever, abstract light streams",
              backgroundUrl: "golden_matrix",
              cameraAngle: "Slow floating 360-degree rotation",
              lipSyncSpeed: "normal",
              actionText: "Sakura reaches out to touch a floating memory cube. Particles of light disperse around her digital avatar.",
              soundEffectPrompt: "Ethereal synth pad chord, sparkling crystal chime, cosmic wind",
              durationSeconds: 10
            }
          ]
        }
      ],
      collaborators: [
        { id: "col-1", name: "Hiroshi Sato", email: "hiroshi@animeverse.ai", role: "Writer", online: true },
        { id: "col-2", name: "Yuki Tanaka", email: "yuki@animeverse.ai", role: "Editor", online: false }
      ],
      localBackups: [
        { id: "bk-1", deviceName: "Kenji's iPhone 15 Pro", deviceType: "smartphone", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: "synced" },
        { id: "bk-2", deviceName: "Studio Workstation PC", deviceType: "computer", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), status: "synced" }
      ],
      schedules: [
        { id: "sch-1", platform: "youtube", scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + " 18:00", status: "scheduled" },
        { id: "sch-2", platform: "tiktok", scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + " 15:30", status: "scheduled" }
      ],
      promotionalContent: {
        id: "promo-seed",
        posterPrompt: "An elegant movie poster of a cyber samurai standing in the heavy rain overlooking a neon cyberpunk Tokyo city, holding a glowing amber plasma sword. Space Grotesk title: 'AnimeVerse AI: Cyber Samurai'.",
        posterUrl: "poster_cyber_samurai",
        thumbnailPrompt: "Close-up of Sakura Lin with shocked expression, holographic data code in her eyes, glowing neon cyberpunk background.",
        thumbnailUrl: "thumbnail_hacker",
        trailerPrompt: "Epic 30-second teaser showing Kenji striking cyber-ninjas in rain-soaked rooftop, ending with Kurogane's crimson eye glowing.",
        trailerScript: "Voiceover (Kore): 'In a city without a past... one blade remembers everything.' [Katana clashes] Kenji: 'AetherCorp built this cage.' [Explosion] Voiceover: 'This Fall, download the revolution.'",
        pacingScore: 92,
        recommendations: [
          "Increase screenplay dramatic pause before Kenji's rooftop declaration to heighten emotional impact.",
          "Add a high-pitched digital sound effect when Sakura bypasses security to increase hacking tension.",
          "Incorporate a 3-second establishing shot of Lord Kurogane's cybernetics before his first dialogue line."
        ]
      }
    }
  ],
  devices: [
    { id: "dev-1", name: "Kenji's iPhone 15 Pro", type: "smartphone", os: "iOS 18.2", status: "authorized", lastSynced: new Date().toISOString() },
    { id: "dev-2", name: "Creator iPad Pro", type: "tablet", os: "iPadOS 18.0", status: "authorized", lastSynced: new Date(Date.now() - 1 * 3600000).toISOString() },
    { id: "dev-3", name: "Studio Workstation PC", type: "computer", os: "Windows 11 Pro", status: "authorized", lastSynced: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: "dev-4", name: "Living Room Apple TV", type: "smart_tv", os: "tvOS 18", status: "unauthorized", lastSynced: "Never" }
  ],
  accounts: [
    { id: "acc-1", platform: "youtube", accountName: "AnimeVerse AI Studios (@AnimeVerseStudios)", status: "authorized", iconName: "Youtube" },
    { id: "acc-2", platform: "tiktok", accountName: "animeverse.ai.official", status: "authorized", iconName: "Music" },
    { id: "acc-3", platform: "gdrive", accountName: "personal_backup_drive@gmail.com", status: "authorized", iconName: "HardDrive" },
    { id: "acc-4", platform: "instagram", accountName: "animeverse_studios_ai", status: "unauthorized", iconName: "Instagram" },
    { id: "acc-5", platform: "dropbox", accountName: "studio_dropbox_cloud", status: "unauthorized", iconName: "FolderGit2" }
  ],
  subscription: {
    planId: null,
    status: "inactive",
    planName: "Free Tier",
    price: 0,
    billingCycle: "none",
    videoLimit: 0,
    videosPostedThisCycle: 0,
    currentPeriodEnd: null,
    cardBrand: "",
    cardLast4: ""
  },
  profile: {
    name: "Enock Kabwe",
    handle: "@enockkabwe",
    bio: "Passionate AI Anime director and screenwriter creating the next generation of sci-fi and fantasy series.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    postedVideos: []
  }
};

// Database Initializer
async function initDatabase() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
      console.log("Database file found.");
      // Repair if any keys missing in existing DB
      const db = await readDB();
      let modified = false;
      if (!db.subscription) {
        db.subscription = DEFAULT_DATABASE.subscription;
        modified = true;
      }
      if (!db.profile) {
        db.profile = DEFAULT_DATABASE.profile;
        modified = true;
      }
      if (modified) {
        await writeDB(db);
        console.log("Database repaired with subscription and profile defaults.");
      }
    } catch {
      console.log("Database file not found, creating seed database.");
      await fs.writeFile(DB_FILE, JSON.stringify(DEFAULT_DATABASE, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to initialize local JSON database:", err);
  }
}

// Read database helper
async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const db = JSON.parse(data);
    if (!db.subscription) {
      db.subscription = DEFAULT_DATABASE.subscription;
    }
    if (!db.profile) {
      db.profile = DEFAULT_DATABASE.profile;
    }
    return db;
  } catch {
    return DEFAULT_DATABASE;
  }
}

// Write database helper
async function writeDB(data: any) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing DB:", err);
    return false;
  }
}

// Gemini Client Lazy Initializer
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to styled AI simulator.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ==========================================
// API ENDPOINTS
// ==========================================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// GET Projects
app.get("/api/projects", async (req, res) => {
  const db = await readDB();
  res.json({ projects: db.projects });
});

// GET Single Project
app.get("/api/projects/:id", async (req, res) => {
  const db = await readDB();
  const project = db.projects.find((p: any) => p.id === req.params.id);
  if (project) {
    res.json({ project });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// POST Create Project
app.post("/api/projects", async (req, res) => {
  const db = await readDB();
  const newProject = {
    id: "proj-" + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    episodes: [],
    characters: [],
    localBackups: [],
    collaborators: [
      { id: "col-default", name: "Me", email: "creator@animeverse.ai", role: "Creator", online: true }
    ],
    schedules: [],
    ambientMusicPrompt: "futuristic cinematic ambient orchestral soundtrack, rich brass and traditional strings",
    openingThemePrompt: "high energy upbeat Japanese anime opening song with powerful guitar riffs",
    endingThemePrompt: "peaceful wind instruments paired with soft acoustic piano chords and ambient nature soundscapes",
    ...req.body
  };
  
  db.projects.unshift(newProject);
  await writeDB(db);
  res.status(201).json({ project: newProject });
});

// PUT/POST Edit Project
app.post("/api/projects/:id", async (req, res) => {
  const db = await readDB();
  const idx = db.projects.findIndex((p: any) => p.id === req.params.id);
  if (idx !== -1) {
    db.projects[idx] = { ...db.projects[idx], ...req.body };
    await writeDB(db);
    res.json({ project: db.projects[idx] });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// DELETE Project
app.delete("/api/projects/:id", async (req, res) => {
  const db = await readDB();
  db.projects = db.projects.filter((p: any) => p.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// GET Devices
app.get("/api/devices", async (req, res) => {
  const db = await readDB();
  res.json({ devices: db.devices });
});

// POST Authorize Device
app.post("/api/devices", async (req, res) => {
  const db = await readDB();
  const { name, type, os } = req.body;
  const newDevice = {
    id: "dev-" + Math.random().toString(36).substring(2, 9),
    name: name || "New Link Device",
    type: type || "smartphone",
    os: os || "OS 1.0",
    status: "authorized" as const,
    lastSynced: new Date().toISOString()
  };
  db.devices.push(newDevice);
  await writeDB(db);
  res.status(201).json({ device: newDevice });
});

// POST Update Device (Deauthorize/Authorize)
app.post("/api/devices/:id/toggle", async (req, res) => {
  const db = await readDB();
  const dev = db.devices.find((d: any) => d.id === req.params.id);
  if (dev) {
    dev.status = dev.status === "authorized" ? "unauthorized" : "authorized";
    dev.lastSynced = dev.status === "authorized" ? new Date().toISOString() : "Never";
    await writeDB(db);
    res.json({ device: dev });
  } else {
    res.status(404).json({ error: "Device not found" });
  }
});

// DELETE Device
app.delete("/api/devices/:id", async (req, res) => {
  const db = await readDB();
  db.devices = db.devices.filter((d: any) => d.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// GET Accounts
app.get("/api/accounts", async (req, res) => {
  const db = await readDB();
  res.json({ accounts: db.accounts });
});

// POST Toggle Account Link
app.post("/api/accounts/:id/toggle", async (req, res) => {
  const db = await readDB();
  const acc = db.accounts.find((a: any) => a.id === req.params.id);
  if (acc) {
    acc.status = acc.status === "authorized" ? "unauthorized" : "authorized";
    if (acc.status === "authorized" && !acc.accountName.includes("@")) {
      acc.accountName = `${acc.platform}_creator_hub`;
    }
    await writeDB(db);
    res.json({ account: acc });
  } else {
    res.status(404).json({ error: "Account not found" });
  }
});

// POST Generate Anime Storyline using Gemini
app.post("/api/generate/storyline", async (req, res) => {
  const { prompt, genre, animationStyle, episodeCount } = req.body;
  const count = parseInt(episodeCount) || 2;

  const gemini = getGeminiClient();
  if (!gemini) {
    // High-fidelity local fallback simulation matching prompt details
    console.log("No Gemini API key. Generating premium fallback project details.");
    
    // Fallback themes depending on the genre
    const fallbackTitle = `Echoes of the ${genre}`;
    const fallbackDesc = `A breath-taking ${genre} saga styled in ${animationStyle}. Prompt inspired story: ${prompt}`;
    
    const charNames = {
      "Action": ["Raiden", "Mei", "Gen-Zero"],
      "Fantasy": ["Eldrin", "Lyra", "Vorgar"],
      "Sci-Fi": ["Vance", "Aria", "Unit-H4"],
      "Romance": ["Haru", "Aoi", "Ryu"],
      "Sports": ["Kaito", "Saki", "Coach Goro"],
      "Horror": ["Yuto", "Rei", "The Shadow"]
    }[genre as string] || ["Takumi", "Mio", "Kuro"];

    const characterList = [
      {
        id: "char-f1",
        name: charNames[0],
        age: "17",
        role: "main" as const,
        voiceName: "Zephyr" as const,
        personality: "Relentless, courageous, slightly clumsy but hiding a legendary potential.",
        visualDescription: `Traditional clothing fused with elements of ${animationStyle}. Carrying a distinctive heirloom weapon.`,
        backstory: "Grew up in the outskirts of the world, unaware of the impending destiny that awaits."
      },
      {
        id: "char-f2",
        name: charNames[1],
        age: "18",
        role: "supporting" as const,
        voiceName: "Kore" as const,
        personality: "Pragmatic, logical, extremely well-read, holds a secret knowledge about the antagonist.",
        visualDescription: "Wears custom glasses, has elegant long hair, clutching an ancient glowing tablet.",
        backstory: "A scholar who fled the capital after discovering forbidden records."
      },
      {
        id: "char-f3",
        name: charNames[2],
        age: "Unknown",
        role: "antagonist" as const,
        voiceName: "Charon" as const,
        personality: "Charismatic but completely unyielding. Believes the destruction of the current order is necessary.",
        visualDescription: "Clad in heavy ceremonial plate armor with dark purple glowing accents.",
        backstory: "A fallen guardian who decided that the world is beyond simple salvation."
      }
    ];

    const generatedEpisodes = Array.from({ length: count }).map((_, idx) => {
      const epNum = idx + 1;
      return {
        id: `ep-f-${epNum}-${Math.random().toString(36).substring(2, 5)}`,
        episodeNumber: epNum,
        title: epNum === 1 ? "The Awakening Call" : "Into the Shattered Lands",
        description: epNum === 1 
          ? `Our hero ${charNames[0]} discovers an ancient power while escaping an onslaught launched by ${charNames[2]}.`
          : `${charNames[0]} and ${charNames[1]} team up to navigate the dangerous borders while being pursued.`,
        scriptStatus: (epNum === 1 ? "completed" : "draft") as "completed" | "draft",
        screenplay: epNum === 1 ? [
          {
            id: `scr-f-1-${idx}`,
            characterId: null,
            characterName: "Scene Narration",
            text: `The horizon burns in gold and crimson. A quiet wind sweeps across the valley. Suddenly, the sky fractures.`,
            emotion: "neutral"
          },
          {
            id: `scr-f-2-${idx}`,
            characterId: "char-f1",
            characterName: charNames[0],
            text: `I've run as far as I can... There's nowhere left to hide. If this is the end, I'll meet it standing!`,
            emotion: "resolute"
          },
          {
            id: `scr-f-3-${idx}`,
            characterId: "char-f2",
            characterName: charNames[1],
            text: `Hold on! Look at your sword—the runes are activating! It's matching your pulse. The prophecies... they weren't myths!`,
            emotion: "excited"
          },
          {
            id: `scr-f-4-${idx}`,
            characterId: "char-f3",
            characterName: charNames[2],
            text: `Amusing. A spark of dust attempting to challenge the inevitable. Rest in the embers.`,
            emotion: "arrogant"
          }
        ] : [
          {
            id: `scr-f-5-${idx}`,
            characterId: null,
            characterName: "Scene Narration",
            text: `The group makes camp under a hollowed giant redwood tree. Embers crackle gently in the damp evening.`,
            emotion: "neutral"
          },
          {
            id: `scr-f-6-${idx}`,
            characterId: "char-f1",
            characterName: charNames[0],
            text: `Do you really think we can make it to the capital? Their armies are everywhere.`,
            emotion: "doubtful"
          }
        ],
        scenes: [
          {
            id: `scene-f-1-${idx}`,
            sceneNumber: 1,
            title: "Shattered Horizon",
            backgroundPrompt: `An expansive valley under a fracturing golden sky, dramatic glowing clouds, stylized anime mountain peaks`,
            backgroundUrl: "shattered_valley",
            cameraAngle: "Extreme wide sweeping panorama",
            lipSyncSpeed: "normal" as const,
            actionText: `${charNames[0]} unsheathes their weapon, which begins to pulse with white cosmic energy.`,
            soundEffectPrompt: "Deep seismic rumble, wind whistling, high-pitch energy spark",
            durationSeconds: 9
          },
          {
            id: `scene-f-2-${idx}`,
            sceneNumber: 2,
            title: "The Confrontation",
            backgroundPrompt: `A desolate crater surrounded by black crystallized obsidian pillars, eerie ambient light`,
            backgroundUrl: "desolate_crater",
            cameraAngle: "Low-angle heroic tracking",
            lipSyncSpeed: "normal" as const,
            actionText: `${charNames[2]} slowly descends from the sky, a massive dark energy sphere hovering over their hand.`,
            soundEffectPrompt: "Heavy synth low hum, wind howling, dark impact explosion",
            durationSeconds: 7
          }
        ]
      };
    });

    return res.json({
      title: fallbackTitle,
      description: fallbackDesc,
      characters: characterList,
      episodes: generatedEpisodes,
      ambientMusicPrompt: `${genre.toLowerCase()} epic orchestral cinematic track with traditional Japanese instruments and heavy acoustic percussion`,
      openingThemePrompt: `upbeat fast paced 180bpm ${genre.toLowerCase()} anime opening song, high melody electric guitars, violin accents`,
      endingThemePrompt: `ambient relaxing piano-driven lo-fi theme, warm vinyl crackle, acoustic flute layers`,
      isMock: true
    });
  }

  // Real Gemini implementation
  try {
    const sysInstruction = `You are a professional Anime Series Creator, Screenwriter, and Executive Producer. 
Generate a comprehensive, highly creative anime series structure based on the prompt, genre, style, and requested episode count. 
Your response MUST be fully formatted JSON conforming precisely to the requested schema. Do not include any extra text outside the JSON block.`;

    const modelPrompt = `Create a detailed anime series based on the following parameters:
- Core Idea/Prompt: "${prompt}"
- Genre: "${genre}"
- Animation Style: "${animationStyle}"
- Episode Count to generate outlines and scripts: ${count}

Generate a JSON object containing:
1. "title": An engaging, original, authentic anime title (e.g. "Chrono Slayers: Edge of Time" or "Haikyuu!! Reborn"). Keep it high quality.
2. "description": A captivating, deep, detailed series synopsis (3-4 sentences).
3. "ambientMusicPrompt": A highly detailed prompt to generate background music in Lyria (describing instruments, tone, rhythm, and genre style).
4. "openingThemePrompt": A highly detailed prompt to generate the high-energy anime opening theme in Lyria.
5. "endingThemePrompt": A highly detailed prompt to generate the relaxing, emotional anime ending theme in Lyria.
6. "characters": An array of EXACTLY 3 characters. Each character object must have:
   - "id": unique string (e.g. "char-1")
   - "name": full authentic Japanese/styled name
   - "age": age string (e.g. "17" or "Unknown")
   - "role": must be one of "main", "supporting", or "antagonist"
   - "voiceName": must be one of "Zephyr", "Kore", "Puck", "Charon", "Fenrir"
   - "personality": 2 sentences describing unique traits, flaws, and speaking style
   - "visualDescription": detailed description of their clothing, physical features, cybernetics, or weapons matching the animation style
   - "backstory": a compelling 2-sentence background lore
7. "episodes": An array of EXACTLY ${count} episodes. Each episode object must have:
   - "id": unique string
   - "episodeNumber": integer (starting from 1)
   - "title": a dramatic, authentic episode title
   - "description": a synopsis of what happens in this episode (2 sentences)
   - "scriptStatus": "completed" for episode 1, "draft" for others
   - "screenplay": an array of 4 dramatic dialogue/narrative lines. Each screenplay line must have:
     - "id": unique string
     - "characterId": the "id" of the character speaking, or null for scene description/narration
     - "characterName": the name of the character speaking, or "Scene Narration"
     - "text": the dramatic script line or action description
     - "emotion": the emotional delivery (e.g. "panicked", "resolute", "calm", "arrogant", "angry")
   - "scenes": an array of 2 visual scenes. Each scene object must have:
     - "id": unique string
     - "sceneNumber": integer (starting from 1)
     - "title": scene description title
     - "backgroundPrompt": deep descriptive prompt of the background layout (elements, lighting, art style)
     - "backgroundUrl": short alphanumeric tag representing the scene's art keyword (e.g. "shattered_valley", "neon_rooftop")
     - "cameraAngle": description of camera movement (e.g. "Wide panning crane shot")
     - "lipSyncSpeed": one of "normal", "fast", "slow"
     - "actionText": detailed description of character movement, magic cast, or sword strike in the scene
     - "soundEffectPrompt": sound design instruction (e.g. "plasma blade humming, heavy boots running on metal")
     - "durationSeconds": integer duration (e.g. 5 to 12)`;

    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: modelPrompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "description", "ambientMusicPrompt", "openingThemePrompt", "endingThemePrompt", "characters", "episodes"],
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            ambientMusicPrompt: { type: Type.STRING },
            openingThemePrompt: { type: Type.STRING },
            endingThemePrompt: { type: Type.STRING },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "name", "age", "role", "voiceName", "personality", "visualDescription", "backstory"],
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  age: { type: Type.STRING },
                  role: { type: Type.STRING },
                  voiceName: { type: Type.STRING },
                  personality: { type: Type.STRING },
                  visualDescription: { type: Type.STRING },
                  backstory: { type: Type.STRING }
                }
              }
            },
            episodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "episodeNumber", "title", "description", "scriptStatus", "screenplay", "scenes"],
                properties: {
                  id: { type: Type.STRING },
                  episodeNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  scriptStatus: { type: Type.STRING },
                  screenplay: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["id", "characterId", "characterName", "text", "emotion"],
                      properties: {
                        id: { type: Type.STRING },
                        characterId: { type: Type.STRING, nullable: true },
                        characterName: { type: Type.STRING },
                        text: { type: Type.STRING },
                        emotion: { type: Type.STRING }
                      }
                    }
                  },
                  scenes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["id", "sceneNumber", "title", "backgroundPrompt", "backgroundUrl", "cameraAngle", "lipSyncSpeed", "actionText", "soundEffectPrompt", "durationSeconds"],
                      properties: {
                        id: { type: Type.STRING },
                        sceneNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        backgroundPrompt: { type: Type.STRING },
                        backgroundUrl: { type: Type.STRING },
                        cameraAngle: { type: Type.STRING },
                        lipSyncSpeed: { type: Type.STRING },
                        actionText: { type: Type.STRING },
                        soundEffectPrompt: { type: Type.STRING },
                        durationSeconds: { type: Type.INTEGER }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(result.text || "{}");
    res.json({ ...parsedData, isMock: false });
  } catch (err: any) {
    console.error("Gemini Storyline Generation Error:", err);
    res.status(500).json({ error: "Failed to generate storyline from Gemini", details: err.message });
  }
});

// POST Generate Alternative Story Branch using Gemini or high-fidelity simulation
app.post("/api/generate/branch", async (req, res) => {
  const { divergenceLineText, choiceText, characters, stylePreset, genre, projectTitle } = req.body;
  const gemini = getGeminiClient();

  if (!gemini) {
    console.log("No Gemini API key for story branching. Generating premium simulated branch.");
    
    const choiceLower = (choiceText || "").toLowerCase();
    let branchTitle = "Alternative Path: " + (choiceText || "New Choice");
    let branchDesc = `The narrative diverges here. Inspired by choice: "${choiceText}"`;
    let outcome = "The story shifts into a new, uncharted dynamic, altering character relationships.";
    let backgroundTag = "shattered_valley";
    
    // Character names from project
    const charList = characters && characters.length > 0 ? characters : [
      { id: "char-1", name: "Kenji", role: "main" },
      { id: "char-2", name: "Sakura", role: "supporting" }
    ];
    const heroName = charList.find((c: any) => c.role === "main")?.name || "Kenji";
    const supportName = charList.find((c: any) => c.role === "supporting")?.name || "Sakura";
    const antName = charList.find((c: any) => c.role === "antagonist")?.name || "Lord Kurogane";

    let screenplayLines = [];
    let sceneObj = [];

    if (choiceLower.includes("retreat") || choiceLower.includes("run") || choiceLower.includes("flee") || choiceLower.includes("escape")) {
      branchTitle = "Shadow Escape Path";
      branchDesc = `${heroName} chooses survival over absolute pride, retreating into the neon-slick steam vents.`;
      outcome = `Alternative Ending: ${heroName} and ${supportName} survive in the shadows, planning a surprise counter-hack from the deep under-grid.`;
      backgroundTag = "hacking_den";
      
      screenplayLines = [
        {
          id: `br-scr-1-${Math.random().toString(36).substring(2, 5)}`,
          characterId: null,
          characterName: "Scene Narration",
          text: `With corporate bullets chewing the concrete behind them, ${heroName} grabs ${supportName}'s hand and slides down the vertical pressure shaft.`,
          emotion: "neutral"
        },
        {
          id: `br-scr-2-${Math.random().toString(36).substring(2, 5)}`,
          characterId: "char-1",
          characterName: heroName,
          text: `My steel cannot defend you if we are both turned to carbon. Hold on—the venting shaft leads to the old drainage network!`,
          emotion: "resolute"
        },
        {
          id: `br-scr-3-${Math.random().toString(36).substring(2, 5)}`,
          characterId: "char-2",
          characterName: supportName,
          text: `Phew... that was too close! But wait, I successfully downloaded AetherCorp's security ledger! We actually got it!`,
          emotion: "excited"
        }
      ];

      sceneObj = [
        {
          id: `br-scene-1-${Math.random().toString(36).substring(2, 5)}`,
          sceneNumber: 1,
          title: "The Steam Shaft Descent",
          backgroundPrompt: `Cramped industrial drainage shaft, heavy white steam jets glowing with green indicator light grids, wet copper plating, stylized in ${stylePreset || 'Cyberpunk Neon'}`,
          backgroundUrl: "hacking_den",
          cameraAngle: "Vertically panning downward tracking shots",
          lipSyncSpeed: "fast" as const,
          actionText: `${heroName} sparks his katana blade against the copper walls to slow down their dizzying slide.`,
          soundEffectPrompt: "Screeching metallic friction, escaping steam pressure hiss, high-frequency hacking alert",
          durationSeconds: 7
        }
      ];
    } else if (choiceLower.includes("fight") || choiceLower.includes("charge") || choiceLower.includes("attack") || choiceLower.includes("clash")) {
      branchTitle = "The Unyielding Stand";
      branchDesc = `Rejecting retreat, ${heroName} stands firm, facing AetherCorp's elite hunter squads head-on.`;
      outcome = `Alternative Ending: An epic battle ensues. ${heroName} disables the elite mechs but sustains major cybernetic damage.`;
      backgroundTag = "desolate_crater";

      screenplayLines = [
        {
          id: `br-scr-1-${Math.random().toString(36).substring(2, 5)}`,
          characterId: null,
          characterName: "Scene Narration",
          text: `${heroName} steps forward into the blinding neon spotlights, unsheathes his katana, and takes a low combat stance.`,
          emotion: "neutral"
        },
        {
          id: `br-scr-2-${Math.random().toString(36).substring(2, 5)}`,
          characterId: "char-1",
          characterName: heroName,
          text: `You have forgotten the weight of honor. I will carve it back into your motherboard!`,
          emotion: "resolute"
        },
        {
          id: `br-scr-3-${Math.random().toString(36).substring(2, 5)}`,
          characterId: "char-3",
          characterName: antName,
          text: `Insignificant particle. Your blade is pre-industrial junk. Prepare for thermal deletion.`,
          emotion: "arrogant"
        }
      ];

      sceneObj = [
        {
          id: `br-scene-1-${Math.random().toString(36).substring(2, 5)}`,
          sceneNumber: 1,
          title: "Plasma Swords Clash",
          backgroundPrompt: `High contrast rooftop stage, black storm clouds, heavy neon-lit electric discharge between combatants, stylized in ${stylePreset || 'Cyberpunk Neon'}`,
          backgroundUrl: "rooftop_rain",
          cameraAngle: "Extreme low-angle wide heroic dynamic track",
          lipSyncSpeed: "normal" as const,
          actionText: `${heroName} charges, leaving a trail of orange sparks in the pouring rain as his katana crashes into Kurogane's obsidian armor.`,
          soundEffectPrompt: "Explosive metal-on-metal clang, electric discharge hum, rising J-rock drum roll",
          durationSeconds: 8
        }
      ];
    } else {
      // Default choice branch
      branchTitle = "Path of the " + (choiceText.substring(0, 15) || "Unknown");
      branchDesc = `${heroName} chooses to: "${choiceText}", fracturing the standard narrative line.`;
      outcome = `Alternative Ending: A unique development where ${heroName} achieves a tactical compromise, changing the balance of the conflict.`;
      backgroundTag = "shattered_valley";

      screenplayLines = [
        {
          id: `br-scr-1-${Math.random().toString(36).substring(2, 5)}`,
          characterId: null,
          characterName: "Scene Narration",
          text: `As the situation reaches its threshold, ${heroName} takes a surprising action: "${choiceText}".`,
          emotion: "neutral"
        },
        {
          id: `br-scr-2-${Math.random().toString(36).substring(2, 5)}`,
          characterId: "char-1",
          characterName: heroName,
          text: `There is always a third way. Let's see if you can calculate this choice!`,
          emotion: "calm"
        },
        {
          id: `br-scr-3-${Math.random().toString(36).substring(2, 5)}`,
          characterId: "char-2",
          characterName: supportName,
          text: `Incredible! That completely bypassed their prediction algorithms. Look, they're scrambling!`,
          emotion: "excited"
        }
      ];

      sceneObj = [
        {
          id: `br-scene-1-${Math.random().toString(36).substring(2, 5)}`,
          sceneNumber: 1,
          title: "Narrative Fracture",
          backgroundPrompt: `A beautiful shifting landscape where neon overlays merge into a serene traditional valley, styled in ${stylePreset || 'Cyberpunk Neon'}`,
          backgroundUrl: "shattered_valley",
          cameraAngle: "Wide panoramic tracking shot",
          lipSyncSpeed: "normal" as const,
          actionText: `${heroName} executes the unexpected maneuver, leaving neon grids fracturing in the air.`,
          soundEffectPrompt: "Shattering glass chiming, wind whispering, deep digital distortion whoosh",
          durationSeconds: 8
        }
      ];
    }

    return res.json({
      title: branchTitle,
      description: branchDesc,
      outcomeSummary: outcome,
      screenplay: screenplayLines,
      scenes: sceneObj,
      isMock: true
    });
  }

  // Real Gemini Branch Generation
  try {
    const sysInstruction = `You are a professional Anime Writer and branching storyline designer.
Generate a narrative divergence branch based on a user's choice at a specific script point. 
Your response MUST be fully formatted JSON conforming precisely to the requested schema. Do not include any extra text outside the JSON block.`;

    const modelPrompt = `The anime project "${projectTitle}" (Genre: "${genre}", Art Style: "${stylePreset}") has reached a divergence point.
The screenplay line just before divergence was: "${divergenceLineText}".
The user has chosen to take this narrative path: "${choiceText}".

Generate an alternative storyline branch. The JSON response must contain:
1. "title": A dramatic, engaging title for this branch (e.g. "Shadows of Defiance" or "The Tactical Retreat").
2. "description": A summary of this branch's storyline direction (2 sentences).
3. "outcomeSummary": A summary of the final outcome or alternative ending this branch leads to (2 sentences).
4. "screenplay": An array of EXACTLY 3 screenplay lines for this branch. Each must have:
   - "id": a unique string
   - "characterId": a string representing who speaks (usually either null for Scene Narration, or "char-1", "char-2" or "char-3" to match the project's characters)
   - "characterName": the name of the character speaking or "Scene Narration"
   - "text": the dramatic script line or action description
   - "emotion": emotional tone (e.g. "panicked", "resolute", "calm", "arrogant", "angry")
5. "scenes": An array of EXACTLY 1 visual scene corresponding to this branch. It must have:
   - "id": a unique string
   - "sceneNumber": 1
   - "title": a scene title
   - "backgroundPrompt": a highly descriptive background layout prompt matching the ${stylePreset} art style
   - "backgroundUrl": an art keyword tag (must be one of "shattered_valley", "neon_rooftop", "rooftop_rain", "hacking_den", "desolate_crater")
   - "cameraAngle": description of camera movement (e.g., "Low-angle dynamic tracking shot")
   - "lipSyncSpeed": "normal", "fast", or "slow"
   - "actionText": detailed description of character actions, movements, or spell/weapon strikes in this branch scene
   - "soundEffectPrompt": sound design instruction (e.g., "plasma blade humming, heavy rain falling")
   - "durationSeconds": integer duration (usually between 6 and 12)`;

    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: modelPrompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "description", "outcomeSummary", "screenplay", "scenes"],
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            outcomeSummary: { type: Type.STRING },
            screenplay: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "characterId", "characterName", "text", "emotion"],
                properties: {
                  id: { type: Type.STRING },
                  characterId: { type: Type.STRING, nullable: true },
                  characterName: { type: Type.STRING },
                  text: { type: Type.STRING },
                  emotion: { type: Type.STRING }
                }
              }
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "sceneNumber", "title", "backgroundPrompt", "backgroundUrl", "cameraAngle", "lipSyncSpeed", "actionText", "soundEffectPrompt", "durationSeconds"],
                properties: {
                  id: { type: Type.STRING },
                  sceneNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  backgroundPrompt: { type: Type.STRING },
                  backgroundUrl: { type: Type.STRING },
                  cameraAngle: { type: Type.STRING },
                  lipSyncSpeed: { type: Type.STRING },
                  actionText: { type: Type.STRING },
                  soundEffectPrompt: { type: Type.STRING },
                  durationSeconds: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(result.text || "{}");
    res.json({ ...parsedData, isMock: false });
  } catch (err: any) {
    console.error("Gemini story branch generation error:", err);
    res.status(500).json({ error: "Failed to generate story branch from Gemini", details: err.message });
  }
});

// POST Analyze Screenplay with co-pilot recommendations (Gemini)
app.post("/api/generate/improve", async (req, res) => {
  const { screenplayText, title, genre } = req.body;
  const gemini = getGeminiClient();

  if (!gemini) {
    // Return high-quality mock recommendations
    return res.json({
      pacingScore: 88,
      recommendations: [
        "Incorporate a 2-second silent establishing shot of the environmental weather elements to build mood before dialog.",
        "Add a subtle digital chime sound effect immediately when Sakura switches holographic terminals to highlight tech density.",
        "Split Kenji's samurai code explanation into two smaller sentences with a visual reaction close-up in between."
      ]
    });
  }

  try {
    const sysInstruction = `You are an expert Anime Script Doctor, Editorial Specialist, and Director.
Analyze the provided screenplay text and title, grade its pacing (0-100), and provide exactly 3 actionable, highly professional editorial or visual suggestions to improve dialogue, pacing, sound design, or visual effects. Always return JSON.`;

    const promptText = `Please analyze this script segment for the anime series "${title}" (${genre}):
"${screenplayText}"

Provide a JSON response with:
1. "pacingScore": integer representing screenplay structural rating
2. "recommendations": an array of EXACTLY 3 bullet points with specific technical directions (e.g., sound effect hints, camera frames, lip-sync adjustments) to elevate the anime's cinematic impact.`;

    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["pacingScore", "recommendations"],
          properties: {
            pacingScore: { type: Type.INTEGER },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(result.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Co-pilot Analysis Error:", err);
    res.json({
      pacingScore: 85,
      recommendations: [
        "Improve contrast in scene pacing by introducing more sensory details into the action prompts.",
        "Add localized Japanese dialect terms in the dialogue to increase world-building depth.",
        "Utilize high-contrast shadow outlines in the background art design to match the dramatic style."
      ]
    });
  }
});

// POST Generate Promotional content (Trailer script, Poster layout prompts)
app.post("/api/generate/promo", async (req, res) => {
  const { title, genre, style, charactersText } = req.body;
  const gemini = getGeminiClient();

  if (!gemini) {
    return res.json({
      posterPrompt: `A breath-taking, cinematic anime movie poster of ${title}, styled in ${style}. Main character overlooking an epic landscape with bold typography.`,
      posterUrl: "poster_cyber_samurai",
      thumbnailPrompt: `Close up high contrast face of the main hero from ${title} with glowing energy sparks, dynamic background.`,
      thumbnailUrl: "thumbnail_hacker",
      trailerPrompt: `A 15-second teaser showing fast cuts of high-octane action scenes from ${title}.`,
      trailerScript: `Narrator (Deep, echoing): 'The saga of the century arrives.' [Clash of blades] 'Faced with the end of all things, heroes emerge.' [Epic orchestration rise] '${title} - Streaming soon.'`
    });
  }

  try {
    const sysInstruction = `You are a theatrical trailer editor and promotional marketer for premium anime series.
Generate high-fidelity promotional asset designs. Your response must be fully valid JSON conforming exactly to the requested schema.`;

    const promptText = `Generate promotion campaign details for:
- Title: "${title}"
- Genre: "${genre}"
- Style: "${style}"
- Characters info: "${charactersText}"

Return JSON:
1. "posterPrompt": Detailed description of a professional movie poster with branding and typeface specifications.
2. "posterUrl": A unique string ID to identify the generated visual style.
3. "thumbnailPrompt": Clickable YouTube thumbnail layout description.
4. "thumbnailUrl": A unique thumbnail ID string.
5. "trailerPrompt": Directing guidelines for a 30-second action teaser.
6. "trailerScript": Script for the trailer voiceover and sound effects. Include narrator lines and dramatic brackets.`;

    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["posterPrompt", "posterUrl", "thumbnailPrompt", "thumbnailUrl", "trailerPrompt", "trailerScript"],
          properties: {
            posterPrompt: { type: Type.STRING },
            posterUrl: { type: Type.STRING },
            thumbnailPrompt: { type: Type.STRING },
            thumbnailUrl: { type: Type.STRING },
            trailerPrompt: { type: Type.STRING },
            trailerScript: { type: Type.STRING }
          }
        }
      }
    });

    const parsedData = JSON.parse(result.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Promotional Content Generation Error:", err);
    res.json({
      posterPrompt: `A striking anime-style movie poster for ${title}, featuring a detailed character compilation with high contrast lighting, retro titles, and vibrant colors.`,
      posterUrl: "poster_cyber_samurai",
      thumbnailPrompt: `Action shot of the primary characters from ${title} in battle pose, featuring bright impact lines and oversized text overlays.`,
      thumbnailUrl: "thumbnail_hacker",
      trailerPrompt: `An action packed 30-second trailer consisting of high tension camera sweeps and fast cuts.`,
      trailerScript: `[Seismic rumble] Voiceover: 'From the studios of AnimeVerse AI...' [Sound of roaring energy] 'When memories are currency, one warrior refuses to pay the price.' [Blade unsheathes] 'The epic adventure ${title} begins now.'`
    });
  }
});

// POST Generate Speech TTS using gemini-3.1-flash-tts-preview
app.post("/api/generate/tts", async (req, res) => {
  const { text, voiceName, characterName } = req.body;
  const gemini = getGeminiClient();

  if (!gemini) {
    console.log("No Gemini API key for TTS. Simulating speech block.");
    return res.json({
      audioData: null,
      isSimulated: true,
      message: `Simulated TTS for character '${characterName}' with voice '${voiceName || 'Zephyr'}'`
    });
  }

  try {
    console.log(`Generating TTS speech with gemini-3.1-flash-tts-preview for ${characterName}: "${text}"`);
    const promptText = `Speak as ${characterName} in the anime. Deliver the line with high emotional impact: "${text}"`;
    
    // Choose prebuilt voice name mapping
    // Available prebuilt: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    let voice = 'Zephyr';
    if (voiceName && ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'].includes(voiceName)) {
      voice = voiceName;
    }

    const response = await gemini.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({
        audioData: base64Audio,
        isSimulated: false,
        mimeType: "audio/pcm;rate=24000"
      });
    } else {
      res.json({
        audioData: null,
        isSimulated: true,
        message: "Audio block was empty"
      });
    }
  } catch (err: any) {
    console.error("Gemini TTS API error:", err);
    res.json({
      audioData: null,
      isSimulated: true,
      message: `TTS fallback activated: ${err.message}`
    });
  }
});

// POST Save Publish Schedule
app.post("/api/projects/:id/schedule", async (req, res) => {
  const db = await readDB();
  const proj = db.projects.find((p: any) => p.id === req.params.id);
  if (proj) {
    const { platform, scheduledAt } = req.body;
    const newSchedule = {
      id: "sch-" + Math.random().toString(36).substring(2, 9),
      platform: platform || "gdrive",
      scheduledAt: scheduledAt || new Date(Date.now() + 24 * 3600000).toISOString().replace('T', ' ').substring(0, 16),
      status: "scheduled" as const
    };
    if (!proj.schedules) proj.schedules = [];
    proj.schedules.push(newSchedule);
    await writeDB(db);
    res.status(201).json({ schedule: newSchedule, schedules: proj.schedules });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// POST Clear Schedule
app.post("/api/projects/:id/schedule/:schId/cancel", async (req, res) => {
  const db = await readDB();
  const proj = db.projects.find((p: any) => p.id === req.params.id);
  if (proj && proj.schedules) {
    proj.schedules = proj.schedules.filter((s: any) => s.id !== req.params.schId);
    await writeDB(db);
    res.json({ schedules: proj.schedules });
  } else {
    res.status(404).json({ error: "Project or schedule not found" });
  }
});

// POST Create local device backup simulation
app.post("/api/projects/:id/backup", async (req, res) => {
  const db = await readDB();
  const proj = db.projects.find((p: any) => p.id === req.params.id);
  if (proj) {
    const { deviceName, deviceType } = req.body;
    const newBackup = {
      id: "bk-" + Math.random().toString(36).substring(2, 9),
      deviceName: deviceName || "Linked Mobile Device",
      deviceType: deviceType || "smartphone",
      timestamp: new Date().toISOString(),
      status: "synced" as const
    };
    if (!proj.localBackups) proj.localBackups = [];
    proj.localBackups.unshift(newBackup);
    await writeDB(db);
    res.status(201).json({ backup: newBackup, backups: proj.localBackups });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// POST Clear Backups
app.post("/api/projects/:id/backup/:bkId/delete", async (req, res) => {
  const db = await readDB();
  const proj = db.projects.find((p: any) => p.id === req.params.id);
  if (proj && proj.localBackups) {
    proj.localBackups = proj.localBackups.filter((b: any) => b.id !== req.params.bkId);
    await writeDB(db);
    res.json({ backups: proj.localBackups });
  } else {
    res.status(404).json({ error: "Project or backup not found" });
  }
});

// GET Profile & Subscription Details
app.get("/api/profile", async (req, res) => {
  const db = await readDB();
  res.json({
    profile: db.profile,
    subscription: db.subscription
  });
});

// POST Update Profile Metadata
app.post("/api/profile/update", async (req, res) => {
  const db = await readDB();
  const { name, handle, bio, avatarUrl } = req.body;
  if (db.profile) {
    if (name !== undefined) db.profile.name = name;
    if (handle !== undefined) db.profile.handle = handle;
    if (bio !== undefined) db.profile.bio = bio;
    if (avatarUrl !== undefined) db.profile.avatarUrl = avatarUrl;
    await writeDB(db);
    res.json({ profile: db.profile });
  } else {
    res.status(500).json({ error: "Profile not initialized" });
  }
});

// POST Subscribe / Upgrade Plan
app.post("/api/subscription/upgrade", async (req, res) => {
  const db = await readDB();
  const { planId, cardBrand, cardLast4 } = req.body;
  
  const plans: Record<string, { planName: string, price: number, billingCycle: 'weekly' | 'monthly', videoLimit: number }> = {
    "weekly-lite": { planName: "Lite Creator (Weekly)", price: 5, billingCycle: "weekly", videoLimit: 9 },
    "weekly-pro": { planName: "Pro Creator (Weekly)", price: 12, billingCycle: "weekly", videoLimit: 16 },
    "monthly-basic": { planName: "Monthly Basic", price: 19, billingCycle: "monthly", videoLimit: 40 },
    "monthly-unlimited": { planName: "Monthly Unlimited", price: 39, billingCycle: "monthly", videoLimit: 999999 }
  };

  const selectedPlan = plans[planId];
  if (!selectedPlan) {
    return res.status(400).json({ error: "Invalid subscription plan selected" });
  }

  const currentPeriodEnd = new Date();
  if (selectedPlan.billingCycle === "weekly") {
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 7);
  } else {
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  }

  db.subscription = {
    planId,
    status: "active",
    planName: selectedPlan.planName,
    price: selectedPlan.price,
    billingCycle: selectedPlan.billingCycle,
    videoLimit: selectedPlan.videoLimit,
    videosPostedThisCycle: 0, // Reset limit count on upgrade/change
    currentPeriodEnd: currentPeriodEnd.toISOString(),
    cardBrand: cardBrand || "Visa",
    cardLast4: cardLast4 || "4242"
  };

  await writeDB(db);
  res.json({ subscription: db.subscription });
});

// POST Cancel Subscription
app.post("/api/subscription/cancel", async (req, res) => {
  const db = await readDB();
  db.subscription = {
    planId: null,
    status: "inactive",
    planName: "Free Tier",
    price: 0,
    billingCycle: "none",
    videoLimit: 0,
    videosPostedThisCycle: 0,
    currentPeriodEnd: null,
    cardBrand: "",
    cardLast4: ""
  };
  await writeDB(db);
  res.json({ subscription: db.subscription });
});

// POST Post Episode Video right to profile
app.post("/api/profile/post-video", async (req, res) => {
  const db = await readDB();
  const { projectId, episodeId } = req.body;

  const project = db.projects.find((p: any) => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const episode = project.episodes.find((e: any) => e.id === episodeId);
  if (!episode) {
    return res.status(404).json({ error: "Episode not found" });
  }

  const sub = db.subscription || { planId: null, status: "inactive", videoLimit: 0, videosPostedThisCycle: 0 };
  if (sub.status !== "active") {
    return res.status(403).json({ 
      error: "Subscription Required",
      message: "Posting videos directly to your public creator profile is a premium feature. Please subscribe to one of our creator plans ($5/week, $12/week, or monthly) to publish your content!" 
    });
  }

  if (sub.videosPostedThisCycle >= sub.videoLimit) {
    return res.status(403).json({
      error: "Quota Exceeded",
      message: `You have reached your current plan limit of ${sub.videoLimit} videos. Please upgrade your subscription to post more videos!`
    });
  }

  const alreadyPosted = db.profile.postedVideos.some((pv: any) => pv.episodeId === episodeId);
  if (alreadyPosted) {
    return res.status(400).json({ error: "This episode has already been posted to your profile!" });
  }

  const newPost = {
    id: "post-" + Math.random().toString(36).substring(2, 9),
    projectId: project.id,
    projectTitle: project.title,
    episodeId: episode.id,
    episodeNumber: episode.episodeNumber,
    episodeTitle: episode.title,
    episodeDescription: episode.description || "A custom animated masterwork.",
    postedAt: new Date().toISOString(),
    views: Math.floor(100 + Math.random() * 5000),
    likes: Math.floor(10 + Math.random() * 800),
    thumbnailUrl: project.promotionalContent?.thumbnailUrl || "thumbnail_hacker",
    genre: project.genre || "Action",
    animationStyle: project.animationStyle || "Classic Shonen"
  };

  db.profile.postedVideos.unshift(newPost);
  db.subscription.videosPostedThisCycle += 1;

  await writeDB(db);
  res.status(201).json({ profile: db.profile, subscription: db.subscription, post: newPost });
});

// POST Delete posted video
app.post("/api/profile/delete-video", async (req, res) => {
  const db = await readDB();
  const { postId } = req.body;
  if (db.profile && db.profile.postedVideos) {
    const postToDelete = db.profile.postedVideos.find((pv: any) => pv.id === postId);
    db.profile.postedVideos = db.profile.postedVideos.filter((pv: any) => pv.id !== postId);
    
    // Decrement the counter if possible (within reason)
    if (postToDelete && db.subscription && db.subscription.videosPostedThisCycle > 0) {
      db.subscription.videosPostedThisCycle -= 1;
    }
    
    await writeDB(db);
    res.json({ profile: db.profile, subscription: db.subscription });
  } else {
    res.status(404).json({ error: "Profile not found" });
  }
});

// ==========================================
// SEED AND START SERVER
// ==========================================
async function startServer() {
  await initDatabase();

  // Vite development middleware or production build serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AnimeVerse AI Server running at http://localhost:${PORT}`);
  });
}

startServer();
