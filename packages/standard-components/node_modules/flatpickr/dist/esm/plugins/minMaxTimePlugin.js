import { compareDates, compareTimes, createDateFormatter, } from "../utils/dates";
function minMaxTimePlugin(config = {}) {
    const state = {
        formatDate: createDateFormatter({}),
        tableDateFormat: config.tableDateFormat || "Y-m-d",
        defaults: {
            minTime: undefined,
            maxTime: undefined,
        },
    };
    function findDateTimeLimit(date) {
        if (config.table !== undefined) {
            return config.table[state.formatDate(date, state.tableDateFormat)];
        }
        return config.getTimeLimits && config.getTimeLimits(date);
    }
    return function (fp) {
        return {
            onReady() {
                state.formatDate = this.formatDate;
                state.defaults = {
                    minTime: this.config.minTime && state.formatDate(this.config.minTime, "H:i"),
                    maxTime: this.config.maxTime && state.formatDate(this.config.maxTime, "H:i"),
                };
                fp.loadedPlugins.push("minMaxTime");
            },
            onChange() {
                const latest = this.latestSelectedDateObj;
                const matchingTimeLimit = latest && findDateTimeLimit(latest);
                if (latest && matchingTimeLimit !== undefined) {
                    this.set(matchingTimeLimit);
                    fp.config.minTime.setFullYear(latest.getFullYear());
                    fp.config.maxTime.setFullYear(latest.getFullYear());
                    fp.config.minTime.setMonth(latest.getMonth());
                    fp.config.maxTime.setMonth(latest.getMonth());
                    fp.config.minTime.setDate(latest.getDate());
                    fp.config.maxTime.setDate(latest.getDate());
                    if (compareDates(latest, fp.config.maxTime, false) > 0) {
                        fp.setDate(new Date(latest.getTime()).setHours(fp.config.maxTime.getHours(), fp.config.maxTime.getMinutes(), fp.config.maxTime.getSeconds(), fp.config.maxTime.getMilliseconds()), false);
                    }
                    else if (compareDates(latest, fp.config.minTime, false) < 0)
                        fp.setDate(new Date(latest.getTime()).setHours(fp.config.minTime.getHours(), fp.config.minTime.getMinutes(), fp.config.minTime.getSeconds(), fp.config.minTime.getMilliseconds()), false);
                }
                else {
                    const newMinMax = state.defaults || {
                        minTime: undefined,
                        maxTime: undefined,
                    };
                    this.set(newMinMax);
                    if (!latest)
                        return;
                    const { minTime, maxTime } = fp.config;
                    if (minTime && compareTimes(latest, minTime) < 0) {
                        fp.setDate(new Date(latest.getTime()).setHours(minTime.getHours(), minTime.getMinutes(), minTime.getSeconds(), minTime.getMilliseconds()), false);
                    }
                    else if (maxTime && compareTimes(latest, maxTime) > 0) {
                        fp.setDate(new Date(latest.getTime()).setHours(maxTime.getHours(), maxTime.getMinutes(), maxTime.getSeconds(), maxTime.getMilliseconds()));
                    }
                }
            },
        };
    };
}
export default minMaxTimePlugin;
