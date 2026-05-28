// Brand Profile, API Keys, and Calendar Event State Manager for GrowthAura AI
const BrandManager = {
    geminiKey: "",
    brandProfile: {
        name: "Sharma Pharmacy",
        location: "Karelibaug, Vadodara",
        logo: "💊",
        themeColor: "#d4af37", // Default Gold accent
        niche: "Chemist & Pharmacy",
        services: "Prescription Drugs, Baby Care, Wellness Products, Home Delivery, Health Checkups",
        hours: "09:00 AM - 10:00 PM",
        contact: "+91 98765 43210",
        language: "Hinglish" // Hinglish, Hindi, English
    },
    scheduledEvents: [],

    init() {
        this.loadApiKey();
        this.loadBrandProfile();
        this.loadScheduledEvents();
    },

    saveApiKey(key) {
        this.geminiKey = key.trim();
        localStorage.setItem('growthaura_gemini_key', this.geminiKey);
        return this.geminiKey;
    },

    loadApiKey() {
        const saved = localStorage.getItem('growthaura_gemini_key');
        if (saved) {
            this.geminiKey = saved;
        }
        return this.geminiKey;
    },

    saveBrandProfile(profile) {
        this.brandProfile = { ...this.brandProfile, ...profile };
        localStorage.setItem('growthaura_brand_profile', JSON.stringify(this.brandProfile));
        return this.brandProfile;
    },

    loadBrandProfile() {
        const saved = localStorage.getItem('growthaura_brand_profile');
        if (saved) {
            try {
                this.brandProfile = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse cached brand profile.", e);
            }
        }
        return this.brandProfile;
    },

    saveScheduledEvents() {
        localStorage.setItem('growthaura_scheduled_events', JSON.stringify(this.scheduledEvents));
    },

    loadScheduledEvents() {
        const saved = localStorage.getItem('growthaura_scheduled_events');
        if (saved) {
            try {
                this.scheduledEvents = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse scheduled events.", e);
                this.scheduledEvents = [];
            }
        } else {
            // Default mock events
            this.scheduledEvents = [
                { id: 1, date: "2026-05-15", title: "Launch Poster", type: "poster" },
                { id: 2, date: "2026-05-20", title: "Reel: Organic Supplements", type: "video" }
            ];
        }
        return this.scheduledEvents;
    },

    addScheduledEvent(date, title, type) {
        const newEvent = {
            id: Date.now(),
            date: date,
            title: title,
            type: type
        };
        this.scheduledEvents.push(newEvent);
        this.saveScheduledEvents();
        return newEvent;
    },

    // Offline Indian localized templates for MSMEs
    fallbacks: {
        Hinglish: {
            poster: [
                "Bimar hain? Pharmacy ki line se bacho! {Name} in {Location} se order karein prescribed medicines aur wellness products, seedhe apne ghar par! 💊 Delivery ke liye call karein {Contact}.",
                "Aapki sehat, hamari zimmedari! {Name} lekar aaye hain original brands aur best quality medicines. Visit {Location} or call {Contact} for special discount code!",
                "Monsoon incoming! 🌧️ Apne wellness and immunity stocks ready rakho with health checks. {Name} is open now in {Location} till {Hours}!"
            ],
            storyboard: [
                {
                    scene: 1,
                    visual: "A busy customer looking worried while holding a prescription slip under the sun.",
                    audio: "Kya aap bhi medicine lines me ghanton khade rehte hain?",
                    music: "Confused, upbeat urban music, medium tempo."
                },
                {
                    scene: 2,
                    visual: "A smart delivery boy wearing a shirt with a green badge, handing over a package safely.",
                    audio: "Aba tension mat lo! Sharma Pharmacy delivers directly to your door in Karelibaug!",
                    music: "Inspiring acoustic chords."
                },
                {
                    scene: 3,
                    visual: "Showcasing baby products, wellness items, and a hand sanitizing station in the clean store.",
                    audio: "Sirf medicines hi nahi, baby care and wellness supplements bhi available.",
                    music: "Gentle humming track."
                },
                {
                    scene: 4,
                    visual: "The shop logo with contact phone number displayed on a bright neon badge.",
                    audio: "Apna prescription WhatsApp kijiye {Contact} par aur paaiye instant delivery. Health is Wealth!",
                    music: "Triumphant sound signature."
                }
            ],
            website: {
                headline: "Aapki Apni {Name}",
                tagline: "Trusted medicines and wellness essentials in {Location}",
                about: "Hum local community ko fast medicine delivery aur certified quality products deliver karte hain.",
                services: [
                    { name: "Prescription Delivery", cost: "Free (orders > ₹300)" },
                    { name: "Immunity Supplements", cost: "Starting at ₹150" },
                    { name: "Ayurvedic Products", cost: "Upto 15% Off" },
                    { name: "Blood Pressure Scan", cost: "Free Walk-in" }
                ],
                hours: "Dukaan Timing: {Hours}",
                contact: "WhatsApp ya Call: {Contact}"
            },
            presentation: [
                {
                    title: "{Name} Ke Baare Me",
                    bullet1: "Trusted medical pharmacy based out of {Location}.",
                    bullet2: "Focused on reliable home delivery of authentic health essentials.",
                    bullet3: "Serving 2,000+ local families with top customer ratings."
                },
                {
                    title: "Hum Kya Offer Karte Hain",
                    bullet1: "Fast home delivery under 45 minutes for prescriptions.",
                    bullet2: "Complete range of Ayurvedic remedies and pediatric supplies.",
                    bullet3: "Free health metrics and diagnostics support clinics."
                },
                {
                    title: "Aapka Growth Partnership",
                    bullet1: "Quality checks across certified suppliers only.",
                    bullet2: "Digital records management for returning patient orders.",
                    bullet3: "Contact {Contact} today for bulk health camps setup."
                }
            ]
        },
        Hindi: {
            poster: [
                "दवाइयों की कतार से पाएं छुटकारा! {Name} ({Location}) से पाएं घर बैठे असली दवाइयां। 💊 अभी संपर्क करें: {Contact}.",
                "स्वास्थ्य ही असली धन है! {Name} पर मिलेंगी सभी आवश्यक स्वास्थ्य सामग्री। आज ही पधारें या कॉल करें: {Hours}.",
                "क्या आपके पास आवश्यक इम्युनिटी सप्लीमेंट्स हैं? स्वस्थ भारत के लिए {Name} हमेशा तत्पर। आज ही {Location} स्टोर आएं।"
            ],
            storyboard: [
                {
                    scene: 1,
                    visual: "दवा की दुकान पर लंबी कतार में खड़े परेशान लोग।",
                    audio: "भीड़ में समय क्यों गंवाना जब स्वास्थ आपके द्वार आ सकता है?",
                    music: "धीमा और तनावपूर्ण संगीत।"
                },
                {
                    scene: 2,
                    visual: "मुस्कुराते हुए डिलीवरी बॉय का ग्राहक को पार्सल सौंपना।",
                    audio: "अब {Name} के साथ {Location} में पाएं तुरंत होम डिलीवरी।",
                    music: "उत्साहजनक बांसुरी की धुन।"
                },
                {
                    scene: 3,
                    visual: "साफ-सुथरे शेल्फ में सजी शिशु देखभाल और ओटीसी औषधियां।",
                    audio: "सभी प्रमाणित ब्रांड और ओटीसी उत्पाद एक ही छत के नीचे उपलब्ध।",
                    music: "सौम्य शांत धुन।"
                },
                {
                    scene: 4,
                    visual: "बैनर पर स्टोर का समय {Hours} और संपर्क सूत्र {Contact} चमक रहा है।",
                    audio: "आज ही संपर्क करें और स्वास्थ्य का नया सवेरा लाएं!",
                    music: "सकारात्मक अंत।"
                }
            ],
            website: {
                headline: "भरोसेमंद {Name}",
                tagline: "आपके स्वास्थ्य का साथी - {Location} में",
                about: "हम गुणवत्तापूर्ण औषधियां और शिशु स्वास्थ्य उत्पाद उचित दाम पर उपलब्ध कराते हैं।",
                services: [
                    { name: "घर पर दवाई पहुंचाना", cost: "निशुल्क (₹300 से ऊपर)" },
                    { name: "हर्बल और आयुर्वेदिक", cost: "10% छूट के साथ" },
                    { name: "रक्तचाप जांच", cost: "निशुल्क सेवा" }
                ],
                hours: "दुकान का समय: {Hours}",
                contact: "कॉल करें: {Contact}"
            },
            presentation: [
                {
                    title: "{Name} की यात्रा",
                    bullet1: "{Location} का सबसे भरोसेमंद मेडिकल स्टोर।",
                    bullet2: "उच्च गुणवत्ता की प्रमाणित दवाइयां उपलब्ध कराना हमारा संकल्प है।",
                    bullet3: "सैकड़ों परिवारों को स्वस्थ रहने में सहायक।"
                },
                {
                    title: "मुख्य सेवाएं",
                    bullet1: "तीव्र होम डिलीवरी 1 घंटे के भीतर।",
                    bullet2: "आयुर्वेदिक और वेलनेस कॉस्मेटिक्स की विस्तृत शृंखला।",
                    bullet3: "विशेषज्ञ परामर्श सुविधा स्टोर पर उपलब्ध।"
                },
                {
                    title: "हमसे जुड़ें",
                    bullet1: "व्हाट्सएप द्वारा आर्डर भेजने की आसान सुविधा।",
                    bullet2: "दुकान खुली रहने की अवधि: {Hours} रोजाना।",
                    bullet3: "अधिक जानकारी के लिए कॉल करें: {Contact}."
                }
            ]
        },
        English: {
            poster: [
                "Skip the chemist line! 💊 Order authentic medicines from {Name} in {Location} and enjoy doorstep delivery! Call {Contact} to place your order.",
                "Your wellness is our ultimate goal. Shop supplements, diagnostics, and OTC care at {Name}. Open now in {Location} till {Hours}.",
                "Looking for a chemist near you? Visit {Name} at {Location}. Certified pharmacists, prompt service, and flat discount codes. Reach out at {Contact}."
            ],
            storyboard: [
                {
                    scene: 1,
                    visual: "A close-up of a calendar ticking away, showing wasted hours in local chemist shops.",
                    audio: "Why spend your precious weekends waiting for essential medical stock?",
                    music: "Fast clock ticking sound, light synth background."
                },
                {
                    scene: 2,
                    visual: "A smart courier smiling and handling a package to a senior citizen.",
                    audio: "With {Name}, secure healthcare deliveries arrive right at your doorstep in {Location}.",
                    music: "Bright acoustic guitar riff."
                },
                {
                    scene: 3,
                    visual: "Various items like inhalers, multi-vitamins, and organic supplements showcased on glowing shelves.",
                    audio: "Access certified prescription products, baby nutrition, and first-aid kits securely.",
                    music: "Inspiring ambient flow."
                },
                {
                    scene: 4,
                    visual: "A banner displays WhatsApp order number {Contact} and operational window {Hours}.",
                    audio: "Save time, stay healthy. WhatsApp your prescription to {Contact} now!",
                    music: "Upbeat corporate jingle."
                }
            ],
            website: {
                headline: "Welcome to {Name}",
                tagline: "Your Premier Wellness Partner in {Location}",
                about: "Providing premium healthcare items, pharmaceutical drugs, and certified medical products to families.",
                services: [
                    { name: "Prescription Fulfillment", cost: "Free delivery" },
                    { name: "Vitamins & Minerals", cost: "10% off retail" },
                    { name: "Baby Care Essentials", cost: "Premium brands" },
                    { name: "Diagnostic Support", cost: "Book in-store" }
                ],
                hours: "Operational Hours: {Hours}",
                contact: "Call or WhatsApp: {Contact}"
            },
            presentation: [
                {
                    title: "About {Name}",
                    bullet1: "Premier healthcare vendor located in {Location}.",
                    bullet2: "Committed to delivering certified authentic medications.",
                    bullet3: "Focusing on local customer care and family health tracking."
                },
                {
                    title: "Our Core Services",
                    bullet1: "Same day courier delivery for all critical prescriptions.",
                    bullet2: "Dedicated wellness section with organic and Ayurvedic stocks.",
                    bullet3: "Experienced pharmacists present for clinical support."
                },
                {
                    title: "Contact & Location Details",
                    bullet1: "Centrally located at {Location} for walk-ins.",
                    bullet2: "Accepting digital prescriptions on WhatsApp number: {Contact}.",
                    bullet3: "Open daily from {Hours}."
                }
            ]
        }
    }
};

// Auto-initialize BrandManager
BrandManager.init();
