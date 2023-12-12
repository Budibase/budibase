<script>
  import { createEventDispatcher, setContext } from "svelte"
  import ComponentSettingsSection from "../../../../pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/ComponentSettingsSection.svelte"
  import { getDatasourceForProvider } from "builderStore/dataBinding"
  import { currentAsset, store } from "builderStore"
  import { Helpers } from "@budibase/bbui"
  import { derived, writable } from "svelte/store"
  import { Utils } from "@budibase/frontend-core"

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

  setContext("multi-step-form-block", multiStepStore)

  $: defaultProps = Utils.buildMultiStepFormBlockDefaultProps({
    _id: componentInstance._id,
    stepCount: stepCount,
    step: $multiStepStore.currentStep,
  })
  $: stepCount = value?.length || 0
  $: updateStore(stepCount)
  $: dataSource = getDatasourceForProvider($currentAsset, componentInstance)
  $: emitCurrentStep($currentStep)
  $: sectionName = getSectionName($multiStepStore)
  $: stepInstance = buildPseudoInstance(value, $currentStep, defaultProps)
  $: stepDef = {
    settings: [
      {
        section: true,
        name: sectionName,
        settings: [
          {
            type: "formStepControls",
            label: "Steps",
            key: "steps",
          },
          {
            type: "text",
            label: "Title",
            key: "title",
            nested: true,
          },
          {
            type: "text",
            label: "Description",
            key: "desc",
            nested: true,
          },
          {
            type: "fieldConfiguration",
            key: "fields",
            nested: true,
          },
          {
            type: "buttonConfiguration",
            label: "Buttons",
            key: "buttons",
            wide: true,
            nested: true,
          },
        ],
      },
    ],
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

  const getSectionName = ({ stepCount, currentStep }) => {
    if (stepCount <= 1) {
      return "Details"
    }
    return `Details (Step ${currentStep + 1}/${stepCount})`
  }

  const emitCurrentStep = step => {
    store.actions.preview.sendEvent("builder-meta", {
      componentId: componentInstance._id,
      step: step,
    })
  }

  const addStep = () => {
    dispatch("change", value.toSpliced($currentStep + 1, 0, {}))
    multiStepStore.update(state => ({
      ...state,
      currentStep: $currentStep + 1,
    }))
  }

  const removeStep = () => {
    dispatch("change", value.toSpliced($currentStep, 1))
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
    dispatch("change", value.toSpliced($currentStep, 1, newStep))
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

  const buildPseudoInstance = (value, currentStep, defaultProps) => {
    const { buttons, fields, title, desc } = value?.[currentStep] || {}
    return {
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/multistepformblockstep",
      _instanceName: `Step ${currentStep + 1}`,
      title: title ?? defaultProps.title,
      buttons: buttons || defaultProps.buttons,
      fields,
      desc,

      // Needed for field configuration
      dataSource,
    }
  }
</script>

<div class="nested-section">
  <ComponentSettingsSection
    includeHidden
    componentInstance={stepInstance}
    componentDefinition={stepDef}
    onUpdateSetting={processUpdate}
    showInstanceName={false}
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
    border-top: var(--border-light);
  }
</style>
