import React, { createContext, useContext, useState, useEffect } from 'react';
export const translations = {
    // Navigation & Header
    home: { en: 'Home', si: 'මුල් පිටුව', ta: 'முகப்பு' },
    findCaregivers: { en: 'Find Caregivers', si: 'සත්කාරකයින් සොයන්න', ta: 'பராமரிப்பாளர்களைத் தேடுங்கள்' },
    forCaregivers: { en: 'For Caregivers', si: 'සත්කාරකයින් සඳහා', ta: 'பராமரிப்பாளர்களுக்காக' },
    forAgencies: { en: 'For Agencies', si: 'ආයතන සඳහා', ta: 'நிறுவனங்களுக்காக' },
    agenciesDirectory: { en: 'Agencies', si: 'සත්කාර ආයතන', ta: 'நிறுவனங்கள்' },
    howItWorks: { en: 'How It Works', si: 'ක්‍රියා කරන ආකාරය', ta: 'செயல்படும் முறை' },
    login: { en: 'Login', si: 'ඇතුල් වන්න', ta: 'உள்நுழைக' },
    register: { en: 'Register', si: 'ලියාපදිංචි වන්න', ta: 'பதிவு செய்ய' },
    dashboard: { en: 'Dashboard', si: 'පාලක පුවරුව', ta: 'முகப்பு பலகை' },
    logout: { en: 'Logout', si: 'ඉවත් වන්න', ta: 'வெளியேறு' },
    adminPanel: { en: 'Admin Panel', si: 'පරිපාලක පුවරුව', ta: 'நிர்வாக பலகை' },
    role: { en: 'Role', si: 'භූමිකාව', ta: 'பங்கு' },
    demoPortals: { en: 'Demo Portals', si: 'ආදර්ශ ගිණුම්', ta: 'மாதிரி கணக்குகள்' },
    familyClient: { en: 'Family / Patient (Ravi)', si: 'පවුල / රෝගී පාර්ශවය (රවී)', ta: 'குடும்பம் / நோயாளி (ரவி)' },
    caregiverNadeesha: { en: 'Caregiver (Nadeesha)', si: 'සත්කාරක (නදීෂා)', ta: 'பராமரிப்பாளர் (நதீஷா)' },
    agencySuwasevana: { en: 'Agency (Suwasevana)', si: 'ආයතනය (සුවසෙවණ)', ta: 'நிறுவனம் (சுவசேவன)' },
    hireLankaAdmin: { en: 'HireLanka Admin', si: 'HireLanka පරිපාලක', ta: 'நிர்வாகி' },
    emergencyNotice: {
        en: 'Sri Lanka 24/7 Hospital Caregiver Dispatch',
        si: 'ශ්‍රී ලංකා 24/7 රෝහල් සත්කාරක සේවාව',
        ta: 'இலங்கை 24/7 மருத்துவமனை பராமரிப்பாளர் சேவை'
    },
    call247: {
        en: 'Call 24/7: 1990 / +94 11 269 1111',
        si: 'අමතන්න 24/7: 1990 / +94 11 269 1111',
        ta: 'அழைக்க 24/7: 1990 / +94 11 269 1111'
    },
    // Hero Section
    heroTitle1: {
        en: 'Compassionate Care that Feels',
        si: 'රෝහලේදීම නිවසක් වැනි',
        ta: 'வீட்டைப் போன்ற அன்பான'
    },
    heroTitleHighlight: {
        en: 'Like Home',
        si: 'සෙනෙහෙබර සත්කාරය',
        ta: 'பராமரிப்பு சேவை'
    },
    heroSubtitle: {
        en: "Professional senior care and hospital bedside attendants designed around your loved one's unique clinical needs, delivered with dignity, respect, and warmth across Sri Lanka.",
        si: 'ඔබේ ආදරණීය රෝගීන්ට ගෞරවයෙන් සහ කරුණාවෙන් පිරිපුන් රෝහල් ඇඳ ළඟ සත්කාරක සහ හෙද සහායක සේවාවන් ශ්‍රී ලංකාව පුරා ලබා ගන්න.',
        ta: 'உங்கள் அன்புக்குரிய நோயாளிகளுக்கு கண்ணியமான, மரியாதையான மற்றும் அன்பான மருத்துவமனை கட்டில் அருகாமை பராமரிப்பு சேவைகள் இலங்கை முழுவதும்.'
    },
    scheduleConsultation: {
        en: 'Find a Caregiver',
        si: 'සත්කාරකයෙකු සොයන්න',
        ta: 'பராமரிப்பாளரைக் கண்டறியவும்'
    },
    policeIdVerified: {
        en: 'Police & ID Verified',
        si: 'පොලිස් හා හැඳුනුම්පත් තහවුරු කළ',
        ta: 'காவல்துறை & அடையாள அட்டை சரிபார்க்கப்பட்டது'
    },
    directWhatsAppContact: {
        en: 'Direct WhatsApp Contact',
        si: 'සෘජු WhatsApp සම්බන්ධතාවය',
        ta: 'நேரடி WhatsApp தொடர்பு'
    },
    transparentLkrRates: {
        en: 'Transparent LKR Rates',
        si: 'පැහැදිලි රුපියල් මිල ගණන්',
        ta: 'வெளிப்படையான ரூபாய் கட்டணம்'
    },
    // Search Widget
    quickHospitalSearch: {
        en: 'Find Caregivers Near Your Sri Lankan Hospital',
        si: 'ඔබේ රෝහල අසල සිටින සත්කාරකයින් සොයන්න',
        ta: 'உங்கள் மருத்துவமனைக்கு அருகிலுள்ள பராமரிப்பாளர்களைக் கண்டறியவும்'
    },
    govPrivateHospitals: {
        en: 'Government Teaching & Private Hospitals',
        si: 'රජයේ ශික්ෂණ සහ පෞද්ගලික රෝහල්',
        ta: 'அரசு போதனா & தனியார் மருத்துவமனைகள்'
    },
    selectHospitalOrDistrict: {
        en: 'Select Hospital or District',
        si: 'රෝහල හෝ දිස්ත්‍රික්කය තෝරන්න',
        ta: 'மருத்துவமனை அல்லது மாவட்டத்தைத் தேர்ந்தெடுக்கவும்'
    },
    hospitalSearchPlaceholder: {
        en: 'Type NHSL, Kalubowila, Ragama, Kandy, Karapitiya, Asiri...',
        si: 'NHSL, කළුබෝවිල, රාගම, මහනුවර, කරාපිටිය, ආසිරි...',
        ta: 'NHSL, களுபோவில, ராகம, கண்டி, கராப்பிட்டிய, ஆசிரி...'
    },
    shiftCoverage: {
        en: 'Shift Coverage',
        si: 'සේවා මුරය',
        ta: 'பணி நேரம்'
    },
    maxBudget: {
        en: 'Max Budget',
        si: 'උපරිම ගාස්තුව',
        ta: 'அதிகபட்ச கட்டணம்'
    },
    searchBtn: {
        en: 'Search Caregivers',
        si: 'සත්කාරකයින් සොයන්න',
        ta: 'பராமரிப்பாளர்களைத் தேடுங்கள்'
    },
    // Service & Shift Types
    whole_day: {
        en: 'Full Day Care (24h/12h)',
        si: 'සම්පූර්ණ දින සත්කාරය (පැය 24/12)',
        ta: 'முழு நாள் பராமரிப்பு (24ம/12ம)'
    },
    nights: {
        en: 'Night Care Shift (12h)',
        si: 'රාත්‍රී සත්කාරක මුරය (පැය 12)',
        ta: 'இரவு நேர பராமரிப்பு (12ம)'
    },
    half_day_morning: {
        en: 'Morning Shift (6h)',
        si: 'උදෑසන සේවා මුරය (පැය 6)',
        ta: 'காலை நேர பணி (6ம)'
    },
    half_day_afternoon: {
        en: 'Afternoon Shift (6h)',
        si: 'සවස් සේවා මුරය (පැය 6)',
        ta: 'மாலை நேர பணி (6ம)'
    },
    half_day: {
        en: 'Half Day Shift',
        si: 'අර්ධ දින සත්කාරය',
        ta: 'அரை நாள் பணி'
    },
    allShifts: {
        en: 'All Shifts',
        si: 'සියලුම සේවා මුර',
        ta: 'அனைத்து பணிகளும்'
    },
    // Story & Mission Section
    dedicatedToFamilies: {
        en: 'Dedicated to Sri Lankan Families',
        si: 'ශ්‍රී ලාංකික පවුල් වෙනුවෙන් කැපවූ',
        ta: 'இலங்கைக் குடும்பங்களுக்காக அர்ப்பணிக்கப்பட்டது'
    },
    storyTitle: {
        en: 'Dedicated to Enriching Hospital & Home Care',
        si: 'රෝහල් හා නිවෙස් රෝගී සත්කාරය පහසු කිරීම අපගේ අරමුණයි',
        ta: 'மருத்துவமனை மற்றும் இல்ல பராமரிப்பை மேம்படுத்துவதில் அர்ப்பணிப்பு'
    },
    storyText: {
        en: 'Hospital admissions in Sri Lanka are stressful. Families often scramble to find bedside attendants to help feed, bathe, and monitor their loved ones. HireLanka Care gives you direct access to trustworthy caregivers in minutes.',
        si: 'රෝහල්ගත වූ විට රෝගියාට කෑම කැවීම, නෑවීම සහ රැකබලා ගැනීමට විශ්වාසදායක සත්කාරකයෙකු සොයා ගැනීම පවුලකට විශාල අභියෝගයකි. HireLanka Care මඟින් මිනිත්තු කිහිපයකින් සෘජුවම සත්කාරකයින් සම්බන්ධ කර ගත හැක.',
        ta: 'மருத்துவமனையில் அனுமதிக்கப்படும் போது நோயாளிகளுக்கு உணவளிக்க, குளிப்பாட்ட மற்றும் கவனிக்க நம்பகமான உதவியாளரைக் கண்டறிவது கடினம். HireLanka Care மூலம் சில நிமிடங்களில் நேரடியாக அவர்களைத் தொடர்பு கொள்ளலாம்.'
    },
    card1Title: {
        en: 'Verified Sri Lankan Caregivers',
        si: 'තහවුරු කළ සත්කාරකයින්',
        ta: 'சரிபார்க்கப்பட்ட பராமரிப்பாளர்கள்'
    },
    card1Desc: {
        en: 'Every profile is checked against National Identity Cards and Sri Lanka Police clearance before receiving the verified badge.',
        si: 'සෑම පැතිකඩක්ම ජාතික හැඳුනුම්පත සහ පොලිස් නිෂ්කාශන වාර්තා පරීක්ෂා කර තහවුරු කරනු ලැබේ.',
        ta: 'ஒவ்வொரு விபரமும் தேசிய அடையாள அட்டை மற்றும் காவல்துறை சான்றிதழ் மூலம் சரிபார்க்கப்படுகிறது.'
    },
    card2Title: {
        en: 'Transparent Daily LKR Pricing',
        si: 'පැහැදිලි රුපියල් මිල ගණන්',
        ta: 'வெளிப்படையான ரூபாய் கட்டணம்'
    },
    card2Desc: {
        en: 'No agency surcharges or platform cuts. Daily rates (Rs. 3,500 – Rs. 6,500) and shift fees are paid directly to the caregiver.',
        si: 'මැදිහත්කරුවන්ගේ අමතර ගාස්තු නැත. දෛනික ගාස්තු (රු. 3,500 – රු. 6,500) සෘජුවම සත්කාරකයාට ගෙවිය හැක.',
        ta: 'கூடுதல் தரகு கட்டணங்கள் இல்லை. தினசரி கட்டணங்களை (ரூ. 3,500 – ரூ. 6,500) நேரடியாக பராமரிப்பாளருக்கு செலுத்தலாம்.'
    },
    card3Title: {
        en: 'Direct WhatsApp & Phone Contact',
        si: 'සෘජු WhatsApp සහ දුරකථන ඇමතුම්',
        ta: 'நேரடி WhatsApp & தொலைபேசி அழைப்பு'
    },
    card3Desc: {
        en: 'Connect instantly via WhatsApp or direct phone call. Discuss hospital ward number, patient mobility, and shift hours directly.',
        si: 'WhatsApp හෝ දුරකථනය හරහා සෘජුවම අමතා රෝහල් වාට්ටු අංකය, රෝගියාගේ තත්ත්වය සහ වේලාවන් සාකච්ඡා කරන්න.',
        ta: 'WhatsApp அல்லது தொலைபேசி மூலம் நேரடியாகப் பேசி மருத்துவமனை வார்டு, நோயாளியின் நிலை மற்றும் நேரங்களை முடிவு செய்யுங்கள்.'
    },
    // Featured Caregivers Section
    topRatedCaregivers: {
        en: 'Top Rated Hospital Caregivers',
        si: 'ඉහළම ඇගයීම් ලත් රෝහල් සත්කාරකයින්',
        ta: 'உயர்ந்த மதிப்பீடு பெற்ற மருத்துவமனை பராமரிப்பாளர்கள்'
    },
    topRatedSubtitle: {
        en: 'Experienced, vetted bedside attendants ready for immediate hospital placement.',
        si: 'වහාම සේවයට ලබා ගත හැකි පළපුරුදු, තහවුරු කළ රෝහල් සත්කාරකයින්.',
        ta: 'உடனடி சேவைக்குத் தயாராக உள்ள அனுபவமிக்க பராமரிப்பாளர்கள்.'
    },
    viewAllProviders: {
        en: 'View All Providers',
        si: 'සියලු සත්කාරකයින් බලන්න',
        ta: 'அனைத்து பராமரிப்பாளர்களையும் பார்க்க'
    },
    // Agency Banner
    agencyBannerTitle: {
        en: 'Are You a Registered Care Agency in Sri Lanka?',
        si: 'ඔබ ලියාපදිංචි සත්කාරක ආයතනයක්ද?',
        ta: 'நீங்கள் பதிவு செய்யப்பட்ட பராமரிப்பு நிறுவனமா?'
    },
    agencyBannerSubtitle: {
        en: 'Reach more hospital patient families across Colombo, Kandy, Galle, and all 9 provinces. Showcase your nursing aides and manage direct inquiries.',
        si: 'කොළඹ, මහනුවර, ගාල්ල ඇතුළු මුළු දිවයින පුරා සිටින රෝගී පවුල් වෙත ඔබගේ හෙද සහායක සේවාවන් ලබා දෙන්න.',
        ta: 'கொழும்பு, கண்டி, காலி உட்பட நாடு முழுவதிலும் உள்ள குடும்பங்களைச் சென்றடைந்து உங்கள் உதவியாளர்களை அறிமுகப்படுத்துங்கள்.'
    },
    listYourAgency: {
        en: 'List Your Agency',
        si: 'ඔබේ ආයතනය ලියාපදිංචි කරන්න',
        ta: 'உங்கள் நிறுவனத்தைப் பதிவு செய்க'
    },
    // Testimonials
    testimonialsTitle: {
        en: 'Trusted by Families Across Sri Lanka',
        si: 'ශ්‍රී ලාංකික පවුල්වල විශ්වාසය',
        ta: 'இலங்கைக் குடும்பங்களின் நம்பிக்கை'
    },
    testimonialsSubtitle: {
        en: 'Real feedback from families who found hospital attendants through HireLanka Care.',
        si: 'HireLanka Care හරහා සත්කාරකයින් සොයාගත් පවුල්වල සැබෑ අදහස්.',
        ta: 'HireLanka Care மூலம் பராமரிப்பாளர்களைக் கண்டறிந்த குடும்பங்களின் உண்மையான கருத்துகள்.'
    },
    // Find Caregivers Page (Search & Filters)
    findAProviderTitle: {
        en: 'Find a Hospital Caregiver',
        si: 'රෝහල් සත්කාරකයෙකු සොයන්න',
        ta: 'மருத்துவமனை பராமரிப்பாளரைக் கண்டறியவும்'
    },
    findAProviderSubtitle: {
        en: 'Browse bedside attendants, compare daily rates in LKR, and contact directly via WhatsApp.',
        si: 'රෝහල් ඇඳ ළඟ සත්කාරකයින් සසඳා බලා WhatsApp මඟින් සෘජුවම සම්බන්ධ කර ගන්න.',
        ta: 'கட்டில் அருகாமை பராமரிப்பாளர்களை ஒப்பிட்டு WhatsApp மூலம் நேரடியாகத் தொடர்பு கொள்ளுங்கள்.'
    },
    filterByHospital: {
        en: 'Filter by Hospital',
        si: 'රෝහල අනුව සොයන්න',
        ta: 'மருத்துவமனை மூலம் வடிகட்டவும்'
    },
    filterByDistrict: {
        en: 'District',
        si: 'දිස්ත්‍රික්කය',
        ta: 'மாவட்டம்'
    },
    allDistricts: {
        en: 'All Districts',
        si: 'සියලු දිස්ත්‍රික්ක',
        ta: 'அனைத்து மாவட்டங்கள்'
    },
    genderPreference: {
        en: 'Caregiver Gender',
        si: 'ස්ත්‍රී / පුරුෂ භාවය',
        ta: 'பாலினம்'
    },
    allGenders: {
        en: 'Any Gender',
        si: 'ඕනෑම අයෙකු',
        ta: 'எந்த பாலினமும்'
    },
    femaleCaregivers: {
        en: 'Female Only',
        si: 'කාන්තා පමණි',
        ta: 'பெண்கள் மட்டும்'
    },
    maleCaregivers: {
        en: 'Male Only',
        si: 'පිරිමි පමණි',
        ta: 'ஆண்கள் மட்டும்'
    },
    careType: {
        en: 'Shift Type',
        si: 'සේවා මුර වර්ගය',
        ta: 'பணி வகை'
    },
    nightCareOnly: {
        en: 'Night Shift Available',
        si: 'රාත්‍රී සත්කාරය ලබාගත හැකි',
        ta: 'இரவுப் பணி கிடைக்கும்'
    },
    priceRange: {
        en: 'Daily Rate (LKR)',
        si: 'දෛනික ගාස්තුව (රු.)',
        ta: 'தினசரி கட்டணம் (ரூ.)'
    },
    clearFilters: {
        en: 'Clear All Filters',
        si: 'පෙරහන් ඉවත් කරන්න',
        ta: 'வடிகட்டிகளை அழிக்க'
    },
    providersFound: {
        en: 'caregivers found',
        si: 'සත්කාරකයින් හමු විය',
        ta: 'பராமரிப்பாளர்கள் உள்ளனர்'
    },
    sortBy: {
        en: 'Sort by:',
        si: 'පිළිවෙල:',
        ta: 'வரிசைப்படுத்து:'
    },
    relevance: {
        en: 'Recommended',
        si: 'නිර්දේශිත',
        ta: 'பரிந்துரைக்கப்பட்ட'
    },
    highestRated: {
        en: 'Highest Rated',
        si: 'ඉහළම ඇගයීම්',
        ta: 'உயர்ந்த மதிப்பீடு'
    },
    feeLowToHigh: {
        en: 'Rate: Low to High',
        si: 'ගාස්තුව: අඩු සිට වැඩි',
        ta: 'கட்டணம்: குறைவு முதல் அதிகம்'
    },
    feeHighToLow: {
        en: 'Rate: High to Low',
        si: 'ගාස්තුව: වැඩි සිට අඩු',
        ta: 'கட்டணம்: அதிகம் முதல் குறைவு'
    },
    noCaregiversFound: {
        en: 'No caregivers match your current filters.',
        si: 'ඔබ සොයන නිර්ණායකවලට ගැලපෙන සත්කාරකයින් හමු නොවීය.',
        ta: 'உங்கள் வடிகட்டல்களுக்கு பொருந்தும் பராமரிப்பாளர்கள் இல்லை.'
    },
    tryClearingFilters: {
        en: 'Try clearing the hospital or district filters to see more profiles.',
        si: 'වෙනත් රෝහලක් හෝ දිස්ත්‍රික්කයක් තෝරා නැවත උත්සාහ කරන්න.',
        ta: 'வடிகட்டிகளை மாற்றி மீண்டும் முயற்சிக்கவும்.'
    },
    // Caregiver Card & Profile
    yearsOld: { en: 'yrs old', si: 'වයස', ta: 'வயது' },
    yearsExperience: { en: 'years hospital experience', si: 'වසරක රෝහල් පළපුරුද්ද', ta: 'வருட மருத்துவமனை அனுபவம்' },
    primaryHospital: { en: 'Primary Hospital:', si: 'ප්‍රධාන රෝහල:', ta: 'முதன்மை மருத்துவமனை:' },
    secondaryHospitals: { en: 'Also covers:', si: 'ආවරණය කරන වෙනත් රෝහල්:', ta: 'சேவை வழங்கும் பிற மருத்துவமனைகள்:' },
    languagesLabel: { en: 'Languages:', si: 'භාෂා:', ta: 'மொழிகள்:' },
    verifiedBadge: { en: 'Verified Profile', si: 'තහවුරු කළ පැතිකඩ', ta: 'சரிபார்க்கப்பட்ட விபரம்' },
    policeClearanceChecked: { en: 'Police & NIC Checked', si: 'පොලිස් සහ ජා.හැ. පරීක්ෂිතයි', ta: 'காவல்துறை & அடையாள அட்டை சரிபார்க்கப்பட்டது' },
    independentCaregiver: { en: 'Independent Caregiver', si: 'ස්වාධීන සත්කාරක', ta: 'சுயாதீன பராமரிப்பாளர்' },
    agencyAttendant: { en: 'Agency Attendant', si: 'ආයතනික සත්කාරක', ta: 'நிறுவன உதவியாளர்' },
    viewProfile: { en: 'View Full Profile', si: 'සම්පූර්ණ තොරතුරු බලන්න', ta: 'முழு விபரம் பார்க்க' },
    callNow: { en: 'Call Now', si: 'දැන් අමතන්න', ta: 'அழைக்க' },
    whatsAppChat: { en: 'WhatsApp', si: 'WhatsApp', ta: 'WhatsApp' },
    perDay: { en: '/ day', si: '/ දිනකට', ta: '/ நாள்' },
    perHour: { en: '/ hr', si: '/ පැයකට', ta: '/ மணி' },
    feeStartingAt: { en: 'Rate starting at', si: 'ආරම්භක ගාස්තුව', ta: 'ஆரம்ப கட்டணம்' },
    // Profile Detail Page
    aboutCaregiver: { en: 'About Caregiver', si: 'සත්කාරක පිළිබඳ තොරතුරු', ta: 'பராமரிப்பாளர் பற்றி' },
    specializationsTitle: {
        en: 'Clinical Care & Bedside Assistance Skills',
        si: 'විශේෂඥ සත්කාරක හැකියාවන්',
        ta: 'மருத்துவமனை சත්කාර திறன்கள்'
    },
    certificationsTitle: {
        en: 'Certifications & Hospital Ward Experience',
        si: 'සහතික සහ වාට්ටු පළපුරුද්ද',
        ta: 'சான்றிதழ்கள் & வார்டு அனுபவம்'
    },
    availabilityCalendarTitle: {
        en: 'Shift Availability Calendar',
        si: 'ලබාගත හැකි දින දර්ශනය',
        ta: 'கிடைக்கும் நாட்காட்டி'
    },
    familyReviewsTitle: {
        en: 'Patient Family Reviews',
        si: 'පවුල්වල ඇගයීම් සහ අදහස්',
        ta: 'குடும்பங்களின் மதிப்பீடுகள்'
    },
    writeReviewBtn: {
        en: '+ Write a Review',
        si: '+ අදහස් දක්වන්න',
        ta: '+ மதிப்பீடு எழுத'
    },
    directHiringRates: {
        en: 'Direct Hiring Rates',
        si: 'සෘජු සේවා ගාස්තු',
        ta: 'நேரடி சேவைக் கட்டணங்கள்'
    },
    directHiringNotice: {
        en: 'Direct hiring with zero commission. Pay directly to caregiver.',
        si: 'අමතර කොමිස් මුදල් නැත. සෘජුවම සත්කාරකයාට මුදල් ගෙවන්න.',
        ta: 'கூடுதல் தரகு கட்டணம் இல்லை. நேரடியாக பராமரிப்பாளருக்கு செலுத்துங்கள்.'
    },
    disclaimer: {
        en: 'HireLanka Care is a caregiver discovery marketplace. Families and caregivers arrange hiring, terms, and payments directly. HireLanka Care does not process medical payments or employ caregivers.',
        si: 'HireLanka Care යනු සත්කාරකයින් සොයා ගැනීමේ වේදිකාවකි. සේවයට බඳවා ගැනීම, වේලාවන් සහ ගෙවීම් සෘජුවම සත්කාරකයා සමඟ තීන්දු කර ගන්න.',
        ta: 'HireLanka Care ஒரு தகவல் தளமாகும். கட்டணங்கள் மற்றும் பணி நிபந்தனைகளை நேரடியாகப் பேசி முடிவு செய்து கொள்ளவும்.'
    },
    // Agencies Page & Profile
    agenciesPageTitle: {
        en: 'Registered Care Agencies in Sri Lanka',
        si: 'ශ්‍රී ලංකාවේ ලියාපදිංචි සත්කාර ආයතන',
        ta: 'இலங்கையில் பதிவு செய்யப்பட்ட பராமரிப்பு நிறுவனங்கள்'
    },
    agenciesPageSubtitle: {
        en: 'Discover professional healthcare staffing agencies managing teams of verified nursing aides and hospital attendants.',
        si: 'පුහුණු හෙද සහායකයින් සහ රෝහල් සත්කාරක කණ්ඩායම් සහිත වෘත්තීය ආයතන සොයා ගන්න.',
        ta: 'தொழில்முறை செவிலியர் உதவியாளர்களைக் கொண்ட நிறுவனங்களைக் கண்டறியவும்.'
    },
    activeAttendants: { en: 'Caregivers on Roster', si: 'සේවයේ සිටින සත්කාරකයින්', ta: 'பணியிலுள்ள பராமரிப்பாளர்கள்' },
    hospitalsCovered: { en: 'Hospitals Covered', si: 'ආවරණය වන රෝහල්', ta: 'சேவை வழங்கும் மருத்துவமனைகள்' },
    contactAgency: { en: 'Contact Agency', si: 'ආයතනය අමතන්න', ta: 'நிறுவனத்தைத் தொடர்பு கொள்ள' },
    viewAgencyProfile: { en: 'View Agency & Staff', si: 'ආයතන විස්තර සහ කාර්යමණ්ඩලය', ta: 'விபரங்கள் மற்றும் ஊழியர்கள்' },
    // How It Works Page
    howItWorksTitle: {
        en: 'How HireLanka Care Works',
        si: 'HireLanka Care ක්‍රියාත්මක වන ආකාරය',
        ta: 'HireLanka Care எவ்வாறு செயல்படுகிறது'
    },
    howItWorksSubtitle: {
        en: 'Designed specifically for Sri Lankan hospital admissions and home patient support.',
        si: 'ශ්‍රී ලංකාවේ රෝහල්ගත රෝගීන්ගේ සහ නිවෙස් සත්කාරක අවශ්‍යතා සඳහාම නිර්මාණය කර ඇත.',
        ta: 'இலங்கை மருத்துவமனை மற்றும் இல்ல பராமரிப்புத் தேவைகளுக்காக வடிவமைக்கப்பட்டது.'
    },
    forFamiliesTitle: {
        en: 'For Families: Find Care in 3 Simple Steps',
        si: 'පවුල් සඳහා: පහසු පියවර 3කින් සත්කාරකයෙකු සොයා ගැනීම',
        ta: 'குடும்பங்களுக்கு: 3 எளிய படிகளில் பராமரிப்பாளரைக் கண்டறியவும்'
    },
    step1Title: { en: '1. Select Your Hospital', si: '1. ඔබේ රෝහල තෝරන්න', ta: '1. மருத்துவமனையைத் தேர்ந்தெடுக்கவும்' },
    step1Desc: {
        en: 'Choose NHSL Colombo, Kalubowila, Ragama, Kandy, Karapitiya, or your local district hospital, and select your shift requirement.',
        si: 'කොළඹ ජාතික රෝහල, කළුබෝවිල, රාගම, මහනුවර හෝ ඔබේ ප්‍රාදේශීය රෝහල තෝරන්න.',
        ta: 'கொழும்பு, களுபோவில, ராகம, கண்டி அல்லது உங்கள் மாவட்ட மருத்துவமனையைத் தேர்வு செய்யவும்.'
    },
    step2Title: { en: '2. Compare Profiles & Daily Rates', si: '2. සත්කාරක විස්තර සහ ගාස්තු සසඳන්න', ta: '2. விபரங்கள் மற்றும் கட்டணங்களை ஒப்பிடுக' },
    step2Desc: {
        en: 'Review qualifications, ward experience, daily LKR rates (Rs. 3,500 - 6,500), and feedback from other patient families.',
        si: 'සුදුසුකම්, වාට්ටු පළපුරුද්ද, දෛනික රුපියල් මිල ගණන් සහ අනෙකුත් පවුල්වල අදහස් බලන්න.',
        ta: 'தகுதிகள், அனுபவம், தினசரி கட்டணங்கள் மற்றும் பிற குடும்பங்களின் கருத்துக்களைப் பார்க்கவும்.'
    },
    step3Title: { en: '3. Contact Directly via WhatsApp', si: '3. WhatsApp මඟින් සෘජුවම අමතන්න', ta: '3. WhatsApp மூலம் நேரடியாகத் தொடர்பு கொள்ளவும்' },
    step3Desc: {
        en: 'Click WhatsApp or Call Now. Discuss hospital ward number, patient needs, and agree on timing. Zero platform commission.',
        si: 'WhatsApp හෝ දුරකථනයෙන් අමතා වාට්ටු අංකය, රෝගියාගේ අවශ්‍යතා පවසා සේවය ලබා ගන්න. අතරමැදි ගාස්තු නැත.',
        ta: 'WhatsApp அல்லது தொலைபேசியில் பேசி வார்டு விபரம் மற்றும் நேரத்தை முடிவு செய்யுங்கள். கமிஷன் இல்லை.'
    },
    // Auth Pages
    loginTitle: { en: 'Welcome to HireLanka Care', si: 'HireLanka Care වෙත සාදරයෙන් පිළිගනිමු', ta: 'HireLanka Care இற்கு நல்வரவு' },
    loginSubtitle: { en: 'Sign in to manage your caregiver profile, bookings, or inquiries', si: 'ඔබේ ගිණුමට ඇතුල් වන්න', ta: 'உங்கள் கணக்கில் உள்நுழைக' },
    emailAddress: { en: 'Email Address', si: 'විද්‍යුත් තැපෑල (Email)', ta: 'மின்னஞ்சல்' },
    password: { en: 'Password', si: 'මුරපදය (Password)', ta: 'கடவுச்சொல்' },
    signInBtn: { en: 'Sign In', si: 'ඇතුල් වන්න', ta: 'உள்நுழைக' },
    forgotPassword: { en: 'Forgot password?', si: 'මුරපදය අමතකද?', ta: 'கடவுச்சொல் மறந்துவிட்டதா?' },
    dontHaveAccount: { en: "Don't have an account?", si: 'තවමත් ගිණුමක් නැද්ද?', ta: 'கணக்கு இல்லையா?' },
    registerHere: { en: 'Register Here', si: 'මෙහි ලියාපදිංචි වන්න', ta: 'இங்கு பதிவு செய்க' },
    registerTitle: { en: 'Create Your HireLanka Care Account', si: 'නව ගිණුමක් සාදන්න', ta: 'புதிய கணக்கை உருவாக்கவும்' },
    registerSubtitle: { en: 'Join thousands of families, caregivers, and agencies across Sri Lanka', si: 'ශ්‍රී ලංකාව පුරා දහස් ගණනක් පවුල් සහ සත්කාරකයින් සමඟ එකතු වන්න', ta: 'இலங்கை முழுவதிலுமுள்ள குடும்பங்கள் மற்றும் பராமரிப்பாளர்களுடன் இணையுங்கள்' },
    iAmA: { en: 'I am registering as:', si: 'ලියාපදිංචි වන ආකාරය:', ta: 'நான் பதிவு செய்வது:' },
    familyOption: { en: 'Family / Patient', si: 'පවුලක් / රෝගී පාර්ශවය', ta: 'குடும்பம் / நோயாளி' },
    caregiverOption: { en: 'Individual Caregiver', si: 'තනි සත්කාරකයෙක්', ta: 'தனி பராமரிப்பாளர்' },
    agencyOption: { en: 'Care Agency', si: 'සත්කාර ආයතනයක්', ta: 'பராமரிப்பு நிறுவனம்' },
    fullName: { en: 'Full Name', si: 'සම්පූර්ණ නම', ta: 'முழுப் பெயர்' },
    phoneLKR: { en: 'Sri Lankan Mobile (+94)', si: 'ජංගම දුරකථන අංකය (+94)', ta: 'கைபேசி எண் (+94)' },
    confirmPassword: { en: 'Confirm Password', si: 'මුරපදය තහවුරු කරන්න', ta: 'கடவுச்சொல்லை உறுதி செய்க' },
    createAccountBtn: { en: 'Create Account', si: 'ගිණුම සාදන්න', ta: 'கணக்கை உருவாக்கு' },
    // Dashboards
    welcomeBack: { en: 'Welcome back', si: 'නැවත සාදරයෙන් පිළිගනිමු', ta: 'மீண்டும் நல்வரவு' },
    hospitalBedsideOverview: { en: 'Hospital Bedside Care Overview', si: 'රෝහල් සත්කාරක සාරාංශය', ta: 'மருத்துவமனை பராமரிப்பு மேலோட்டம்' },
    upcomingHospitalShifts: { en: 'Upcoming Hospital Shifts', si: 'ඉදිරි රෝහල් සේවා මුර', ta: 'வரவிருக்கும் மருத்துவமனை பணிகள்' },
    nearbyHospitals: { en: 'Nearby Government & Private Hospitals', si: 'ආසන්න රජයේ සහ පෞද්ගලික රෝහල්', ta: 'அருகிலுள்ள மருத்துவமனைகள்' },
    recommendedCaregivers: { en: 'Recommended Caregivers', si: 'නිර්දේශිත සත්කාරකයින්', ta: 'பரிந்துரைக்கப்பட்ட பராமரிப்பாளர்கள்' },
    myProfile: { en: 'My Profile', si: 'මගේ පැතිකඩ', ta: 'எனது விபரம்' },
    editProfile: { en: 'Edit Profile', si: 'පැතිකඩ සංස්කරණය', ta: 'விபரத்தை திருத்த' },
    manageSchedule: { en: 'Manage Shift Availability', si: 'සේවා මුර කාලසටහන', ta: 'பணி நேரத்தை நிர்வகிக்க' },
    setDailyRates: { en: 'Set Daily Rates (LKR)', si: 'දෛනික ගාස්තු සකසන්න', ta: 'தினசரி கட்டணத்தை நிர்ணயிக்க' },
    recentInquiries: { en: 'Recent Patient Inquiries', si: 'ලැබුණු විමසීම්', ta: 'சமீபத்திய விசாரணைகள்' },
    // Modals & Inquiries
    contactCaregiverDirectly: { en: 'Contact Caregiver Directly', si: 'සත්කාරක සෘජුවම සම්බන්ධ කර ගන්න', ta: 'பராமரிப்பாளரை நேரடியாகத் தொடர்பு கொள்ள' },
    chatOnWhatsApp: { en: 'Chat on WhatsApp', si: 'WhatsApp හරහා පණිවිඩයක් යවන්න', ta: 'WhatsApp மூலம் உரையாடுக' },
    directCall: { en: 'Direct Phone Call', si: 'දුරකථන ඇමතුමක් ලබා ගන්න', ta: 'தொலைபேசி அழைப்பு' },
    patientName: { en: 'Patient Name', si: 'රෝගියාගේ නම', ta: 'நோயாளி பெயர்' },
    hospitalNameLabel: { en: 'Hospital & Ward Number', si: 'රෝහල සහ වාට්ටු අංකය', ta: 'மருத்துவமனை & வார்டு எண்' },
    mobileNumberLabel: { en: 'Your Mobile Number', si: 'ඔබේ දුරකථන අංකය', ta: 'உங்கள் கைபேசி எண்' },
    shiftNeeded: { en: 'Shift Needed', si: 'අවශ්‍ය සේවා මුරය', ta: 'தேவையான பணி' },
    notesOrCondition: { en: 'Patient condition / special notes', si: 'රෝගියාගේ තත්ත්වය / විශේෂ සටහන්', ta: 'நோயாளியின் நிலை / குறிப்புகள்' },
    openWhatsAppChat: { en: 'Open WhatsApp Chat', si: 'WhatsApp විවෘත කරන්න', ta: 'WhatsApp ஐத் திறக்க' },
    callCaregiverNow: { en: 'Call Caregiver Now', si: 'දැන් ඇමතුමක් ගන්න', ta: 'இப்போதே அழைக்க' },
    closeBtn: { en: 'Close', si: 'වසන්න', ta: 'மூடுக' },
    // Review Modal
    rateYourCaregiver: { en: 'Share Your Experience', si: 'ඔබේ අත්දැකීම බෙදාගන්න', ta: 'உங்கள் அனுபவத்தைப் பகிரவும்' },
    ratingLabel: { en: 'Overall Rating', si: 'සමස්ත ඇගයීම', ta: 'ஒட்டுமொத்த மதிப்பீடு' },
    reviewCommentLabel: { en: 'Your Review', si: 'ඔබේ අදහස', ta: 'உங்கள் கருத்து' },
    reviewPlaceholder: {
        en: 'How was the caregiver? Did they arrive on time to the hospital ward? How was their patient care, hygiene, and attentiveness?',
        si: 'සත්කාරකයාගේ සේවය කෙබඳුද? වෙලාවට රෝහල් වාට්ටුවට පැමිණියාද? රෝගී සත්කාරය සහ සැලකිලිමත් බව පිළිබඳ සඳහන් කරන්න.',
        ta: 'பராமரிப்பாளரின் சேவை எவ்வாறு இருந்தது? நேரத்திற்கு வந்தாரா? நோயாளியைக் கவனிக்கும் விதம் எவ்வாறு இருந்தது?'
    },
    submitReviewBtn: { en: 'Submit Family Review', si: 'අදහස යොමු කරන්න', ta: 'மதிப்பீட்டைச் சமர்ப்பிக்க' },
    reviewSubmittedSuccess: { en: 'Thank you! Your review has been submitted.', si: 'ස්තූතියි! ඔබේ අදහස සාර්ථකව සටහන් විය.', ta: 'நன்றி! உங்கள் மதிப்பீடு சமர்ப்பிக்கப்பட்டது.' },
    // Footer & Common
    medicalEmergencySL: {
        en: 'Medical Emergency in Sri Lanka? Call 1990 Suwa Seriya Free National Ambulance Service',
        si: 'හදිසි රෝගී අවස්ථාවකදී නොමිලේ ගිලන්රථ සේවය සඳහා 1990 සුව සැරිය අමතන්න',
        ta: 'அவசர மருத்துவ உதவிக்கு 1990 சுவ செரிய இலவச அவசர ஊர்தி சேவையை அழைக்கவும்'
    },
    nhslHotline: {
        en: 'National Hospital of Sri Lanka: +94 11 269 1111',
        si: 'කොළඹ ජාතික රෝහල: +94 11 269 1111',
        ta: 'கொழும்பு தேசிய மருத்துவமனை: +94 11 269 1111'
    },
    footerDesc: {
        en: "Sri Lanka's hospital and home caregiver discovery marketplace. Connecting families with trusted patient attendants, nurses' aides, and registered care agencies across government and private hospitals.",
        si: 'ශ්‍රී ලංකාවේ රෝහල් සහ නිවෙස් රෝගී සත්කාරක සේවා සොයා ගැනීමේ ප්‍රමුඛතම වේදිකාව. විශ්වාසදායක සත්කාරකයින් සහ ලියාපදිංචි ආයතන සෘජුවම සම්බන්ධ කර ගන්න.',
        ta: 'இலங்கையின் மருத்துவமனை மற்றும் இல்ல பராமரிப்பாளர் தகவல் தளம். அரசு மற்றும் தனியார் மருத்துவமனைகளுக்கு நம்பகமான உதவியாளர்களை நேரடியாக இணைக்கிறது.'
    },
    explore: { en: 'Explore', si: 'ප්‍රධාන පිටු', ta: 'பக்கங்கள்' },
    popularHospitals: { en: 'Popular Hospitals Served', si: 'ජනප්‍රිය රෝහල්', ta: 'முக்கிய மருத்துவமனைகள்' },
    trustTransparency: { en: 'Trust & Transparency', si: 'විශ්වාසය සහ විනිවිදභාවය', ta: 'நம்பிக்கை & வெளிப்படைத்தன்மை' },
    zeroCommissionTitle: { en: 'Zero Commission on Families', si: 'පවුල්වලින් කොමිස් මුදල් අය නොකෙරේ', ta: 'குடும்பங்களுக்கு தரகு கட்டணம் இல்லை' },
    zeroCommissionDesc: {
        en: 'Families pay caregivers directly via cash or bank transfer. No online payments or hidden booking fees on this platform.',
        si: 'පවුල් විසින් සෘජුවම මුදල් හෝ බැංකු තැන්පතු මඟින් සත්කාරකයාට මුදල් ගෙවනු ලැබේ. අතරමැදි හෝ සැඟවුණු ගාස්තු නැත.',
        ta: 'பராமரிப்பாளருக்கு நேரடியாக பணமாகவோ வங்கி மூலமாகவோ செலுத்தலாம். மறைமுக கட்டணங்கள் இல்லை.'
    },
    allRightsReserved: {
        en: '© 2026 HireLanka Care Platform. Built with care for Sri Lanka.',
        si: '© 2026 HireLanka Care. ශ්‍රී ලාංකික රෝගීන් සහ පවුල් වෙනුවෙන්.',
        ta: '© 2026 HireLanka Care. இலங்கைக் குடும்பங்களுக்காக அன்புடன் உருவாக்கப்பட்டது.'
    }
};
const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem('hirelanka_lang');
        return saved || 'en';
    });
    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('hirelanka_lang', lang);
        document.documentElement.lang = lang;
    };
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
    const t = (key, fallback) => {
        if (translations[key] && translations[key][language]) {
            return translations[key][language];
        }
        if (translations[key] && translations[key].en) {
            return translations[key].en;
        }
        return fallback !== undefined ? fallback : key;
    };
    return (<LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>);
};
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
