// Scheduler and Content Calendar Engine for GrowPilot AI
const Scheduler = {
    // Platform connection status
    connections: {
        facebook: true,
        instagram: true,
        youtube: false,
        gmb: true
    },

    // Current scheduled queue items
    queue: [
        { id: 101, platform: "facebook", title: "Brand Launch Post", time: "Tomorrow, 9:00 AM", dateOffset: 1, text: "Welcome to our brand new workspace! Let's get growing!" },
        { id: 102, platform: "gmb", title: "Local SEO Promotional Offer", time: "In 2 days, 10:30 AM", dateOffset: 2, text: "Check out our newest catalog and services. Click Call Now to speak with a specialist!" },
        { id: 103, platform: "instagram", title: "Weekly Core Values Carousel", time: "In 4 days, 3:00 PM", dateOffset: 4, text: "A slide deck showcasing how we make things happen." }
    ],

    // Toggle connection state
    toggleConnection(platform) {
        if (this.connections.hasOwnProperty(platform)) {
            this.connections[platform] = !this.connections[platform];
            // Save to localStorage
            localStorage.setItem('growpilot_connections', JSON.stringify(this.connections));
            // Trigger UI update
            window.dispatchEvent(new CustomEvent('connectionsUpdated', { detail: this.connections }));
        }
        return this.connections[platform];
    },

    // Load connection state
    loadConnections() {
        const saved = localStorage.getItem('growpilot_connections');
        if (saved) {
            try {
                this.connections = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load connection data.", e);
            }
        }
        return this.connections;
    },

    // Add content to the scheduler queue
    addToQueue(platform, title, text, dateOffset = 1) {
        const id = Date.now();
        // Set scheduled time string based on offset
        let timeStr = "Tomorrow";
        if (dateOffset > 1) {
            timeStr = `In ${dateOffset} days`;
        }
        timeStr += `, 10:00 AM`;

        const newItem = {
            id,
            platform,
            title,
            time: timeStr,
            dateOffset,
            text
        };
        
        this.queue.push(newItem);
        // Save to localStorage
        this.saveQueue();
        
        // Notify user of simulation action
        this.triggerNotification(`Scheduled new ${platform} post successfully!`);
        
        window.dispatchEvent(new CustomEvent('queueUpdated', { detail: this.queue }));
        return newItem;
    },

    saveQueue() {
        localStorage.setItem('growpilot_scheduler_queue', JSON.stringify(this.queue));
    },

    loadQueue() {
        const saved = localStorage.getItem('growpilot_scheduler_queue');
        if (saved) {
            try {
                this.queue = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load queue data.", e);
            }
        }
        return this.queue;
    },

    // Remove item from queue
    removeFromQueue(id) {
        this.queue = this.queue.filter(item => item.id !== id);
        this.saveQueue();
        window.dispatchEvent(new CustomEvent('queueUpdated', { detail: this.queue }));
    },

    // Toast/Notifications simulator
    triggerNotification(msg) {
        const toast = document.createElement('div');
        toast.className = 'glass-panel';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.padding = '16px 24px';
        toast.style.zIndex = '9999';
        toast.style.borderLeft = '4px solid var(--secondary)';
        toast.style.boxShadow = 'var(--glow-secondary)';
        toast.style.animation = 'fadeIn 0.3s ease forwards';
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="status-dot"></div>
                <div style="font-weight: 700; font-size: 0.9rem; font-family: var(--font-heading); color: #fff;">${msg}</div>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeIn 0.3s ease reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};
