/**
 * Operator options for lucene queries
 */
export const OperatorOptions = {
  Equals: {
    value: "equal",
    label: "Equals",
  },
  NotEquals: {
    value: "notEqual",
    label: "Not equals",
  },
  Empty: {
    value: "empty",
    label: "Is empty",
  },
  NotEmpty: {
    value: "notEmpty",
    label: "Is not empty",
  },
  StartsWith: {
    value: "string",
    label: "Starts with",
  },
  Like: {
    value: "fuzzy",
    label: "Like",
  },
  MoreThan: {
    value: "rangeLow",
    label: "More than",
  },
  LessThan: {
    value: "rangeHigh",
    label: "Less than",
  },
  Contains: {
    value: "equal",
    label: "Contains",
  },
  NotContains: {
    value: "notEqual",
    label: "Does Not Contain",
  },
}

export const NoEmptyFilterStrings = [
  OperatorOptions.StartsWith.value,
  OperatorOptions.Like.value,
  OperatorOptions.Equals.value,
  OperatorOptions.NotEquals.value,
  OperatorOptions.Contains.value,
  OperatorOptions.NotContains.value,
]

/**
 * Returns the valid operator options for a certain data type
 * @param type the data type
 */
export const getValidOperatorsForType = type => {
  const Op = OperatorOptions
  if (type === "string") {
    return [
      Op.Equals,
      Op.NotEquals,
      Op.StartsWith,
      Op.Like,
      Op.Empty,
      Op.NotEmpty,
    ]
  } else if (type === "number") {
    return [
      Op.Equals,
      Op.NotEquals,
      Op.MoreThan,
      Op.LessThan,
      Op.Empty,
      Op.NotEmpty,
    ]
  } else if (type === "options") {
    return [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty]
  } else if (type === "array") {
    return [Op.Contains, Op.NotContains, Op.Empty, Op.NotEmpty]
  } else if (type === "boolean") {
    return [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty]
  } else if (type === "longform") {
    return [
      Op.Equals,
      Op.NotEquals,
      Op.StartsWith,
      Op.Like,
      Op.Empty,
      Op.NotEmpty,
    ]
  } else if (type === "datetime") {
    return [
      Op.Equals,
      Op.NotEquals,
      Op.MoreThan,
      Op.LessThan,
      Op.Empty,
      Op.NotEmpty,
    ]
  }
  return []
}
