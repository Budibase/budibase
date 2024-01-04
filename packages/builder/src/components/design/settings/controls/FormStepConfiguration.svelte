<script>
  import { createEventDispatcher, setContext } from "svelte"
  import ComponentSettingsSection from "../../../../pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/ComponentSettingsSection.svelte"
  import { getDatasourceForProvider } from "builderStore/dataBinding"
  import { currentAsset, store } from "builderStore"
  import { Helpers } from "@budibase/bbui"
  import { derived, writable } from "svelte/store"
  import { Utils } from "@budibase/frontend-core"
  import { cloneDeep } from "lodash"

  export let componentInstance
  export let componentBindings
  export let value
  export let bindings

  const dispatch = createEventDispatcher()
  const multiStepStore = writable({
    stepCount: value?.length ?? 0,
    currentStep: 0,
  })
  const currentStep = derived(multiStepStore, state => state.currentStep)
  const componentType = "@budibase/standard-components/multistepformblockstep"

  setContext("multi-step-form-block", multiStepStore)

  $: stepCount = value?.length || 0
  $: updateStore(stepCount)
  $: dataSource = getDatasourceForProvider($currentAsset, componentInstance)
  $: emitCurrentStep($currentStep)
  $: stepLabel = getStepLabel($multiStepStore)
  $: stepDef = getDefinition(stepLabel)
  $: stepSettings = value?.[$currentStep] || {}
  $: defaults = Utils.buildMultiStepFormBlockDefaultProps({
    _id: componentInstance._id,
    stepCount: $multiStepStore.stepCount,
    currentStep: $multiStepStore.currentStep,
    actionType: componentInstance.actionType,
    dataSource: componentInstance.dataSource,
  })
  $: stepInstance = {
    _id: Helpers.uuid(),
    _component: componentType,
    _instanceName: `Step ${currentStep + 1}`,
    title: stepSettings.title ?? defaults.title,
    buttons: stepSettings.buttons || defaults.buttons,
    fields: stepSettings.fields,
    desc: stepSettings.desc,

    // Needed for field configuration
    dataSource,
  }

  const getDefinition = stepLabel => {
    let def = cloneDeep(store.actions.components.getDefinition(componentType))
    def.settings.find(x => x.key === "steps").label = stepLabel
    return def
  }

  const updateStore = stepCount => {
    multiStepStore.update(state => {
      state.stepCount = stepCount
      if (state.currentStep >= stepCount) {
        state.currentStep = 0
      }
      return { ...state }
    })
  }

  const getStepLabel = ({ stepCount, currentStep }) => {
    if (stepCount <= 1) {
      return "Steps"
    }
    return `Steps (${currentStep + 1}/${stepCount})`
  }

  const emitCurrentStep = step => {
    store.actions.preview.sendEvent("builder-meta", {
      componentId: componentInstance._id,
      step: step,
    })
  }

  const addStep = () => {
    value = value.toSpliced($currentStep + 1, 0, {})
    dispatch("change", value)
    multiStepStore.update(state => ({
      ...state,
      currentStep: $currentStep + 1,
    }))
  }

  const removeStep = () => {
    value = value.toSpliced($currentStep, 1)
    dispatch("change", value)
    multiStepStore.update(state => ({
      ...state,
      currentStep: Math.min($currentStep, stepCount - 2),
    }))
  }

  const previousStep = () => {
    multiStepStore.update(state => ({
      ...state,
      currentStep: Math.max($currentStep - 1, 0),
    }))
  }

  const nextStep = () => {
    multiStepStore.update(state => ({
      ...state,
      currentStep: Math.min($currentStep + 1, value.length - 1),
    }))
  }

  const updateStep = (field, val) => {
    const newStep = {
      ...value[$currentStep],
      [field.key]: val,
    }
    value = value.toSpliced($currentStep, 1, newStep)
    dispatch("change", value)
  }

  const handleStepAction = action => {
    switch (action) {
      case "addStep":
        addStep()
        break
      case "removeStep":
        removeStep()
        break
      case "nextStep":
        nextStep()
        break
      case "previousStep":
        previousStep()
    }
  }

  const processUpdate = (field, val) => {
    if (field.key === "steps") {
      handleStepAction(val.action)
    } else {
      updateStep(field, val)
    }
  }
</script>

<div class="nested-section">
  <ComponentSettingsSection
    includeHidden
    componentInstance={stepInstance}
    componentDefinition={stepDef}
    onUpdateSetting={processUpdate}
    showSectionTitle={false}
    isScreen={false}
    nested={true}
    {bindings}
    {componentBindings}
  />
</div>

<style>
  .nested-section {
    margin: 0 calc(-1 * var(--spacing-xl)) calc(-1 * var(--spacing-xl))
      calc(-1 * var(--spacing-xl));
  }
  .nested-section :global(.property-panel) {
    padding-top: 0;
  }
</style>
