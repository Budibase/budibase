import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

// needed to parse the possible date strings
dayjs.extend(customParseFormat)

const VALID_DATE_FORMATS = [undefined, "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"]

export function isValidDate(date: string) {
  let isValid: boolean = false
  for (let format of VALID_DATE_FORMATS) {
    isValid = dayjs(date, format).isValid()
    if (isValid) {
      return isValid
    }
  }
  return isValid
}
