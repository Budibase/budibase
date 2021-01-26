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
      const length = constraints.length?.maximum
      checks.push(lengthConstraint(length))
    }

    // Min / max number constraint
    if (constraints.numericality?.greaterThanOrEqualTo != null) {
      const min = constraints.numericality.greaterThanOrEqualTo
      checks.push(numericalConstraint(x => x >= min, `Minimum value is ${min}`))
    }
    if (constraints.numericality?.lessThanOrEqualTo != null) {
      const max = constraints.numericality.lessThanOrEqualTo
      checks.push(numericalConstraint(x => x <= max, `Maximum value is ${max}`))
    }

    // Inclusion constraint
    if (constraints.inclusion !== undefined) {
      const options = constraints.inclusion
      checks.push(inclusionConstraint(options))
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
  return value == null || value === "" ? "Required" : null
}

const lengthConstraint = maxLength => value => {
  if (value && value.length > maxLength) {
    ;`Maximum ${maxLength} characters`
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
