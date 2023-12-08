<script>
  import { createEventDispatcher, setContext } from "svelte"
  import ComponentSettingsSection from "../../../../pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/ComponentSettingsSection.svelte"
  import { getDatasourceForProvider } from "builderStore/dataBinding"
  import { currentAsset, store } from "builderStore"
  import { Helpers } from "@budibase/bbui"
  import FormStepControls from "./FormStepControls.svelte"
  import { writable } from "svelte/store"
  import { buildMultiStepFormBlockButtonConfig } from "@budibase/frontend-core/src/utils/utils"

  export let componentInstance
  export let componentBindings
  export let value
  export let bindings

  const dispatch = createEventDispatcher()

  let stepState = [...(value || [])]

  const stepStore = writable({
    stepsCount: stepState?.length || 1,
    currentStep: 0,
  })

  setContext("step-form-block", stepStore)

  $: ({ currentStep } = $stepStore)
  $: if (stepState.length) {
    stepStore.update(state => ({
      ...state,
      stepsCount: stepState.length || 0,
    }))
  }
  $: defaultButtonConfig = buildMultiStepFormBlockButtonConfig({
    _id: componentInstance._id,
    steps: value,
    currentStep,
  })

  // Step Definition Settings
  let compSettings = [
    {
      customType: "formStepControl",
      label: "Multi-steps",
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
  ]

  const emitCurrentStep = step => {
    store.actions.preview.sendEvent("builder-meta", {
      component: {
        _id: componentInstance._id,
        step: step,
      },
    })
  }

  $: dataSource = getDatasourceForProvider($currentAsset, componentInstance)

  $: stepDef = {
    component: "@budibase/standard-components/multistepformblock-step",
    name: "Formblock step",
    settings: compSettings,
  }

  const addStep = () => {
    const newStepIdx = currentStep + 1

    stepState = [
      ...stepState.slice(0, newStepIdx),
      {},
      ...stepState.slice(newStepIdx),
    ]

    stepStore.update(state => ({
      ...state,
      currentStep: newStepIdx,
    }))

    dispatch("change", stepState)
    emitCurrentStep(newStepIdx)
  }

  const removeStep = () => {
    const clone = stepState.map(x => x)
    clone.splice(currentStep, 1)

    const targetStepIdx = Math.max(currentStep - 1, 0)
    stepState = clone.map(x => x)

    stepStore.update(state => ({
      ...state,
      currentStep: targetStepIdx,
    }))

    dispatch("change", stepState)
    emitCurrentStep(targetStepIdx)
  }

  const previousStep = () => {
    const prevStepIdx = Math.max(currentStep - 1, 0)
    stepStore.update(state => ({
      ...state,
      currentStep: prevStepIdx,
    }))
    emitCurrentStep(prevStepIdx)
  }

  const nextStep = () => {
    const nextStepIdx = currentStep + 1
    stepStore.update(state => ({
      ...state,
      currentStep: Math.min(nextStepIdx, stepState.length - 1),
    }))
    emitCurrentStep(nextStepIdx)
  }

  const updateStep = (field, val) => {
    stepState[currentStep] ||= {}
    stepState[currentStep][field.key] = val
    dispatch("change", stepState)
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
        break
      default:
        console.log("Nothing")
    }
  }

  const processUpdate = (field, val) => {
    if (field.key === "steps") {
      handleStepAction(val.action)
    } else {
      updateStep(field, val)
    }
  }

  const buildPseudoInstance = ({ buttons, fields, title, desc }) => {
    return {
      _id: Helpers.uuid(),
      _component: "@budibase/standard-components/multistepformblock-step",
      buttons: buttons || defaultButtonConfig,
      fields,
      title,
      desc,
      dataSource,
      step: currentStep + 1,
      _instanceName: `Step ${currentStep + 1}`,
    }
  }

  $: stepConfigInstance = buildPseudoInstance(stepState?.[currentStep] || {})
</script>

<span class="settings-wrap">
  <ComponentSettingsSection
    includeHidden
    componentInstance={stepConfigInstance}
    componentDefinition={stepDef}
    onUpdateSetting={processUpdate}
    getCustomComponent={type => {
      const types = { formStepControl: FormStepControls }
      return types[type]
    }}
    getCustomSectionTitle={section => {
      console.log(section.name)
      if (section.name === "Details" && stepState?.length > 0) {
        return `Details (${currentStep}/${stepState?.length})`
      }
      return section.name
    }}
    showSectionTitle={false}
    showInstanceName={false}
    isScreen={false}
    noPadding={true}
    nested={true}
    {bindings}
    {componentBindings}
  />
</span>
