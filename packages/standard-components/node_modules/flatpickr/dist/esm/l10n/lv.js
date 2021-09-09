const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Latvian = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "Se"],
        longhand: [
            "Svētdiena",
            "Pirmdiena",
            "Otrdiena",
            "Trešdiena",
            "Ceturtdiena",
            "Piektdiena",
            "Sestdiena",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jūn",
            "Jūl",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dec",
        ],
        longhand: [
            "Janvāris",
            "Februāris",
            "Marts",
            "Aprīlis",
            "Maijs",
            "Jūnijs",
            "Jūlijs",
            "Augusts",
            "Septembris",
            "Oktobris",
            "Novembris",
            "Decembris",
        ],
    },
    rangeSeparator: " līdz ",
    time_24hr: true,
};
fp.l10ns.lv = Latvian;
export default fp.l10ns;
