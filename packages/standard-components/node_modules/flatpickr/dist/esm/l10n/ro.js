const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Romanian = {
    weekdays: {
        shorthand: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"],
        longhand: [
            "Duminică",
            "Luni",
            "Marți",
            "Miercuri",
            "Joi",
            "Vineri",
            "Sâmbătă",
        ],
    },
    months: {
        shorthand: [
            "Ian",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Iun",
            "Iul",
            "Aug",
            "Sep",
            "Oct",
            "Noi",
            "Dec",
        ],
        longhand: [
            "Ianuarie",
            "Februarie",
            "Martie",
            "Aprilie",
            "Mai",
            "Iunie",
            "Iulie",
            "August",
            "Septembrie",
            "Octombrie",
            "Noiembrie",
            "Decembrie",
        ],
    },
    firstDayOfWeek: 1,
    time_24hr: true,
    ordinal: () => {
        return "";
    },
};
fp.l10ns.ro = Romanian;
export default fp.l10ns;
