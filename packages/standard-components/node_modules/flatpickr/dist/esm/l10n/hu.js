const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Hungarian = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["V", "H", "K", "Sz", "Cs", "P", "Szo"],
        longhand: [
            "Vasárnap",
            "Hétfő",
            "Kedd",
            "Szerda",
            "Csütörtök",
            "Péntek",
            "Szombat",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Már",
            "Ápr",
            "Máj",
            "Jún",
            "Júl",
            "Aug",
            "Szep",
            "Okt",
            "Nov",
            "Dec",
        ],
        longhand: [
            "Január",
            "Február",
            "Március",
            "Április",
            "Május",
            "Június",
            "Július",
            "Augusztus",
            "Szeptember",
            "Október",
            "November",
            "December",
        ],
    },
    ordinal: function () {
        return ".";
    },
    weekAbbreviation: "Hét",
    scrollTitle: "Görgessen",
    toggleTitle: "Kattintson a váltáshoz",
    rangeSeparator: " - ",
    time_24hr: true,
};
fp.l10ns.hu = Hungarian;
export default fp.l10ns;
