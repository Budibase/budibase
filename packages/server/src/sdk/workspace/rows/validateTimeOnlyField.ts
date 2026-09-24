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

export function validateTimeOnlyField(
  fieldName: string,
  value: any,
  constraints: FieldConstraints | undefined
) {
  let res
  if (value && !sql.utils.isValidTime(value)) {
    res = [`"${fieldName}" is not a valid time`]
  } else if (constraints) {
    let castedValue = value
    const stringTimeToDate = (value: string) => {
      const [hour, minute, second] = value.split(":").map((x: string) => +x)
      let date = dayjs("2000-01-01T00:00:00.000Z").hour(hour).minute(minute)
      if (!isNaN(second)) {
        date = date.second(second)
      }
      return date
    }

    if (castedValue) {
      castedValue = stringTimeToDate(castedValue)
    }
    let castedConstraints = cloneDeep(constraints)

    let earliest, latest
    let easliestTimeString: string, latestTimeString: string
    if (castedConstraints.datetime?.earliest) {
      easliestTimeString = castedConstraints.datetime.earliest
      if (dayjs(castedConstraints.datetime.earliest).isValid()) {
        easliestTimeString = dayjs(castedConstraints.datetime.earliest).format(
          "HH:mm"
        )
      }
      earliest = stringTimeToDate(easliestTimeString)
    }
    if (castedConstraints.datetime?.latest) {
      latestTimeString = castedConstraints.datetime.latest
      if (dayjs(castedConstraints.datetime.latest).isValid()) {
        latestTimeString = dayjs(castedConstraints.datetime.latest).format(
          "HH:mm"
        )
      }
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
