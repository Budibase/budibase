import { monthToStr } from "../../utils/formatting";
import { getEventTarget } from "../../utils/dom";
const defaultConfig = {
    shorthand: false,
    dateFormat: "F Y",
    altFormat: "F Y",
    theme: "light",
};
function monthSelectPlugin(pluginConfig) {
    const config = Object.assign(Object.assign({}, defaultConfig), pluginConfig);
    return (fp) => {
        fp.config.dateFormat = config.dateFormat;
        fp.config.altFormat = config.altFormat;
        const self = { monthsContainer: null };
        function clearUnnecessaryDOMElements() {
            if (!fp.rContainer || !fp.daysContainer || !fp.weekdayContainer)
                return;
            fp.rContainer.removeChild(fp.daysContainer);
            fp.rContainer.removeChild(fp.weekdayContainer);
            for (let index = 0; index < fp.monthElements.length; index++) {
                const element = fp.monthElements[index];
                if (!element.parentNode)
                    continue;
                element.parentNode.removeChild(element);
            }
        }
        function addListeners() {
            fp._bind(fp.prevMonthNav, "click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                fp.changeYear(fp.currentYear - 1);
                selectYear();
            });
            fp._bind(fp.nextMonthNav, "click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                fp.changeYear(fp.currentYear + 1);
                selectYear();
            });
        }
        function addMonths() {
            if (!fp.rContainer)
                return;
            self.monthsContainer = fp._createElement("div", "flatpickr-monthSelect-months");
            self.monthsContainer.tabIndex = -1;
            fp.calendarContainer.classList.add(`flatpickr-monthSelect-theme-${config.theme}`);
            for (let i = 0; i < 12; i++) {
                const month = fp._createElement("span", "flatpickr-monthSelect-month");
                month.dateObj = new Date(fp.currentYear, i);
                month.$i = i;
                month.textContent = monthToStr(i, config.shorthand, fp.l10n);
                month.tabIndex = -1;
                month.addEventListener("click", selectMonth);
                self.monthsContainer.appendChild(month);
                if ((fp.config.minDate && month.dateObj < fp.config.minDate) ||
                    (fp.config.maxDate && month.dateObj > fp.config.maxDate)) {
                    month.classList.add("disabled");
                }
            }
            fp.rContainer.appendChild(self.monthsContainer);
        }
        function setCurrentlySelected() {
            if (!fp.rContainer)
                return;
            const currentlySelected = fp.rContainer.querySelectorAll(".flatpickr-monthSelect-month.selected");
            for (let index = 0; index < currentlySelected.length; index++) {
                currentlySelected[index].classList.remove("selected");
            }
            const targetMonth = (fp.selectedDates[0] || new Date()).getMonth();
            const month = fp.rContainer.querySelector(`.flatpickr-monthSelect-month:nth-child(${targetMonth + 1})`);
            if (month) {
                month.classList.add("selected");
            }
        }
        function selectYear() {
            let selectedDate = fp.selectedDates[0];
            if (selectedDate) {
                selectedDate = new Date(selectedDate);
                selectedDate.setFullYear(fp.currentYear);
                if (fp.config.minDate && selectedDate < fp.config.minDate) {
                    selectedDate = fp.config.minDate;
                }
                if (fp.config.maxDate && selectedDate > fp.config.maxDate) {
                    selectedDate = fp.config.maxDate;
                }
                fp.currentYear = selectedDate.getFullYear();
            }
            fp.currentYearElement.value = String(fp.currentYear);
            if (fp.rContainer) {
                const months = fp.rContainer.querySelectorAll(".flatpickr-monthSelect-month");
                months.forEach((month) => {
                    month.dateObj.setFullYear(fp.currentYear);
                    if ((fp.config.minDate && month.dateObj < fp.config.minDate) ||
                        (fp.config.maxDate && month.dateObj > fp.config.maxDate)) {
                        month.classList.add("disabled");
                    }
                    else {
                        month.classList.remove("disabled");
                    }
                });
            }
            setCurrentlySelected();
        }
        function selectMonth(e) {
            e.preventDefault();
            e.stopPropagation();
            const eventTarget = getEventTarget(e);
            if (eventTarget instanceof Element &&
                !eventTarget.classList.contains("disabled")) {
                setMonth(eventTarget.dateObj);
                fp.close();
            }
        }
        function setMonth(date) {
            const selectedDate = new Date(date);
            selectedDate.setFullYear(fp.currentYear);
            fp.setDate(selectedDate, true);
            setCurrentlySelected();
        }
        const shifts = {
            37: -1,
            39: 1,
            40: 3,
            38: -3,
        };
        function onKeyDown(_, __, ___, e) {
            const shouldMove = shifts[e.keyCode] !== undefined;
            if (!shouldMove && e.keyCode !== 13) {
                return;
            }
            if (!fp.rContainer || !self.monthsContainer)
                return;
            const currentlySelected = fp.rContainer.querySelector(".flatpickr-monthSelect-month.selected");
            let index = Array.prototype.indexOf.call(self.monthsContainer.children, document.activeElement);
            if (index === -1) {
                const target = currentlySelected || self.monthsContainer.firstElementChild;
                target.focus();
                index = target.$i;
            }
            if (shouldMove) {
                self.monthsContainer.children[(12 + index + shifts[e.keyCode]) % 12].focus();
            }
            else if (e.keyCode === 13 &&
                self.monthsContainer.contains(document.activeElement)) {
                setMonth(document.activeElement.dateObj);
            }
        }
        function destroyPluginInstance() {
            if (self.monthsContainer !== null) {
                const months = self.monthsContainer.querySelectorAll(".flatpickr-monthSelect-month");
                for (let index = 0; index < months.length; index++) {
                    months[index].removeEventListener("click", selectMonth);
                }
            }
        }
        return {
            onParseConfig() {
                fp.config.mode = "single";
                fp.config.enableTime = false;
            },
            onValueUpdate: setCurrentlySelected,
            onKeyDown,
            onReady: [
                () => {
                    fp.currentMonth = 0;
                },
                clearUnnecessaryDOMElements,
                addListeners,
                addMonths,
                setCurrentlySelected,
                () => {
                    fp.loadedPlugins.push("monthSelect");
                },
            ],
            onDestroy: destroyPluginInstance,
        };
    };
}
export default monthSelectPlugin;
