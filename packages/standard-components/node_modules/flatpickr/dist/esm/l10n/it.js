const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Italian = {
    weekdays: {
        shorthand: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
        longhand: [
            "Domenica",
            "Lunedì",
            "Martedì",
            "Mercoledì",
            "Giovedì",
            "Venerdì",
            "Sabato",
        ],
    },
    months: {
        shorthand: [
            "Gen",
            "Feb",
            "Mar",
            "Apr",
            "Mag",
            "Giu",
            "Lug",
            "Ago",
            "Set",
            "Ott",
            "Nov",
            "Dic",
        ],
        longhand: [
            "Gennaio",
            "Febbraio",
            "Marzo",
            "Aprile",
            "Maggio",
            "Giugno",
            "Luglio",
            "Agosto",
            "Settembre",
            "Ottobre",
            "Novembre",
            "Dicembre",
        ],
    },
    firstDayOfWeek: 1,
    ordinal: () => "°",
    rangeSeparator: " al ",
    weekAbbreviation: "Se",
    scrollTitle: "Scrolla per aumentare",
    toggleTitle: "Clicca per cambiare",
    time_24hr: true,
};
fp.l10ns.it = Italian;
export default fp.l10ns;
