<script>
  import { backendUiStore } from "builderStore"
  import { Button } from "@budibase/bbui"
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

  $: field =
    $backendUiStore.draftModel.schema[$backendUiStore.selectedField] || {}
  $: required =
    field.constraints &&
    field.constraints.presence &&
    !field.constraints.presence.allowEmpty
</script>

<div class="info">
  <div class="field-box">
    <header>Name</header>
    <input class="budibase__input" type="text" bind:value={field.name} />
  </div>
</div>

<div class="info">
  <div class="field-box">
    <header>Type</header>
    <span>{field.type}</span>
  </div>
</div>

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
    <ValuesList label="Categories" bind:values={field.constraints.inclusion} />
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

<style>
  .info {
    margin-bottom: 16px;
    border-radius: 5px;
  }

  label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .field {
    display: grid;
    align-items: center;
    margin-bottom: 16px;
  }

  .field-box header {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .field-box span {
    background: var(--grey-2);
    color: var(--grey-6);
    font-weight: 400;
    height: 36px;
    display: grid;
    align-items: center;
    padding-left: 12px;
    text-transform: capitalize;
    border-radius: 5px;
    cursor: not-allowed;
  }
</style>
