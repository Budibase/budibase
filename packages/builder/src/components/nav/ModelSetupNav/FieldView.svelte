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

  let field = {}

  $: field = $backendUiStore.draftModel.schema[$backendUiStore.selectedField] || {}
  $: required =
    field.constraints && field.constraints.presence && !constraints.presence.allowEmpty

  const save = () => {
    backendUiStore.actions.models.save({ 
      instanceId: $backendUiStore.selectedDatabase._id,
      model: $backendUiStore.draftModel
    })
  }
</script>

<form on:submit|preventDefault class="uk-form-stacked">
  <Textbox label="Name" bind:text={field.name} />
  <Dropdown label="Type" bind:selected={field.type} options={FIELD_TYPES} />

  <Checkbox label="Required" bind:checked={required} />

  {#if field.type === 'string'}
    <NumberBox label="Max Length" bind:value={field.constraints.length.maximum} />
    <ValuesList label="Categories" bind:values={field.constraints.inclusion} />
  {:else if field.type === 'datetime'}
    <DatePicker label="Min Value" bind:value={field.constraints.datetime.earliest} />
    <DatePicker label="Max Value" bind:value={field.constraints.datetime.latest} />
  {:else if field.type === 'number'}
    <NumberBox
      label="Min Value"
      bind:value={field.constraints.numericality.greaterThanOrEqualTo} />
    <NumberBox
      label="Max Value"
      bind:value={field.constraints.numericality.lessThanOrEqualTo} />
  {:else if field.type === 'link'}
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
