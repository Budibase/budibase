import { findAllMatchingComponents } from "@/helpers/components"

/**
 * Gets available form options for the FormBlockTracker component
 * @param {Screen} screen - The screen to search for forms
 * @returns {Array} Array of form options with label and value
 */
export const getAvailableFormOptions = (screen) => {
  if (!screen?.props) {
    return []
  }

  const forms = []
  
  // Find Multi Step Form Blocks (multistepformblock components)
  const multiStepFormBlocks = findAllMatchingComponents(
    screen.props, 
    (component) => component._component?.endsWith("/multistepformblock")
  )
  multiStepFormBlocks.forEach((formBlock) => {
    forms.push({
      label: formBlock._instanceName || `Multi Step Form (${formBlock._id.slice(-4)})`,
      value: formBlock._id,
    })
  })

  // Also find regular Form Blocks (formblock components)
  const formBlocks = findAllMatchingComponents(
    screen.props, 
    (component) => component._component?.endsWith("/formblock")
  )
  formBlocks.forEach((formBlock) => {
    forms.push({
      label: formBlock._instanceName || `Form Block (${formBlock._id.slice(-4)})`,
      value: formBlock._id,
    })
  })

  // Find regular Form components that have FormStep children
  const formComponents = findAllMatchingComponents(
    screen.props, 
    (component) => component._component?.endsWith("/form")
  )
  formComponents.forEach((formComponent) => {
    // Check if this form has FormStep children
    const formSteps = findAllMatchingComponents(
      formComponent,
      (component) => component._component?.endsWith("/formstep")
    )
    if (formSteps.length > 0) {
      forms.push({
        label: formComponent._instanceName || `Form with Steps (${formComponent._id.slice(-4)})`,
        value: formComponent._id,
      })
    }
  })

  return forms
}