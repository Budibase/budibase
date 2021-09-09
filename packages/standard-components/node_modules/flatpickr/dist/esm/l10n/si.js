const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Sinhala = {
    weekdays: {
        shorthand: ["ඉ", "ස", "අ", "බ", "බ්‍ර", "සි", "සෙ"],
        longhand: [
            "ඉරිදා",
            "සඳුදා",
            "අඟහරුවාදා",
            "බදාදා",
            "බ්‍රහස්පතින්දා",
            "සිකුරාදා",
            "සෙනසුරාදා",
        ],
    },
    months: {
        shorthand: [
            "ජන",
            "පෙබ",
            "මාර්",
            "අප්‍රේ",
            "මැයි",
            "ජුනි",
            "ජූලි",
            "අගෝ",
            "සැප්",
            "ඔක්",
            "නොවැ",
            "දෙසැ",
        ],
        longhand: [
            "ජනවාරි",
            "පෙබරවාරි",
            "මාර්තු",
            "අප්‍රේල්",
            "මැයි",
            "ජුනි",
            "ජූලි",
            "අගෝස්තු",
            "සැප්තැම්බර්",
            "ඔක්තෝබර්",
            "නොවැම්බර්",
            "දෙසැම්බර්",
        ],
    },
    time_24hr: true,
};
fp.l10ns.si = Sinhala;
export default fp.l10ns;
