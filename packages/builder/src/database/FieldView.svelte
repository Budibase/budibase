<script>
  import Dropdown from "../common/Dropdown.svelte"
  import Textbox from "../common/Textbox.svelte"
  import Button from "../common/Button.svelte"
  import ButtonGroup from "../common/ButtonGroup.svelte"
  import NumberBox from "../common/NumberBox.svelte"
  import ValuesList from "../common/ValuesList.svelte"
  import ErrorsBox from "../common/ErrorsBox.svelte"
  import Checkbox from "../common/Checkbox.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import DatePicker from "../common/DatePicker.svelte"
  import {
    cloneDeep,
    assign,
    keys,
    isNumber,
    includes,
    map,
    isBoolean,
  } from "lodash/fp"
  import {
    allTypes,
    validate,
    getPotentialReferenceIndexes,
    getDefaultTypeOptions,
    getNode,
    getPotentialReverseReferenceIndexes,
  } from "../common/core"

  export let field
  export let allFields
  export let onFinished = () => {}
  export let store

  let errors = []
  let clonedField = cloneDeep(field)

  $: isNew = !!field && field.name.length === 0

  $: possibleReferenceIndexes = getPotentialReferenceIndexes(
    store.hierarchy,
    store.currentNode
  )

  $: selectedReverseRefIndex = !clonedField.typeOptions.indexNodeKey
    ? ""
    : getNode(store.hierarchy, clonedField.typeOptions.indexNodeKey)

  $: possibleReverseReferenceIndexes = !selectedReverseRefIndex
    ? []
    : getPotentialReverseReferenceIndexes(
        store.hierarchy,
        selectedReverseRefIndex
      )

  const typeChanged = ev =>
    (clonedField.typeOptions = getDefaultTypeOptions(ev.detail))

  const save = () => {
    errors = validate.field(allFields)(clonedField)
    if (errors.length > 0) return
    field.typeOptions = cloneDeep(clonedField.typeOptions)
    onFinished(assign(field)(clonedField))
  }
</script>

<div class="root">

  <ErrorsBox {errors} />

  <form class="uk-form-stacked">
    <Textbox label="Name" bind:text={clonedField.name} />
    <Dropdown
      label="Type"
      bind:selected={clonedField.type}
      options={keys(allTypes)}
      on:change={typeChanged} />

    <Textbox label="Label" bind:text={clonedField.label} />

    {#if clonedField.type === 'string'}
      <NumberBox
        label="Max Length"
        bind:value={clonedField.typeOptions.maxLength} />
      <ValuesList
        label="Categories"
        bind:values={clonedField.typeOptions.values} />
      <Checkbox
        label="Declared Values Only"
        bind:checked={clonedField.typeOptions.allowDeclaredValuesOnly} />
    {:else if clonedField.type === 'bool'}
      <Checkbox
        label="Allow Null"
        bind:checked={clonedField.typeOptions.allowNulls} />
    {:else if clonedField.type === 'datetime'}
      <DatePicker
        label="Min Value"
        bind:value={clonedField.typeOptions.minValue} />
      <DatePicker
        label="Max Value"
        bind:value={clonedField.typeOptions.maxValue} />
    {:else if clonedField.type === 'number'}
      <NumberBox
        label="Min Value"
        bind:value={clonedField.typeOptions.minValue} />
      <NumberBox
        label="Max Value"
        bind:value={clonedField.typeOptions.maxValue} />
      <NumberBox
        label="Decimal Places"
        bind:value={clonedField.typeOptions.decimalPlaces} />
    {:else if clonedField.type === 'reference'}
      <Dropdown
        label="Lookup Index"
        options={possibleReferenceIndexes}
        valueMember={n => n.nodeKey()}
        textMember={n => n.name}
        bind:selected={clonedField.typeOptions.indexNodeKey} />

      <Dropdown
        label="Reverse Reference Index"
        options={possibleReverseReferenceIndexes}
        multiple="true"
        valueMember={n => n.nodeKey()}
        textMember={n => n.name}
        bind:selected={clonedField.typeOptions.reverseIndexNodeKeys} />

      <Textbox
        label="Display Value"
        bind:text={clonedField.typeOptions.displayValue} />
    {:else if clonedField.type.startsWith('array')}
      <NumberBox
        label="Min Length"
        bind:value={clonedField.typeOptions.minLength} />
      <NumberBox
        label="Max Length"
        bind:value={clonedField.typeOptions.maxLength} />
    {/if}
  </form>

  <footer>
    <ActionButton primary on:click={save}>Save</ActionButton>
    <ActionButton alert on:click={() => onFinished(false)}>Cancel</ActionButton>
  </footer>
</div>

<style>
  footer {
    position: absolute;
    padding: 20px;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #fafafa;
  }
</style>
