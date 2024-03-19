import dayjs from "dayjs"

import dayjsDurationPlugin from "dayjs/plugin/duration"
import dayjsAdvancedFormatPlugin from "dayjs/plugin/advancedFormat"
import dayjsIsoWeekPlugin from "dayjs/plugin/isoWeek"
import dayjsWeekYearPlugin from "dayjs/plugin/weekYear"
import dayjsWeekOfYearPlugin from "dayjs/plugin/weekOfYear"
import dayjsRelativeTimePlugin from "dayjs/plugin/relativeTime"
import dayjsUtcPlugin from "dayjs/plugin/utc"
import dayjsTimezonePlugin from "dayjs/plugin/timezone"

dayjs.extend(dayjsDurationPlugin)
dayjs.extend(dayjsAdvancedFormatPlugin)
dayjs.extend(dayjsIsoWeekPlugin)
dayjs.extend(dayjsWeekYearPlugin)
dayjs.extend(dayjsWeekOfYearPlugin)
dayjs.extend(dayjsRelativeTimePlugin)
dayjs.extend(dayjsUtcPlugin)
dayjs.extend(dayjsTimezonePlugin)

/**
 * This file was largely taken from the helper-date package - we did this for two reasons:
 * 1. It made use of both moment of date.js - this caused some weird bugs with some relatively simple
 * syntax and didn't offer much in return.
 * 2. Replacing moment with dayjs helps massively reduce bundle size.
 * The original package can be found here:
 * https://github.com/helpers/helper-date
 */

function isOptions(val: any) {
  return typeof val === "object" && typeof val.hash === "object"
}

function isApp(thisArg: any) {
  return (
    typeof thisArg === "object" &&
    typeof thisArg.options === "object" &&
    typeof thisArg.app === "object"
  )
}

function getContext(thisArg: any, locals: any, options: any) {
  if (isOptions(thisArg)) {
    return getContext({}, locals, thisArg)
  }
  // ensure args are in the correct order
  if (isOptions(locals)) {
    return getContext(thisArg, options, locals)
  }
  const appContext = isApp(thisArg) ? thisArg.context : {}
  options = options || {}

  // if "options" is not handlebars options, merge it onto locals
  if (!isOptions(options)) {
    locals = Object.assign({}, locals, options)
  }
  // merge handlebars root data onto locals if specified on the hash
  if (isOptions(options) && options.hash.root === true) {
    locals = Object.assign({}, options.data.root, locals)
  }
  let context = Object.assign({}, appContext, locals, options.hash)
  if (!isApp(thisArg)) {
    context = Object.assign({}, thisArg, context)
  }
  if (isApp(thisArg) && thisArg.view && thisArg.view.data) {
    context = Object.assign({}, context, thisArg.view.data)
  }
  return context
}

function initialConfig(str: any, pattern: any, options?: any) {
  if (isOptions(pattern)) {
    options = pattern
    pattern = null
  }

  if (isOptions(str)) {
    options = str
    pattern = null
    str = null
  }
  return { str, pattern, options }
}

function setLocale(this: any, str: any, pattern: any, options?: any) {
  // if options is null then it'll get updated here
  const config = initialConfig(str, pattern, options)
  const defaults = { lang: "en", date: new Date(config.str) }
  // for now don't allow this to be configurable, don't pass in options
  const opts = getContext(this, defaults, {})

  // set the language to use
  dayjs.locale(opts.lang || opts.language)
}

export const date = (str: any, pattern: any, options: any) => {
  const config = initialConfig(str, pattern, options)

  // if no args are passed, return a formatted date
  if (config.str == null && config.pattern == null) {
    dayjs.locale("en")
    return dayjs().format("MMMM DD, YYYY")
  }

  setLocale(config.str, config.pattern, config.options)

  let date = dayjs(new Date(config.str))
  if (typeof config.options === "string") {
    date =
      config.options.toLowerCase() === "utc"
        ? date.utc()
        : date.tz(config.options)
  } else {
    date = date.tz(dayjs.tz.guess())
  }
  if (config.pattern === "") {
    return date.toISOString()
  }
  return date.format(config.pattern)
}

export const duration = (str: any, pattern: any, format: any) => {
  const config = initialConfig(str, pattern)

  setLocale(config.str, config.pattern)

  const duration = dayjs.duration(config.str, config.pattern)
  if (format && !isOptions(format)) {
    return duration.format(format)
  } else {
    return duration.humanize()
  }
}
