import cronValidate from "cron-validate"
import cronParser from "cron-parser"

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
    for (let [oldErr, newErr] of Object.entries(ERROR_SWAPS)) {
      if (error.includes(oldErr)) {
        error = error.replace(new RegExp(oldErr, "g"), newErr)
      }
    }
    finalErrors.push(error)
  }
  return finalErrors
}

export function getNextExecutionDates(
  cronExpression: string,
  limit = 4
): string[] {
  const parsed = cronParser.parseExpression(cronExpression)
  const nextRuns = []
  for (let i = 0; i < limit; i++) {
    nextRuns.push(parsed.next().toString())
  }

  return nextRuns
}

export function validate(
  cronExpression: string
): { valid: false; err: string[] } | { valid: true } {
  const result = cronValidate(cronExpression, {
    preset: "npm-cron-schedule",
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
