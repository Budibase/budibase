export const AUTOMATION_STEP_NAME_ERROR =
  "Please enter a name consisting of only alphanumeric characters, spaces, underscores, hyphens and periods"

const AUTOMATION_STEP_NAME_REGEX = /^[A-Za-z0-9_.\-\s]+$/

export const isValidAutomationStepName = (name: string) => {
  return AUTOMATION_STEP_NAME_REGEX.test(name)
}
