const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Slovak = {
    weekdays: {
        shorthand: ["Ned", "Pon", "Ut", "Str", "Štv", "Pia", "Sob"],
        longhand: [
            "Nedeľa",
            "Pondelok",
            "Utorok",
            "Streda",
            "Štvrtok",
            "Piatok",
            "Sobota",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Máj",
            "Jún",
            "Júl",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dec",
        ],
        longhand: [
            "Január",
            "Február",
            "Marec",
            "Apríl",
            "Máj",
            "Jún",
            "Júl",
            "August",
            "September",
            "Október",
            "November",
            "December",
        ],
    },
    firstDayOfWeek: 1,
    rangeSeparator: " do ",
    time_24hr: true,
    ordinal: function () {
        return ".";
    },
};
fp.l10ns.sk = Slovak;
export default fp.l10ns;
