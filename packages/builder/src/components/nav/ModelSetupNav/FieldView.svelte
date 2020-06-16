<script>
  import { backendUiStore } from "builderStore"
  import { Button } from "@budibase/bbui"
  import Dropdown from "components/common/Dropdown.svelte"
  import Textbox from "components/common/Textbox.svelte"
  import ButtonGroup from "components/common/ButtonGroup.svelte"
  import NumberBox from "components/common/NumberBox.svelte"
  import ValuesList from "components/common/ValuesList.svelte"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import Checkbox from "components/common/Checkbox.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import DatePicker from "components/common/DatePicker.svelte"
  import { keys, cloneDeep } from "lodash/fp"

  const FIELD_TYPES = ["string", "number", "boolean", "link"]

  export let field

  $: type = field.type
  $: constraints = field.constraints
  $: required =
    constraints && constraints.presence && !constraints.presence.allowEmpty

  $: console.log(field)

  const save = () => {
    // constraints.presence = required ? { allowEmpty: false } : false
    // draft[field.name] = { type, constraints }
    backendUiStore.actions.models.save($backendUiStore.draftModel)
  }
</script>

<form on:submit|preventDefault class="uk-form-stacked">
  <Textbox label="Name" bind:text={field.name} />
  <Dropdown label="Type" bind:selected={type} options={FIELD_TYPES} />

  <Checkbox label="Required" bind:checked={required} />

  {#if type === 'string'}
    <NumberBox label="Max Length" bind:value={constraints.length.maximum} />
    <ValuesList label="Categories" bind:values={constraints.inclusion} />
  {:else if type === 'datetime'}
    <DatePicker label="Min Value" bind:value={constraints.datetime.earliest} />
    <DatePicker label="Max Value" bind:value={constraints.datetime.latest} />
  {:else if type === 'number'}
    <NumberBox
      label="Min Value"
      bind:value={constraints.numericality.greaterThanOrEqualTo} />
    <NumberBox
      label="Max Value"
      bind:value={constraints.numericality.lessThanOrEqualTo} />
  {:else if type === 'link'}
    <select class="budibase__input" bind:value={field.modelId}>
      <option value={''} />
      {#each $backendUiStore.models as model}
        <option value={model._id}>{model.name}</option>
      {/each}
    </select>
  {/if}
</form>
<Button attention wide on:click={save}>Save</Button>

<style>

</style>
