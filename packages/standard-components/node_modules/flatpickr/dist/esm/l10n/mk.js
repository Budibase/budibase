const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Macedonian = {
    weekdays: {
        shorthand: ["Не", "По", "Вт", "Ср", "Че", "Пе", "Са"],
        longhand: [
            "Недела",
            "Понеделник",
            "Вторник",
            "Среда",
            "Четврток",
            "Петок",
            "Сабота",
        ],
    },
    months: {
        shorthand: [
            "Јан",
            "Фев",
            "Мар",
            "Апр",
            "Мај",
            "Јун",
            "Јул",
            "Авг",
            "Сеп",
            "Окт",
            "Ное",
            "Дек",
        ],
        longhand: [
            "Јануари",
            "Февруари",
            "Март",
            "Април",
            "Мај",
            "Јуни",
            "Јули",
            "Август",
            "Септември",
            "Октомври",
            "Ноември",
            "Декември",
        ],
    },
    firstDayOfWeek: 1,
    weekAbbreviation: "Нед.",
    rangeSeparator: " до ",
    time_24hr: true,
};
fp.l10ns.mk = Macedonian;
export default fp.l10ns;
