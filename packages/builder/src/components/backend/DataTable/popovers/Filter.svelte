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
  import CreateEditRecord from "./CreateEditRecord.svelte"

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

  $: viewModel = $backendUiStore.models.find(
    ({ _id }) => _id === $backendUiStore.selectedView.modelId
  )
  $: fields = viewModel && Object.keys(viewModel.schema)

  function saveView() {
    backendUiStore.actions.views.save(view)
    notifier.success(`View ${view.name} saved.`)
    dropdown.hide()
  }

  function removeFilter(idx) {
    view.filters.splice(idx, 1)
    view.filters = view.filters
  }

  function addFilter() {
    view.filters.push({})
    view.filters = view.filters
  }

  function isMultipleChoice(field) {
    return (
      viewModel.schema[field].constraints &&
      viewModel.schema[field].constraints.inclusion &&
      viewModel.schema[field].constraints.inclusion.length
    )
  }
</script>

<div bind:this={anchor}>
  <TextButton
    text
    small
    on:click={dropdown.show}
    active={view.filters && view.filters.length}>
    <Icon name="filter" />
    Filter
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <div class="actions">
    <h5>Filter</h5>
    {#if view.filters.length}
      <div class="input-group-row">
        {#each view.filters as filter, idx}
          {#if idx === 0}
            <p>Where</p>
          {:else}
            <Select secondary thin bind:value={filter.conjunction}>
              <option value="">Choose an option</option>
              {#each CONJUNCTIONS as conjunction}
                <option value={conjunction.key}>{conjunction.name}</option>
              {/each}
            </Select>
          {/if}
          <Select secondary thin bind:value={filter.key}>
            <option value="">Choose an option</option>
            {#each fields as field}
              <option value={field}>{field}</option>
            {/each}
          </Select>
          <Select secondary thin bind:value={filter.condition}>
            <option value="">Choose an option</option>
            {#each CONDITIONS as condition}
              <option value={condition.key}>{condition.name}</option>
            {/each}
          </Select>
          {#if filter.key && isMultipleChoice(filter.key)}
            <Select secondary thin bind:value={filter.value}>
              <option value="">Choose an option</option>
              {#each viewModel.schema[filter.key].constraints.inclusion as option}
                <option value={option}>{option}</option>
              {/each}
            </Select>
          {:else}
            <Input thin placeholder="Value" bind:value={filter.value} />
          {/if}
          <i class="ri-close-circle-fill" on:click={() => removeFilter(idx)} />
        {/each}
      </div>
    {/if}
    <div class="footer">
      <Button text on:click={addFilter}>Add Filter</Button>
      <div class="buttons">
        <Button secondary on:click={dropdown.hide}>Cancel</Button>
        <Button primary on:click={saveView}>Save</Button>
      </div>
    </div>
  </div>
</Popover>

<style>
  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }

  .ri-close-circle-fill {
    cursor: pointer;
  }

  .input-group-row {
    display: grid;
    grid-template-columns: minmax(50px, auto) 1fr 1fr 1fr 15px;
    gap: var(--spacing-s);
    align-items: center;
  }

  p {
    margin: 0;
    font-size: var(--font-size-xs);
  }
</style>
