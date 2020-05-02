<script>
  import Dropdown from "components/common/Dropdown.svelte"
  import Textbox from "components/common/Textbox.svelte"
  import Button from "components/common/Button.svelte"
  import ButtonGroup from "components/common/ButtonGroup.svelte"
  import NumberBox from "components/common/NumberBox.svelte"
  import ValuesList from "components/common/ValuesList.svelte"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import Checkbox from "components/common/Checkbox.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import DatePicker from "components/common/DatePicker.svelte"
  import { keys, cloneDeep } from "lodash/fp"

  const FIELD_TYPES = ["string", "number", "boolean"]

  export let field = { type: "string" }
  export let schema
  export let goBack

  let errors = []
  let draftField = cloneDeep(field)

  const save = () => {
    schema[field.name] = draftField
    goBack()
  }
</script>

<div class="root">

  <ErrorsBox {errors} />

  <form on:submit|preventDefault class="uk-form-stacked">
    <Textbox label="Name" bind:text={field.name} />
    <Dropdown
      label="Type"
      bind:selected={draftField.type}
      options={FIELD_TYPES} />

    {#if field.type === 'string'}
      <NumberBox label="Max Length" bind:value={draftField.maxLength} />
      <ValuesList label="Categories" bind:values={draftField.values} />
    {:else if field.type === 'boolean'}
      <!-- TODO: revisit and fix with JSON schema -->
      <Checkbox label="Allow Null" bind:checked={draftField.allowNulls} />
    {:else if field.format === 'datetime'}
      <!-- TODO: revisit and fix with JSON schema -->
      <DatePicker label="Min Value" bind:value={draftField.minValue} />
      <DatePicker label="Max Value" bind:value={draftField.maxValue} />
    {:else if field.type === 'number'}
      <NumberBox label="Min Value" bind:value={draftField.minimum} />
      <NumberBox label="Max Value" bind:value={draftField.maximum} />
    {:else if draftField.type.startsWith('array')}
      <!-- TODO: revisit and fix with JSON schema -->
      <NumberBox
        label="Min Length"
        bind:value={draftField.typeOptions.minLength} />
      <NumberBox
        label="Max Length"
        bind:value={draftField.typeOptions.maxLength} />
    {/if}
  </form>
</div>
<footer>
  <ActionButton primary on:click={save}>Save</ActionButton>
  <ActionButton alert on:click={goBack}>Cancel</ActionButton>
</footer>

<style>
  .root {
    margin: 20px;
  }
  footer {
    padding: 20px;
    border-radius: 0 0 5px 5px;
    bottom: 0;
    left: 0;
    background: #fafafa;
  }
</style>
