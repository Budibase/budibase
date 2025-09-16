<script lang="ts">
  import { getContext } from "svelte"
  import { screenStore } from "@/stores/screens"
  import { findChildrenByType } from "@/utils/components"
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

    const forms: Array<{label: string, value: string, subtitle: string}> = []
    
    // Find Multi Step Form Blocks (multistepformblock components)
    const multiStepFormBlocks: any[] = []
    findChildrenByType(activeScreen.props, "multistepformblock", multiStepFormBlocks)
    multiStepFormBlocks.forEach((formBlock: any) => {
      forms.push({
        label: formBlock._instanceName || `Multi Step Form (${formBlock._id.slice(-4)})`,
        value: formBlock._id,
        subtitle: "Multi Step Form Block"
      })
    })

    // Also find regular Form Blocks (formblock components)
    const formBlocks: any[] = []
    findChildrenByType(activeScreen.props, "formblock", formBlocks)
    formBlocks.forEach((formBlock: any) => {
      forms.push({
        label: formBlock._instanceName || `Form Block (${formBlock._id.slice(-4)})`,
        value: formBlock._id,
        subtitle: "Form Block"
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
          label: formComponent._instanceName || `Form with Steps (${formComponent._id.slice(-4)})`,
          value: formComponent._id,
          subtitle: `Form with ${formSteps.length} steps`
        })
      }
    })

    return forms
  }

  // Provide context for potential builder integration
  export const getAvailableFormOptions = () => {
    const forms = getAvailableForms()
    console.log("FormBlockTracker - getAvailableFormOptions called, returning:", forms.map(form => ({ label: form.label, value: form.value })))
    return forms.map(form => ({
      label: form.label,
      value: form.value
    }))
  }

  // Also try making it available as a global function on the window
  $: if (typeof window !== 'undefined' && $availableForms.length > 0) {
    ;(window as any).budibaseFormBlockTrackerOptions = getAvailableFormOptions()
  }

  // Create a derived store to find applicable forms for display
  const availableForms = derived(
    [screenStore],
    ([$screenStore]) => {
      const activeScreen = $screenStore.activeScreen
      console.log("FormBlockTracker - Active screen:", activeScreen)
      console.log("FormBlockTracker - Screen props:", activeScreen?.props)
      
      const forms = getAvailableForms()
      console.log("FormBlockTracker - Available forms:", forms)
      return forms
    }
  )

  // Find the selected form details or auto-detect
  $: selectedForm = (() => {
    if (form === "Auto-detect from page" || !form) {
      // Auto-detect: use the first available form
      return $availableForms[0] || null
    }
    // Look for specific form by ID
    return $availableForms.find(f => f.value === form) || null
  })()

  // Export options for the builder settings system
  export const getSettingOptions = (key: string) => {
    if (key === 'form') {
      const options = getAvailableFormOptions()
      console.log("FormBlockTracker - getSettingOptions called for form:", options)
      return options
    }
    return []
  }

  // Export form options directly for builder
  export const formOptions = derived(availableForms, $availableForms => {
    const options = $availableForms.map(form => ({
      label: form.label,
      value: form.value
    }))
    console.log("FormBlockTracker - formOptions derived:", options)
    return options
  })

  // Try to provide options through component instance
  $: if ($component) {
    const options = getAvailableFormOptions()
    console.log("FormBlockTracker - Setting component options:", options)
    // Try to set options on the component instance for builder access
    if (typeof ($component as any).setOptions === 'function') {
      ($component as any).setOptions('form', options)
    }
  }
</script>

<div use:styleable={$component.styles}>
  {#if selectedForm}
    <h2>Tracking: {selectedForm.label}</h2>
    <p>Type: {selectedForm.subtitle}</p>
    <p>ID: {selectedForm.value}</p>
  {:else if form}
    <h2>Form not found: {form}</h2>
    <p>Available forms: {$availableForms.length}</p>
    {#each $availableForms as availableForm}
      <p>- {availableForm.label} ({availableForm.value})</p>
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
