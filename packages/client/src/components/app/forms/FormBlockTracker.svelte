<script lang="ts">
  import { getContext } from "svelte"
  import { screenStore } from "@/stores/screens"
  import { findChildrenByType, findComponentById } from "@/utils/components"
  import { derived, get } from "svelte/store"

  export let form
  export let stepCustomization = {}

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  const context = getContext("context")

  // Function to get available forms for builder settings
  export const getAvailableForms = () => {
    const currentScreenStore = get(screenStore)
    const activeScreen = currentScreenStore.activeScreen
    if (!activeScreen?.props) {
      return []
    }

    const forms: Array<{ label: string; value: string; subtitle: string }> = []

    // Find Multi Step Form Blocks (multistepformblock components)
    const multiStepFormBlocks: any[] = []
    findChildrenByType(
      activeScreen.props,
      "multistepformblock",
      multiStepFormBlocks
    )
    multiStepFormBlocks.forEach((formBlock: any) => {
      forms.push({
        label:
          formBlock._instanceName ||
          `Multi Step Form (${formBlock._id.slice(-4)})`,
        value: formBlock._id,
        subtitle: "Multi Step Form Block",
      })
    })

    // Also find regular Form Blocks (formblock components)
    const formBlocks: any[] = []
    findChildrenByType(activeScreen.props, "formblock", formBlocks)
    formBlocks.forEach((formBlock: any) => {
      forms.push({
        label:
          formBlock._instanceName || `Form Block (${formBlock._id.slice(-4)})`,
        value: formBlock._id,
        subtitle: "Form Block",
      })
    })

    // Find regular Form components that have FormStep children
    const formComponents: any[] = []
    findChildrenByType(activeScreen.props, "form", formComponents)
    formComponents.forEach((formComponent: any) => {
      // Check if this form has FormStep children
      const formSteps: any[] = []
      findChildrenByType(formComponent, "formstep", formSteps)
      if (formSteps.length > 0) {
        forms.push({
          label:
            formComponent._instanceName ||
            `Form with Steps (${formComponent._id.slice(-4)})`,
          value: formComponent._id,
          subtitle: `Form with ${formSteps.length} steps`,
        })
      }
    })

    return forms
  }

  // Function to get detailed information about a component by ID
  export const getComponentDetails = (componentId: string) => {
    const currentScreenStore = get(screenStore)
    const activeScreen = currentScreenStore.activeScreen
    if (!activeScreen?.props || !componentId) {
      return null
    }

    // Find the component by ID
    const component = findComponentById(activeScreen.props, componentId)
    if (!component) {
      return null
    }

    // Basic component information with form-specific analysis
    const details = {
      id: component._id,
      instanceName: component._instanceName,
      component: component._component,
      children: component._children?.length || 0,
      formAnalysis: analyzeFormComponent(component),
    }

    return details
  }

  // Function to analyze form-specific details
  const analyzeFormComponent = (component: any) => {
    const analysis: any = {
      type: "unknown",
      stepCount: 0,
      steps: [],
      dataSource: null,
      actionType: null,
    }

    // Determine component type and extract details
    if (component._component?.endsWith("/multistepformblock")) {
      analysis.type = "Multi Step Form Block"

      if (component.steps) {
        analysis.stepCount = component.steps.length
        analysis.steps = component.steps.map((step: any, index: number) => ({
          stepNumber: index + 1,
          title: step.title || `Step ${index + 1}`,
          description: step.desc,
          fieldCount: step.fields?.length || 0,
          fieldNames:
            step.fields?.map((field: any) => field.name || field.field) || [],
        }))
      }

      analysis.dataSource = component.dataSource
      analysis.actionType = component.actionType
    } else if (component._component?.endsWith("/formblock")) {
      analysis.type = "Form Block"
      analysis.dataSource = component.dataSource
      analysis.actionType = component.actionType
    } else if (component._component?.endsWith("/form")) {
      analysis.type = "Form"

      // Count FormStep children
      const formSteps: any[] = []
      findChildrenByType(component, "formstep", formSteps)
      analysis.stepCount = formSteps.length

      if (formSteps.length > 0) {
        analysis.steps = formSteps.map((step: any, index: number) => ({
          stepNumber: step.step || index + 1,
          stepId: step._id,
          instanceName: step._instanceName || `Step ${index + 1}`,
          childCount: step._children?.length || 0,
        }))
      }

      analysis.dataSource = component.dataSource
      analysis.actionType = component.actionType
    }

    return analysis
  }

  // Create a derived store to find applicable forms for display
  const _availableForms = derived([screenStore], ([_$screenStore]) => {
    return getAvailableForms()
  })

  // Get detailed information about the selected form directly from the form prop
  // Depend on $screenStore so builder updates (like adding steps) recompute details
  $: selectedFormDetails =
    form && $screenStore ? getComponentDetails(form) : null

  // Determine the provider key used by the form's context (forms inside blocks use "<blockId>-form")
  $: providerKey = (() => {
    if (!selectedFormDetails?.formAnalysis?.type) {
      return form
    }
    return selectedFormDetails.formAnalysis.type === "Form"
      ? selectedFormDetails.id
      : `${selectedFormDetails.id}-form`
  })()

  // Subscribe to the selected form's data context to track step + validation
  let formDataStore = derived(context, $ctx =>
    providerKey ? $ctx?.[providerKey] : null
  )
  $: formDataStore = derived(context, $ctx =>
    providerKey ? $ctx?.[providerKey] : null
  )

  // Expose current step and its validity from the form context
  $: currentStep = $formDataStore?.__currentStep || 1
  $: currentStepValid =
    $formDataStore?.__currentStepValid !== undefined
      ? $formDataStore.__currentStepValid
      : true

  // Track per-step statuses: "incomplete" | "current" | "valid" | "invalid"
  let stepStatuses: Array<"incomplete" | "current" | "valid" | "invalid"> = []
  let lastStep: number | null = null

  // Reset statuses when form or step count changes
  $: {
    const stepCount = selectedFormDetails?.formAnalysis?.stepCount || 0
    if (stepCount && stepStatuses.length !== stepCount) {
      stepStatuses = Array(stepCount).fill("incomplete")
      lastStep = null
    }
  }

  // When step changes forward, mark previous step as valid (passed validation)
  $: if (
    stepStatuses.length > 0 &&
    currentStep != null &&
    currentStep >= 1 &&
    currentStep <= stepStatuses.length
  ) {
    if (lastStep != null && currentStep !== lastStep) {
      if (currentStep > lastStep && lastStep - 1 in stepStatuses) {
        stepStatuses[lastStep - 1] = "valid"
      }
    }
    lastStep = currentStep
  }

  // Reflect current step validity live
  $: if (
    stepStatuses.length > 0 &&
    currentStep >= 1 &&
    currentStep <= stepStatuses.length
  ) {
    stepStatuses = stepStatuses.map((status, idx) => {
      if (idx === currentStep - 1) {
        return currentStepValid ? "current" : "invalid"
      }
      return status === "current" ? "incomplete" : status
    })
  }

  // Get step customizations or use defaults
  $: getStepCustomization = stepIndex => {
    const stepKey = `step${stepIndex + 1}`
    const stepConfig = stepCustomization?.[stepKey]

    return {
      icon: stepConfig?.icon || "ri-checkbox-circle-line",
      completedColor: stepConfig?.completedColor || "#22c55e",
      currentColor: stepConfig?.currentColor || "#3b82f6",
      incompleteColor: stepConfig?.incompleteColor || "#94a3b8",
      errorColor: stepConfig?.errorColor || "#ef4444",
    }
  }
