// Central UI Controller for GrowthAura AI Dashboard
let activeTab = "dashboard";
let currentSlideIndex = 0;
let generatedSlides = [];
let generatedReels = [];
let posterCount = 0;
let reelCount = 0;

// New State Variables for Advanced Creators Suite
let activeVideoScenes = [];
let isPlayingVideo = false;
let videoPlaybackInterval = null;
let videoPlaybackProgress = 0;
let currentSceneIndex = 0;
let activeUtterance = null;

// Initialize app on load
document.addEventListener("DOMContentLoaded", () => {
    // Populate settings key
    const savedKey = BrandManager.loadApiKey();
    const keyInput = document.getElementById("settings-api-key-input");
    if (keyInput && savedKey) {
        keyInput.value = savedKey;
    }

    // Populate Brand Kit inputs from saved profile
    syncBrandKitInputs();

    // Render Calendar
    renderCalendar();

    // Render Initial UI text updates
    updateUISnapshots();
});

// Sync input fields from BrandManager profile state
function syncBrandKitInputs() {
    const profile = BrandManager.brandProfile;
    document.getElementById("brand-name").value = profile.name;
    document.getElementById("brand-loc").value = profile.location;
    document.getElementById("brand-logo").value = profile.logo;
    document.getElementById("brand-color").value = profile.themeColor;
    document.getElementById("brand-niche").value = profile.niche;
    document.getElementById("brand-contact").value = profile.contact;
    document.getElementById("brand-hours").value = profile.hours;
    document.getElementById("brand-language").value = profile.language;
    document.getElementById("brand-services").value = profile.services;
}

// Update UI copy details everywhere based on active profile state
function updateUISnapshots() {
    const profile = BrandManager.brandProfile;

    // Sidebar
    document.getElementById("sidebar-logo-emoji").innerText = profile.logo;
    document.getElementById("sidebar-brand-title").innerText = profile.name;
    document.getElementById("sidebar-brand-lang-badge").innerText = profile.language;

    // Dashboard overview
    document.getElementById("dash-welcome-name").innerText = profile.name;
    document.getElementById("stat-posters-cnt").innerText = posterCount;
    document.getElementById("stat-reels-cnt").innerText = reelCount;
    document.getElementById("stat-calendar-cnt").innerText = BrandManager.scheduledEvents.length;

    // Poster canvas headers
    document.getElementById("poster-brand-logo").innerText = profile.logo;
    document.getElementById("poster-brand-name").innerText = profile.name;
    document.getElementById("poster-brand-loc").innerText = "📍 " + profile.location;

    // Mini-site panel summaries
    document.getElementById("web-meta-headline").innerText = "Aapki Apni " + profile.name;
    document.getElementById("web-meta-tagline").innerText = "Trusted in " + profile.location;
    
    const servicesCount = profile.services.split(",").length;
    document.getElementById("web-meta-services").innerText = `${servicesCount} Items compiled`;
    document.getElementById("web-meta-hours").innerText = profile.hours;

    // Pre-fill default topic ideas for images/videos
    if (!document.getElementById("image-prompt-textarea").value) {
        document.getElementById("image-prompt-textarea").value = `A clean commercial product banner advertisement for ${profile.name} located in ${profile.location}, showcasing premium ${profile.services.split(',')[0]} and items.`;
    }
    if (!document.getElementById("video-topic-input").value) {
        document.getElementById("video-topic-input").value = `Express delivery of genuine prescription wellness essentials directly to your home in ${profile.location}.`;
    }
    if (!document.getElementById("avatar-script-idea").value) {
        document.getElementById("avatar-script-idea").value = `Welcome customers, highlight our daily timing from ${profile.hours}, and tell them to call ${profile.contact}.`;
    }
}

// Route between landing and dashboard workspace
function launchWorkspace() {
    document.getElementById("view-landing").style.display = "none";
    document.getElementById("view-workspace").style.display = "flex";
    document.getElementById("nav-workspace-btn").innerText = "Workspace Dashboard";
    document.getElementById("nav-workspace-btn").onclick = () => switchWorkspaceTab('dashboard');
    document.getElementById("main-footer").style.display = "none";
    switchWorkspaceTab("dashboard");
}

