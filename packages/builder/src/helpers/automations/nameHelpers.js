import { AutomationActionStepId } from "@budibase/types"

export const updateBindingsInInputs = (inputs, oldName, newName, stepIndex) => {
  if (typeof inputs === "string") {
    return inputs
      .replace(
        new RegExp(`stepsByName\\.${oldName}\\.`, "g"),
        `stepsByName.${newName}.`
      )
      .replace(
        new RegExp(`steps\\.${stepIndex}\\.`, "g"),
        `stepsByName.${newName}.`
      )
  }

  if (Array.isArray(inputs)) {
    return inputs.map(item =>
      updateBindingsInInputs(item, oldName, newName, stepIndex)
    )
  }

  if (typeof inputs === "object" && inputs !== null) {
    const updatedInputs = {}
    for (const [key, value] of Object.entries(inputs)) {
      const updatedKey = updateBindingsInInputs(
        key,
        oldName,
        newName,
        stepIndex
      )
      updatedInputs[updatedKey] = updateBindingsInInputs(
        value,
        oldName,
        newName,
        stepIndex
      )
    }
    return updatedInputs
  }
  return inputs
}

export const updateBindingsInSteps = (
  steps,
  oldName,
  newName,
  changedStepIndex
) => {
  return steps.map(step => {
    const updatedStep = {
      ...step,
      inputs: updateBindingsInInputs(
        step.inputs,
        oldName,
        newName,
        changedStepIndex
      ),
    }

    if ("branches" in updatedStep.inputs) {
      updatedStep.inputs.branches = updatedStep.inputs.branches.map(branch => ({
        ...branch,
        condition: updateBindingsInInputs(
          branch.condition,
          oldName,
          newName,
          changedStepIndex
        ),
      }))

      if (updatedStep.inputs.children) {
        for (const [key, childSteps] of Object.entries(
          updatedStep.inputs.children
        )) {
          updatedStep.inputs.children[key] = updateBindingsInSteps(
            childSteps,
            oldName,
            newName,
            changedStepIndex
          )
        }
      }
    }

    return updatedStep
  })
}
export const getNewStepName = (automation, step) => {
  const baseName = step.name

  const countExistingSteps = steps => {
    return steps.reduce((count, currentStep) => {
      if (currentStep.name && currentStep.name.startsWith(baseName)) {
        count++
      }
      if (
        currentStep.stepId === AutomationActionStepId.BRANCH &&
        currentStep.inputs &&
        currentStep.inputs.children
      ) {
        Object.values(currentStep.inputs.children).forEach(branchSteps => {
          count += countExistingSteps(branchSteps)
        })
      }
      return count
    }, 0)
  }
  let existingCount = 0
  if (automation?.definition) {
    existingCount = countExistingSteps(automation.definition.steps)
  }
  if (existingCount === 0) {
    return baseName
  }

  return `${baseName} ${existingCount + 1}`
}
