<script>
  import { onMount } from "svelte"
  import {
    Input,
    TextArea,
    Button,
    Select,
    Toggle,
    Label,
  } from "@budibase/bbui"
  import { cloneDeep, merge } from "lodash/fp"
  import { store, backendUiStore } from "builderStore"
  import { FIELDS } from "constants/backend"
  import { notifier } from "builderStore/store/notifications"
  import ButtonGroup from "components/common/ButtonGroup.svelte"
  import NumberBox from "components/common/NumberBox.svelte"
  import ValuesList from "components/common/ValuesList.svelte"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import Checkbox from "components/common/Checkbox.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import DatePicker from "components/common/DatePicker.svelte"
  import LinkedRecordSelector from "components/common/LinkedRecordSelector.svelte"
  import * as api from "../api"

  let fieldDefinitions = cloneDeep(FIELDS)

  export let onClosed
  export let field = {
    type: "string",
    constraints: fieldDefinitions.STRING.constraints,
  }

  let originalName = field.name
  $: modelOptions = $backendUiStore.models.filter(
    model => model._id !== $backendUiStore.draftModel._id
  )

  async function saveColumn() {
    backendUiStore.update(state => {
      backendUiStore.actions.models.saveField({
        originalName,
        field,
      })
      return state
    })
    onClosed()
  }

  function handleFieldConstraints(event) {
    const { type, constraints } = fieldDefinitions[
      event.target.value.toUpperCase()
    ]
    field.type = type
    field.constraints = constraints
  }
</script>

<div class="actions">
  <Input label="Name" thin bind:value={field.name} />

  <Select
    secondary
    thin
    label="Type"
    on:change={handleFieldConstraints}
    bind:value={field.type}>
    {#each Object.values(fieldDefinitions) as field}
      <option value={field.type}>{field.name}</option>
    {/each}
  </Select>

  <Toggle
    checked={!field.constraints.presence.allowEmpty}
    on:change={e => (field.constraints.presence.allowEmpty = !e.target.checked)}
    thin
    text="Required" />

  {#if field.type === 'string'}
    <Input
      thin
      type="number"
      label="Max Length"
      bind:value={field.constraints.length.maximum} />
  {:else if field.type === 'options'}
    <ValuesList
      label="Options (one per line)"
      bind:values={field.constraints.inclusion} />
  {:else if field.type === 'datetime'}
    <DatePicker
      label="Earliest"
      bind:value={field.constraints.datetime.earliest} />
    <DatePicker label="Latest" bind:value={field.constraints.datetime.latest} />
  {:else if field.type === 'number'}
    <Input
      thin
      type="number"
      label="Min Value"
      bind:value={field.constraints.numericality.greaterThanOrEqualTo} />
    <Input
      thin
      type="number"
      label="Max Value"
      bind:value={field.constraints.numericality.lessThanOrEqualTo} />
  {:else if field.type === 'link'}
    <Select label="Table" thin secondary bind:value={field.modelId}>
      <option value="">Choose an option</option>
      {#each modelOptions as model}
        <option value={model._id}>{model.name}</option>
      {/each}
    </Select>
    <Input
      label={`Column Name in Other Table`}
      thin
      bind:value={field.fieldName} />
  {/if}
  <footer>
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={saveColumn}>Save Column</Button>
  </footer>
</div>

<style>
  .actions {
    padding: var(--spacing-xl);
    display: grid;
    grid-gap: var(--spacing-xl);
    min-width: 400px;
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
