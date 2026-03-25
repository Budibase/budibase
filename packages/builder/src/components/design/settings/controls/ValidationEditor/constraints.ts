export interface ValidationConstraintOption {
  label: string
  value: string
}

const Constraints = {
  Required: {
    label: "Required",
    value: "required",
  },
  MinLength: {
    label: "Min length",
    value: "minLength",
  },
  MaxLength: {
    label: "Max length",
    value: "maxLength",
  },
  MaxValue: {
    label: "Max value",
    value: "maxValue",
  },
  MinValue: {
    label: "Min value",
    value: "minValue",
  },
  Equal: {
    label: "Must equal",
    value: "equal",
  },
  NotEqual: {
    label: "Must not equal",
    value: "notEqual",
  },
  Regex: {
    label: "Must match regex",
    value: "regex",
  },
  NotRegex: {
    label: "Must not match regex",
    value: "notRegex",
  },
  Contains: {
    label: "Must contain",
    value: "contains",
  },
  NotContains: {
    label: "Must not contain",
    value: "notContains",
  },
  MaxFileSize: {
    label: "Max file size (MB)",
    value: "maxFileSize",
  },
  MaxUploadSize: {
    label: "Max total upload size (MB)",
    value: "maxUploadSize",
  },
}

const ConstraintMap: Record<string, ValidationConstraintOption[]> = {
  ["string"]: [
    Constraints.Required,
    Constraints.MinLength,
    Constraints.MaxLength,
    Constraints.Equal,
    Constraints.NotEqual,
    Constraints.Regex,
    Constraints.NotRegex,
  ],
  ["number"]: [
    Constraints.Required,
    Constraints.MaxValue,
    Constraints.MinValue,
    Constraints.Equal,
    Constraints.NotEqual,
  ],
  ["boolean"]: [Constraints.Required, Constraints.Equal, Constraints.NotEqual],
  ["datetime"]: [
    Constraints.Required,
    Constraints.MaxValue,
    Constraints.MinValue,
    Constraints.Equal,
    Constraints.NotEqual,
  ],
  ["attachment"]: [
    Constraints.Required,
    Constraints.MaxFileSize,
    Constraints.MaxUploadSize,
  ],
  ["attachment_single"]: [Constraints.Required, Constraints.MaxUploadSize],
  ["signature_single"]: [Constraints.Required],
  ["link"]: [
    Constraints.Required,
    Constraints.Contains,
    Constraints.NotContains,
    Constraints.MinLength,
    Constraints.MaxLength,
  ],
  ["array"]: [
    Constraints.Required,
    Constraints.MinLength,
    Constraints.MaxLength,
    Constraints.Contains,
    Constraints.NotContains,
  ],
}

export const getConstraintsForType = (
  type: string
): ValidationConstraintOption[] => {
  return ConstraintMap[type] || []
}
