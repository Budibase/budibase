<script>
  import { Label, Button, Icon, Divider } from "@budibase/bbui"
  import { IconSelect } from "./IconSelect"
  import ColorPicker from "./ColorPicker.svelte"
  import { createEventDispatcher } from "svelte"
  import { selectedScreen } from "@/stores/builder"

  export let componentInstance = {}
  export let value = {}

  const dispatch = createEventDispatcher()

  let currentFormId = null
  let isInitializing = false
  let steps = []

  // Watch for form changes and step count changes; recompute and initialize
  $: {
    const formId = componentInstance?.form
    const formDetails = getFormDetails()
    const newSteps = formDetails?.steps || []
    const changedForm = formId !== currentFormId
    const countChanged = newSteps.length !== steps.length
    if ((changedForm || countChanged) && !isInitializing) {
      currentFormId = formId
      steps = newSteps
      initializeStepCustomizations(newSteps.length)
    }
  }

  function getFormDetails() {
    if (!componentInstance?.form || !$selectedScreen?.props) {
      return null
    }

    const formId = componentInstance.form
    const component = findComponentById($selectedScreen.props, formId)

    if (!component) return null

    return analyzeFormComponent(component)
  }

  function findComponentById(component, targetId) {
    if (component._id === targetId) {
      return component
    }
    if (component._children) {
      for (const child of component._children) {
        const found = findComponentById(child, targetId)
        if (found) return found
      }
    }
    return null
  }

  function analyzeFormComponent(component) {
    const analysis = {
      type: "unknown",
      stepCount: 0,
      steps: [],
    }

    if (component._component?.endsWith("/multistepformblock")) {
      analysis.type = "Multi Step Form Block"
      if (component.steps) {
        analysis.stepCount = component.steps.length
        analysis.steps = component.steps.map((step, index) => ({
          stepNumber: index + 1,
          title: step.title || `Step ${index + 1}`,
          description: step.desc,
        }))
      }
    } else if (component._component?.endsWith("/form")) {
      analysis.type = "Form"
      const formSteps = []
      findChildrenByType(component, "formstep", formSteps)
      analysis.stepCount = formSteps.length
      if (formSteps.length > 0) {
        analysis.steps = formSteps.map((step, index) => ({
          stepNumber: step.step || index + 1,
          stepId: step._id,
          title: step._instanceName || `Step ${index + 1}`,
        }))
      }
    }

    return analysis
  }

  function findChildrenByType(component, type, results = []) {
    if (component._component?.endsWith(`/${type}`)) {
      results.push(component)
    }
    if (component._children) {
      for (const child of component._children) {
        findChildrenByType(child, type, results)
      }
    }
    return results
  }

  function getStepValue(stepIndex, property) {
    return (
      value?.[`step${stepIndex + 1}`]?.[property] || getDefaultValue(property)
    )
  }

  function getDefaultValue(property) {
    // Prefer component-level defaults if provided
    if (property === "icon" && componentInstance?.icon) {
      return componentInstance.icon
    }
    if (property === "completedColor" && componentInstance?.completedColor) {
      return componentInstance.completedColor
    }
    if (property === "currentColor" && componentInstance?.currentColor) {
      return componentInstance.currentColor
    }
    if (property === "incompleteColor" && componentInstance?.incompleteColor) {
      return componentInstance.incompleteColor
    }
    if (property === "errorColor" && componentInstance?.errorColor) {
      return componentInstance.errorColor
    }
    const defaults = {
      icon: "ri-checkbox-circle-line",
      completedColor: "#22c55e",
      currentColor: "#3b82f6",
      incompleteColor: "#94a3b8",
      errorColor: "#ef4444",
    }
    return defaults[property]
  }

  function updateStepValue(stepIndex, property, newValue) {
    const stepKey = `step${stepIndex + 1}`
    const newValueObj = { ...value }

    if (!newValueObj[stepKey]) {
      newValueObj[stepKey] = {}
    }

    newValueObj[stepKey][property] = newValue

    value = newValueObj
    dispatch("change", value)
  }

  function resetStep(stepIndex) {
    const stepKey = `step${stepIndex + 1}`
    const newValueObj = { ...value }

    newValueObj[stepKey] = {
      icon: getDefaultValue("icon"),
      completedColor: getDefaultValue("completedColor"),
      currentColor: getDefaultValue("currentColor"),
      incompleteColor: getDefaultValue("incompleteColor"),
      errorColor: getDefaultValue("errorColor"),
    }

    value = newValueObj
    dispatch("change", value)
  }

  function initializeStepCustomizations(expectedStepCount) {
    if (isInitializing) return

    isInitializing = true

    try {
      // Only initialize if we don't have any existing customizations for this form's steps
      // or if the number of steps has changed
      const currentStepKeys = Object.keys(value || {}).filter(key =>
        key.startsWith("step")
      )

      if (
        currentStepKeys.length !== expectedStepCount ||
        expectedStepCount === 0
      ) {
        const newValueObj = {}

        // Only create entries for forms that have steps
        if (expectedStepCount > 0) {
          // Preserve existing customizations where possible
          for (let i = 0; i < expectedStepCount; i++) {
            const stepKey = `step${i + 1}`
            newValueObj[stepKey] = value?.[stepKey] || {
              icon: getDefaultValue("icon"),
              completedColor: getDefaultValue("completedColor"),
              currentColor: getDefaultValue("currentColor"),
              incompleteColor: getDefaultValue("incompleteColor"),
            }
          }
        }

        value = newValueObj
        dispatch("change", value)
      }
    } finally {
      isInitializing = false
    }
  }
</script>

<div class="form-step-customization">
  {#if steps.length > 0}
    {#each steps as step, index (componentInstance?.form + "-" + step.stepNumber)}
      <div class="step-section">
        <div class="step-header">
          <h4>Step {step.stepNumber}: {step.title}</h4>
        </div>

        {#if step.description}
          <p class="step-description">{step.description}</p>
        {/if}

        <div class="step-settings">
          <div class="setting-row">
            <Label>Icon</Label>
            <IconSelect
              value={getStepValue(index, "icon")}
              on:change={e => updateStepValue(index, "icon", e.detail)}
            />
          </div>
        </div>

        {#if index < steps.length - 1}
          <Divider />
        {/if}
      </div>
    {/each}
  {:else if componentInstance?.form}
    <div class="no-steps">
      <p>No steps found in the selected form.</p>
    </div>
  {:else}
    <div class="no-form">
      <p>Please select a form first to customize step settings.</p>
    </div>
  {/if}
</div>

<style>
  .form-step-customization {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .step-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .step-header h4 {
    margin: 0;
    color: var(--spectrum-global-color-gray-800);
    font-size: 16px;
  }

  .step-description {
    margin: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-600);
  }

  .step-settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .setting-row,
  .preview-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .preview-icons {
    display: flex;
    gap: var(--spacing-l);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-50);
  }

  .preview-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .preview-item span {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .no-steps,
  .no-form {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--spectrum-global-color-gray-600);
  }
</style>
