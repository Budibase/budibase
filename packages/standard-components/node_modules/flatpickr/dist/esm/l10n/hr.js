const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Croatian = {
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
            "Sij",
            "Velj",
            "Ožu",
            "Tra",
            "Svi",
            "Lip",
            "Srp",
            "Kol",
            "Ruj",
            "Lis",
            "Stu",
            "Pro",
        ],
        longhand: [
            "Siječanj",
            "Veljača",
            "Ožujak",
            "Travanj",
            "Svibanj",
            "Lipanj",
            "Srpanj",
            "Kolovoz",
            "Rujan",
            "Listopad",
            "Studeni",
            "Prosinac",
        ],
    },
    time_24hr: true,
};
fp.l10ns.hr = Croatian;
export default fp.l10ns;
