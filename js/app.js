// Core Application Controller for GrowPilot AI
let currentSlideIndex = 0;
let carouselSlides = [];
let activeCarouselTheme = 'cyber';

// Initialize on window load
window.addEventListener('load', () => {
    // 1. Load active data
    BrandManager.loadProfile();
    Scheduler.loadConnections();
    Scheduler.loadQueue();

    // 2. Populate onboarding form inputs
    populateProfileForm();

    // 3. Trigger initial content generation
    regenerateAppContent();

    // 4. Register Custom event listeners for real-time model syncing
    window.addEventListener('brandProfileUpdated', (e) => {
        updateProfilePreviewCard(e.detail);
        regenerateAppContent();
    });

    window.addEventListener('connectionsUpdated', () => {
        updateConnectionsUI();
    });

    window.addEventListener('queueUpdated', () => {
        renderQueue();
        renderCalendar();
    });

    // 5. Render components
    updateProfilePreviewCard(BrandManager.currentBrand);
    updateConnectionsUI();
    renderQueue();
    renderCalendar();
});

// Switch Tab SPA Routing
function switchTab(tabId) {
    // Remove active classes
    document.querySelectorAll('.nav-item-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));

    // Set active link and panel
    const targetLink = document.getElementById(`nav-${tabId}`);
    const targetPanel = document.getElementById(`view-${tabId}`);
    
    if (targetLink) targetLink.classList.add('active');
    if (targetPanel) targetPanel.classList.add('active');

    // Update Header Text dynamically
    const headerTitle = document.getElementById('viewport-title');
    const headerSubtitle = document.getElementById('viewport-subtitle');

    switch (tabId) {
        case 'dashboard':
            headerTitle.textContent = "Dashboard Cockpit";
            headerSubtitle.textContent = "Welcome to your marketing control hub.";
            break;
        case 'profile':
            headerTitle.textContent = "Brand Profile Hub";
            headerSubtitle.textContent = "Tune your workspace details and tone of voice.";
            break;
        case 'carousel':
            headerTitle.textContent = "Post & Carousel Creator";
            headerSubtitle.textContent = "Design high-converting custom multi-slide carousels.";
            break;
        case 'ads':
            headerTitle.textContent = "Ad Creative Studio";
            headerSubtitle.textContent = "Generate promotional copy and UGC scripts.";
            break;
        case 'video':
            headerTitle.textContent = "Reels & Video Storyboards";
            headerSubtitle.textContent = "Blueprints for video production and timings.";
            break;
        case 'gmb':
            headerTitle.textContent = "GMB Local SEO Engine";
            headerSubtitle.textContent = "Dominate Google search results and local map rankings.";
            break;
        case 'calendar':
            headerTitle.textContent = "Content Calendar";
            headerSubtitle.textContent = "Oversee scheduled campaigns and sync profiles.";
            break;
        case 'analytics':
            headerTitle.textContent = "Analytics Tracker";
            headerSubtitle.textContent = "Track organic search growth and SEO visibility.";
            break;
    }
}

// Onboarding Profile form functions
function populateProfileForm() {
    const brand = BrandManager.currentBrand;
    document.getElementById('brand-name-input').value = brand.name;
    document.getElementById('brand-niche-select').value = brand.niche;
    document.getElementById('brand-desc-input').value = brand.description;
    document.getElementById('brand-audience-input').value = brand.audience;
    document.getElementById('brand-keywords-input').value = brand.keywords;
    
    // Set API Key field
    document.getElementById('gemini-key-input').value = brand.geminiKey || "";
    
    // Select tone
    selectTone(brand.tone, false);
}

function selectTone(toneValue, dispatch = true) {
    document.querySelectorAll('.tone-card-option').forEach(card => card.classList.remove('active'));
    document.getElementById(`tone-${toneValue}`).classList.add('active');
    
    if (dispatch) {
        BrandManager.currentBrand.tone = toneValue;
    }
}

function saveBrandProfile(event) {
    event.preventDefault();
    const updatedProfile = {
        name: document.getElementById('brand-name-input').value,
        niche: document.getElementById('brand-niche-select').value,
        description: document.getElementById('brand-desc-input').value,
        audience: document.getElementById('brand-audience-input').value,
        keywords: document.getElementById('brand-keywords-input').value,
        geminiKey: document.getElementById('gemini-key-input').value,
        tone: BrandManager.currentBrand.tone
    };
    BrandManager.saveProfile(updatedProfile);
    Scheduler.triggerNotification("Brand profile saved and compiled!");
}

function updateProfilePreviewCard(brand) {
    document.getElementById('sidebar-brand-name').textContent = brand.name;
    
    let nicheText = "AI SaaS Workspace";
    if (brand.niche === 'gym') nicheText = "Fitness / Gym Workspace";
    if (brand.niche === 'restaurant') nicheText = "Food & Beverage Cafe";
    if (brand.niche === 'ecommerce') nicheText = "Retail E-Commerce Shop";
    if (brand.niche === 'real-estate') nicheText = "Real Estate Agency";
    
    document.getElementById('sidebar-brand-niche').textContent = nicheText;
    document.getElementById('sidebar-avatar').textContent = brand.name.slice(0, 2).toUpperCase();
    
    document.getElementById('preview-brand-name').textContent = brand.name;
    document.getElementById('preview-avatar').textContent = brand.name.slice(0, 2).toUpperCase();
    document.getElementById('preview-niche-badge').textContent = nicheText;
    document.getElementById('preview-desc-text').textContent = brand.description;
    document.getElementById('preview-tone-badge').textContent = brand.tone.toUpperCase() + " TONE";
    
    // Google listings titles sync
    const gmbTitle = document.getElementById('gmb-preview-name');
    if (gmbTitle) gmbTitle.textContent = brand.name;
    const gmbAvatar = document.getElementById('gmb-avatar-circle');
    if (gmbAvatar) gmbAvatar.textContent = brand.name.slice(0, 2).toUpperCase();
}

// Regenerate AI Content Mockups
async function regenerateAppContent() {
    const brand = BrandManager.currentBrand;
    
    // Show loading overlay
    const banner = document.getElementById('processing-banner');
    const container = document.querySelector('.app-container');
    if (banner) banner.classList.add('active');
    if (container) container.classList.add('processing');

    try {
        const generated = await ContentGenerator.generateAllContentAsync(brand);

        // 1. Set Carousel data
        carouselSlides = generated.carouselSlides;
        currentSlideIndex = 0;
        renderCarouselSlide();

        // 2. Set Copy and scripts
        document.getElementById('ad-aida-textarea').value = generated.captions[0] || "";
        document.getElementById('ad-pas-textarea').value = generated.captions[1] || "";
        
        document.getElementById('ugc-hook-disp').textContent = generated.ugcScript.hook;
        document.getElementById('ugc-body-disp').textContent = generated.ugcScript.body;
        document.getElementById('ugc-cta-disp').textContent = generated.ugcScript.cta;

        // 3. Set Storyboard
        renderVideoStoryboard(generated.storyboard);

        // 4. Set GMB listings preview text
        document.getElementById('gmb-post-textarea').value = generated.gmbUpdateText;
        document.getElementById('gmb-preview-body').textContent = generated.gmbUpdateText;

        if (brand.geminiKey && brand.geminiKey.trim() !== "") {
            Scheduler.triggerNotification("Content compiled live via Gemini 1.5 Flash!");
        }
    } catch (err) {
        console.error("Async content regeneration failed", err);
        Scheduler.triggerNotification("Failed to generate content. Please check API Key.");
    } finally {
        // Hide loading overlay
        if (banner) banner.classList.remove('active');
        if (container) container.classList.remove('processing');
    }
}

// Carousel Card Renderer
function renderCarouselSlide() {
    if (!carouselSlides || carouselSlides.length === 0) return;
    
    const slide = carouselSlides[currentSlideIndex];
    const brand = BrandManager.currentBrand;

    // Viewport displays
    document.getElementById('slide-watermark-text').textContent = brand.name.toUpperCase();
    document.getElementById('slide-brand-lbl').textContent = brand.name.toLowerCase().replace(/\s/g, '') + ".com";
    document.getElementById('slide-number-lbl').textContent = `${currentSlideIndex + 1}/${carouselSlides.length}`;
    document.getElementById('slide-title-display').textContent = slide.title;
    document.getElementById('slide-body-display').textContent = slide.body;

    // Controls inputs sync
    document.getElementById('slide-title-input').value = slide.title;
    document.getElementById('slide-body-input').value = slide.body;

    // Update Dots indicators
    const dotsContainer = document.getElementById('slide-dots-container');
    dotsContainer.innerHTML = "";
    carouselSlides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `slide-dot ${idx === currentSlideIndex ? 'active' : ''}`;
        dot.onclick = () => {
            currentSlideIndex = idx;
            renderCarouselSlide();
        };
        dotsContainer.appendChild(dot);
    });
}