function resetToHome() {
    document.getElementById("view-landing").style.display = "flex";
    document.getElementById("view-workspace").style.display = "none";
    document.getElementById("nav-workspace-btn").innerText = "Launch Workspace";
    document.getElementById("nav-workspace-btn").onclick = launchWorkspace;
    document.getElementById("main-footer").style.display = "block";
    
    // Stop any active avatar narration
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    stopSimulatedVideoPlayback();
}

// Scroll to section on landing page
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Switch Sidebar tabs
function switchWorkspaceTab(tabId) {
    activeTab = tabId;
    
    // Stop speaking and playing when leaving tabs
    if (tabId !== "avatars" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (tabId !== "videos") {
        stopSimulatedVideoPlayback();
    }

    // Toggle active sidebar link
    document.querySelectorAll(".sidebar-menu .menu-item").forEach(item => {
        item.classList.remove("active");
    });
    const activeMenuItem = document.getElementById(`tab-${tabId}`);
    if (activeMenuItem) {
        activeMenuItem.classList.add("active");
    }

    // Toggle active content pane
    document.querySelectorAll(".workspace-content-pane .workspace-view").forEach(pane => {
        pane.classList.remove("active");
    });
    const activePane = document.getElementById(`pane-${tabId}`);
    if (activePane) {
        activePane.classList.add("active");
    }

    // Specially re-render calendar when calendar tab opens
    if (tabId === "calendar") {
        renderCalendar();
    }
}

// Processing HUD loaders
function showLoader(text) {
    const banner = document.getElementById("global-processing-banner");
    const loaderText = document.getElementById("global-loader-text");
    loaderText.innerText = text || "AI engine compiling localized assets...";
    banner.style.display = "flex";
}

function hideLoader() {
    document.getElementById("global-processing-banner").style.display = "none";
}

// Modals management
function openSettingsModal() {
    document.getElementById("modal-settings").style.display = "flex";
}

function closeActiveModal() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.style.display = "none";
    });
}

function saveSettings() {
    const key = document.getElementById("settings-api-key-input").value;
    BrandManager.saveApiKey(key);
    closeActiveModal();
    alert("Google Gemini API configuration saved successfully!");
}

// Handle Brand Kit Form Submit
function handleBrandFormSubmit(event) {
    event.preventDefault();
    
    const updatedProfile = {
        name: document.getElementById("brand-name").value,
        location: document.getElementById("brand-loc").value,
        logo: document.getElementById("brand-logo").value,
        themeColor: document.getElementById("brand-color").value,
        niche: document.getElementById("brand-niche").value,
        contact: document.getElementById("brand-contact").value,
        hours: document.getElementById("brand-hours").value,
        language: document.getElementById("brand-language").value,
        services: document.getElementById("brand-services").value
    };

    BrandManager.saveBrandProfile(updatedProfile);
    updateUISnapshots();
    alert("Brand Kit profile successfully synchronized!");
    switchWorkspaceTab("dashboard");
}

// --- AI POSTER CANVAS ACTIONS ---

// Apply color background gradients based on select choices
function applyPosterPresetStyle() {
    const preset = document.getElementById("poster-style-preset").value;
    const canvas = document.getElementById("live-poster-element");

    if (preset === "gold-dark") {
        canvas.style.background = "linear-gradient(135deg, #1f1f2e 0%, #000000 100%)";
        canvas.style.borderColor = "var(--primary)";
    } else if (preset === "emerald-glow") {
        canvas.style.background = "linear-gradient(135deg, #052615 0%, #000000 100%)";
        canvas.style.borderColor = "var(--secondary)";
    } else if (preset === "royal-purple") {
        canvas.style.background = "linear-gradient(135deg, #250938 0%, #040108 100%)";
        canvas.style.borderColor = "#9d4edd";
    } else if (preset === "festive-red") {
        canvas.style.background = "linear-gradient(135deg, #480607 0%, #050000 100%)";
        canvas.style.borderColor = "#e63946";
    } else if (preset === "sunset-orange") {
        canvas.style.background = "linear-gradient(135deg, #3d1b04 0%, #000000 100%)";
        canvas.style.borderColor = "#f77f00";
    }
}

