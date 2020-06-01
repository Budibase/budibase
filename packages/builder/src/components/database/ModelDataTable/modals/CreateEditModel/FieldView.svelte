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

  export let field = {
    type: "string",
    constraints: { type: "string", presence: false },
  }
  export let schema
  export let goBack

  let errors = []
  let draftField = cloneDeep(field)

  let type = field.type
  let constraints = field.constraints
  let required =
    field.constraints.presence && !field.constraints.presence.allowEmpty

  const save = () => {
    constraints.presence = required ? { allowEmpty: false } : false
    draftField.constraints = constraints
    draftField.type = type
    schema[field.name] = draftField
    goBack()
  }

  $: constraints =
    type === "string"
      ? { type: "string", length: {}, presence: false }
      : type === "number"
      ? { type: "number", presence: false, numericality: {} }
      : type === "boolean"
      ? { type: "boolean", presence: false }
      : type === "datetime"
      ? { type: "date", datetime: {}, presence: false }
      : type.startsWith("array")
      ? { type: "array", presence: false }
      : { type: "string", presence: false }
</script>

<div class="root">

  <ErrorsBox {errors} />

  <form on:submit|preventDefault class="uk-form-stacked">
    <Textbox label="Name" bind:text={field.name} />
    <Dropdown label="Type" bind:selected={type} options={FIELD_TYPES} />

    <Checkbox label="Required" bind:checked={required} />

    {#if type === 'string'}
      <NumberBox label="Max Length" bind:value={constraints.length.maximum} />
      <ValuesList label="Categories" bind:values={constraints.inclusion} />
    {:else if type === 'datetime'}
      <DatePicker
        label="Min Value"
        bind:value={constraints.datetime.earliest} />
      <DatePicker label="Max Value" bind:value={constraints.datetime.latest} />
    {:else if type === 'number'}
      <NumberBox
        label="Min Value"
        bind:value={constraints.numericality.greaterThanOrEqualTo} />
      <NumberBox
        label="Max Value"
        bind:value={constraints.numericality.lessThanOrEqualTo} />
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
