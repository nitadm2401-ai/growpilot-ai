// Content Generation Engine for GrowthAura AI using Google Gemini
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

    // Utilities to clean and parse JSON blocks from Gemini responses
    cleanJSONString(str) {
        let cleaned = str.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length - 3);
        }
        return cleaned.trim();
    },

    // Replace brand placeholders in fallbacks
    replacePlaceholders(templateStr, brand) {
        if (typeof templateStr !== 'string') return templateStr;
        return templateStr
            .replace(/{Name}/g, brand.name)
            .replace(/{Location}/g, brand.location)
            .replace(/{Services}/g, brand.services)
            .replace(/{Hours}/g, brand.hours)
            .replace(/{Contact}/g, brand.contact);
    },

    // 1. Generate AI Poster Caption
    async generateAIPoster(brand) {
        const apiKey = BrandManager.geminiKey;
        const lang = brand.language || "Hinglish";

        if (!apiKey || apiKey.trim() === "") {
            const postersList = BrandManager.fallbacks[lang]?.poster || BrandManager.fallbacks["Hinglish"].poster;
            const randomIndex = Math.floor(Math.random() * postersList.length);
            return this.replacePlaceholders(postersList[randomIndex], brand);
        }

        const prompt = `You are a creative poster copywriter for Indian MSMEs. Write a short, punchy marketing message for this brand:
Name: "${brand.name}"
Location: "${brand.location}"
Niche: "${brand.niche}"
Services: "${brand.services}"
Contact Phone: "${brand.contact}"

Language Mode: "${lang}" (Write the caption in ${lang}. If Hinglish, write Hindi in Latin script, like daily chat speech, mixing Hindi words with English terms).

Guidelines:
- Maximum 20 words.
- Focus on high visual appeal and a single call-to-action.
- Use relevant emojis.
- Output ONLY the caption itself. Do not add quotes, explanation, or titles.`;

        try {
            const result = await this.callGemini(prompt, apiKey);
            return result.trim().replace(/^"|"$/g, '');
        } catch (err) {
            console.error("Gemini Poster failed, running offline fallback.", err);
            const postersList = BrandManager.fallbacks[lang]?.poster || BrandManager.fallbacks["Hinglish"].poster;
            const randomIndex = Math.floor(Math.random() * postersList.length);
            return this.replacePlaceholders(postersList[randomIndex], brand);
        }
    },

    // 2. Generate Reels & Video Storyboard (Legacy Poster Version)
    async generateReelStoryboard(brand) {
        const lang = brand.language || "Hinglish";
        const list = BrandManager.fallbacks[lang]?.storyboard || BrandManager.fallbacks["Hinglish"].storyboard;
        return list.map(scene => ({
            scene: scene.scene,
            visual: this.replacePlaceholders(scene.visual, brand),
            audio: this.replacePlaceholders(scene.audio, brand),
            music: this.replacePlaceholders(scene.music, brand)
        }));
    },

    // 3. Generate Instant Mini-Website details
    async generateMiniSite(brand) {
        const apiKey = BrandManager.geminiKey;
        const lang = brand.language || "Hinglish";

        if (!apiKey || apiKey.trim() === "") {
            const ws = BrandManager.fallbacks[lang]?.website || BrandManager.fallbacks["Hinglish"].website;
            return {
                headline: this.replacePlaceholders(ws.headline, brand),
                tagline: this.replacePlaceholders(ws.tagline, brand),
                about: this.replacePlaceholders(ws.about, brand),
                services: ws.services.map(s => ({ name: s.name, cost: s.cost })),
                hours: this.replacePlaceholders(ws.hours, brand),
                contact: this.replacePlaceholders(ws.contact, brand)
            };
        }

        const prompt = `You are a modern web design copywriter. Generate a styled mini-website content kit for this brand:
Name: "${brand.name}"
Location: "${brand.location}"
Niche: "${brand.niche}"
Services list: "${brand.services}"
Operating Hours: "${brand.hours}"
Contact Phone: "${brand.contact}"

Language Preference: "${lang}" (Write the text content in ${lang}).

Output MUST be a valid JSON object matching this exact schema:
{
  "headline": "Main attractive welcome headline (in ${lang})",
  "tagline": "Catchy subheading/slogan (in ${lang})",
  "about": "Short introduction summary of the shop (in ${lang}, max 30 words)",
  "services": [
    { "name": "Service/Product 1 name (in ${lang})", "cost": "Estimated price in INR (e.g. ₹200)" },
    { "name": "Service/Product 2 name (in ${lang})", "cost": "Estimated price in INR (e.g. ₹500)" },
    { "name": "Service/Product 3 name (in ${lang})", "cost": "Estimated price in INR" },
    { "name": "Service/Product 4 name (in ${lang})", "cost": "Estimated price in INR" }
  ],
  "hours": "Operating hours info (in ${lang})",
  "contact": "Call / WhatsApp text with phone (in ${lang})"
}

Do not output explanatory text. Just the JSON object.`;

        try {
            const result = await this.callGemini(prompt, apiKey);
            const cleanText = this.cleanJSONString(result);
            return JSON.parse(cleanText);
        } catch (err) {
            console.error("Gemini MiniSite compilation failed, running offline fallback.", err);
            const ws = BrandManager.fallbacks[lang]?.website || BrandManager.fallbacks["Hinglish"].website;
            return {
                headline: this.replacePlaceholders(ws.headline, brand),
                tagline: this.replacePlaceholders(ws.tagline, brand),
                about: this.replacePlaceholders(ws.about, brand),
                services: ws.services.map(s => ({ name: s.name, cost: s.cost })),
                hours: this.replacePlaceholders(ws.hours, brand),
                contact: this.replacePlaceholders(ws.contact, brand)
            };
        }
    },

    // 4. Generate AI Pitch Presentation slides (3 slides)
    async generatePresentation(brand) {
        const apiKey = BrandManager.geminiKey;
        const lang = brand.language || "Hinglish";

        if (!apiKey || apiKey.trim() === "") {
            const slides = BrandManager.fallbacks[lang]?.presentation || BrandManager.fallbacks["Hinglish"].presentation;
            return slides.map(slide => ({
                title: this.replacePlaceholders(slide.title, brand),
                bullet1: this.replacePlaceholders(slide.bullet1, brand),
                bullet2: this.replacePlaceholders(slide.bullet2, brand),
                bullet3: this.replacePlaceholders(slide.bullet3, brand)
            }));
        }

        const prompt = `You are a professional venture consultant. Design a simple 3-slide pitch/presentation deck to introduce this business to customers or partners:
Name: "${brand.name}"
Location: "${brand.location}"
Niche: "${brand.niche}"
Services: "${brand.services}"
Contact Phone: "${brand.contact}"

Language Mode: "${lang}"

Output MUST be a valid JSON array containing exactly 3 objects representing the 3 slides. Match this exact format:
[
  {
    "title": "Slide 1 Title (in ${lang})",
    "bullet1": "Highlight point 1 (in ${lang})",
    "bullet2": "Highlight point 2 (in ${lang})",
    "bullet3": "Highlight point 3 (in ${lang})"
  },
  {
    "title": "Slide 2 Title (in ${lang})",
    "bullet1": "Feature 1 description (in ${lang})",
    "bullet2": "Feature 2 description (in ${lang})",
    "bullet3": "Feature 3 description (in ${lang})"
  },
  {
    "title": "Slide 3 Title (in ${lang})",
    "bullet1": "Growth CTA details (in ${lang})",
    "bullet2": "Operating hours or contact info (in ${lang})",
    "bullet3": "Customer promise note (in ${lang})"
  }
]

Do not write markdown, do not write commentary. Just the raw JSON block.`;

        try {
            const result = await this.callGemini(prompt, apiKey);
            const cleanText = this.cleanJSONString(result);
            const parsed = JSON.parse(cleanText);
            if (Array.isArray(parsed) && parsed.length === 3) {
                return parsed.map(slide => {
                    const keys = Object.keys(slide);
                    const title = slide.title || slide[keys[0]] || "";
                    const b1 = slide.bullet1 || slide[keys[1]] || "";
                    const b2 = slide.bullet2 || slide[keys[2]] || "";
                    const b3 = slide.bullet3 || slide[keys[3]] || "";
                    return { title, bullet1: b1, bullet2: b2, bullet3: b3 };
                });
            }
            throw new Error("Invalid parsed slides schema");
        } catch (err) {
            console.error("Gemini Pitch Slides failed, running offline fallback.", err);
            const slides = BrandManager.fallbacks[lang]?.presentation || BrandManager.fallbacks["Hinglish"].presentation;
            return slides.map(slide => ({
                title: this.replacePlaceholders(slide.title, brand),
                bullet1: this.replacePlaceholders(slide.bullet1, brand),
                bullet2: this.replacePlaceholders(slide.bullet2, brand),
                bullet3: this.replacePlaceholders(slide.bullet3, brand)
            }));
        }
    },


    // ================= NEW ADVANCED STUDIO GENERATORS =================

    // 5. Pollinations.ai client-side image builder
    getPollinationsImageURL(prompt, style, aspect = "1:1") {
        let width = 512;
        let height = 512;
        if (aspect === "9:16") {
            width = 360;
            height = 640;
        } else if (aspect === "16:9") {
            width = 640;
            height = 360;
        }

        const fullPrompt = `${prompt}, in style of ${style}, commercial product design, professional advertising photography, 8k resolution, photorealistic`;
        const encoded = encodeURIComponent(fullPrompt);
        const seed = Math.floor(Math.random() * 1000000);
        return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
    },

    // 6. Generate AI Avatar Spokesperson script
    async generateAvatarScript(brand, avatarPrompt) {
        const apiKey = BrandManager.geminiKey;
        const lang = brand.language || "Hinglish";

        if (!apiKey || apiKey.trim() === "") {
            const template = BrandManager.fallbacks[lang]?.avatarScript || BrandManager.fallbacks["Hinglish"].avatarScript;
            return this.replacePlaceholders(template, brand);
        }

        const prompt = `You are a scriptwriter for an AI Avatar spokesperson. Write a short promotional speech based on:
Brand Name: "${brand.name}"
Location: "${brand.location}"
Category: "${brand.niche}"
Services: "${brand.services}"
Contact Phone: "${brand.contact}"
Operating Hours: "${brand.hours}"

User script prompt request: "${avatarPrompt}"

Language Mode: "${lang}" (Write the speech script in ${lang}. If Hinglish, write Hindi in Latin script, like daily chat speech, mixing Hindi words with English terms).

Guidelines:
- Keep it under 65 words (very concise so browser SpeechSynthesis works smoothly).
- Make it sound natural, persuasive, and retail-focused.
- Output ONLY the speech script text. Do not add directions, introductions, or quotation wrappers.`;

        try {
            const result = await this.callGemini(prompt, apiKey);
            return result.trim().replace(/^"|"$/g, '');
        } catch (err) {
            console.error("Gemini Avatar Script failed, running offline fallback.", err);
            const template = BrandManager.fallbacks[lang]?.avatarScript || BrandManager.fallbacks["Hinglish"].avatarScript;
            return this.replacePlaceholders(template, brand);
        }
    },

    // 7. Generate AI Video Storyboard (Advanced multi-scene version)
    async generateVideoStoryboard(brand, videoType, topic) {
        const apiKey = BrandManager.geminiKey;
        const lang = brand.language || "Hinglish";

        if (!apiKey || apiKey.trim() === "") {
            // Offline fallbacks based on type
            const list = BrandManager.fallbacks[lang]?.videos[videoType] || BrandManager.fallbacks["Hinglish"].videos[videoType] || BrandManager.fallbacks["Hinglish"].videos.ugc;
            return list.map(scene => ({
                scene: scene.scene,
                visual: this.replacePlaceholders(scene.visual, brand),
                audio: this.replacePlaceholders(scene.audio, brand),
                music: this.replacePlaceholders(scene.music, brand),
                // Add a dynamic image prompt for pollinations
                imagePrompt: `A promotional scene displaying ${brand.niche}: ${this.replacePlaceholders(scene.visual, brand)}`
            }));
        }

        const prompt = `You are a creative video director. Create a 4-scene video script storyboard for:
Brand Name: "${brand.name}"
Location: "${brand.location}"
Niche: "${brand.niche}"
Services list: "${brand.services}"

Video Category Style: "${videoType}" (Options: ugc, promo, marketing, tutorial, product)
Reel Topic/Goal: "${topic}"
Voiceover Language: "${lang}"

Output MUST be a valid JSON array of exactly 4 objects. Each object must have these exact keys:
"scene": number,
"visual": "Short description of what is happening on screen in English (max 10 words)",
"audio": "Voiceover line to be spoken in the scene (in ${lang}, max 15 words)",
"music": "Music beat or audio cues suggestion (in English, max 5 words)",
"imagePrompt": "A detailed, descriptive text-to-image prompt to generate a realistic background picture for this scene (in English, max 20 words)"

Do not output code blocks wrappers unless in a JSON format. Just raw JSON.`;

        try {
            const result = await this.callGemini(prompt, apiKey);
            const cleanText = this.cleanJSONString(result);
            const parsed = JSON.parse(cleanText);
            if (Array.isArray(parsed) && parsed.length === 4) {
                return parsed;
            }
            throw new Error("Invalid video storyboard schema parsed");
        } catch (err) {
            console.error("Gemini Video Storyboard failed, running fallback.", err);
            const list = BrandManager.fallbacks[lang]?.videos[videoType] || BrandManager.fallbacks["Hinglish"].videos[videoType] || BrandManager.fallbacks["Hinglish"].videos.ugc;
            return list.map(scene => ({
                scene: scene.scene,
                visual: this.replacePlaceholders(scene.visual, brand),
                audio: this.replacePlaceholders(scene.audio, brand),
                music: this.replacePlaceholders(scene.music, brand),
                imagePrompt: `A promotional scene displaying ${brand.niche}: ${this.replacePlaceholders(scene.visual, brand)}`
            }));
        }
    }
};