function selectCarouselTheme(theme) {
    activeCarouselTheme = theme;
    const viewport = document.getElementById('carousel-viewport');
    
    // Reset theme classes
    viewport.className = "carousel-slide-viewport";
    
    // Add specific classes
    if (theme === 'cyber') viewport.classList.add('theme-cyber');
    if (theme === 'minimal') viewport.classList.add('theme-minimal');
    if (theme === 'sunset') viewport.classList.add('theme-sunset');
    if (theme === 'forest') viewport.classList.add('theme-forest');
    if (theme === 'ocean') viewport.classList.add('theme-ocean');
    if (theme === 'gold') viewport.classList.add('theme-gold');

    // Sync button borders active
    document.querySelectorAll('.theme-btn-option').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function updateSlideContent() {
    if (!carouselSlides[currentSlideIndex]) return;
    
    const titleVal = document.getElementById('slide-title-input').value;
    const bodyVal = document.getElementById('slide-body-input').value;
    
    carouselSlides[currentSlideIndex].title = titleVal;
    carouselSlides[currentSlideIndex].body = bodyVal;

    document.getElementById('slide-title-display').textContent = titleVal;
    document.getElementById('slide-body-display').textContent = bodyVal;
}

function navigateSlide(direction) {
    if (direction === 'next') {
        currentSlideIndex = (currentSlideIndex + 1) % carouselSlides.length;
    } else {
        currentSlideIndex = (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;
    }
    renderCarouselSlide();
}

function addCustomSlide() {
    const newId = carouselSlides.length + 1;
    carouselSlides.push({
        id: newId,
        title: "New Custom Slide Title",
        body: "Enter your slide bullet description steps here."
    });
    currentSlideIndex = carouselSlides.length - 1;
    renderCarouselSlide();
    Scheduler.triggerNotification("Added new slide card.");
}

function deleteCurrentSlide() {
    if (carouselSlides.length <= 1) {
        Scheduler.triggerNotification("Cannot delete. Keep at least 1 slide!");
        return;
    }
    carouselSlides.splice(currentSlideIndex, 1);
    currentSlideIndex = Math.max(0, currentSlideIndex - 1);
    
    // Reindex
    carouselSlides.forEach((slide, idx) => slide.id = idx + 1);
    
    renderCarouselSlide();
    Scheduler.triggerNotification("Deleted slide card.");
}

function scheduleCarouselToCalendar() {
    const brand = BrandManager.currentBrand;
    const title = `IG Carousel: ${carouselSlides[0].title.slice(0, 20)}...`;
    const text = carouselSlides.map(s => `[Slide ${s.id}] ${s.title}: ${s.body}`).join('\n');
    
    Scheduler.addToQueue("instagram", title, text, 3);
}

// UGC scripts copy
function copyUgcScript() {
    const hook = document.getElementById('ugc-hook-disp').textContent;
    const body = document.getElementById('ugc-body-disp').textContent;
    const cta = document.getElementById('ugc-cta-disp').textContent;
    
    const fullScript = `UGC AD BLUEPRINT\n\n[HOOK (0-3s)]:\n${hook}\n\n[BODY (3-12s)]:\n${body}\n\n[CTA (12-15s)]:\n${cta}`;
    navigator.clipboard.writeText(fullScript);
    Scheduler.triggerNotification("Copied UGC script to clipboard!");
}

function scheduleAdToCalendar(framework) {
    const copyVal = framework === 'AIDA' ? 
        document.getElementById('ad-aida-textarea').value : 
        document.getElementById('ad-pas-textarea').value;
        
    Scheduler.addToQueue("facebook", `${framework} Ad Creative Campaign`, copyVal, 2);
}

// Video Storyboards timeline compiler
function renderVideoStoryboard(storyboard) {
    const container = document.getElementById('storyboard-timeline-container');
    container.innerHTML = "";

    storyboard.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = 'glass-panel storyboard-scene-card';
        item.innerHTML = `
            <div class="scene-header">
                <div class="scene-title">${step.scene}</div>
                <div class="scene-time-tag">Duration: ${step.duration}</div>
            </div>
            <div class="scene-details-split">
                <div class="scene-instruction-box">
                    <div class="instruction-label">Visual Frame & Shoot Cues</div>
                    <div class="instruction-body">${step.visual}</div>
                </div>
                <div class="scene-instruction-box">
                    <div class="instruction-label">Voiceover & Audio SFX Cues</div>
                    <div class="instruction-body"><strong>Audio:</strong> ${step.audio}</div>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

// Google SEO Updates functions
function publishGmbUpdateImmediately() {
    const updateText = document.getElementById('gmb-post-textarea').value;
    const cta = document.getElementById('gmb-cta-select').value;
    
    document.getElementById('gmb-preview-body').textContent = updateText;
    document.getElementById('gmb-preview-cta').textContent = cta;
    
    // Simulate push GMB
    Scheduler.triggerNotification("GMB Update posted instantly to Google Maps listings!");
}

function scheduleGmbUpdate() {
    const updateText = document.getElementById('gmb-post-textarea').value;
    Scheduler.addToQueue("gmb", "Google Map Local SEO Post", updateText, 1);
}

async function generateAiReviewResponse() {
    const reviewInput = document.getElementById('review-input-box').value;
    
    const responseCard = document.getElementById('review-response-card');
    const responseText = document.getElementById('review-response-text');
    
    responseText.textContent = "AI responder compiling SEO keywords response...";
    responseCard.style.display = "block";

    try {
        const replyText = await ContentGenerator.generateReviewReplyAsync(BrandManager.currentBrand, reviewInput);
        responseText.textContent = replyText;
    } catch (err) {
        console.error(err);
        responseText.textContent = "Failed to compile response.";
    }
}

function copyReviewReply() {
    const val = document.getElementById('review-response-text').textContent;
    navigator.clipboard.writeText(val);
    Scheduler.triggerNotification("Copied review reply response!");
}

// Scheduler Calendar & Connection toggling
function updateConnectionsUI() {
    const conn = Scheduler.connections;
    
    const toggleButton = (platform, isConnected) => {
        const btn = document.getElementById(`btn-conn-${platform}`);
        if (!btn) return;
        
        if (isConnected) {
            btn.className = "badge badge-success";
            btn.textContent = "Connected";
        } else {
            btn.className = "badge badge-danger";
            btn.textContent = "Disconnected";
        }
    };
    
    toggleButton('facebook', conn.facebook);
    toggleButton('instagram', conn.instagram);
    toggleButton('youtube', conn.youtube);
    toggleButton('gmb', conn.gmb);
}

function togglePlatformConnection(platform) {
    const state = Scheduler.toggleConnection(platform);
    Scheduler.triggerNotification(`${platform.charAt(0).toUpperCase() + platform.slice(1)} account ${state ? 'connected' : 'disconnected'}.`);
}

function renderQueue() {
    const queueList = Scheduler.queue;
    const countLbl = document.getElementById('dashboard-scheduled-count');
    if (countLbl) {
        countLbl.textContent = `${queueList.length} Campaign${queueList.length === 1 ? '' : 's'}`;
    }

    const container = document.getElementById('scheduler-queue-container');
    if (!container) return;
    container.innerHTML = "";

    if (queueList.length === 0) {
        container.innerHTML = `
            <div style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 20px;">
                No campaigns scheduled in calendar.
            </div>
        `;
        return;
    }

    queueList.forEach(item => {
        let platformIcon = "📢";
        if (item.platform === 'facebook') platformIcon = "🔵";
        if (item.platform === 'instagram') platformIcon = "🟣";
        if (item.platform === 'youtube') platformIcon = "🔴";
        if (item.platform === 'gmb') platformIcon = "🟠";

        const card = document.createElement('div');
        card.className = "glass-panel queue-item-card";
        card.innerHTML = `
            <div class="queue-item-icon" style="background: var(--bg-dark);">${platformIcon}</div>
            <div class="queue-item-details">
                <div class="queue-item-title">${item.title}</div>
                <div class="queue-item-time">${item.time}</div>
            </div>
            <button class="btn-icon" style="padding: 4px 8px; font-size: 0.75rem;" onclick="Scheduler.removeFromQueue(${item.id})">×</button>
        `;
        container.appendChild(card);
    });
}

function renderCalendar() {
    const container = document.getElementById('calendar-grid-container');
    if (!container) return;
    container.innerHTML = "";

    // 1. Draw Weekday Headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(day => {
        const header = document.createElement('div');
        header.className = "calendar-day-header";
        header.textContent = day;
        container.appendChild(header);
    });

    // 2. Generate Simulated May 2026 Cells
    // May 1 2026 falls on Friday, so offset start cells by 5 blank spaces
    const startOffset = 5;
    const daysInMonth = 31;
    const totalCells = 35; // 5 weeks grid

    // Hardcode simulated "Today" is Wednesday, May 27, 2026
    const simulatedTodayDay = 27;

    for (let cellIdx = 1; cellIdx <= totalCells; cellIdx++) {
        const cell = document.createElement('div');
        cell.className = "calendar-day-cell";
        
        const dayNumber = cellIdx - startOffset;
        
        if (dayNumber > 0 && dayNumber <= daysInMonth) {
            // Label Day
            const dayNumSpan = document.createElement('span');
            dayNumSpan.className = "calendar-day-number";
            dayNumSpan.textContent = dayNumber;
            cell.appendChild(dayNumSpan);

            // Is Today?
            if (dayNumber === simulatedTodayDay) {
                cell.classList.add('today');
            }

            // Append events matching schedule dates
            // Match scheduler offset to dates:
            // Today (27) + dateOffset
            const eventsBox = document.createElement('div');
            eventsBox.className = "calendar-events-container";

            Scheduler.queue.forEach(item => {
                const targetDay = simulatedTodayDay + item.dateOffset;
                if (targetDay === dayNumber) {
                    const tag = document.createElement('div');
                    tag.className = `calendar-event-tag tag-platform-${item.platform}`;
                    tag.textContent = item.title;
                    tag.title = item.text;
                    eventsBox.appendChild(tag);
                }
            });

            cell.appendChild(eventsBox);
        } else {
            // Blank overflow cells
            cell.style.opacity = "0.15";
            cell.style.pointerEvents = "none";
            const dayNumSpan = document.createElement('span');
            dayNumSpan.className = "calendar-day-number";
            dayNumSpan.textContent = dayNumber <= 0 ? (30 + dayNumber) : (dayNumber - daysInMonth);
            cell.appendChild(dayNumSpan);
        }

        container.appendChild(cell);
    }
}

function changeMonth(direction) {
    const title = document.getElementById('calendar-month-year-title');
    if (direction === 'next') {
        title.textContent = "June 2026";
        Scheduler.triggerNotification("Viewing next month updates.");
    } else {
        title.textContent = "April 2026";
        Scheduler.triggerNotification("Viewing previous month archives.");
    }
}

// Quick Scheduler modal controls
function openModal() {
    const modal = document.getElementById('quick-schedule-modal');
    modal.classList.add('active');
    
    // Prefill text with active ad PAS or GMB update based on preference
    document.getElementById('modal-text-textarea').value = document.getElementById('gmb-post-textarea').value;
    document.getElementById('modal-title-input').value = "Social Promo Feed Post";
}

function closeModal() {
    const modal = document.getElementById('quick-schedule-modal');
    modal.classList.remove('active');
}

function submitQuickSchedule() {
    const platform = document.getElementById('modal-platform-select').value;
    const title = document.getElementById('modal-title-input').value;
    const text = document.getElementById('modal-text-textarea').value;
    const offset = parseInt(document.getElementById('modal-offset-select').value, 10);

    if (!title || !text) {
        Scheduler.triggerNotification("Title and content details are required!");
        return;
    }

    Scheduler.addToQueue(platform, title, text, offset);
    closeModal();
}
