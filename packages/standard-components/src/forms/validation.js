import flatpickr from "flatpickr"
import { isEmpty } from "lodash/fp"

export const createValidatorFromConstraints = (constraints, field, table) => {
  let checks = []

  if (constraints) {
    // Required constraint
    if (
      field === table?.primaryDisplay ||
      constraints.presence?.allowEmpty === false
    ) {
      checks.push(presenceConstraint)
    }

    // String length constraint
    if (constraints.length?.maximum) {
      const length = constraints.length.maximum
      checks.push(lengthConstraint(length))
    }

    // Min / max number constraint
    if (!isEmpty(constraints.numericality?.greaterThanOrEqualTo)) {
      const min = constraints.numericality.greaterThanOrEqualTo
      checks.push(numericalConstraint(x => x >= min, `Minimum value is ${min}`))
    }
    if (!isEmpty(constraints.numericality?.lessThanOrEqualTo)) {
      const max = constraints.numericality.lessThanOrEqualTo
      checks.push(numericalConstraint(x => x <= max, `Maximum value is ${max}`))
    }

    // Inclusion constraint
    if (!isEmpty(constraints.inclusion)) {
      const options = constraints.inclusion
      checks.push(inclusionConstraint(options))
    }

    // Date constraint
    if (!isEmpty(constraints.datetime?.earliest)) {
      const limit = constraints.datetime.earliest
      checks.push(dateConstraint(limit, true))
    }
    if (!isEmpty(constraints.datetime?.latest)) {
      const limit = constraints.datetime.latest
      checks.push(dateConstraint(limit, false))
    }
  }

  // Evaluate each constraint
  return value => {
    for (let check of checks) {
      const error = check(value)
      if (error) {
        return error
      }
    }
    return null
  }
}

const presenceConstraint = value => {
  let invalid
  if (Array.isArray(value)) {
    invalid = value.length === 0
  } else {
    invalid = value == null || value === ""
  }
  return invalid ? "Required" : null
}

const lengthConstraint = maxLength => value => {
  if (value && value.length > maxLength) {
    return `Maximum ${maxLength} characters`
  }
  return null
}

const numericalConstraint = (constraint, error) => value => {
  if (isNaN(value)) {
    return "Must be a number"
  }
  const number = parseFloat(value)
  if (!constraint(number)) {
    return error
  }
  return null
}

const inclusionConstraint = (options = []) => value => {
  if (value == null || value === "") {
    return null
  }
  if (!options.includes(value)) {
    return "Invalid value"
  }
  return null
}

const dateConstraint = (dateString, isEarliest) => {
  const dateLimit = Date.parse(dateString)
  return value => {
    if (value == null || value === "") {
      return null
    }
    const dateValue = Date.parse(value)
    const valid = isEarliest ? dateValue >= dateLimit : dateValue <= dateLimit
    const adjective = isEarliest ? "Earliest" : "Latest"
    const limitString = flatpickr.formatDate(new Date(dateLimit), "F j Y, H:i")
    return valid ? null : `${adjective} is ${limitString}`
  }
}
