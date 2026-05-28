// Brand Profile & API Config Manager for GrowPilot AI
const BrandManager = {
    geminiKey: "",
    lastAudit: null,

    saveApiKey(key) {
        this.geminiKey = key.trim();
        localStorage.setItem('growpilot_gemini_key', this.geminiKey);
        return this.geminiKey;
    },

    loadApiKey() {
        const saved = localStorage.getItem('growpilot_gemini_key');
        if (saved) {
            this.geminiKey = saved;
        }
        return this.geminiKey;
    },

    saveAuditResult(auditObj) {
        this.lastAudit = auditObj;
        localStorage.setItem('growpilot_last_audit', JSON.stringify(auditObj));
        return this.lastAudit;
    },

    loadAuditResult() {
        const saved = localStorage.getItem('growpilot_last_audit');
        if (saved) {
            try {
                this.lastAudit = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse cached audit report.", e);
            }
        }
        return this.lastAudit;
    },

    // Simplified fallback templates database for offline simulated generation
    fallbacks: {
        restaurant: {
            post: "Craving delicious, freshly made artisanal dishes? 🍕🍽️ Visit us at {Name} in {Location}! We use locally sourced, organic ingredients to cook your favorites. Tap below to call now and reserve a table or order takeout today!",
            reply: "Hi! Thank you so much for your review. We are delighted to serve you the best gourmet food here at {Name} in {Location}. We look forward to seeing you again soon!",
            keywords: "best restaurant in {Location}, family dining, organic food delivery, pizza restaurant"
        },
        gym: {
            post: "Ready to crush your fitness goals? 💪 Let's get started at {Name} in {Location}! We offer certified personal training, state-of-the-art weights, cardio machines, and customized nutrition plans. Call now to claim your free 1-day guest pass!",
            reply: "Hi! Thanks for your positive feedback! We love helping our members reach their strength and weight loss goals at {Name} in {Location}. Keep up the great work!",
            keywords: "best gym in {Location}, personal training, weights fitness center, weight loss coach"
        },
        ecommerce: {
            post: "Upgrade your daily gear! 🎒🛍️ Checkout our sustainable premium collection at {Name}. Crafted for comfort, long-lasting utility, and modern style. Shop online today and get free shipping to {Location} on all orders over $50!",
            reply: "Hi! Thank you for shopping with us. We are proud to provide excellent customer support and durable items here at {Name}. We appreciate your support!",
            keywords: "online sustainable shop, premium backpacks, eco-friendly shopping, free shipping {Location}"
        },
        "real-estate": {
            post: "Find your dream home in {Location}! 🏡 Modern architecture, open floor plans, floor-to-ceiling windows, and customized smart automation profiles. Contact our experienced agents at {Name} to schedule a private tour today!",
            reply: "Hi! Thank you so much for your kind words. Our client-success team at {Name} is always here to make property buying and selling smooth and simple for you in {Location}!",
            keywords: "dream homes in {Location}, luxury real estate agency, property listings, purchase house"
        },
        saas: {
            post: "Automate your marketing flow and rank first on Google Maps with {Name}! 🚀 Generate high-converting posts, manage customer reviews, and check SEO visibility scores in seconds. Visit our website to start for free today!",
            reply: "Hi! Thank you for your feedback. We are glad our marketing software is saving you time and boosting search ranking visibility. Let us know if you need any assistance!",
            keywords: "GMB local SEO software, automated maps poster, local keyword ranks tool, review responder"
        }
    }
};