// Call AI generation for posters
async function triggerPosterGeneration() {
    showLoader("Generating localized poster caption using Gemini...");
    
    try {
        const result = await ContentGenerator.generateAIPoster(BrandManager.brandProfile);
        document.getElementById("poster-caption-overlay").innerText = result;
        posterCount++;
        updateUISnapshots();
    } catch (err) {
        console.error(err);
        alert("Failed to build poster text overlay.");
    } finally {
        hideLoader();
    }
}

// Typography sliders override
function updateLivePosterText() {
    const font = document.getElementById("poster-font-select").value;
    const color = document.getElementById("poster-text-color").value;
    const size = document.getElementById("poster-font-size").value;

    const overlay = document.getElementById("poster-caption-overlay");
    overlay.style.fontFamily = font;
    overlay.style.color = color;
    overlay.style.fontSize = size + "rem";
}

// Download poster mock
function downloadPosterImage() {
    const text = document.getElementById("poster-caption-overlay").innerText;
    
    // Simulate image compiler download
    const blob = new Blob([`GrowthAura AI Creative Banner File\n---------------------------------\nBrand: ${BrandManager.brandProfile.name}\nLocation: ${BrandManager.brandProfile.location}\nCaption Text:\n${text}`], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "growthaura_poster_banner.txt";
    link.click();
    
    alert("Graphic Poster Canvas compiled successfully! File downloaded as 'growthaura_poster_banner.txt'.");
}

function schedulePosterEvent() {
    const text = document.getElementById("poster-caption-overlay").innerText;
    openAddEventModal(`Poster: ${text.substring(0, 20)}...`, "poster");
}


// ================= NEW CREATORS SUITE CONTROLLERS =================

// --- 1. AI IMAGE STUDIO FUNCTIONS ---

function triggerImageGeneration() {
    const promptText = document.getElementById("image-prompt-textarea").value;
    const stylePreset = document.getElementById("image-style-select").value;
    const aspect = document.getElementById("image-aspect-select").value;

    if (!promptText || promptText.trim() === "") {
        alert("Please write a description prompt for your image creative.");
        return;
    }

    showLoader("Loading real-time Imagen AI graphic model...");

    const imageElement = document.getElementById("generated-image-element");
    const generatedUrl = ContentGenerator.getPollinationsImageURL(promptText, stylePreset, aspect);

    // Load Image in background to show smooth complete event
    const loaderImg = new Image();
    loaderImg.src = generatedUrl;
    loaderImg.onload = () => {
        imageElement.src = generatedUrl;
        posterCount++;
        updateUISnapshots();
        hideLoader();
    };
    loaderImg.onerror = () => {
        hideLoader();
        alert("Error connecting to Pollinations.ai image server. Please try refreshing prompt.");
    };
}

function downloadGeneratedImage() {
    const img = document.getElementById("generated-image-element");
    if (img.src.startsWith("data:")) {
        alert("Please generate an image first.");
        return;
    }
    // Open in a new tab to let user save
    window.open(img.src, "_blank");
}

function scheduleImageEvent() {
    const promptText = document.getElementById("image-prompt-textarea").value;
    openAddEventModal(`Image: ${promptText.substring(0, 20)}...`, "poster");
}

// --- 2. AI VIDEO / REELS STUDIO FUNCTIONS ---

async function triggerVideoTimelineGeneration() {
    showLoader("Compiling scenes storyboard and fetching frames...");
    stopSimulatedVideoPlayback();
    
    const category = document.getElementById("video-type-select").value;
    const topic = document.getElementById("video-topic-input").value;
    const container = document.getElementById("video-scenes-list-container");
    container.innerHTML = "";

    try {
        const scenes = await ContentGenerator.generateVideoStoryboard(BrandManager.brandProfile, category, topic);
        
        // Map and load scene visual images
        activeVideoScenes = scenes.map(s => {
            const imgUrl = ContentGenerator.getPollinationsImageURL(s.imagePrompt, "vibrant cinematic marketing ad frame", "9:16");
            return {
                ...s,
                image: imgUrl
            };
        });

        // Render card grids
        activeVideoScenes.forEach(scene => {
            const card = document.createElement("div");
            card.className = "glass-panel storyboard-scene-card";
            card.style.padding = "16px";
            card.innerHTML = `
                <div style="display: flex; gap: 14px; align-items: center;">
                    <div class="scene-index-badge" style="width: 35px; height: 35px; font-size: 0.9rem;">#${scene.scene}</div>
                    <img src="${scene.image}" style="width: 50px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);" alt="Scene frame">
                    <div style="flex-grow: 1;">
                        <h4 style="font-size: 0.9rem; margin-bottom: 3px; color: var(--primary);">${scene.visual}</h4>
                        <p style="font-size: 0.78rem; color: #fff; margin-bottom: 2px;">🎙️ "${scene.audio}"</p>
                        <span style="font-size: 0.65rem; color: var(--text-dark);">🎵 Sound: ${scene.music}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Load Scene 1 in Player Screen
        document.getElementById("vplayer-bg").style.backgroundImage = `url('${activeVideoScenes[0].image}')`;
        document.getElementById("vplayer-subtitles").innerText = `🎙️ ${activeVideoScenes[0].audio}`;
        document.getElementById("vplayer-scene-num").innerText = "Scene 1/4";
        document.getElementById("vplayer-brand-badge").innerText = BrandManager.brandProfile.name;
        document.getElementById("vplayer-progress").style.width = "0%";

        reelCount++;
        updateUISnapshots();
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div style="color: var(--accent-danger); text-align: center;">Failed to compile video.</div>`;
    } finally {
        hideLoader();
    }
}

function toggleSimulatedVideoPlayback() {
    if (activeVideoScenes.length === 0) {
        alert("Please generate video storyboards first.");
        return;
    }

    if (isPlayingVideo) {
        pauseSimulatedVideoPlayback();
    } else {
        startSimulatedVideoPlayback();
    }
}

function startSimulatedVideoPlayback() {
    isPlayingVideo = true;
    document.getElementById("vplayer-play-btn").innerText = "⏸";
    
    videoPlaybackInterval = setInterval(() => {
        videoPlaybackProgress += 1.5; // Tick progress speed
        if (videoPlaybackProgress >= 100) {
            videoPlaybackProgress = 0;
        }

        document.getElementById("vplayer-progress").style.width = videoPlaybackProgress + "%";
        
        // Calculate scene index based on progress (0 to 3)
        const sceneIndex = Math.min(Math.floor((videoPlaybackProgress / 100) * 4), 3);
        
        // If scene updates, change visual assets in player mockup
        if (sceneIndex !== currentSceneIndex) {
            currentSceneIndex = sceneIndex;
            const scene = activeVideoScenes[currentSceneIndex];
            
            document.getElementById("vplayer-bg").style.backgroundImage = `url('${scene.image}')`;
            document.getElementById("vplayer-subtitles").innerText = `🎙️ ${scene.audio}`;
            document.getElementById("vplayer-scene-num").innerText = `Scene ${currentSceneIndex + 1}/4`;
        }
    }, 100);
}

function pauseSimulatedVideoPlayback() {
    isPlayingVideo = false;
    document.getElementById("vplayer-play-btn").innerText = "▶";
    if (videoPlaybackInterval) {
        clearInterval(videoPlaybackInterval);
    }
}

function stopSimulatedVideoPlayback() {
    pauseSimulatedVideoPlayback();
    videoPlaybackProgress = 0;
    currentSceneIndex = 0;
    document.getElementById("vplayer-progress").style.width = "0%";
    document.getElementById("vplayer-subtitles").innerText = "Click the Play Button above to watch simulated video slideshow with audio transcription subtitles.";
    document.getElementById("vplayer-scene-num").innerText = "Scene 1/4";
    document.getElementById("vplayer-bg").style.backgroundImage = `url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22568%22%3E%3Crect width=%22320%22 height=%22568%22 fill=%22%2308080c%22/%3E%3C/svg%3E')`;
}

function scheduleVideoEvent() {
    const topic = document.getElementById("video-topic-input").value || "Video Campaign";
    openAddEventModal(`Video: ${topic.substring(0, 20)}...`, "video");
}

// --- 3. AI AVATAR STUDIO FUNCTIONS ---

function updateAvatarImageStyle() {
    const style = document.getElementById("avatar-model-select").value;
    const imgElement = document.getElementById("avatar-display-image");
    
    showLoader("Switching avatar headshot visual...");

    const avatarPrompt = `${style}, Indian ethnic headshot, smiling portrait, studio soft focus lighting, solid clean white backdrop`;
    const generatedUrl = ContentGenerator.getPollinationsImageURL(avatarPrompt, "photorealistic", "1:1");

    const loaderImg = new Image();
    loaderImg.src = generatedUrl;
    loaderImg.onload = () => {
        imgElement.src = generatedUrl;
        hideLoader();
    };
    loaderImg.onerror = () => {
        hideLoader();
        alert("Error updating avatar frame.");
    };
}

async function triggerAvatarScriptGeneration() {
    showLoader("Writing spokesperson vocal transcript...");
    const idea = document.getElementById("avatar-script-idea").value;

    try {
        const script = await ContentGenerator.generateAvatarScript(BrandManager.brandProfile, idea);
        document.getElementById("avatar-script-textarea").value = script;
    } catch (err) {
        console.error(err);
        alert("Failed to compile script details.");
    } finally {
        hideLoader();
    }
}

function narrateAvatarSpeech() {
    const text = document.getElementById("avatar-script-textarea").value;
    if (!text || text.trim() === "") {
        alert("Please generate or input a spokesperson script first.");
        return;
    }

    if (!window.speechSynthesis) {
        alert("Speech synthesis is not supported on this browser version.");
        return;
    }

    // Toggle speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
    }

    activeUtterance = new SpeechSynthesisUtterance(text);

    // Apply voice settings
    const pitch = parseFloat(document.getElementById("avatar-speech-pitch").value);
    const rate = parseFloat(document.getElementById("avatar-speech-rate").value);
    activeUtterance.pitch = pitch;
    activeUtterance.rate = rate;

    // Detect target language voice (Hindi/English)
    const lang = BrandManager.brandProfile.language;
    const voices = window.speechSynthesis.getVoices();
    
    if (lang === "Hindi") {
        activeUtterance.lang = "hi-IN";
        const hiVoice = voices.find(v => v.lang.includes("hi-IN") || v.lang.includes("hi"));
        if (hiVoice) activeUtterance.voice = hiVoice;
    } else {
        // Hinglish/English default to Indian-English voice if present
        activeUtterance.lang = "en-IN";
        const enInVoice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("en-in"));
        if (enInVoice) activeUtterance.voice = enInVoice;
    }

    // Visual animation callbacks
    activeUtterance.onstart = () => {
        document.getElementById("avatar-presenter-circle").classList.add("speaking");
        document.getElementById("avatar-voice-waves-row").classList.add("active");
        document.getElementById("avatar-status-label").innerHTML = "🎙️ Speaking...";
    };

    activeUtterance.onend = () => {
        document.getElementById("avatar-presenter-circle").classList.remove("speaking");
        document.getElementById("avatar-voice-waves-row").classList.remove("active");
        document.getElementById("avatar-status-label").innerHTML = "Avatar Presenter: Ready";
    };

    activeUtterance.onerror = () => {
        document.getElementById("avatar-presenter-circle").classList.remove("speaking");
        document.getElementById("avatar-voice-waves-row").classList.remove("active");
        document.getElementById("avatar-status-label").innerHTML = "Avatar Presenter: Ready";
    };

    window.speechSynthesis.speak(activeUtterance);
}


// --- 4. REELS & VIDEO STORYBOARDER (LEGACY VERSION) ---

async function triggerReelsGeneration() {
    showLoader("Directing reel scenes and script transcripts...");
    const container = document.getElementById("reels-storyboard-flow-container");
    container.innerHTML = "";

    try {
        const scenes = await ContentGenerator.generateReelStoryboard(BrandManager.brandProfile);
        generatedReels = scenes;

        scenes.forEach(scene => {
            const card = document.createElement("div");
            card.className = "glass-panel storyboard-scene-card";
            card.innerHTML = `
                <div class="scene-index-badge">#${scene.scene}</div>
                <div class="scene-detail-box">
                    <h4>🎬 Scene Action Visual</h4>
                    <p>${scene.visual}</p>
                </div>
                <div class="scene-audio-cue">
                    <h5>🎙️ Voiceover Transcript (${BrandManager.brandProfile.language})</h5>
                    <p>"${scene.audio}"</p>
                    <div style="margin-top: 10px; font-size: 0.72rem; color: var(--primary);">
                        🎵 Audio Advice: ${scene.music}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        reelCount++;
        updateUISnapshots();
        document.getElementById("reels-action-footer").style.display = "flex";
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div style="color: var(--accent-danger); text-align: center;">Failed to compile video scenes outline.</div>`;
    } finally {
        hideLoader();
    }
}

function scheduleReelsEvent() {
    const topic = document.getElementById("reels-topic-input").value || "Business Reel Campaign";
    openAddEventModal(`Reel: ${topic.substring(0, 20)}...`, "video");
}

// --- INSTANT MINI-WEBSITE BUILDER ---

async function compileMiniWebsite() {
    showLoader("Writing site code assets and styling simulator...");
    const viewport = document.getElementById("smartphone-content-viewport");
    viewport.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding-top: 150px;">Compiling styles...</div>`;

    try {
        const webData = await ContentGenerator.generateMiniSite(BrandManager.brandProfile);

        // Build list of services
        let servicesHTML = "";
        webData.services.forEach(s => {
            servicesHTML += `
                <div class="mini-site-item-row" style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 6px 0; border-bottom: 1px dashed rgba(255,255,255,0.15);">
                    <span style="color: #fff; font-weight: 500;">✓ ${s.name}</span>
                    <strong style="color: var(--primary);">${s.cost}</strong>
                </div>
            `;
        });

        const activeThemeColor = BrandManager.brandProfile.themeColor || "#d4af37";

        viewport.innerHTML = `
            <div style="--site-theme: ${activeThemeColor};">
                <div class="mini-site-header" style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 2.2rem; margin-bottom: 8px;">${BrandManager.brandProfile.logo}</div>
                    <h3 style="font-family: var(--font-heading); color: var(--site-theme); margin: 0 0 4px; font-size: 1.25rem;">${webData.headline}</h3>
                    <p style="font-size: 0.75rem; color: #a0a0b0; margin: 0; font-style: italic;">${webData.tagline}</p>
                </div>

                <div class="mini-site-hero-img" style="border-radius: 8px; background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.1); padding: 12px; font-size: 0.78rem; line-height: 1.4; color: #e0e0e0; margin-bottom: 20px; text-align: center;">
                    ${webData.about}
                </div>

                <div class="mini-site-section-title" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--site-theme); margin-bottom: 10px; border-bottom: 2px solid var(--site-theme); padding-bottom: 3px;">
                    Our Services / Products
                </div>
                <div class="mini-site-items-list" style="margin-bottom: 24px;">
                    ${servicesHTML}
                </div>

                <div class="mini-site-hours-block" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 10px; border-radius: 6px; margin-bottom: 20px; font-size: 0.75rem;">
                    ⏰ <strong>Timing:</strong> ${webData.hours}
                </div>

                <div class="mini-site-section-title" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--site-theme); margin-bottom: 10px; border-bottom: 2px solid var(--site-theme); padding-bottom: 3px;">
                    Contact & Booking
                </div>
                <div style="font-size: 0.75rem; color: #a0a0b0; margin-bottom: 12px;">
                    📞 ${webData.contact}
                </div>

                <!-- Interactive Appt Form inside viewport -->
                <form id="viewport-booking-form" onsubmit="handleSimulatorBooking(event)" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                    <input type="text" placeholder="Enter Your Name" required style="width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 8px; color: #fff; font-size: 0.75rem;">
                    <input type="tel" placeholder="Mobile Number" required style="width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 8px; color: #fff; font-size: 0.75rem;">
                    <button type="submit" style="width: 100%; background: var(--site-theme); color: #000; font-weight: 700; border: none; border-radius: 4px; padding: 8px; cursor: pointer; font-size: 0.75rem; transition: 0.2s;">
                        Confirm Appointment Booking
                    </button>
                </form>
                <div id="booking-success-message" style="display: none; background: rgba(20, 150, 80, 0.2); border: 1px solid var(--secondary); border-radius: 6px; padding: 10px; text-align: center; color: var(--secondary); font-size: 0.75rem; margin-top: 10px;">
                    🎉 Appointment Booked! Confirmation SMS sent.
                </div>
            </div>
        `;
    } catch (err) {
        console.error(err);
        viewport.innerHTML = `<div style="color: var(--accent-danger); text-align: center; padding-top: 150px;">Failed to compile.</div>`;
    } finally {
        hideLoader();
    }
}

// Handle Form Submission within simulated smartphone view
function handleSimulatorBooking(event) {
    event.preventDefault();
    document.getElementById("viewport-booking-form").style.display = "none";
    document.getElementById("booking-success-message").style.display = "block";
}

// --- AI PRESENTATION DECK ACTIONS ---

async function triggerPresentationDeckGeneration() {
    showLoader("Writing slide text deck and formatting layouts...");
    currentSlideIndex = 0;
    
    try {
        const slides = await ContentGenerator.generatePresentation(BrandManager.brandProfile);
        generatedSlides = slides;

        // Render slides
        const wrapper = document.getElementById("deck-slides-wrapper");
        wrapper.innerHTML = "";

        slides.forEach((slide, idx) => {
            const slideDiv = document.createElement("div");
            slideDiv.className = `presentation-slide-item ${idx === 0 ? 'active' : ''}`;
            slideDiv.id = `slide-deck-${idx}`;
            slideDiv.innerHTML = `
                <span class="slide-number-lbl">Slide ${idx + 1} of 3</span>
                <h2 class="slide-content-title" style="color: var(--primary); font-family: var(--font-heading);">${slide.title}</h2>
                <ul class="slide-bullet-points" style="margin-top: 20px; font-family: var(--font-body);">
                    <li style="font-size: 1.05rem; margin-bottom: 12px; line-height: 1.6;">${slide.bullet1}</li>
                    <li style="font-size: 1.05rem; margin-bottom: 12px; line-height: 1.6;">${slide.bullet2}</li>
                    <li style="font-size: 1.05rem; margin-bottom: 12px; line-height: 1.6;">${slide.bullet3}</li>
                </ul>
            `;
            wrapper.appendChild(slideDiv);
        });

        // Enable buttons
        document.getElementById("deck-prev-btn").disabled = false;
        document.getElementById("deck-next-btn").disabled = false;
        
        updateSlidePagerDots();
    } catch (err) {
        console.error(err);
        alert("Failed to build pitch slides.");
    } finally {
        hideLoader();
    }
}

function renderActiveSlide() {
    document.querySelectorAll(".presentation-slide-item").forEach((slide, idx) => {
        if (idx === currentSlideIndex) {
            slide.classList.add("active");
        } else {
            slide.classList.remove("active");
        }
    });
    updateSlidePagerDots();
}

function updateSlidePagerDots() {
    const dotsContainer = document.getElementById("deck-pager-dots");
    dotsContainer.innerHTML = "";
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.className = `dot-indicator ${i === currentSlideIndex ? 'active' : ''}`;
        dot.onclick = () => jumpToSlide(i);
        dotsContainer.appendChild(dot);
    }
}

function jumpToSlide(index) {
    if (generatedSlides.length === 0) return;
    currentSlideIndex = index;
    renderActiveSlide();
}

function slideNavNext() {
    if (currentSlideIndex < 2) {
        currentSlideIndex++;
        renderActiveSlide();
    }
}

function slideNavPrevious() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderActiveSlide();
    }
}

