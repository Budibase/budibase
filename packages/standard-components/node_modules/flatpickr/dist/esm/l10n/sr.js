const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Serbian = {
    weekdays: {
        shorthand: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
        longhand: [
            "Nedelja",
            "Ponedeljak",
            "Utorak",
            "Sreda",
            "Četvrtak",
            "Petak",
            "Subota",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Maj",
            "Jun",
            "Jul",
            "Avg",
            "Sep",
            "Okt",
            "Nov",
            "Dec",
        ],
        longhand: [
            "Januar",
            "Februar",
            "Mart",
            "April",
            "Maj",
            "Jun",
            "Jul",
            "Avgust",
            "Septembar",
            "Oktobar",
            "Novembar",
            "Decembar",
        ],
    },
    firstDayOfWeek: 1,
    weekAbbreviation: "Ned.",
    rangeSeparator: " do ",
    time_24hr: true,
};
fp.l10ns.sr = Serbian;
export default fp.l10ns;
