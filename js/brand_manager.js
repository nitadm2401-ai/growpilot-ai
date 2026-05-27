// Brand / Business Profile Manager for GrowPilot AI
const BrandManager = {
    // Current brand state
    currentBrand: {
        name: "GrowPilot AI",
        niche: "saas",
        description: "AI-powered social media generator and marketing assistant for small businesses.",
        audience: "Small business owners, digital marketers, agency managers",
        tone: "bold",
        keywords: "AI marketing, automation, social media posts, carousel builder, rank #1, local SEO",
        geminiKey: ""
    },

    // Save profile to localStorage
    saveProfile(profileData) {
        this.currentBrand = { ...this.currentBrand, ...profileData };
        localStorage.setItem('growpilot_brand_profile', JSON.stringify(this.currentBrand));
        // Dispatch custom event to notify UI
        window.dispatchEvent(new CustomEvent('brandProfileUpdated', { detail: this.currentBrand }));
        return this.currentBrand;
    },

    // Load profile from localStorage
    loadProfile() {
        const saved = localStorage.getItem('growpilot_brand_profile');
        if (saved) {
            try {
                this.currentBrand = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved brand profile, resetting to default.", e);
            }
        }
        return this.currentBrand;
    },

    // Industry templates database for realistic content simulations
    templates: {
        saas: {
            carousel: [
                {
                    title: "Unlock 10x Growth",
                    body: "Stop spending hours writing and designing posts. Let AI handle your marketing flow.",
                },
                {
                    title: "Automate Creation",
                    body: "Generate carousels, videos, copy, and GMB posts from a single brief.",
                },
                {
                    title: "Scale Local SEO",
                    body: "Rank #1 in Google Maps search with scheduled, optimized local updates.",
                },
                {
                    title: "Start Growing Today",
                    body: "Join thousands of smart businesses scaling with GrowPilot AI.",
                }
            ],
            postCaptions: [
                "🚀 Ready to take back your time? Stop spending hours creating content. GrowPilot AI lets you generate a week's worth of marketing assets—posts, reels, ads, and GMB updates—in under 5 minutes.\n\nType 'GROW' below to get early access! 👇\n\n#SaaS #GrowthHacking #DigitalMarketing #AIMarketing #Productivity",
                "Local business owners: Are you invisible on Google? 🙈\n\nIf you aren't posting regularly on Google My Business, your search ranking is slipping. GrowPilot automatically schedules SEO-optimized GMB updates to push you to the top of Google Maps.\n\nLearn how in our bio! 🔗\n\n#LocalSEO #GoogleMyBusiness #GMBSEO #BusinessGrowth #GrowPilot"
            ],
            ugcScript: {
                hook: "I used to spend 15 hours a week coding, designing, and scheduling posts for my startup. Now, I do it all in 60 seconds. Let me show you how.",
                body: "I just open this tool called {Name}. I type in my business info: '{Description}'. In seconds, it builds high-converting carousel designs, viral video hooks, and even posts to my Google My Business to bump my search rankings.",
                cta: "If you're a builder or marketer running out of time, head to the link in my bio to start with {Name} for free."
            },
            videoStoryboard: [
                { scene: "Scene 1: Hook", visual: "Creator looks stressed at laptop screen, hands in hair. Caption text on screen: 'Me spending 15 hours on social posts vs...'", audio: "Upbeat electronic drop", duration: "3s" },
                { scene: "Scene 2: Transition", visual: "Creator clicks single button on {Name} dashboard. Screen glows with custom carousel graphics. Text: 'Me using {Name} AI for 10 seconds.'", audio: "Smooth whoosh transition SFX", duration: "4s" },
                { scene: "Scene 3: Detail", visual: "Show close-up of dynamic carousel slides scrolling horizontally, looking ultra-premium.", audio: "Energetic synth melody", duration: "4s" },
                { scene: "Scene 4: Outro CTA", visual: "Creator points up to link. Caption: 'Link in bio to dominate social and Google My Business!'", audio: "Fade out", duration: "4s" }
            ],
            gmbUpdate: "Need to boost your digital marketing performance? {Name} helps businesses automate content creation and handle Google My Business postings seamlessly. Save time and rank higher today! Learn more on our website."
        },
        gym: {
            carousel: [
                {
                    title: "Build Your Best Self",
                    body: "No shortcuts, just consistency. Start your transformation journey today.",
                },
                {
                    title: "Expert Coaching",
                    body: "Personalized nutrition and strength guides designed specifically for your goals.",
                },
                {
                    title: "Modern Facilities",
                    body: "Clean workspaces, premium weights, cardio decks, and recovery spaces.",
                },
                {
                    title: "Claim Your Free Pass",
                    body: "Click the link in bio to book your assessment session today.",
                }
            ],
            postCaptions: [
                "💪 Consistency beats intensity every single time. It's not about working out for 4 hours once a week; it's about showing up for 45 minutes every day.\n\nTell us in the comments: What are you training today? 👇\n\n#FitnessGoals #GymLife #StrengthTraining #ConsistencyIsKey #WorkoutMotivation",
                "Results don't come from comfort zones. 🙅‍♂️\n\nOur certified personal trainers at {Name} are ready to help you shatter your plateaus and customize a program built around your busy schedule.\n\nClick the link in our bio to book your free consultation! 📲\n\n#PersonalTraining #FitnessJourney #WeightLossTips #HealthyLiving"
            ],
            ugcScript: {
                hook: "If you're still struggling to stay consistent with the gym, listen to this. I found a hack that changed everything.",
                body: "I started training at {Name}. The vibe here is incredible, the trainers actually teach you the 'why' behind workouts, and the custom nutrition tracker means you aren't starving yourself to get fit.",
                cta: "DM me the word 'FIT' and I'll send you a free 3-day pass to join me for a session."
            },
            videoStoryboard: [
                { scene: "Scene 1: Hook", visual: "Close up of sneaker stepping on chalk, tying laces. Text overlay: 'The secret to consistent gains isn't motivation...'", audio: "Heavy bass drum beat", duration: "3s" },
                { scene: "Scene 2: Action", visual: "Fast cuts of kettlebell swings, deadlifts, and rope pulls in a beautifully lit dark gym environment.", audio: "High-tempo motivational beat", duration: "5s" },
                { scene: "Scene 3: Vibe", visual: "Creator smiling, drinking protein shake, fist-bumping a coach.", audio: "Upbeat background synth", duration: "4s" },
                { scene: "Scene 4: Call to Action", visual: "Text overlay with logo: 'Stop waiting. Join {Name} today. Link in bio.'", audio: "Fade out", duration: "3s" }
            ],
            gmbUpdate: "Ready to kickstart your fitness goals? Join {Name}! We offer state-of-the-art equipment, personalized training, and a supportive community. Visit us today to claim your free day pass!"
        },
        restaurant: {
            carousel: [
                {
                    title: "Taste Perfection",
                    body: "Handcrafted dishes made from fresh, locally sourced organic ingredients.",
                },
                {
                    title: "Artisanal Recipes",
                    body: "Curated by expert chefs combining traditional tastes with modern twists.",
                },
                {
                    title: "The Perfect Vibe",
                    body: "Cozy lighting, rich music, and top-tier service for your date nights.",
                },
                {
                    title: "Reserve a Table",
                    body: "Link in bio to book online. Free signature dessert for first-time guests!",
                }
            ],
            postCaptions: [
                "✨ Dinner plans? Let us handle the cooking tonight. Indulge in our signature dishes made fresh to order using the finest local ingredients.\n\nTag the person you'd share this meal with! 🍽️👇\n\n#Foodiegram #GourmetFood #DateNightVibe #DinnerPlans #LocalEats",
                "Did someone say brunch? 🥞☕\n\nCelebrate the weekend with our freshly brewed single-origin coffee and artisanal pancakes. Serving hot from 8 AM to 2 PM.\n\nReserve your table at {Name} via the link in our bio! \n\n#BrunchGoals #CoffeeLovers #WeekendVibes #BreakfastTime #ChefSpecial"
            ],
            ugcScript: {
                hook: "Okay, I just found the absolute best cozy date night spot in town, and you need to put this on your list immediately.",
                body: "This is {Name}. The aesthetics are gorgeous, but the real star is their food. They use local organic ingredients, and this signature dish is literally heaven on a plate.",
                cta: "Save this post and share it with someone who owes you a dinner date here!"
            },
            videoStoryboard: [
                { scene: "Scene 1: Hook", visual: "Steaming hot, cheese-pull shot of a signature dish being served. Text: 'POV: You found the ultimate date spot...'", audio: "Sizzling SFX, smooth jazz track", duration: "3s" },
                { scene: "Scene 2: Experience", visual: "Slow panning shot of cocktails being shaken, cozy candlelight warm ambiance, friends laughing.", audio: "Classy ambient chatter & jazz", duration: "5s" },
                { scene: "Scene 3: Detail", visual: "Close up of chef placing a fresh garnish on a beautifully plated dessert.", audio: "Upbeat jazz crescendo", duration: "4s" },
                { scene: "Scene 4: Call to Action", visual: "Text overlay: 'Reserve your table at {Name}. Link in bio.'", audio: "Music fades out", duration: "3s" }
            ],
            gmbUpdate: "Craving something delicious? Come try our fresh seasonal menu at {Name}. We prioritize top-tier service, cozy ambiance, and healthy, flavorful dishes. Tap 'Call Now' to reserve your table!"
        },
        ecommerce: {
            carousel: [
                {
                    title: "Elevate Your Style",
                    body: "Premium, eco-friendly essentials designed to look good and last longer.",
                },
                {
                    title: "Thoughtful Details",
                    body: "Water-resistant fabrics, ergonomic fits, and deep hidden pockets.",
                },
                {
                    title: "Ethically Sourced",
                    body: "100% organic cotton and recycled packaging. Fashion that cares.",
                },
                {
                    title: "Shop the Collection",
                    body: "Use code 'GROW20' for 20% off your first order. Link in bio!",
                }
            ],
            postCaptions: [
                "🎒 Designed for the modern commuter. Made from water-resistant recycled fabrics, this pack carries your tech safely while maintaining a sleek, minimalist footprint.\n\nGet yours now with free global shipping! 🌍\n\n#MinimalistStyle #EcoFriendlyFashion #TravelGear #ProductDesign #StyleInspiration",
                "Why choose between style and durability? 🤷‍♀️\n\nOur latest collection at {Name} features premium, ethically sourced materials crafted to withstand daily grinds without wearing down.\n\nShop the drop at the link in bio! 🛍️\n\n#SustainableStyle #SlowFashion #OOTDGuide #ShopOnline"
            ],
            ugcScript: {
                hook: "I have been looking for the perfect everyday backpack for months, and I finally found one that doesn't look bulky.",
                body: "It's from {Name}. The compartment space is genius—there is a hidden TSA laptop sleeve, magnetic clasps, and it's fully waterproof. Plus, it's made from 100% recycled bottles.",
                cta: "Tap the link below to grab yours before they sell out again."
            },
            videoStoryboard: [
                { scene: "Scene 1: Hook", visual: "Creator opens a sleek matte black packaging box. Face lights up. Text: 'Unboxing the viral backpack from {Name}...'", audio: "Crisp cardboard unboxing sounds", duration: "3s" },
                { scene: "Scene 2: Demonstration", visual: "Close up of creator packing a laptop, water bottle, notepad, and sunglasses into individual pockets.", audio: "Pop beat kicks in", duration: "5s" },
                { scene: "Scene 3: Proof", visual: "Creator pours water directly onto the backpack; water beads and runs off instantly. Creator looks impressed.", audio: "Upbeat music swells", duration: "4s" },
                { scene: "Scene 4: Call to Action", visual: "Creator wearing the backpack walking away. Text overlay: 'Get 20% Off. Code: GROW20. Shop now.'", audio: "Music fades out", duration: "3s" }
            ],
            gmbUpdate: "Upgrade your daily essentials with our premium, sustainable gear at {Name}. Handcrafted for comfort, style, and long-lasting utility. Order online today and get free shipping on orders over $50!"
        },
        "real-estate": {
            carousel: [
                {
                    title: "Find Your Dream Home",
                    body: "Exclusive listings in top-rated school districts and vibrant neighborhoods.",
                },
                {
                    title: "Modern Architecture",
                    body: "Open floor plans, floor-to-ceiling windows, smart home integration.",
                },
                {
                    title: "Chef's Kitchens",
                    body: "Quartz countertops, professional gas ranges, and custom cabinetry.",
                },
                {
                    title: "Schedule a Tour",
                    body: "Contact our team to book a private viewing before this goes off the market.",
                }
            ],
            postCaptions: [
                "🏡 Welcome home. This stunning 4-bedroom, 3.5-bath modern estate offers the perfect balance of luxury and comfort, featuring a heated pool and custom smart home wiring.\n\nDM us for the listing details and address! 🔑\n\n#LuxuryRealEstate #DreamHome #HouseHunting #ModernHome #RealEstateAgent",
                "Thinking about selling your home in 2026? 📈\n\nNeighborhood demand is at an all-time high, but setting the right price is crucial. Our team at {Name} provides free, no-obligation valuation reports.\n\nClaim your free report at the link in bio! 📲\n\n#HomeValuation #RealEstateTips #SellingYourHome #PropertyMarket"
            ],
            ugcScript: {
                hook: "Tour this million-dollar modern farmhouse with me and wait until you see the hidden pantry in the kitchen.",
                body: "Located in the heart of the valley, this listing by {Name} is absolute goals. It has custom oak flooring, a massive primary suite with a spa-like bath, and a backyard designed for entertaining.",
                cta: "If you want the full listing link or want to book a private tour, comment 'TOUR' below!"
            },
            videoStoryboard: [
                { scene: "Scene 1: Hook", visual: "Sleek glass front door opens slowly, revealing a grand double-height foyer with a crystal chandelier.", audio: "Cinematic, inspiring orchestral melody", duration: "3s" },
                { scene: "Scene 2: High Points", visual: "Smooth drone shots panning over the outdoor fireplace, zero-edge pool, and the luxury designer kitchen.", audio: "Sophisticated ambient beats", duration: "5s" },
                { scene: "Scene 3: Feature Highlight", visual: "Close up of turning a dial and lighting up a hidden bar room with glowing LED accents.", audio: "Whoosh sounds, upbeat swell", duration: "4s" },
                { scene: "Scene 4: Call to Action", visual: "Agent smiling, holding keys. Text: 'Your dream home is waiting. Contact {Name}.'", audio: "Music fades", duration: "3s" }
            ],
            gmbUpdate: "Looking to buy or sell property in the area? The expert team at {Name} is here to guide you. We offer personalized market consultations and exclusive home tours. Tap 'Learn More' to connect with an agent!"
        }
    }
};
