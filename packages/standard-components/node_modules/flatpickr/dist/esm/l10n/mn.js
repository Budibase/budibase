const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Mongolian = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"],
        longhand: ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"],
    },
    months: {
        shorthand: [
            "1-р сар",
            "2-р сар",
            "3-р сар",
            "4-р сар",
            "5-р сар",
            "6-р сар",
            "7-р сар",
            "8-р сар",
            "9-р сар",
            "10-р сар",
            "11-р сар",
            "12-р сар",
        ],
        longhand: [
            "Нэгдүгээр сар",
            "Хоёрдугаар сар",
            "Гуравдугаар сар",
            "Дөрөвдүгээр сар",
            "Тавдугаар сар",
            "Зургаадугаар сар",
            "Долдугаар сар",
            "Наймдугаар сар",
            "Есдүгээр сар",
            "Аравдугаар сар",
            "Арваннэгдүгээр сар",
            "Арванхоёрдугаар сар",
        ],
    },
    rangeSeparator: "-с ",
    time_24hr: true,
};
fp.l10ns.mn = Mongolian;
export default fp.l10ns;
