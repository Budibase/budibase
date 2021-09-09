const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Bosnian = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
        longhand: [
            "Nedjelja",
            "Ponedjeljak",
            "Utorak",
            "Srijeda",
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
            "Juni",
            "Juli",
            "Avgust",
            "Septembar",
            "Oktobar",
            "Novembar",
            "Decembar",
        ],
    },
    time_24hr: true,
};
fp.l10ns.bs = Bosnian;
export default fp.l10ns;
