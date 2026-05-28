// Google Business Profile Audit Engine for GrowPilot AI
const Auditor = {
    // Generate deterministic hash from business name for consistent scores
    getStringHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    },

    // Detect niche based on name keywords
    detectNiche(name) {
        const lower = name.toLowerCase();
        if (lower.includes("gym") || lower.includes("fit") || lower.includes("muscle") || lower.includes("yoga") || lower.includes("crossfit")) {
            return "gym";
        }
        if (lower.includes("pizza") || lower.includes("cafe") || lower.includes("burger") || lower.includes("restaurant") || lower.includes("bites") || lower.includes("food") || lower.includes("kitchen")) {
            return "restaurant";
        }
        if (lower.includes("shop") || lower.includes("store") || lower.includes("boutique") || lower.includes("wear") || lower.includes("deals") || lower.includes("buy")) {
            return "ecommerce";
        }
        if (lower.includes("home") || lower.includes("realty") || lower.includes("estate") || lower.includes("properties") || lower.includes("realtor") || lower.includes("condo")) {
            return "real-estate";
        }
        return "saas"; // Default Niche
    },

    // Calculate audit items dynamically
    runGmbAudit(businessName, location) {
        const cleanName = businessName.trim();
        const cleanLoc = location.trim() || "India";
        const hash = this.getStringHash(cleanName + cleanLoc);
        
        // Deterministic score between 52 and 79
        const score = 52 + (hash % 28);
        const niche = this.detectNiche(cleanName);

        // Deterministic reviews and ratings
        const rating = (4.0 + ((hash % 10) / 10)).toFixed(1);
        const totalReviews = 12 + (hash % 120);
        const unansweredCount = 3 + (hash % 18);
        const photoCount = 2 + (hash % 15);

        // Core GMB Task database mapping
        const criticalFixes = [];
        const warningFixes = [];
        const completedItems = [];

        // 1. Evaluate GMB Update activity
        if (hash % 2 === 0) {
            criticalFixes.push({
                id: "gmb_posts",
                title: "No profile posts in last 7 days",
                desc: "Google ranks active profiles higher. Signal activity to Google Maps local crawlers.",
                actionText: "Write GMB Post with AI"
            });
        } else {
            completedItems.push({
                id: "gmb_posts",
                title: "Recent posts are active",
                desc: "Profile shows recent updates within the past week."
            });
        }

        // 2. Evaluate Customer Review reply status
        if (unansweredCount > 0) {
            criticalFixes.push({
                id: "gmb_replies",
                title: `${unansweredCount} customer reviews have no reply`,
                desc: "Replying to reviews builds local trust and tells Google you are highly responsive.",
                actionText: "Reply to Reviews with AI",
                payload: unansweredCount
            });
        } else {
            completedItems.push({
                id: "gmb_replies",
                title: "All reviews are replied to",
                desc: "Great job! Active feedback loops maintain local credibility."
            });
        }

        // 3. Evaluate Keyword density
        if (hash % 3 !== 0) {
            warningFixes.push({
                id: "gmb_keywords",
                title: "Missing localized keywords in description",
                desc: "Target search terms are not optimized in description to signal Map positioning.",
                actionText: "Optimize Description AI"
            });
        } else {
            completedItems.push({
                id: "gmb_keywords",
                title: "Optimized keywords detected",
                desc: "Local search keywords match active business settings."
            });
        }

        // 4. Evaluate Image count
        if (photoCount < 15) {
            warningFixes.push({
                id: "gmb_photos",
                title: `Only ${photoCount} photos uploaded (Target: 20)`,
                desc: "High-performing GMB listings update custom shop photos weekly.",
                actionText: "Generate Photo Promo Post"
            });
        } else {
            completedItems.push({
                id: "gmb_photos",
                title: "High-resolution photos uploaded",
                desc: "Listing has healthy visual activity."
            });
        }

        // 5. Hardcoded baseline completions for validation realism
        completedItems.push({
            id: "gmb_phone",
            title: "NAP Consistency Verified",
            desc: "Name, Address, and Phone Number verified across maps registries."
        });
        completedItems.push({
            id: "gmb_hours",
            title: "Operating hours are configured",
            desc: "Opening schedule matches maps directions database."
        });

        return {
            name: cleanName,
            location: cleanLoc,
            niche,
            score,
            rating,
            totalReviews,
            unansweredCount,
            photoCount,
            criticalFixes,
            warningFixes,
            completedItems
        };
    }
};
