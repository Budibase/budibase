<script>
  import { createEventDispatcher, setContext } from "svelte"
  import ComponentSettingsSection from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/ComponentSettingsSection.svelte"
  import { getDatasourceForProvider } from "@/dataBinding"
  import {
    selectedScreen,
    componentStore,
    previewStore,
  } from "@/stores/builder"
  import { Helpers } from "@budibase/bbui"
  import { derived, writable } from "svelte/store"
  import { Utils } from "@budibase/frontend-core"
  import { cloneDeep, isEqual } from "lodash"

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

  let cachedValue
  let cachedInstance = {}

  $: if (!isEqual(cachedValue, value)) {
    cachedValue = value
  }
  $: if (!isEqual(componentInstance, cachedInstance)) {
    cachedInstance = componentInstance
  }
  $: stepCount = cachedValue?.length || 0
  $: updateStore(stepCount)
  $: dataSource = getDatasourceForProvider($selectedScreen, cachedInstance)
  $: emitCurrentStep($currentStep)
  $: stepLabel = getStepLabel($multiStepStore)
  $: stepDef = getDefinition(stepLabel)
  $: savedInstance = cachedValue?.[$currentStep] || {}
  $: defaults = Utils.buildMultiStepFormBlockDefaultProps({
    _id: cachedInstance._id,
    stepCount: $multiStepStore.stepCount,
    currentStep: $multiStepStore.currentStep,
    actionType: cachedInstance.actionType,
    dataSource: cachedInstance.dataSource,
  })
  // For backwards compatibility we need to sometimes manually set base
  // properties like _id and _component as we didn't used to save these
  $: stepInstance = {
    _id: savedInstance._id || Helpers.uuid(),
    _component: savedInstance._component || componentType,
    _instanceName: `Step ${currentStep + 1}`,
    title: savedInstance.title ?? defaults?.title,
    buttons: savedInstance.buttons || defaults?.buttons,
    buttonsCollapsed: savedInstance.buttonsCollapsed,
    buttonsCollapsedText: savedInstance.buttonsCollapsedText,
    fields: savedInstance.fields,
    desc: savedInstance.desc,

    // Needed for field configuration
    dataSource,
  }

  const getDefinition = stepLabel => {
    let def = cloneDeep(componentStore.getDefinition(componentType))
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
    previewStore.sendEvent("builder-meta", {
      componentId: componentInstance._id,
      step: step,
    })
  }

  const addStep = () => {
    const newInstance = componentStore.createInstance(componentType)
    value = value.toSpliced($currentStep + 1, 0, newInstance)
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