// --- CALENDAR SCHEDULER ACTIONS ---

function renderCalendar() {
    const grid = document.getElementById("calendar-cells-stack");
    if (!grid) return;
    grid.innerHTML = "";

    // Month details (Simulate May 2026 for demonstration)
    const startDayOffset = 5;
    const daysInMonth = 31;
    const prevMonthDays = 30; // April

    // Render preceding month padding cells
    for (let i = prevMonthDays - startDayOffset + 1; i <= prevMonthDays; i++) {
        const cell = document.createElement("div");
        cell.className = "calendar-cell-day other-month";
        cell.innerHTML = `<span class="calendar-date-number">${i}</span>`;
        grid.appendChild(cell);
    }

    // Render active month cells
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDateString = `2026-05-${day.toString().padStart(2, '0')}`;
        
        const cell = document.createElement("div");
        cell.className = "calendar-cell-day";
        cell.onclick = () => openAddEventModal("", "", cellDateString);
        
        // Find matching events scheduled on this day
        const events = BrandManager.scheduledEvents.filter(e => e.date === cellDateString);
        let eventsHTML = "";
        
        events.forEach(e => {
            const cls = e.type === "poster" ? "event-poster" : (e.type === "video" ? "event-video" : "event-other");
            const icon = e.type === "poster" ? "🎨" : (e.type === "video" ? "🎬" : "📝");
            eventsHTML += `
                <div class="calendar-event-indicator ${cls}" title="${e.title}">
                    ${icon} ${e.title}
                </div>
            `;
        });

        cell.innerHTML = `
            <span class="calendar-date-number">${day}</span>
            <div class="calendar-events-stack">
                ${eventsHTML}
            </div>
        `;
        
        grid.appendChild(cell);
    }

    // Render succeeding month padding cells
    const totalRendered = startDayOffset + daysInMonth;
    const nextPadding = 42 - totalRendered;
    for (let i = 1; i <= nextPadding; i++) {
        const cell = document.createElement("div");
        cell.className = "calendar-cell-day other-month";
        cell.innerHTML = `<span class="calendar-date-number">${i}</span>`;
        grid.appendChild(cell);
    }
}

// Scheduling dialog forms
function openAddEventModal(preTitle = "", preType = "", preDate = "") {
    const modal = document.getElementById("modal-schedule-event");
    modal.style.display = "flex";

    document.getElementById("schedule-title-input").value = preTitle;
    
    if (preType) {
        document.getElementById("schedule-type-select").value = preType;
    }
    
    // Set date input value
    const dateInput = document.getElementById("schedule-date-input");
    if (preDate) {
        dateInput.value = preDate;
    } else {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
}

function handleNewEventSchedule() {
    const title = document.getElementById("schedule-title-input").value;
    const date = document.getElementById("schedule-date-input").value;
    const type = document.getElementById("schedule-type-select").value;

    if (!title || !date) {
        alert("Please complete the event title and date fields.");
        return;
    }

    BrandManager.addScheduledEvent(date, title, type);
    closeActiveModal();
    renderCalendar();
    updateUISnapshots();
    alert(`Successfully scheduled your post '${title}' on ${date}!`);
}
