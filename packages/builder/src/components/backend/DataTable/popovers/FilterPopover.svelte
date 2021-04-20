<script>
  import { Button, Input, Select, DatePicker } from "@budibase/bbui"
  import { tables, views } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import analytics from "analytics"

  const CONDITIONS = [
    {
      name: "Equals",
      key: "EQUALS",
    },
    {
      name: "Not Equals",
      key: "NOT_EQUALS",
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
  export let onClosed

  $: viewTable = $tables.list.find(({ _id }) => _id === $views.selected.tableId)
  $: fields = viewTable && Object.keys(viewTable.schema)

  function saveView() {
    views.save(view)
    notifications.success(`View ${view.name} saved.`)
    onClosed()
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
      (viewTable.schema[field].constraints &&
        viewTable.schema[field].constraints.inclusion &&
        viewTable.schema[field].constraints.inclusion.length) ||
      viewTable.schema[field].type === "boolean"
    )
  }

  function fieldOptions(field) {
    return viewTable.schema[field].type === "options"
      ? viewTable.schema[field].constraints.inclusion
      : [true, false]
  }

  function isDate(field) {
    return viewTable.schema[field].type === "datetime"
  }

  function isNumber(field) {
    return viewTable.schema[field].type === "number"
  }

  const fieldChanged = filter => ev => {
    // reset if type changed
    if (
      filter.key &&
      ev.target.value &&
      viewTable.schema[filter.key].type !==
        viewTable.schema[ev.target.value].type
    ) {
      filter.value = ""
    }
  }

  const getOptionLabel = x => x.name
  const getOptionValue = x => x.key
</script>

<div class="actions">
  <h5>Filter</h5>
  {#if view.filters.length}
    <div class="input-group-row">
      {#each view.filters as filter, idx}
        {#if idx === 0}
          <p>Where</p>
        {:else}
          <Select
            bind:value={filter.conjunction}
            options={CONJUNCTIONS}
            {getOptionLabel}
            {getOptionValue} />
        {/if}
        <Select
          bind:value={filter.key}
          on:change={fieldChanged(filter)}
          options={fields} />
        <Select
          bind:value={filter.condition}
          options={CONDITIONS}
          {getOptionLabel}
          {getOptionValue} />
        {#if filter.key && isMultipleChoice(filter.key)}
          <Select
            bind:value={filter.value}
            options={fieldOptions(filter.key)}
            getOptionLabel={x => x.toString()} />
        {:else if filter.key && isDate(filter.key)}
          <DatePicker
            bind:value={filter.value}
            placeholder={filter.key || fields[0]} />
        {:else if filter.key && isNumber(filter.key)}
          <Input
            bind:value={filter.value}
            placeholder={filter.key || fields[0]}
            type="number" />
        {:else}
          <Input
            placeholder={filter.key || fields[0]}
            bind:value={filter.value} />
        {/if}
        <i class="ri-close-circle-fill" on:click={() => removeFilter(idx)} />
      {/each}
    </div>
  {/if}
  <div class="footer">
    <div class="add-filter">
      <Button text on:click={addFilter}>Add Filter</Button>
    </div>
    <div class="buttons">
      <Button secondary on:click={onClosed}>Cancel</Button>
      <Button cta on:click={saveView}>Save</Button>
    </div>
  </div>
</div>

<style>
  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
    padding: var(--spacing-xl);
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

  .add-filter {
    margin-right: 16px;
  }
</style>
