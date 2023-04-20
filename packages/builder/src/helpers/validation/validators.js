// TODO: Convert to yup based validators
import { _ } from "../../../lang/i18n"

export function emailValidator(value) {
  return (
    (value &&
      !!value.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) ||
    $_("helpers.validation.validators.Please")
  )
}

export function requiredValidator(value) {
  return (
    (value !== undefined && value !== null && value !== "") ||
    $_("helpers.validation.validators.This")
  )
}
