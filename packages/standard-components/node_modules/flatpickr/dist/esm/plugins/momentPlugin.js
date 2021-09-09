import { getEventTarget } from "../utils/dom";
function momentPlugin(config) {
    const moment = config.moment;
    return function (fp) {
        function captureIncrement(e) {
            const event = e;
            event.stopPropagation();
            const date = moment(fp.selectedDates[0]);
            const input = getEventTarget(event);
            const unit = Array.from(input.classList)
                .filter((name) => name.startsWith("flatpickr-"))
                .map((name) => name.substring(10))[0];
            const step = parseFloat(input.getAttribute("step"));
            date.add(step * event.delta, unit);
            fp.setDate(date.toDate());
        }
        return {
            parseDate: (datestr, format) => {
                return moment(datestr, format, true).toDate();
            },
            formatDate: (date, format) => {
                const momentDate = moment(date);
                if (typeof fp.config.locale === "string") {
                    momentDate.locale(fp.config.locale);
                }
                return momentDate.format(format);
            },
            onReady() {
                [fp.hourElement, fp.minuteElement, fp.secondElement].forEach((element) => element &&
                    element.addEventListener("increment", captureIncrement, {
                        capture: true,
                    }));
            },
            onDestroy() {
                [fp.hourElement, fp.minuteElement, fp.secondElement].forEach((element) => element &&
                    element.removeEventListener("increment", captureIncrement, {
                        capture: true,
                    }));
            },
        };
    };
}
export default momentPlugin;
