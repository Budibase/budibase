<script>
  import { onMount } from "svelte"
  import { Input, TextArea, Button, Select } from "@budibase/bbui"
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

  export let onClosed
  export let field = {}

  let fieldDefinitions = cloneDeep(FIELDS)
  let originalName = field.name

  $: required =
    field.constraints &&
    field.constraints.presence &&
    !field.constraints.presence.allowEmpty
  $: if (field.type) {
    field.constraints = merge(
      fieldDefinitions[field.type.toUpperCase()].constraints,
      field.constraints
    )
  }

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
</script>

<div class="actions">
  <Input placeholder="Name" thin bind:value={field.name} />

  <Select secondary thin bind:value={field.type}>
    {#each Object.values(fieldDefinitions) as field}
      <option value={field.type}>{field.name}</option>
    {/each}
  </Select>

  <div class="info">
    <div class="field">
      <label>Required</label>
      <input
        type="checkbox"
        bind:checked={required}
        on:change={() => (field.constraints.presence.allowEmpty = required)} />
    </div>

    {#if field.type === 'string'}
      <NumberBox
        label="Max Length"
        bind:value={field.constraints.length.maximum} />
      <ValuesList
        label="Categories"
        bind:values={field.constraints.inclusion} />
    {:else if field.type === 'datetime'}
      <DatePicker
        label="Min Value"
        bind:value={field.constraints.datetime.earliest} />
      <DatePicker
        label="Max Value"
        bind:value={field.constraints.datetime.latest} />
    {:else if field.type === 'number'}
      <NumberBox
        label="Min Value"
        bind:value={field.constraints.numericality.greaterThanOrEqualTo} />
      <NumberBox
        label="Max Value"
        bind:value={field.constraints.numericality.lessThanOrEqualTo} />
    {:else if field.type === 'link'}
      <div class="field">
        <label>Link</label>
        <select class="budibase__input" bind:value={field.modelId}>
          <option value={''} />
          {#each $backendUiStore.models as model}
            {#if model._id !== $backendUiStore.draftModel._id}
              <option value={model._id}>{model.name}</option>
            {/if}
          {/each}
        </select>
      </div>
    {/if}
  </div>

</div>
<footer>
  <div class="button-margin-3">
    <Button secondary on:click={onClosed}>Cancel</Button>
  </div>
  <div class="button-margin-4">
    <Button primary on:click={saveColumn}>Save Column</Button>
  </div>
</footer>

<style>
  .actions {
    padding: var(--spacing-l) var(--spacing-xl);
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  footer {
    padding: 20px 30px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    background: var(--grey-1);
    border-bottom-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }

  .field {
    display: grid;
    grid-template-columns: auto 20px 1fr;
    align-items: center;
    grid-gap: 5px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: var(--spacing-l);
    font-family: var(--font-normal);
  }

  .button-margin-3 {
    grid-column-start: 3;
    display: grid;
  }

  .button-margin-4 {
    grid-column-start: 4;
    display: grid;
  }
</style>
