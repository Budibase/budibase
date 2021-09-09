const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const UzbekLatin = {
    weekdays: {
        shorthand: ["Ya", "Du", "Se", "Cho", "Pa", "Ju", "Sha"],
        longhand: [
            "Yakshanba",
            "Dushanba",
            "Seshanba",
            "Chorshanba",
            "Payshanba",
            "Juma",
            "Shanba",
        ],
    },
    months: {
        shorthand: [
            "Yan",
            "Fev",
            "Mar",
            "Apr",
            "May",
            "Iyun",
            "Iyul",
            "Avg",
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
            "Iyun",
            "Iyul",
            "Avgust",
            "Sentabr",
            "Oktabr",
            "Noyabr",
            "Dekabr",
        ],
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return "";
    },
    rangeSeparator: " — ",
    weekAbbreviation: "Hafta",
    scrollTitle: "Kattalashtirish uchun aylantiring",
    toggleTitle: "O‘tish uchun bosing",
    amPM: ["AM", "PM"],
    yearAriaLabel: "Yil",
    time_24hr: true,
};
fp.l10ns["uz_latn"] = UzbekLatin;
export default fp.l10ns;
