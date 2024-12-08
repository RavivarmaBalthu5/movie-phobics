const { DEFAULT_IMG_URL, IMG_BASE_URL, DEV_NETLIFY_API_URL, NETLIFY_API_URL } = require("./configs");

const fetchWithRetry = async (fetchFunction, query, retries = 3) => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await fetchFunction(query);
        } catch (error) {
            attempt++;
            if (attempt >= retries) {
                throw error; // Re-throw if retries are exhausted
            }
            console.error(`Retrying fetch (${attempt}/${retries})...`, error);
            await new Promise(res => setTimeout(res, 1000)); // Wait before retrying
        }
    }
};
const getImageUrl = (movie) => {
    return movie?.poster_path ? `${IMG_BASE_URL}${movie?.poster_path}` : DEFAULT_IMG_URL;
}

const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const day = date.getDate();
    const monthYear = date.toLocaleDateString('en-US', options);

    const ordinalSuffix = (n) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const value = n % 100;
        return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
    };

    return `${monthYear.split(' ')[0]} ${day}${ordinalSuffix(day)}, ${monthYear.split(' ')[2]}`;
};

const getYearFromDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return null;
    }

    return date.getFullYear();
};


const getNetlifyUrl = () => {
    if (window.location.href.includes("dev") || window.location.href.includes("localhost")) {
        return DEV_NETLIFY_API_URL
    }
    return NETLIFY_API_URL
}
const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

const languageMapping = {
    af: "Afrikaans(Afrikaans)",
    sq: "Albanian(Shqip)",
    am: "Amharic(አማርኛ)",
    ar: "Arabic(العربية)",
    hy: "Armenian(Հայերեն)",
    az: "Azerbaijani(Azərbaycanca)",
    eu: "Basque(Euskara)",
    be: "Belarusian(Беларуская)",
    bn: "Bengali(বাংলা)",
    bs: "Bosnian(Bosanski)",
    bg: "Bulgarian(Български)",
    ca: "Catalan(Català)",
    ceb: "Cebuano(Binisaya)",
    zh: "Chinese(中文)",
    "zh-CN": "Chinese (Simplified)(简体中文)",
    "zh-TW": "Chinese (Traditional)(繁體中文)",
    co: "Corsican(Corsu)",
    hr: "Croatian(Hrvatski)",
    cs: "Czech(Čeština)",
    da: "Danish(Dansk)",
    nl: "Dutch(Nederlands)",
    en: "English",
    eo: "Esperanto(Esperanto)",
    et: "Estonian(Eesti)",
    fi: "Finnish(Suomi)",
    fr: "French(Français)",
    fy: "Frisian(Frysk)",
    gl: "Galician(Galego)",
    ka: "Georgian(ქართული)",
    de: "German(Deutsch)",
    el: "Greek(Ελληνικά)",
    gu: "Gujarati(ગુજરાતી)",
    ht: "Haitian Creole(Kreyòl Ayisyen)",
    ha: "Hausa(Hausa)",
    he: "Hebrew(עברית)",
    hi: "Hindi(हिन्दी)",
    hmn: "Hmong(Hmoob)",
    hu: "Hungarian(Magyar)",
    is: "Icelandic(Íslenska)",
    ig: "Igbo(Igbo)",
    id: "Indonesian(Bahasa Indonesia)",
    ga: "Irish(Gaeilge)",
    it: "Italian(Italiano)",
    ja: "Japanese(日本語)",
    jv: "Javanese(Basa Jawa)",
    kn: "Kannada(ಕನ್ನಡ)",
    kk: "Kazakh(Қазақша)",
    km: "Khmer(ខ្មែរ)",
    rw: "Kinyarwanda(Kinyarwanda)",
    ko: "Korean(한국어)",
    ku: "Kurdish(Kurdî)",
    ky: "Kyrgyz(Кыргызча)",
    lo: "Lao(ລາວ)",
    la: "Latin(Latina)",
    lv: "Latvian(Latviešu)",
    lt: "Lithuanian(Lietuvių)",
    lb: "Luxembourgish(Lëtzebuergesch)",
    mk: "Macedonian(Македонски)",
    mg: "Malagasy(Malagasy)",
    ms: "Malay(Bahasa Melayu)",
    ml: "Malayalam(മലയാളം)",
    mt: "Maltese(Malti)",
    mi: "Maori(Te Reo Māori)",
    mr: "Marathi(मराठी)",
    mn: "Mongolian(Монгол)",
    my: "Myanmar (Burmese)(မြန်မာ)",
    ne: "Nepali(नेपाली)",
    no: "Norwegian(Norsk)",
    ny: "Nyanja(Chichewa)",
    or: "Odia(ଓଡ଼ିଆ)",
    ps: "Pashto(پښتو)",
    fa: "Persian(فارسی)",
    pl: "Polish(Polski)",
    pt: "Portuguese(Português)",
    pa: "Punjabi(ਪੰਜਾਬੀ)",
    ro: "Romanian(Română)",
    ru: "Russian(Русский)",
    sm: "Samoan(Gagana Samoa)",
    gd: "Scots Gaelic(Gàidhlig)",
    sr: "Serbian(Српски)",
    st: "Sesotho(Sesotho)",
    sn: "Shona(ChiShona)",
    sd: "Sindhi(سنڌي)",
    si: "Sinhala(සිංහල)",
    sk: "Slovak(Slovenčina)",
    sl: "Slovenian(Slovenščina)",
    so: "Somali(Soomaali)",
    es: "Spanish(Español)",
    su: "Sundanese(Basa Sunda)",
    sw: "Swahili(Kiswahili)",
    sv: "Swedish(Svenska)",
    tl: "Tagalog(Filipino)",
    tg: "Tajik(Тоҷикӣ)",
    ta: "Tamil(தமிழ்)",
    tt: "Tatar(Татарча)",
    te: "Telugu(తెలుగు)",
    th: "Thai(ไทย)",
    tr: "Turkish(Türkçe)",
    tk: "Turkmen(Türkmençe)",
    uk: "Ukrainian(Українська)",
    ur: "Urdu(اردو)",
    ug: "Uyghur(ئۇيغۇرچە)",
    uz: "Uzbek(O‘zbek)",
    vi: "Vietnamese(Tiếng Việt)",
    cy: "Welsh(Cymraeg)",
    xh: "Xhosa(IsiXhosa)",
    yi: "Yiddish(ייִדיש)",
    yo: "Yoruba(Yorùbá)",
    zu: "Zulu(IsiZulu)"
};

module.exports = {
    fetchWithRetry,
    getImageUrl,
    formatReleaseDate,
    getYearFromDate,
    getNetlifyUrl,
    genreMap,
    languageMapping
}
