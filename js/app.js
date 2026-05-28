// Core UI Controller for GrowPilot AI
let activeAudit = null;
let activeModal = null;

// Initialize on load
window.addEventListener('load', () => {
    // Load config state
    BrandManager.loadApiKey();
    const cachedAudit = BrandManager.loadAuditResult();
    
    // Set API Key field in settings modal
    document.getElementById('settings-api-key-input').value = BrandManager.geminiKey;

    if (cachedAudit) {
        // Direct route to report if audited previously
        activeAudit = cachedAudit;
        showView('report');
        renderAuditReport(cachedAudit);
    } else {
        showView('landing');
    }
});

// Navigation scroll helpers
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

// Reset app back to landing homepage
function resetToHome() {
    activeAudit = null;
    localStorage.removeItem('growpilot_last_audit');
    
    // Clear input fields
    document.getElementById('input-biz-name').value = "";
    document.getElementById('input-biz-loc').value = "";
    
    showView('landing');
}

// View switcher router
function showView(viewName) {
    document.getElementById('view-landing').style.display = viewName === 'landing' ? 'block' : 'none';
    document.getElementById('view-scanner').style.display = viewName === 'scanner' ? 'flex' : 'none';
    document.getElementById('view-report').style.display = viewName === 'report' ? 'block' : 'none';
    
    // Adjust header button visibility
    const headerBtn = document.querySelector('.landing-header .btn-primary');
    if (headerBtn) {
        headerBtn.style.display = viewName === 'landing' ? 'inline-flex' : 'none';
    }
}

// Run GMB Audit Scanner Radar Animation
function triggerAuditScan() {
    const bizName = document.getElementById('input-biz-name').value;
    const bizLoc = document.getElementById('input-biz-loc').value;

    if (!bizName || bizName.trim() === "") {
        Scheduler.triggerNotification("Please enter a Business Name to scan!");
        return;
    }

    // Switch view to Scanner
    showView('scanner');

    // Scanning status log timeline simulation
    const logs = [
        "Locating Google Map registries and coordinates...",
        "Fetching citation listings and NAP consistency details...",
        "Reading customer review counts and sentiment ratios...",
        "Analyzing local search keyword competition ranking densities...",
        "Compiling checklist optimization score report..."
    ];

    const logLbl = document.getElementById('scanner-log-lbl');
    let logIdx = 0;

    const interval = setInterval(() => {
        if (logIdx < logs.length) {
            logLbl.textContent = logs[logIdx];
            logIdx++;
        } else {
            clearInterval(interval);
            // Execute actual audit calculations
            const result = Auditor.runGmbAudit(bizName, bizLoc);
            activeAudit = result;
            BrandManager.saveAuditResult(result);
            
            // Switch view to Report
            showView('report');
            renderAuditReport(result);
        }
    }, 700);
}

// Render Google Audit report dashboard
function renderAuditReport(audit) {
    // 1. Set headers
    document.getElementById('report-biz-name').textContent = audit.name;
    document.getElementById('report-biz-loc').textContent = audit.location || "Local Area";
    document.getElementById('sidebar-rating').textContent = `${audit.rating} / 5.0`;
    document.getElementById('sidebar-reviews').textContent = `${audit.totalReviews} reviews`;
    document.getElementById('sidebar-photos').textContent = `${audit.photoCount} photos`;

    // 2. Animate Circular Score Dial Gauge
    const circle = document.getElementById('score-dial-circle');
    const scoreVal = audit.score;
    const percentLbl = document.getElementById('score-percentage-lbl');
    
    // Total path length of radius 65 circle is 2 * PI * r = ~408.4
    const circumference = 408.4;
    const offset = circumference - (scoreVal / 100) * circumference;
    
    circle.style.strokeDashoffset = circumference; // reset first
    percentLbl.textContent = "0%";
    
    // Trigger count-up animation
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
        
        let counter = 0;
        const speed = Math.max(10, 800 / scoreVal);
        const timer = setInterval(() => {
            if (counter < scoreVal) {
                counter++;
                percentLbl.textContent = counter + "%";
            } else {
                clearInterval(timer);
            }
        }, speed);
    }, 200);

    // 3. Set assessment grade badge
    const badge = document.getElementById('score-grade-badge');
    badge.className = "badge";
    if (scoreVal >= 75) {
        badge.classList.add('badge-success');
        badge.textContent = "Optimized";
    } else if (scoreVal >= 60) {
        badge.classList.add('badge-warning');
        badge.textContent = "Needs Growth";
    } else {
        badge.classList.add('badge-danger');
        badge.textContent = "Critical Attention";
    }

    // 4. Render Task rows
    renderTaskChecklistRows(audit);
}

