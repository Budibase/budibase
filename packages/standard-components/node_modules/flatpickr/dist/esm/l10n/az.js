const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Azerbaijan = {
    weekdays: {
        shorthand: ["B.", "B.e.", "Ç.a.", "Ç.", "C.a.", "C.", "Ş."],
        longhand: [
            "Bazar",
            "Bazar ertəsi",
            "Çərşənbə axşamı",
            "Çərşənbə",
            "Cümə axşamı",
            "Cümə",
            "Şənbə",
        ],
    },
    months: {
        shorthand: [
            "Yan",
            "Fev",
            "Mar",
            "Apr",
            "May",
            "İyn",
            "İyl",
            "Avq",
            "Sen",
            "Okt",
            "Noy",
            "Dek",
        ],
        longhand: [
            "Yanvar",
            "Fevral",
            "Mart",
            "Aprel",
            "May",
            "İyun",
            "İyul",
            "Avqust",
            "Sentyabr",
            "Oktyabr",
            "Noyabr",
            "Dekabr",
        ],
    },
    firstDayOfWeek: 1,
    ordinal: () => {
        return ".";
    },
    rangeSeparator: " - ",
    weekAbbreviation: "Hf",
    scrollTitle: "Artırmaq üçün sürüşdürün",
    toggleTitle: "Aç / Bağla",
    amPM: ["GƏ", "GS"],
    time_24hr: true,
};
fp.l10ns.az = Azerbaijan;
export default fp.l10ns;
