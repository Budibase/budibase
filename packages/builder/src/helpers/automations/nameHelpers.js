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

const parseStepName = name => {
  const match = name.match(/^(.*?)(?: (\d+))?$/)
  return {
    rootName: match?.[1] || name,
    suffix: match?.[2] ? Number(match[2]) : 1,
  }
}

const getStepDisplayName = (automation, step) => {
  return automation?.definition?.stepNames?.[step.id] || step.name
}

const getHighestExistingSuffix = (automation, rootName) => {
  const countExistingSteps = steps => {
    return steps.reduce((highestSuffix, currentStep) => {
      const currentName = getStepDisplayName(automation, currentStep)
      if (currentName) {
        const { rootName: currentRootName, suffix } = parseStepName(currentName)
        if (currentRootName === rootName) {
          highestSuffix = Math.max(highestSuffix, suffix)
        }
      }
      if (
        currentStep.stepId === AutomationActionStepId.BRANCH &&
        currentStep.inputs &&
        currentStep.inputs.children
      ) {
        Object.values(currentStep.inputs.children).forEach(branchSteps => {
          highestSuffix = Math.max(
            highestSuffix,
            countExistingSteps(branchSteps)
          )
        })
      }
      if (
        currentStep.stepId === AutomationActionStepId.LOOP_V2 &&
        currentStep.inputs &&
        Array.isArray(currentStep.inputs.children)
      ) {
        highestSuffix = Math.max(
          highestSuffix,
          countExistingSteps(currentStep.inputs.children)
        )
      }
      return highestSuffix
    }, 0)
  }

  return automation?.definition
    ? countExistingSteps(automation.definition.steps)
    : 0
}

export const getDuplicateStepName = (automation, stepOrName) => {
  const name =
    typeof stepOrName === "string" ? stepOrName : stepOrName?.name || ""
  const { rootName, suffix } = parseStepName(name)
  const highestExistingSuffix = getHighestExistingSuffix(automation, rootName)
  return `${rootName} ${Math.max(highestExistingSuffix, suffix) + 1}`
}

export const getNewStepName = (automation, step) => {
  const { rootName, suffix: currentSuffix } = parseStepName(step.name)
  const highestExistingSuffix = getHighestExistingSuffix(automation, rootName)
  if (highestExistingSuffix === 0) {
    return step.name
  }

  return `${rootName} ${Math.max(highestExistingSuffix, currentSuffix) + 1}`
}
