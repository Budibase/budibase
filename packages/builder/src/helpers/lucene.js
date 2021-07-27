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
}

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
