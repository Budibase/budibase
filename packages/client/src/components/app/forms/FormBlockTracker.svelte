<script lang="ts">
  import { getContext } from "svelte"
  import { screenStore } from "@/stores/screens"
  import { findChildrenByType, findComponentById } from "@/utils/components"
  import { derived, get } from "svelte/store"

  export let form

  const { styleable } = getContext("sdk")
  const component = getContext("component")

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
  const availableForms = derived([screenStore], ([$screenStore]) => {
    return getAvailableForms()
  })

  // Get detailed information about the selected form directly from the form prop
  $: selectedFormDetails = form ? getComponentDetails(form) : null
</script>

<div use:styleable={$component.styles}>
  {#if form && selectedFormDetails}
    <div class="form-tracker">
      <h3 class="form-title">{selectedFormDetails.instanceName || `Form ${form.slice(-4)}`}</h3>
      <div class="form-info">
        <div class="info-row">
          <span class="label">Type:</span>
          <span class="value">{selectedFormDetails.formAnalysis.type}</span>
        </div>

        {#if selectedFormDetails.formAnalysis.stepCount > 0}
          <div class="info-row">
            <span class="label">Steps:</span>
            <span class="value">{selectedFormDetails.formAnalysis.stepCount}</span>
          </div>

          <div class="steps-list">
            {#each selectedFormDetails.formAnalysis.steps as step}
              <div class="step-item">
                <span class="step-number">{step.stepNumber}.</span>
                <div class="step-details">
                  <div class="step-title">{step.title || step.instanceName}</div>
                  {#if step.description}
                    <div class="step-description">{step.description}</div>
                  {/if}
                  {#if step.fieldCount > 0}
                    <div class="field-info">{step.fieldCount} fields</div>
                  {:else if step.childCount > 0}
                    <div class="field-info">{step.childCount} components</div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#if selectedFormDetails.formAnalysis.dataSource}
          <div class="info-row">
            <span class="label">Data Source:</span>
            <span class="value">{selectedFormDetails.formAnalysis.dataSource}</span>
          </div>
        {/if}

        {#if selectedFormDetails.formAnalysis.actionType}
          <div class="info-row">
            <span class="label">Action:</span>
            <span class="value">{selectedFormDetails.formAnalysis.actionType}</span>
          </div>
        {/if}
      </div>
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
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
  }

  .form-title {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .form-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .info-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .label {
    font-weight: 500;
    color: #666;
    min-width: 80px;
  }

  .value {
    color: #333;
    font-family: monospace;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
  }

  .steps-list {
    margin-top: 12px;
    padding-left: 8px;
  }

  .step-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    align-items: flex-start;
  }

  .step-number {
    font-weight: 600;
    color: #666;
    min-width: 20px;
  }

  .step-details {
    flex: 1;
  }

  .step-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 2px;
  }

  .step-description {
    font-size: 13px;
    color: #666;
    margin-bottom: 2px;
  }

  .field-info {
    font-size: 12px;
    color: #888;
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
</style>