</script>

<div use:styleable={$component.styles}>
  {#if form && selectedFormDetails}
    <div class="form-tracker">
      <h3 class="form-title">
        {selectedFormDetails.instanceName || `Form ${form.slice(-4)}`}
      </h3>

      {#if selectedFormDetails.formAnalysis.stepCount > 0}
        <div class="step-progress-tracker">
          <div class="progress-line"></div>
          <div class="steps-container">
            {#each selectedFormDetails.formAnalysis.steps as step, index}
              {@const customization = getStepCustomization(index)}
              {@const status = stepStatuses[index] || "incomplete"}
              <div class="step-indicator">
                <div class="step-icon-container">
                  <i
                    class="{customization.icon} ri-xl step-icon"
                    style="color: {status === 'valid'
                      ? customization.completedColor
                      : status === 'current'
                        ? customization.currentColor
                        : status === 'invalid'
                          ? customization.errorColor
                          : customization.incompleteColor};"
                  ></i>
                </div>
                <div class="step-info">
                  <div class="step-title">
                    {step.title || step.instanceName}
                  </div>
                  {#if step.description}
                    <div class="step-description">{step.description}</div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="no-steps">
          <p>This form doesn't have multiple steps to track.</p>
          <div class="form-info">
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="value">{selectedFormDetails.formAnalysis.type}</span>
            </div>

            {#if selectedFormDetails.formAnalysis.dataSource}
              <div class="info-row">
                <span class="label">Data Source:</span>
                <span class="value"
                  >{selectedFormDetails.formAnalysis.dataSource}</span
                >
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {:else if form}
    <div class="form-tracker error">
      <h3>Form not found</h3>
      <p>Could not find form with ID: <code>{form}</code></p>
    </div>
  {:else}
    <div class="form-tracker placeholder">
      <h3>No Form Selected</h3>
      <p>Please select a form from the settings panel.</p>
    </div>
  {/if}
</div>

<style>
  .form-tracker {
    padding: 20px;
  }

  .form-title {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    text-align: center;
  }

  .step-progress-tracker {
    position: relative;
    margin-bottom: 24px;
  }

  .progress-line {
    position: absolute;
    top: 30px;
    left: 30px;
    right: 30px;
    height: 2px;
    background: #e0e0e0;
    z-index: 1;
  }

  .steps-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 2;
  }

  .step-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 120px;
    text-align: center;
  }

  .step-icon-container {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: white;
    border: 3px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    position: relative;
    z-index: 3;
  }

  .step-icon {
    font-size: 24px;
  }

  .step-info {
    text-align: center;
  }

  .step-title {
    font-weight: 500;
    color: #333;
    font-size: 14px;
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .step-description {
    font-size: 12px;
    color: #666;
    line-height: 1.3;
  }

  .form-summary,
  .form-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
  }

  .info-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .label {
    font-weight: 500;
    color: #666;
    min-width: 100px;
  }

  .value {
    color: #333;
    font-family: monospace;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
  }

  .no-steps {
    text-align: center;
    padding: 20px;
  }

  .no-steps p {
    color: #666;
    font-size: 16px;
    margin: 0 0 16px 0;
  }

  .form-tracker.error {
    border-color: #ff6b6b;
    background: #fff5f5;
  }

  .form-tracker.placeholder {
    border-color: #ffa726;
    background: #fff8e1;
  }

  code {
    background: #f0f0f0;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 12px;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .steps-container {
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
    }

    .progress-line {
      display: none;
    }

    .step-indicator {
      margin-bottom: 20px;
    }
  }
</style>
