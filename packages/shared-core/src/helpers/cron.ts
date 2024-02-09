import cronValidate from "cron-validate"

const INPUT_CRON_START = "(Input cron: "
const ERROR_SWAPS = {
  "smaller than lower limit": "less than",
  "bigger than upper limit": "greater than",
  daysOfMonth: "'days of the month'",
  daysOfWeek: "'days of the week'",
  years: "'years'",
  months: "'months'",
  hours: "'hours'",
  minutes: "'minutes'",
  seconds: "'seconds'",
}

function improveErrors(errors: string[]): string[] {
  const finalErrors: string[] = []

  for (let error of errors) {
    if (error.includes(INPUT_CRON_START)) {
      error = error.split(INPUT_CRON_START)[0].trim()
    }
    for (let [key, value] of Object.entries(ERROR_SWAPS)) {
      if (error.includes(key)) {
        error = error.replace(new RegExp(key, "g"), value)
      }
    }
    finalErrors.push(error)
  }
  return finalErrors
}

export function validate(
  cronExpression: string
): { valid: false; err: string[] } | { valid: true } {
  const result = cronValidate(cronExpression, {
    preset: "npm-node-cron",
    override: {
      useSeconds: false,
    },
  })
  if (!result.isValid()) {
    return { valid: false, err: improveErrors(result.getError()) }
  } else {
    return { valid: true }
  }
}
