const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Uzbek = {
    weekdays: {
        shorthand: ["Якш", "Душ", "Сеш", "Чор", "Пай", "Жум", "Шан"],
        longhand: [
            "Якшанба",
            "Душанба",
            "Сешанба",
            "Чоршанба",
            "Пайшанба",
            "Жума",
            "Шанба",
        ],
    },
    months: {
        shorthand: [
            "Янв",
            "Фев",
            "Мар",
            "Апр",
            "Май",
            "Июн",
            "Июл",
            "Авг",
            "Сен",
            "Окт",
            "Ноя",
            "Дек",
        ],
        longhand: [
            "Январ",
            "Феврал",
            "Март",
            "Апрел",
            "Май",
            "Июн",
            "Июл",
            "Август",
            "Сентябр",
            "Октябр",
            "Ноябр",
            "Декабр",
        ],
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return "";
    },
    rangeSeparator: " — ",
    weekAbbreviation: "Ҳафта",
    scrollTitle: "Катталаштириш учун айлантиринг",
    toggleTitle: "Ўтиш учун босинг",
    amPM: ["AM", "PM"],
    yearAriaLabel: "Йил",
    time_24hr: true,
};
fp.l10ns.uz = Uzbek;
export default fp.l10ns;
