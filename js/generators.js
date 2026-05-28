// Content Generation Engine for GrowPilot AI GMB Auditing
const ContentGenerator = {
    // Call Google Gemini 1.5 Flash API
    async callGemini(prompt, apiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    },

    // 1. Generate GMB Post via Gemini
    async generateGMBPost(businessName, location, niche, tone) {
        const apiKey = BrandManager.geminiKey;
        if (!apiKey || apiKey.trim() === "") {
            // Offline Fallback
            const template = BrandManager.fallbacks[niche]?.post || BrandManager.fallbacks["saas"].post;
            return template.replace(/{Name}/g, businessName).replace(/{Location}/g, location);
        }

        const prompt = `You are a local SEO expert and copywriter. Write a Google Business Profile (Google My Business) update post for this business:
Name: "${businessName}"
Location: "${location}"
Niche/Niche: "${niche}"
Tone of voice: "${tone}"

Guidelines:
- Include a high-converting hook, details of a promo, and call-to-action details (e.g. Call Now, Visit us).
- Inject local SEO target search terms for this niche naturally.
- Keep it concise (max 80 words). Use emojis and a few relevant hashtags.
- Output ONLY the post text. Do not include quote marks, markdown styling, or introductory commentary.`;

        try {
            const result = await this.callGemini(prompt, apiKey);
            return result.trim().replace(/^"|"$/g, '');
        } catch (err) {
            console.error("Gemini GMB Post creation failed, running fallback.", err);
            const template = BrandManager.fallbacks[niche]?.post || BrandManager.fallbacks["saas"].post;
            return template.replace(/{Name}/g, businessName).replace(/{Location}/g, location);
        }
    },

    // 2. Generate GMB Review reply response via Gemini
    async generateGMBReply(businessName, location, niche, reviewText) {
        const apiKey = BrandManager.geminiKey;
        if (!apiKey || apiKey.trim() === "") {
            // Offline Fallback
            const template = BrandManager.fallbacks[niche]?.reply || BrandManager.fallbacks["saas"].reply;
            return template.replace(/{Name}/g, businessName).replace(/{Location}/g, location);
        }

        const prompt = `You are a customer reputation manager for a local business:
Name: "${businessName}"
Location: "${location}"
Niche: "${niche}"

Write a professional, warm, local SEO optimized response reply to this customer review left on Google Maps:
"${reviewText}"

Guidelines:
- If the review is positive, thank them warmly and weave in search keywords naturally to aid map rankings.
- If negative, apologize politely, maintain a professional tone, and offer a contact number/email to resolve the issue directly.
- Keep the response short (max 60 words).
- Output ONLY the raw response text. Do not add quotes, titles, or other comments.`;

        try {
            const result = await this.callGemini(prompt, apiKey);
            return result.trim().replace(/^"|"$/g, '');
        } catch (err) {
            console.error("Gemini GMB Reply failed, running fallback.", err);
            const template = BrandManager.fallbacks[niche]?.reply || BrandManager.fallbacks["saas"].reply;
            return template.replace(/{Name}/g, businessName).replace(/{Location}/g, location);
        }
    },

    // 3. Generate Local Search Keywords recommendations
    async generateLocalKeywords(businessName, location, niche) {
        const apiKey = BrandManager.geminiKey;
        if (!apiKey || apiKey.trim() === "") {
            // Offline Fallback
            const list = BrandManager.fallbacks[niche]?.keywords || BrandManager.fallbacks["saas"].keywords;
            return list.replace(/{Location}/g, location);
        }

        const prompt = `Suggest the top 5 high-intent local search keywords that a local business in the "${niche}" niche named "${businessName}" located in "${location}" should optimize for on their website and Google Maps profile to rank #1.
Format the output as a simple comma-separated string (e.g. keyword 1, keyword 2, keyword 3). Do not number them or list them in separate lines. Do not add introduction.`;

        try {
            const result = await this.callGemini(prompt, apiKey);
            return result.trim().replace(/^"|"$/g, '');
        } catch (err) {
            console.error("Gemini Keywords failed, running fallback.", err);
            const list = BrandManager.fallbacks[niche]?.keywords || BrandManager.fallbacks["saas"].keywords;
            return list.replace(/{Location}/g, location);
        }
    }
};
