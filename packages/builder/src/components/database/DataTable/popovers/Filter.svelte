<script>
  import {
    Popover,
    TextButton,
    Button,
    Icon,
    Input,
    Select,
  } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import CreateEditRecord from "../modals/CreateEditRecord.svelte"

  const CONDITIONS = [
    {
      name: "Equals",
      key: "EQUALS",
    },
    {
      name: "Less Than",
      key: "LT",
    },
    {
      name: "Less Than Or Equal",
      key: "LTE",
    },
    {
      name: "More Than",
      key: "MT",
    },
    {
      name: "More Than Or Equal",
      key: "MTE",
    },
    {
      name: "Contains",
      key: "CONTAINS",
    },
  ]

  const CONJUNCTIONS = [
    {
      name: "Or",
      key: "OR",
    },
    {
      name: "And",
      key: "AND",
    },
  ]

  export let view = {}

  let anchor
  let dropdown
  let filters = view.filters || []

  $: viewModel = $backendUiStore.models.find(
    ({ _id }) => _id === $backendUiStore.selectedView.modelId
  )
  $: fields = viewModel && Object.keys(viewModel.schema)

  function saveView() {
    view.filters = filters
    backendUiStore.actions.views.save(view)
    notifier.success(`View ${view.name} saved.`)
    dropdown.hide()
  }

  function removeFilter(idx) {
    filters.splice(idx, 1)
    filters = filters
  }

  function addFilter() {
    filters = [...filters, {}]
  }
</script>

<div bind:this={anchor}>
  <TextButton
    text
    small
    on:click={dropdown.show}
    active={filters && filters.length}>
    <Icon name="filter" />
    Filter
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <h5>Filter</h5>
  <div class="input-group-row">
    {#each filters as filter, idx}
      {#if idx === 0}
        <p>Where</p>
      {:else}
        <Select secondary thin bind:value={filter.conjunction}>
          {#each CONJUNCTIONS as conjunction}
            <option value={conjunction.key}>{conjunction.name}</option>
          {/each}
        </Select>
      {/if}
      <Select secondary thin bind:value={filter.key}>
        {#each fields as field}
          <option value={field}>{field}</option>
        {/each}
      </Select>
      <Select secondary thin bind:value={filter.condition}>
        {#each CONDITIONS as condition}
          <option value={condition.key}>{condition.name}</option>
        {/each}
      </Select>
      <Input
        thin
        placeholder={filter.key || fields[0]}
        bind:value={filter.value} />
      <i class="ri-close-circle-fill" on:click={() => removeFilter(idx)} />
    {/each}
  </div>
  <div class="button-group">
    <Button text on:click={addFilter}>Add Filter</Button>
    <div>
      <Button secondary on:click={dropdown.hide}>Cancel</Button>
      <Button primary on:click={saveView}>Save</Button>
    </div>
  </div>
</Popover>

<style>
  h5 {
    margin-bottom: var(--spacing-l);
    font-weight: 500;
  }

  .button-group {
    margin-top: var(--spacing-l);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :global(.button-group > div > button) {
    margin-left: var(--spacing-m);
  }

  .ri-close-circle-fill {
    cursor: pointer;
  }

  .input-group-row {
    display: grid;
    grid-template-columns: minmax(50px, auto) 1fr 1fr 1fr 15px;
    gap: var(--spacing-s);
    margin-bottom: var(--spacing-l);
    align-items: center;
  }

  p {
    margin: 0;
    font-size: var(--font-size-xs);
  }
</style>
