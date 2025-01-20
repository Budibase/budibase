const validators = {
  checkValidDatasource: (a: any) => {
    return `Ups... "${a.label}" not found`
  },
}

export function validateComponentSetting(
  key: keyof typeof validators,
  value: any
) {
  const validator = validators[key]
  return validator(value)
}
