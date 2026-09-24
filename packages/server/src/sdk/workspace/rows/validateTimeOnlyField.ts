import validateJs from "validate.js"
import dayjs from "dayjs"
import cloneDeep from "lodash/fp/cloneDeep"
import { sql } from "@budibase/backend-core"
import type { FieldConstraints } from "@budibase/types"

validateJs.extend(validateJs.validators.datetime, {
  parse: function (value: string) {
    return new Date(value).getTime()
  },
  format: function (value: string) {
    return new Date(value).toISOString()
  },
})

const stringTimeToDate = (value: string) => {
  const [hour, minute, rawSecond] = value.split(":").map(part => +part)
  const second = Number.isFinite(rawSecond) ? rawSecond : 0
  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute >= 60 ||
    second < 0 ||
    second >= 60
  ) {
    return
  }
  const wholeSecond = Math.floor(second)
  const millisecond = Math.round((second - wholeSecond) * 1000)
  return dayjs("2000-01-01T00:00:00.000Z")
    .hour(hour)
    .minute(Math.floor(minute))
    .second(wholeSecond)
    .millisecond(millisecond)
}

const toTimeBound = (bound: string) => {
  if (sql.utils.isValidTime(bound)) {
    return bound
  }
  const parsed = dayjs(bound)
  if (!parsed.isValid()) {
    return bound
  }
  return parsed.format(parsed.second() ? "HH:mm:ss" : "HH:mm")
}

export function validateTimeOnlyField(
  fieldName: string,
  value: any,
  constraints: FieldConstraints | undefined
) {
  let res
  if (value && (!sql.utils.isValidTime(value) || !stringTimeToDate(value))) {
    res = [`"${fieldName}" is not a valid time`]
  } else if (constraints) {
    let castedValue = value
    if (castedValue) {
      castedValue = stringTimeToDate(castedValue)
    }
    let castedConstraints = cloneDeep(constraints)

    let earliest, latest
    let easliestTimeString: string, latestTimeString: string
    if (castedConstraints.datetime?.earliest) {
      easliestTimeString = toTimeBound(castedConstraints.datetime.earliest)
      earliest = stringTimeToDate(easliestTimeString)
    }
    if (castedConstraints.datetime?.latest) {
      latestTimeString = toTimeBound(castedConstraints.datetime.latest)
      latest = stringTimeToDate(latestTimeString)
    }

    if (earliest && latest && earliest.isAfter(latest)) {
      latest = latest.add(1, "day")
      if (earliest.isAfter(castedValue)) {
        castedValue = castedValue.add(1, "day")
      }
    }

    if (earliest || latest) {
      castedConstraints.datetime = {
        earliest: earliest?.toISOString() || "",
        latest: latest?.toISOString() || "",
      }
    }

    let jsValidation = validateJs.single(
      castedValue?.toISOString(),
      castedConstraints
    )
    jsValidation = jsValidation?.map((m: string) =>
      m
        ?.replace(
          castedConstraints.datetime?.earliest || "",
          easliestTimeString || ""
        )
        .replace(
          castedConstraints.datetime?.latest || "",
          latestTimeString || ""
        )
    )
    if (jsValidation) {
      res ??= []
      res.push(...jsValidation)
    }
  }

  return res
}
