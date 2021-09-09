const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Finnish = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
        longhand: [
            "Sunnuntai",
            "Maanantai",
            "Tiistai",
            "Keskiviikko",
            "Torstai",
            "Perjantai",
            "Lauantai",
        ],
    },
    months: {
        shorthand: [
            "Tammi",
            "Helmi",
            "Maalis",
            "Huhti",
            "Touko",
            "Kesä",
            "Heinä",
            "Elo",
            "Syys",
            "Loka",
            "Marras",
            "Joulu",
        ],
        longhand: [
            "Tammikuu",
            "Helmikuu",
            "Maaliskuu",
            "Huhtikuu",
            "Toukokuu",
            "Kesäkuu",
            "Heinäkuu",
            "Elokuu",
            "Syyskuu",
            "Lokakuu",
            "Marraskuu",
            "Joulukuu",
        ],
    },
    ordinal: () => {
        return ".";
    },
    time_24hr: true,
};
fp.l10ns.fi = Finnish;
export default fp.l10ns;
