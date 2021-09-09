const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Belarusian = {
    weekdays: {
        shorthand: ["Нд", "Пн", "Аў", "Ср", "Чц", "Пт", "Сб"],
        longhand: [
            "Нядзеля",
            "Панядзелак",
            "Аўторак",
            "Серада",
            "Чацвер",
            "Пятніца",
            "Субота",
        ],
    },
    months: {
        shorthand: [
            "Сту",
            "Лют",
            "Сак",
            "Кра",
            "Тра",
            "Чэр",
            "Ліп",
            "Жні",
            "Вер",
            "Кас",
            "Ліс",
            "Сне",
        ],
        longhand: [
            "Студзень",
            "Люты",
            "Сакавік",
            "Красавік",
            "Травень",
            "Чэрвень",
            "Ліпень",
            "Жнівень",
            "Верасень",
            "Кастрычнік",
            "Лістапад",
            "Снежань",
        ],
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return "";
    },
    rangeSeparator: " — ",
    weekAbbreviation: "Тыд.",
    scrollTitle: "Пракруціце для павелічэння",
    toggleTitle: "Націсніце для пераключэння",
    amPM: ["ДП", "ПП"],
    yearAriaLabel: "Год",
    time_24hr: true,
};
fp.l10ns.be = Belarusian;
export default fp.l10ns;
