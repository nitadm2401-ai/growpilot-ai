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
            avatarScript: "Hello friends! Main {Name} ki AI avatar bol rahi hu. Hum {Location} me best healthcare and items home delivery options offer karte hain. Dukaan timings daily {Hours} tak hain, toh ab medicine lines me line lagane ki tension kharab mat karo! Apne presciption ka photo WhatsApp screenshot bhejo hume {Contact} par aur fast home delivery pao. Aapki wellness hamari pratmikta hai. Thank you so much!",
            videos: {
                ugc: [
                    { scene: 1, visual: "Selfie video of a smiling customer pointing at their delivery package.", audio: "Hey guys! Dekho mera medicine stock packet time par aa gaya!", music: "Chill, relatable beat" },
                    { scene: 2, visual: "Zoom in on prescription medicines, showing official invoice.", audio: "Main hamesha {Name} se order karti hu, sab products 100% original hote hain.", music: "Acoustic casual" },
                    { scene: 3, visual: "Delivery boy waving and walking back to his motorcycle.", audio: "Fast delivery in {Location} and helpful team behavior is super cool.", music: "Acoustic casual" },
                    { scene: 4, visual: "Logo block overlay showing whatsapp number {Contact}.", audio: "Aap bhi try karo, just WhatsApp your prescriptions right now!", music: "Happy resolving bell" }
                ],
                promo: [
                    { scene: 1, visual: "Glowing discount banner displaying Flat 20% OFF and store name {Name}.", audio: "Dhamaka Offer Alert! Flat 20% Discount on your first order!", music: "Vibrant high energy synth" },
                    { scene: 2, visual: "Selection of wellness supplements, baby products, and vitamins.", audio: "Medicines ke sath products range par bhi discounts available hain.", music: "Upbeat energetic" },
                    { scene: 3, visual: "Delivery van rushing through the street lanes.", audio: "Free home delivery details in {Location} area details are open till {Hours}.", music: "Upbeat energetic" },
                    { scene: 4, visual: "CTA card with call logo and number {Contact}.", audio: "Bina time waste kiye call karein aur savings start karein!", music: "Catchy outro chords" }
                ],
                marketing: [
                    { scene: 1, visual: "Healthy happy grandparents playing with a toddler in the living room.", audio: "Aapki family ki acchi health hi aapki sabse badi success hai.", music: "Warm emotional piano" },
                    { scene: 2, visual: "Pharmacist neatly packing and checking medicines in safety gloves.", audio: "Isiliye {Name} laaye hain genuine brands and careful packaging system.", music: "Warm emotional piano" },
                    { scene: 3, visual: "Client walking inside the modern, welcoming shop in {Location}.", audio: "Hum care karte hain aapki convenience aur strict wellness norms ki.", music: "Inspiring ambient flow" },
                    { scene: 4, visual: "Logo of {Name} with call-to-action to visit till {Hours}.", audio: "Apni wellness partner ko call karein {Contact} par.", music: "Soft guitar resolve" }
                ],
                tutorial: [
                    { scene: 1, visual: "Close up of a mobile screen showing WhatsApp contact list.", audio: "{Name} se home delivery order karna bahut hi simple hai. Chalo seekhein!", music: "Upbeat instructional synth" },
                    { scene: 2, visual: "Finger tapping 'Attach Document' icon and selecting prescription photo.", audio: "Step 1: Apne prescription ki photo click karein aur WhatsApp par send karein.", music: "Upbeat instructional synth" },
                    { scene: 3, visual: "Delivery boy ring the doorbell, handing over package safely.", audio: "Step 2: Hamara rider orders check karke direct aapke address par deliver karega.", music: "Calm instructional synth" },
                    { scene: 4, visual: "Mobile overlay showing order verification tick mark.", audio: "Toh ab medicine queue lines ko bolo bye! Call aur WhatsApp contact hume: {Contact}.", music: "Positive chime" }
                ],
                product: [
                    { scene: 1, visual: "Glowing product showcase of a winter immunity booster pack.", audio: "Kya aapki immunity monsoon ready hai? Check this product range!", music: "Premium commercial pop" },
                    { scene: 2, visual: "Close up of label details: certified ingredients and vitamins.", audio: "{Name} introduces special wellness packs containing herbal vitamins.", music: "Premium commercial pop" },
                    { scene: 3, visual: "Neat row of health supplement bottles inside clean store shelves.", audio: "Available walk-in in {Location} or get it delivered at home.", music: "Trendy rhythm loop" },
                    { scene: 4, visual: "Promo graphic with logo and delivery details, dial {Contact}.", audio: "Apna immunity pack aaj hi secure karein. We are open till {Hours}!", music: "Triumphant electronic note" }
                ]
            },
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
            avatarScript: "नमस्ते! मैं {Name} की एआई प्रवक्ता हूँ। हमारे स्टोर पर आपको मिलेंगी उच्च गुणवत्ता की दवाइयां और स्वास्थ्यवर्धक उत्पाद। कतारों को अलविदा कहें, और सीधे हमारे व्हाट्सएप नंबर {Contact} पर अपनी पर्ची भेजकर घर बैठे दवाइयां मंगाएं। दुकान का समय रोज सुबह से रात {Hours} तक है। आपकी सेवा करना हमारा सौभाग्य है। धन्यवाद!",
            videos: {
                ugc: [
                    { scene: 1, visual: "संतुष्ट ग्राहक अपने घर के द्वार पर डिलीवरी पार्सल दिखा रहा है।", audio: "नमस्ते दोस्तों! देखिये {Name} से मेरी दवाइयां बिल्कुल समय पर आ गईं।", music: "हल्की मधुर धुन" },
                    { scene: 2, visual: "पार्सल की पैकिंग खोलकर दिखाई जा रही मूल दवाइयां।", audio: "पैकेजिंग बहुत अच्छी है और दवाइयां भी बिल्कुल असली हैं।", music: "बांसुरी की संगत" },
                    { scene: 3, visual: "मुस्कुराता हुआ डिलीवरी कर्मी वापस लौट रहा है।", audio: "मुझे {Location} में इनकी होम डिलीवरी सेवा बहुत पसंद आई।", music: "बांसुरी की संगत" },
                    { scene: 4, visual: "स्क्रीन पर {Contact} संपर्क सूत्र प्रदर्शित हो रहा है।", audio: "आप भी कतारों से बचें और आज ही आर्डर करें!", music: "सकारात्मक अंत" }
                ],
                promo: [
                    { scene: 1, visual: "लाल और सुनहरे रंग का धमाका ऑफर बैनर - २०% की छूट।", audio: "विशेष सूचना! पहले आर्डर पर पाएं फ्लैट २०% की भारी छूट।", music: "ऊर्जावान ढोल की थाप" },
                    { scene: 2, visual: "विभिन्न बेबी केयर और हेल्थ टॉनिक बोतलों का दृश्य।", audio: "दवाइयों के साथ सभी वेलनेस प्रोडक्ट्स पर भी छूट उपलब्ध।", music: "उत्साहजनक बीट्स" },
                    { scene: 3, visual: "स्टोर का पता {Location} और संपर्क सूत्र {Contact} चमक रहा है।", audio: "स्टोर रोजाना {Hours} तक खुला रहता है, तुरंत लाभ उठाएं।", music: "उत्साहजनक बीट्स" },
                    { scene: 4, visual: "कॉल टू एक्शन बटन - अभी कॉल करें।", audio: "बिना किसी देरी के कॉल करें और अपनी दवाइयां मंगाएं।", music: "अंतिम स्वर धुन" }
                ],
                marketing: [
                    { scene: 1, visual: "वरिष्ठ नागरिक पार्क में टहलते हुए हंस रहे हैं।", audio: "आपके माता-पिता और बच्चों का स्वास्थ्य आपकी सबसे बड़ी पूंजी है।", music: "धीमी भावुक पियानो" },
                    { scene: 2, visual: "फार्मासिस्ट सुरक्षा नियमों के साथ पार्सल तैयार कर रहा है।", audio: "इसीलिए {Name} प्रदान करते हैं केवल प्रमाणित एवं सुरक्षित दवाइयां।", music: "धीमी भावुक पियानो" },
                    { scene: 3, visual: "सजे हुए शेल्फ और साफ़-सुथरा स्टोर परिवेश।", audio: "हम {Location} में स्वास्थ्य सेवाओं को सुलभ बनाने के लिए संकल्पित हैं।", music: "शांत वाद्य संगीत" },
                    { scene: 4, visual: "स्टोर का नाम {Name} और मोबाइल नंबर {Contact} का बैनर।", audio: "आज ही अपने विश्वसनीय साथी से जुड़ें।", music: "सद्भावपूर्ण संगीत" }
                ],
                tutorial: [
                    { scene: 1, visual: "स्मार्टफोन स्क्रीन पर व्हाट्सएप एप खोलते हुए उंगली।", audio: "घर बैठे दवाइयां आर्डर करना बहुत ही आसान है, आइये सीखें।", music: "मार्गदर्शक इलेक्ट्रॉनिक धुन" },
                    { scene: 2, visual: "पर्चे की साफ़ फोटो खींचने का प्रदर्शन।", audio: "पहले डॉक्टर के पर्चे की एक साफ़ फोटो खींचें।", music: "मार्गदर्शक इलेक्ट्रॉनिक धुन" },
                    { scene: 3, visual: "व्हाट्सएप चैट में फोटो सेंड करने का स्क्रीनशॉट।", audio: "अब इस फोटो को हमारे व्हाट्सएप नंबर {Contact} पर भेज दें।", music: "धीमी इलेक्ट्रॉनिक धुन" },
                    { scene: 4, visual: "डिलीवरी बॉय ग्राहक को बैग सौंपते हुए मुस्कुरा रहा है।", audio: "बस! हमारा प्रतिनिधि आपके घर {Location} में दवाइयां पहुंचा देगा।", music: "चिम संगीत" }
                ],
                product: [
                    { scene: 1, visual: "इम्युनिटी किट और काढ़े के पैक का क्लोज-अप।", audio: "क्या आपने बदलते मौसम के लिए इम्युनिटी किट तैयार की है?", music: "उत्कृष्ट वाद्य धुन" },
                    { scene: 2, visual: "फार्मासिस्ट द्वारा किट के फायदों को बताने का दृश्य।", audio: "{Name} लाएं हैं प्रमाणित आयुर्वेदिक इम्युनिटी बूस्टर्स।", music: "उत्कृष्ट वाद्य धुन" },
                    { scene: 3, visual: "स्टोर का प्रवेश द्वार और साफ़ सुथरी डिस्पेंसरी।", audio: "आज ही {Location} स्टोर आएं या होम डिलीवरी पाएं।", music: "आधुनिक रिदम" },
                    { scene: 4, visual: "कॉल करें - {Contact} और दुकान का समय {Hours}।", audio: "अपने परिवार को स्वस्थ रखें, आज ही संपर्क करें।", music: "उत्साहपूर्ण अंत" }
                ]
            },
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
            avatarScript: "Hello and welcome! I am the AI avatar presenter representing {Name} in {Location}. We are committed to serving our local neighborhood with authentic medicines, baby products, and reliable healthcare essentials. We are open daily during the window {Hours}. Avoid crowded store lines, send a photo of your prescription directly via WhatsApp at {Contact}, and enjoy express doorstep shipping. Thank you for choosing us!",
            videos: {
                ugc: [
                    { scene: 1, visual: "Close up of a customer smiling and showing the delivery receipt.", audio: "Look what just arrived! Safe home delivery from {Name}!", music: "Upbeat ambient pop" },
                    { scene: 2, visual: "Unboxing the package to reveal neatly wrapped medicines.", audio: "The items are carefully packed with seal-verified original cards.", music: "Warm acoustic" },
                    { scene: 3, visual: "The friendly courier waving and walking outside the house.", audio: "Super fast and reliable service in {Location} area.", music: "Warm acoustic" },
                    { scene: 4, visual: "Text overlay showing the logo and hotline {Contact}.", audio: "Go check them out! Text your script or orders now.", music: "Corporate finish chime" }
                ],
                promo: [
                    { scene: 1, visual: "Vibrant yellow discount tags sliding on screen: Flat 20% Off.", audio: "Limited Time Promotion! Grab a flat 20% discount on all wellness stocks!", music: "Energetic house beat" },
                    { scene: 2, visual: "Array of premium multi-vitamins and baby care essentials.", audio: "Applies to both prescriptions and daily baby care items.", music: "Energetic house beat" },
                    { scene: 3, visual: "Store logo with location {Location} and schedule details.", audio: "We are open daily till {Hours}. Stop by or get home shipping.", music: "Trendy synth background" },
                    { scene: 4, visual: "Call to Action button with telephone icons and number {Contact}.", audio: "Call now to place your delivery orders instantly!", music: "Bright electronic resolve" }
                ],
                marketing: [
                    { scene: 1, visual: "An elderly couple smiling and walking comfortably in a park.", audio: "Keeping your loved ones healthy is your number one priority.", music: "Sentimental piano background" },
                    { scene: 2, visual: "Pharmacist wearing a face-shield and safely checking labels.", audio: "That's why {Name} provides 100% certified authentic medical stock.", music: "Sentimental piano background" },
                    { scene: 3, visual: "Walkthrough of clean store shelves and active display boards.", audio: "Serving the local community in {Location} with trust and care.", music: "Inspiring ambient" },
                    { scene: 4, visual: "Logo block overlay showing operational hours till {Hours}.", audio: "Visit us today or call our pharmacist at {Contact}.", music: "Soft guitar tone" }
                ],
                tutorial: [
                    { scene: 1, visual: "Close up of a thumb launching a mobile messaging client.", audio: "Ordering your prescription from {Name} takes only 3 steps. Let's show you!", music: "Helpful tech synth" },
                    { scene: 2, visual: "Capturing a clear photo of prescription details with the camera.", audio: "Step 1: Take a clear photo of your doctor's official prescription note.", music: "Helpful tech synth" },
                    { scene: 3, visual: "Selecting the photo and typing name in WhatsApp chat.", audio: "Step 2: WhatsApp the image directly to our team at {Contact}.", music: "Helpful tech synth" },
                    { scene: 4, visual: "Rider delivering package at door, user signing screen.", audio: "Step 3: Receive safe delivery at your door in {Location}. Simple!", music: "Friendly chime" }
                ],
                product: [
                    { scene: 1, visual: "A revolving display of premium organic wellness supplement bottles.", audio: "Boost your daily nutrition with our premium wellness range.", music: "Modern upbeat rhythm" },
                    { scene: 2, visual: "Close up of the back label detailing FDA approval and vitamins.", audio: "We source certified organic and plant-based supplements.", music: "Modern upbeat rhythm" },
                    { scene: 3, visual: "Display shelves showing multivitamin boxes inside the shop.", audio: "Now in stock at our store in {Location} or for home delivery.", music: "Rhythmic bass loop" },
                    { scene: 4, visual: "Contact banner with hours {Hours} and dial number {Contact}.", audio: "Consult our pharmacist today and secure your wellness kits!", music: "Energetic ending chord" }
                ]
            },
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
