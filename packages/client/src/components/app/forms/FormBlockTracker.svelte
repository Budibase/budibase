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

    console.log("FormBlockTracker - Found component:", component)

    // Basic component information
    const details = {
      id: component._id,
      instanceName: component._instanceName,
      component: component._component,
      styles: component._styles,
      children: component._children?.length || 0,
      props: component,

      // Form-specific analysis
      formAnalysis: analyzeFormComponent(component),
    }

    console.log("DETAILS", details)
    return details
  }

  // Function to analyze form-specific details
  const analyzeFormComponent = (component: any) => {
    const analysis: any = {
      type: "unknown",
      stepCount: 0,
      steps: [],
      fields: [],
      buttons: [],
      dataSource: null,
      actionType: null,
    }

    // Determine component type
    if (component._component?.endsWith("/multistepformblock")) {
      analysis.type = "Multi Step Form Block"

      // Multi Step Form Block specific analysis
      if (component.steps) {
        analysis.stepCount = component.steps.length
        analysis.steps = component.steps.map((step: any, index: number) => ({
          stepNumber: index + 1,
          title: step.title || `Step ${index + 1}`,
          description: step.desc,
          fields: step.fields?.length || 0,
          fieldNames:
            step.fields?.map((field: any) => field.name || field.field) || [],
          buttons: step.buttons || [],
        }))
      }

      analysis.dataSource = component.dataSource
      analysis.actionType = component.actionType
      analysis.buttonPosition = component.buttonPosition
      analysis.size = component.size
    } else if (component._component?.endsWith("/formblock")) {
      analysis.type = "Form Block"
      // Regular form block analysis
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
          instanceName: step._instanceName,
          children: step._children?.length || 0,
          childComponents:
            step._children?.map((child: any) => child._component) || [],
        }))
      }

      // Find field components within the form
      const allFields: any[] = []
      findChildrenByType(component, "*field", allFields) // This might catch various field types
      analysis.fields = allFields.map((field: any) => ({
        id: field._id,
        type: field._component,
        instanceName: field._instanceName,
        field: field.field,
        label: field.label,
      }))

      analysis.dataSource = component.dataSource
      analysis.actionType = component.actionType
      analysis.size = component.size
      analysis.disabled = component.disabled
      analysis.readonly = component.readonly
    }

    return analysis
  }

  // Provide context for potential builder integration
  export const getAvailableFormOptions = () => {
    const forms = getAvailableForms()
    // console.log(
    //   "1 FormBlockTracker - getAvailableFormOptions called, returning:",
    //   forms.map(form => ({ label: form.label, value: form.value }))
    // )
    return forms.map(form => ({
      label: form.label,
      value: form.value,
    }))
  }

  // Also try making it available as a global function on the window
  $: if (typeof window !== "undefined" && $availableForms.length > 0) {
    ;(window as any).budibaseFormBlockTrackerOptions = getAvailableFormOptions()
  }

  // Create a derived store to find applicable forms for display
  const availableForms = derived([screenStore], ([$screenStore]) => {
    const activeScreen = $screenStore.activeScreen

    const forms = getAvailableForms()

    return forms
  })

  // Find the selected form details
  $: selectedForm = (() => {
    if (!form) {
      // No form selected, use first available
      return $availableForms[0] || null
    }
    // Look for specific form by ID
    const found = $availableForms.find(f => f.value === form)
    return found || null
  })()

  // Export options for the builder settings system
  export const getSettingOptions = (key: string) => {
    if (key === "form") {
      const options = getAvailableFormOptions()
      return options
    }
    return []
  }

  // Export form options directly for builder
  export const formOptions = derived(availableForms, $availableForms => {
    const options = $availableForms.map(form => ({
      label: form.label,
      value: form.value,
    }))
    return options
  })

  // Try to provide options through component instance
  $: if ($component) {
    const options = getAvailableFormOptions()
    console.log("7 FormBlockTracker - Setting component options:", options)
    // Try to set options on the component instance for builder access
    if (typeof ($component as any).setOptions === "function") {
      ;($component as any).setOptions("form", options)
    }
  }
</script>

<div use:styleable={$component.styles}>
  <p>Form {JSON.stringify(selectedForm)}</p>
  {#if selectedForm}
    <h2>Tracking: {selectedForm.label}</h2>
    <p>Type: {selectedForm.subtitle}</p>
    <p>ID: {selectedForm.value}</p>
    <p>{getComponentDetails(selectedForm.)}</p>
  {:else if form}
    <h2>Form not found: {form}</h2>
    <p>Available forms: {$availableForms.length}</p>
    {#each $availableForms as availableForm}
      <p>- {availableForm.label} ({availableForm.value})</p>
      <p>{JSON.stringify(availableForm)}</p>
    {/each}
  {:else}
    <p>No form selected</p>
    <p>Available forms: {$availableForms.length}</p>
    {#each $availableForms as availableForm}
      <p>- {availableForm.label}</p>
    {/each}
  {/if}
</div>

<style>
</style>
