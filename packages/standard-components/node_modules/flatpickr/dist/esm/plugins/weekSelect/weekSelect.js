import { getEventTarget } from "../../utils/dom";
function weekSelectPlugin() {
    return function (fp) {
        function onDayHover(event) {
            const day = getEventTarget(event);
            if (!day.classList.contains("flatpickr-day"))
                return;
            const days = fp.days.childNodes;
            const dayIndex = day.$i;
            const dayIndSeven = dayIndex / 7;
            const weekStartDay = days[7 * Math.floor(dayIndSeven)]
                .dateObj;
            const weekEndDay = days[7 * Math.ceil(dayIndSeven + 0.01) - 1].dateObj;
            for (let i = days.length; i--;) {
                const day = days[i];
                const date = day.dateObj;
                if (date > weekEndDay || date < weekStartDay)
                    day.classList.remove("inRange");
                else
                    day.classList.add("inRange");
            }
        }
        function highlightWeek() {
            const selDate = fp.latestSelectedDateObj;
            if (selDate !== undefined &&
                selDate.getMonth() === fp.currentMonth &&
                selDate.getFullYear() === fp.currentYear) {
                fp.weekStartDay = fp.days.childNodes[7 * Math.floor(fp.selectedDateElem.$i / 7)].dateObj;
                fp.weekEndDay = fp.days.childNodes[7 * Math.ceil(fp.selectedDateElem.$i / 7 + 0.01) - 1].dateObj;
            }
            const days = fp.days.childNodes;
            for (let i = days.length; i--;) {
                const date = days[i].dateObj;
                if (date >= fp.weekStartDay && date <= fp.weekEndDay)
                    days[i].classList.add("week", "selected");
            }
        }
        function clearHover() {
            const days = fp.days.childNodes;
            for (let i = days.length; i--;)
                days[i].classList.remove("inRange");
        }
        function onReady() {
            if (fp.daysContainer !== undefined)
                fp.daysContainer.addEventListener("mouseover", onDayHover);
        }
        function onDestroy() {
            if (fp.daysContainer !== undefined)
                fp.daysContainer.removeEventListener("mouseover", onDayHover);
        }
        return {
            onValueUpdate: highlightWeek,
            onMonthChange: highlightWeek,
            onYearChange: highlightWeek,
            onOpen: highlightWeek,
            onClose: clearHover,
            onParseConfig: function () {
                fp.config.mode = "single";
                fp.config.enableTime = false;
                fp.config.dateFormat = fp.config.dateFormat
                    ? fp.config.dateFormat
                    : "\\W\\e\\e\\k #W, Y";
                fp.config.altFormat = fp.config.altFormat
                    ? fp.config.altFormat
                    : "\\W\\e\\e\\k #W, Y";
            },
            onReady: [
                onReady,
                highlightWeek,
                () => {
                    fp.loadedPlugins.push("weekSelect");
                },
            ],
            onDestroy,
        };
    };
}
export default weekSelectPlugin;
