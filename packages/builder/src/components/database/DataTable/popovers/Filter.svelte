<script>
  import {
    Popover,
    TextButton,
    Button,
    Icon,
    Input,
    Select,
    DatePicker,
  } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import analytics from "analytics"

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
    analytics.captureEvent("Added View Filter", {
      filters: JSON.stringify(view.filters),
    })
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
      (viewModel.schema[field].constraints &&
        viewModel.schema[field].constraints.inclusion &&
        viewModel.schema[field].constraints.inclusion.length) ||
      viewModel.schema[field].type === "boolean"
    )
  }

  function fieldOptions(field) {
    return viewModel.schema[field].type === "string"
      ? viewModel.schema[field].constraints.inclusion
      : [true, false]
  }

  function isDate(field) {
    return viewModel.schema[field].type === "datetime"
  }

  function isNumber(field) {
    return viewModel.schema[field].type === "number"
  }

  const fieldChanged = filter => ev => {
    // reset if type changed
    if (
      filter.key &&
      ev.target.value &&
      viewModel.schema[filter.key].type !==
        viewModel.schema[ev.target.value].type
    ) {
      filter.value = ""
    }
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
  <h5>Filter</h5>
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
      <Select
        secondary
        thin
        bind:value={filter.key}
        on:change={fieldChanged(filter)}>
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
          {#each fieldOptions(filter.key) as option}
            <option value={option}>{option.toString()}</option>
          {/each}
        </Select>
      {:else if filter.key && isDate(filter.key)}
        <DatePicker
          bind:value={filter.value}
          placeholder={filter.key || fields[0]} />
      {:else if filter.key && isNumber(filter.key)}
        <Input
          thin
          bind:value={filter.value}
          placeholder={filter.key || fields[0]}
          type="number" />
      {:else}
        <Input
          thin
          placeholder={filter.key || fields[0]}
          bind:value={filter.value} />
      {/if}
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
