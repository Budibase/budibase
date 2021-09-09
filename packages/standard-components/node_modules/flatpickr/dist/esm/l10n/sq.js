const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Albanian = {
    weekdays: {
        shorthand: ["Di", "Hë", "Ma", "Më", "En", "Pr", "Sh"],
        longhand: [
            "E Diel",
            "E Hënë",
            "E Martë",
            "E Mërkurë",
            "E Enjte",
            "E Premte",
            "E Shtunë",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Shk",
            "Mar",
            "Pri",
            "Maj",
            "Qer",
            "Kor",
            "Gus",
            "Sht",
            "Tet",
            "Nën",
            "Dhj",
        ],
        longhand: [
            "Janar",
            "Shkurt",
            "Mars",
            "Prill",
            "Maj",
            "Qershor",
            "Korrik",
            "Gusht",
            "Shtator",
            "Tetor",
            "Nëntor",
            "Dhjetor",
        ],
    },
    time_24hr: true,
};
fp.l10ns.sq = Albanian;
export default fp.l10ns;
