const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Lithuanian = {
    weekdays: {
        shorthand: ["S", "Pr", "A", "T", "K", "Pn", "Š"],
        longhand: [
            "Sekmadienis",
            "Pirmadienis",
            "Antradienis",
            "Trečiadienis",
            "Ketvirtadienis",
            "Penktadienis",
            "Šeštadienis",
        ],
    },
    months: {
        shorthand: [
            "Sau",
            "Vas",
            "Kov",
            "Bal",
            "Geg",
            "Bir",
            "Lie",
            "Rgp",
            "Rgs",
            "Spl",
            "Lap",
            "Grd",
        ],
        longhand: [
            "Sausis",
            "Vasaris",
            "Kovas",
            "Balandis",
            "Gegužė",
            "Birželis",
            "Liepa",
            "Rugpjūtis",
            "Rugsėjis",
            "Spalis",
            "Lapkritis",
            "Gruodis",
        ],
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return "-a";
    },
    rangeSeparator: " iki ",
    weekAbbreviation: "Sav",
    scrollTitle: "Keisti laiką pelės rateliu",
    toggleTitle: "Perjungti laiko formatą",
    time_24hr: true,
};
fp.l10ns.lt = Lithuanian;
export default fp.l10ns;
