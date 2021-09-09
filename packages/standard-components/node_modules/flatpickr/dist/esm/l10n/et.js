const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Estonian = {
    weekdays: {
        shorthand: ["P", "E", "T", "K", "N", "R", "L"],
        longhand: [
            "Pühapäev",
            "Esmaspäev",
            "Teisipäev",
            "Kolmapäev",
            "Neljapäev",
            "Reede",
            "Laupäev",
        ],
    },
    months: {
        shorthand: [
            "Jaan",
            "Veebr",
            "Märts",
            "Apr",
            "Mai",
            "Juuni",
            "Juuli",
            "Aug",
            "Sept",
            "Okt",
            "Nov",
            "Dets",
        ],
        longhand: [
            "Jaanuar",
            "Veebruar",
            "Märts",
            "Aprill",
            "Mai",
            "Juuni",
            "Juuli",
            "August",
            "September",
            "Oktoober",
            "November",
            "Detsember",
        ],
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return ".";
    },
    weekAbbreviation: "Näd",
    rangeSeparator: " kuni ",
    scrollTitle: "Keri, et suurendada",
    toggleTitle: "Klõpsa, et vahetada",
    time_24hr: true,
};
fp.l10ns.et = Estonian;
export default fp.l10ns;
