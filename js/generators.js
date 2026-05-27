// Content Generation Engine for GrowPilot AI
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

    // Clean JSON formatting from Gemini wrappers
    cleanJsonString(str) {
        let clean = str.trim();
        if (clean.startsWith('```')) {
            clean = clean.replace(/^```json/, '');
            clean = clean.replace(/^```/, '');
            clean = clean.replace(/```$/, '');
        }
        return clean.trim();
    },

    // Asynchronous Gemini Content compiler
    async generateAllContentAsync(brandInfo) {
        const apiKey = brandInfo.geminiKey;
        if (!apiKey || apiKey.trim() === "") {
            // Fallback to local templates
            return this.generateAllContent(brandInfo);
        }

        const prompt = `You are an expert digital and AI marketer. Generate a complete marketing content package for this business:
Business Name: "${brandInfo.name}"
Category/Niche: "${brandInfo.niche}"
Description: "${brandInfo.description}"
Target Audience: "${brandInfo.audience}"
SEO Target Keywords: "${brandInfo.keywords}"
Tone of Voice style to use: "${brandInfo.tone}"

Output must be a single, valid JSON object matching this schema exactly:
{
  "carouselSlides": [
    { "id": 1, "title": "Slide 1 Title", "body": "Slide 1 explanation" },
    { "id": 2, "title": "Slide 2 Title", "body": "Slide 2 explanation" },
    { "id": 3, "title": "Slide 3 Title", "body": "Slide 3 explanation" },
    { "id": 4, "title": "Slide 4 Title", "body": "Slide 4 explanation" }
  ],
  "captions": [
    "Instagram caption option 1 with hashtags and emojis",
    "Facebook caption option 2 with hashtags and emojis"
  ],
  "ugcScript": {
    "hook": "0-3s high-converting viral video opening hook",
    "body": "3-12s product explanation or core problem agitation",
    "cta": "12-15s strong call to action"
  },
  "storyboard": [
    { "scene": "Scene 1: Hook", "visual": "Visual camera directions", "audio": "Voiceover words and background music SFX details", "duration": "3s" },
    { "scene": "Scene 2: Problem", "visual": "Visual camera directions", "audio": "Voiceover words and background music SFX details", "duration": "4s" },
    { "scene": "Scene 3: Solution", "visual": "Visual camera directions", "audio": "Voiceover words and background music SFX details", "duration": "4s" },
    { "scene": "Scene 4: Action", "visual": "Visual camera directions", "audio": "Voiceover words and background music SFX details", "duration": "4s" }
  ],
  "gmbUpdateText": "Google Business Profile update text (max 80 words) optimized for local SEO search ranking"
}

Ensure the output is ONLY the JSON object. Do not add any introductory or explanatory text. Do not wrap the JSON in markdown formatting blocks. Validate the syntax carefully.`;

        try {
            const rawText = await this.callGemini(prompt, apiKey);
            const cleanText = this.cleanJsonString(rawText);
            const parsed = JSON.parse(cleanText);
            return parsed;
        } catch (err) {
            console.warn("AI generation failed or parsed incorrectly, falling back to local simulation.", err);
            if (typeof Scheduler !== 'undefined' && Scheduler.triggerNotification) {
                Scheduler.triggerNotification("AI request failed. Running template fallback.");
            }
            return this.generateAllContent(brandInfo);
        }
    },

    // Asynchronous GMB review responder
    async generateReviewReplyAsync(brandInfo, reviewText) {
        const apiKey = brandInfo.geminiKey;
        if (!apiKey || apiKey.trim() === "") {
            return this.generateReviewReply(brandInfo, reviewText);
        }

        const prompt = `You are a reputation manager for a local business named "${brandInfo.name}" (niche: ${brandInfo.niche}, SEO keywords: ${brandInfo.keywords}).
Write a professional, warm, local SEO optimized response reply to this customer review left on Google Maps:
"${reviewText}"

Guidelines:
- If the review is positive, thank them warmly and weave in search keywords naturally to aid visibility rankings.
- If negative, maintain absolute professionalism, apologize for the issue, and invite them to contact us directly to make it right.
- Keep the response short and friendly (max 60 words).
- Output ONLY the raw response text. Do not add quotes, introductions, or other commentaries.`;

        try {
            const reply = await this.callGemini(prompt, apiKey);
            return reply.trim().replace(/^"|"$/g, '');
        } catch (err) {
            console.warn("AI review response failed, falling back.", err);
            return this.generateReviewReply(brandInfo, reviewText);
        }
    },

    // Basic text token compiler
    compileTemplate(templateStr, brandInfo) {
        if (!templateStr) return "";
        let result = templateStr;
        result = result.replace(/{Name}/g, brandInfo.name);
        result = result.replace(/{Description}/g, brandInfo.description);
        result = result.replace(/{Audience}/g, brandInfo.audience);
        result = result.replace(/{Keywords}/g, brandInfo.keywords);
        return result;
    },

    // Apply tone shifts to simulate AI re-writing
    applyToneShift(text, tone) {
        let modified = text;
        switch (tone) {
            case "bold":
                modified = "🔥 " + modified.toUpperCase().replace(/\b(STOP|GET|READY|NOW|DOMINATE|UNLEASH)\b/g, '$1! 🚀');
                break;
            case "casual":
                modified = "Hey guys! 👋 " + modified.charAt(0).toLowerCase() + modified.slice(1);
                modified = modified.replace(/\.\s/g, ", literally. ");
                modified += " Let me know your thoughts in the comments! 👇";
                break;
            case "witty":
                modified = "Let's be honest: " + modified;
                modified = modified.replace("Free signature dessert", "Free dessert (because calories don't count on weekends)");
                modified = modified.replace("Results don't come", "Spoiler alert: Results don't come");
                modified += " 😉";
                break;
            case "professional":
                // Make it more formal
                modified = modified.replace(/🔥|🚀|👋|😉|👇|📲|🛍️|🍽️|🥞|☕/g, "");
                modified = "Dear customers, " + modified;
                modified = modified.replace("literally", "effectively");
                break;
        }
        return modified;
    },

    // Generate a full set of content items based on the active brand profile
    generateAllContent(brandInfo) {
        const niche = brandInfo.niche || "saas";
        const templateSet = BrandManager.templates[niche] || BrandManager.templates["saas"];
        const tone = brandInfo.tone || "bold";

        // 1. Generate Carousel Slides
        const carouselSlides = templateSet.carousel.map((slide, idx) => {
            return {
                id: idx + 1,
                title: this.applyToneShift(this.compileTemplate(slide.title, brandInfo), tone),
                body: this.compileTemplate(slide.body, brandInfo)
            };
        });

        // 2. Generate Post Captions
        const captions = templateSet.postCaptions.map(caption => {
            return this.applyToneShift(this.compileTemplate(caption, brandInfo), tone);
        });

        // 3. Generate UGC Script
        const ugcRaw = templateSet.ugcScript;
        const ugcScript = {
            hook: this.applyToneShift(this.compileTemplate(ugcRaw.hook, brandInfo), tone),
            body: this.compileTemplate(ugcRaw.body, brandInfo),
            cta: this.compileTemplate(ugcRaw.cta, brandInfo)
        };

        // 4. Generate Video Storyboard
        const storyboard = templateSet.videoStoryboard.map(step => {
            return {
                scene: step.scene,
                visual: this.compileTemplate(step.visual, brandInfo),
                audio: this.compileTemplate(step.audio, brandInfo),
                duration: step.duration
            };
        });

        // 5. Generate GMB Local update
        const gmbUpdateText = this.compileTemplate(templateSet.gmbUpdate, brandInfo);

        return {
            carouselSlides,
            captions,
            ugcScript,
            storyboard,
            gmbUpdateText
        };
    },

    // Generate a reply to customer review (SEO optimized)
    generateReviewReply(brandInfo, reviewText) {
        const name = brandInfo.name;
        const keywords = brandInfo.keywords.split(',')[0] || "great service";

        if (!reviewText || reviewText.trim() === "") {
            return `Hi! Thank you so much for your review. We are delighted to assist you at ${name} and offer our best features. We look forward to serving you again!`;
        }

        const isNegative = reviewText.toLowerCase().includes("bad") || 
                           reviewText.toLowerCase().includes("worst") || 
                           reviewText.toLowerCase().includes("slow") ||
                           reviewText.toLowerCase().includes("poor");

        if (isNegative) {
            return `Thank you for sharing your feedback with us. At ${name}, we take your experience seriously. We strive to offer top-tier ${keywords} and apologize for falling short. Please contact us directly so we can resolve this issue immediately.`;
        } else {
            return `Thank you so much for your positive review! We love hearing feedback from our valued customers. We are proud to provide excellent ${keywords} here at ${name}. Looking forward to seeing you again soon!`;
        }
    }
};