// Draw list tasks with action buttons
function renderTaskChecklistRows(audit) {
    const criticalContainer = document.getElementById('critical-tasks-container');
    const warningContainer = document.getElementById('warning-tasks-container');
    const completedContainer = document.getElementById('completed-tasks-container');

    criticalContainer.innerHTML = "";
    warningContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    // Show/Hide groups based on count
    document.getElementById('card-critical-group').style.display = audit.criticalFixes.length === 0 ? 'none' : 'block';
    document.getElementById('card-warning-group').style.display = audit.warningFixes.length === 0 ? 'none' : 'block';

    // A. Render Critical
    audit.criticalFixes.forEach(task => {
        const row = document.createElement('div');
        row.className = "checklist-row-item";
        row.innerHTML = `
            <div class="task-item-description">
                <span class="task-severity-icon">🔴</span>
                <div class="task-text-body">
                    <h4>${task.title}</h4>
                    <p>${task.desc}</p>
                </div>
            </div>
            <button class="btn btn-primary" onclick="launchAIAction('${task.id}')">${task.actionText}</button>
        `;
        criticalContainer.appendChild(row);
    });

    // B. Render Warnings
    audit.warningFixes.forEach(task => {
        const row = document.createElement('div');
        row.className = "checklist-row-item";
        row.innerHTML = `
            <div class="task-item-description">
                <span class="task-severity-icon">🟡</span>
                <div class="task-text-body">
                    <h4>${task.title}</h4>
                    <p>${task.desc}</p>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="launchAIAction('${task.id}')">${task.actionText}</button>
        `;
        warningContainer.appendChild(row);
    });

    // C. Render Good
    audit.completedItems.forEach(task => {
        const row = document.createElement('div');
        row.className = "checklist-row-item";
        row.innerHTML = `
            <div class="task-item-description">
                <span class="task-severity-icon">💚</span>
                <div class="task-text-body">
                    <h4>${task.title}</h4>
                    <p>${task.desc}</p>
                </div>
            </div>
            <span class="badge badge-success" style="padding: 6px 12px; font-size: 0.65rem;">Pass</span>
        `;
        completedContainer.appendChild(row);
    });
}

// Router for opening modal tasks
function launchAIAction(taskId) {
    if (taskId === 'gmb_posts' || taskId === 'gmb_photos') {
        openModalWindow('modal-gmb-post');
        generatePostAction(); // auto-trigger initial post write
    } else if (taskId === 'gmb_replies') {
        openModalWindow('modal-gmb-reviews');
        populateReviewsStack();
    } else if (taskId === 'gmb_keywords') {
        openModalWindow('modal-gmb-keywords');
        generateKeywordsAction();
    }
}

// Modal controller functions
function openModalWindow(modalId) {
    closeActiveModal();
    activeModal = document.getElementById(modalId);
    if (activeModal) activeModal.classList.add('active');
}

function closeActiveModal() {
    if (activeModal) {
        activeModal.classList.remove('active');
        activeModal = null;
    }
}

// Processing banner controls
function toggleLoadingBanner(show) {
    const banner = document.getElementById('global-processing-banner');
    if (banner) {
        if (show) banner.classList.add('active');
        else banner.classList.remove('active');
    }
}

// Modal A Actions: Write GMB Post
async function generatePostAction() {
    if (!activeAudit) return;
    
    const textarea = document.getElementById('modal-post-textarea');
    textarea.value = "AI post writer is thinking...";
    toggleLoadingBanner(true);

    const tone = document.getElementById('post-tone-select').value;

    try {
        const postText = await ContentGenerator.generateGMBPost(
            activeAudit.name,
            activeAudit.location,
            activeAudit.niche,
            tone
        );
        textarea.value = postText;
    } catch (err) {
        console.error(err);
        textarea.value = "Failed to generate GMB post.";
    } finally {
        toggleLoadingBanner(false);
    }
}

function copyPostText() {
    const val = document.getElementById('modal-post-textarea').value;
    navigator.clipboard.writeText(val);
    Scheduler.triggerNotification("Copied GMB post text to clipboard!");
}

