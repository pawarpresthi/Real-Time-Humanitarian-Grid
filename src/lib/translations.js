export const translations = {
    English: {
        title: "Emergency Request",
        subtitle: "Fill this form to request immediate assistance.",
        nameLabel: "Name",
        phoneLabel: "Phone",
        needLabel: "Type of Need",
        locationLabel: "Location",
        submitBtn: "SEND HELP NOW",
        success: "Request Sent!",
        successMsg: "Help is on the way. Your request ID has been generated.",
        returnHome: "Return Home",
        locationBtn: "Use My Current Location",
        manualLocation: "Or enter address manually"
    },
    Hindi: {
        title: "आपातकालीन अनुरोध",
        subtitle: "तत्काल सहायता के लिए यह फॉर्म भरें।",
        nameLabel: "नाम",
        phoneLabel: "फ़ोन नंबर",
        needLabel: "ज़रूरत का प्रकार",
        locationLabel: "स्थान",
        submitBtn: "अभी मदद भेजें",
        success: "अनुरोध भेजा गया!",
        successMsg: "मदद रास्ते में है। आपकी अनुरोध आईडी जनरेट कर दी गई है।",
        returnHome: "घर लौटें",
        locationBtn: "मेरे वर्तमान स्थान का उपयोग करें",
        manualLocation: "या पता मैन्युअल रूप से दर्ज करें"
    },
    Gujarati: {
        title: "કટોકટી વિનંતી",
        subtitle: "તાત્કાલિક સહાય માટે આ ફોર્મ ભરો.",
        nameLabel: "નામ",
        phoneLabel: "ફોન નંબર",
        needLabel: "જરૂરિયાતનો પ્રકાર",
        locationLabel: "સ્થળ",
        submitBtn: "હમણાં મદદ મોકલો",
        success: "વિનંતી મોકલી!",
        successMsg: "મદદ રસ્તામાં છે. તમારું વિનંતી ID જનરેટ કરવામાં આવ્યું છે.",
        returnHome: "મુખ્ય પૃષ્ઠ પર જાઓ",
        locationBtn: "મારા વર્તમાન સ્થાનનો ઉપયોગ કરો",
        manualLocation: "અથવા સરનામું જાતે દાખલ કરો"
    },
    Marathi: {
        title: "आपत्कालीन विनंती",
        subtitle: "तात्काळ मदतीसाठी हा फॉर्म भरा.",
        nameLabel: "नाव",
        phoneLabel: "फोन नंबर",
        needLabel: "गरजेचा प्रकार",
        locationLabel: "स्थान",
        submitBtn: "आता मदत पाठवा",
        success: "विनंती पाठवली!",
        successMsg: "मदत येत आहे. तुमचा विनंती आयडी तयार केला गेला आहे.",
        returnHome: "मुख्य पृष्ठावर जा",
        locationBtn: "माझे वर्तमान स्थान वापरा",
        manualLocation: "किंवा पत्ता मॅन्युअली प्रविष्ट करा"
    },
    // Add other languages with fallbacks to English or simple transliterations for demo purposes
    Bhojpuri: {
        title: "आपातकालीन निवेदन",
        subtitle: "तुरंत मदद बदे ई फॉर्म भरीं।",
        nameLabel: "नांव",
        phoneLabel: "फोन नंबर",
        needLabel: "जरूरत के प्रकार",
        locationLabel: "जगह",
        submitBtn: "मदद भेजीं",
        success: "निवेदन चल गइल!",
        successMsg: "मदद आवत बा। रउरा आईडी मिल गइल बा।",
        returnHome: "घरे लौटीं",
        locationBtn: "हमर जगह के उपयोग करीं",
        manualLocation: "या पता लिखीं"
    }
};

export const getTranslation = (lang) => {
    return translations[lang] || translations['English'];
};
