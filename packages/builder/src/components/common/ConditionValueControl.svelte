<script>
  import { DatePicker, Select } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import { createEventDispatcher } from "svelte"
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import DrawerBindableSlot from "@/components/common/bindings/DrawerBindableSlot.svelte"

  export let bindings = []
  export let value = null
  export let valueType = FieldType.STRING
  export let disabled = false
  export let typeSelectDisabled = undefined
  export let context = {}
  export let panel = ClientBindingPanel
  export let showTypeSelect = true

  const dispatch = createEventDispatcher()

  let currentValue = value

  $: effectiveValueType = valueType || FieldType.STRING
  $: resolvedTypeSelectDisabled = typeSelectDisabled ?? disabled
  $: currentValue = value

  const valueTypeOptions = [
    { value: FieldType.STRING, label: "Text" },
    { value: FieldType.NUMBER, label: "Number" },
    { value: FieldType.DATETIME, label: "Date" },
    { value: FieldType.BOOLEAN, label: "Boolean" },
  ]

  const bindingValueTypes = [FieldType.STRING, "Binding"]

  const updateType = newType => {
    const update = {
      value: null,
      valueType: newType,
    }
    if (newType === FieldType.BOOLEAN) {
      update.value = "true"
    }
    dispatch("change", update)
  }

  const updateValue = newValue => {
    currentValue = newValue
    dispatch("change", {
      value: newValue,
    })
  }

  const commitValue = newValue => {
    updateValue(newValue)
    dispatch("blur", {
      value: newValue,
    })
  }
</script>

{#if showTypeSelect}
  <Select
    disabled={resolvedTypeSelectDisabled || effectiveValueType === "Binding"}
    options={valueTypeOptions}
    value={effectiveValueType === "Binding"
      ? FieldType.STRING
      : effectiveValueType}
    placeholder={false}
    on:change={e => updateType(e.detail)}
    popoverAutoWidth
  />
{/if}

{#if bindingValueTypes.includes(effectiveValueType) || effectiveValueType === FieldType.NUMBER}
  <DrawerBindableInput
    {disabled}
    {bindings}
    {context}
    {panel}
    placeholder="Value"
    value={currentValue}
    inputType={effectiveValueType === FieldType.NUMBER ? "number" : undefined}
    on:change={e => updateValue(e.detail)}
    on:blur={e => commitValue(e.detail)}
  />
{:else if effectiveValueType === FieldType.DATETIME}
  <DrawerBindableSlot
    title="Value"
    type="date"
    value={currentValue}
    on:change={e => updateValue(e.detail)}
    {bindings}
    {context}
    {panel}
    updateOnChange={false}
    {disabled}
  >
    <DatePicker
      placeholder="Value"
      {disabled}
      value={currentValue}
      on:change={e => updateValue(e.detail)}
    />
  </DrawerBindableSlot>
{:else if effectiveValueType === FieldType.BOOLEAN}
  <DrawerBindableSlot
    title="Value"
    type="boolean"
    value={currentValue}
    on:change={e => updateValue(e.detail)}
    {bindings}
    {context}
    {panel}
    updateOnChange={false}
    {disabled}
  >
    <Select
      placeholder={false}
      {disabled}
      options={[
        { label: "True", value: "true" },
        { label: "False", value: "false" },
      ]}
      value={currentValue}
      popoverAutoWidth
      on:change={e => updateValue(e.detail)}
    />
  </DrawerBindableSlot>
{/if}