// Modal B Actions: Reviews Responder
// Niche-specific review generation database
const nicheReviews = {
    restaurant: [
        "Food was delicious but the service was slow. Took 25 minutes to get our bill.",
        "Excellent organic ingredients! The pizza crust is crispy and toppings are fresh.",
        "Worst customer service. Nobody picked up my phone calls for delivery reservation."
    ],
    gym: [
        "Equipment is good but the gym gets very crowded during peak hours (6-8 PM).",
        "Great atmosphere! Coaches are extremely friendly and weight sections are clean.",
        "Staff was rude and didn't explain the subscription details properly when onboarding."
    ],
    ecommerce: [
        "Material quality is great but shipping took a week to arrive at my address.",
        "The everyday backpack is waterproof and spacious. Fully worth the price!",
        "Item arrived with a damaged zip. Need replacement but response is slow."
    ],
    "real-estate": [
        "Agent was late for the farmhouse listing showing, but the property tour was good.",
        "Very professional real estate agency. Found us the perfect home in a week!",
        "They set the listing valuation too high and we had zero offers for a month."
    ],
    saas: [
        "App works well but would love it if there was a direct Instagram autopost.",
        "Amazing local ranking features! Our map ranking went from #9 to #2 in 3 weeks.",
        "Interface is slightly confusing. Took some time to find GMB review responders."
    ]
};

function populateReviewsStack() {
    const container = document.getElementById('mock-reviews-stack');
    container.innerHTML = "";
    
    if (!activeAudit) return;
    const niche = activeAudit.niche || "saas";
    const reviews = nicheReviews[niche] || nicheReviews["saas"];
    
    reviews.forEach((review, idx) => {
        const isNegative = review.toLowerCase().includes("slow") || 
                           review.toLowerCase().includes("worst") || 
                           review.toLowerCase().includes("rude") || 
                           review.toLowerCase().includes("damaged") ||
                           review.toLowerCase().includes("confusing") ||
                           review.toLowerCase().includes("high");

        const card = document.createElement('div');
        card.className = "glass-panel";
        card.style.padding = "16px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "10px";
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--secondary);">Reviewer #${idx + 1}</div>
                <span class="badge ${isNegative ? 'badge-danger' : 'badge-success'}">${isNegative ? 'Negative' : 'Positive'}</span>
            </div>
            <p style="font-size: 0.85rem; font-style: italic; color: #fff;">"${review}"</p>
            <button class="btn btn-secondary" style="font-size: 0.72rem; padding: 6px 12px; align-self: flex-end;" onclick="generateSingleReviewReply('${idx}', \`${review.replace(/`/g, '\\`').replace(/'/g, "\\'")}\`)">Write Reply with AI</button>
        `;
        container.appendChild(card);
    });
}

async function generateSingleReviewReply(idx, reviewText) {
    if (!activeAudit) return;
    
    const textarea = document.getElementById('modal-reply-textarea');
    textarea.value = "AI responder is writing reply...";
    toggleLoadingBanner(true);

    try {
        const replyText = await ContentGenerator.generateGMBReply(
            activeAudit.name,
            activeAudit.location,
            activeAudit.niche,
            reviewText
        );
        textarea.value = replyText;
    } catch (err) {
        console.error(err);
        textarea.value = "Failed to generate reply.";
    } finally {
        toggleLoadingBanner(false);
    }
}

function copyReplyText() {
    const val = document.getElementById('modal-reply-textarea').value;
    navigator.clipboard.writeText(val);
    Scheduler.triggerNotification("Copied review reply response!");
}

// Modal C Actions: Suggest Keywords
async function generateKeywordsAction() {
    if (!activeAudit) return;
    
    const input = document.getElementById('modal-keywords-input');
    input.value = "AI suggestions loading...";
    toggleLoadingBanner(true);

    try {
        const keywordsList = await ContentGenerator.generateLocalKeywords(
            activeAudit.name,
            activeAudit.location,
            activeAudit.niche
        );
        input.value = keywordsList;
    } catch (err) {
        console.error(err);
        input.value = "Failed to suggest keywords.";
    } finally {
        toggleLoadingBanner(false);
    }
}

function copyKeywordsText() {
    const val = document.getElementById('modal-keywords-input').value;
    navigator.clipboard.writeText(val);
    Scheduler.triggerNotification("Copied keywords list to clipboard!");
}

// Settings modal functions
function openSettingsModal() {
    openModalWindow('modal-settings');
}

function saveSettings() {
    const keyInput = document.getElementById('settings-api-key-input').value;
    BrandManager.saveApiKey(keyInput);
    Scheduler.triggerNotification("Google Gemini API configuration saved successfully!");
    closeActiveModal();
    
    // Refresh content if audit reports exist
    if (activeAudit) {
        renderAuditReport(activeAudit);
    }
}
