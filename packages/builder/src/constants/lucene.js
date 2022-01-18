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
