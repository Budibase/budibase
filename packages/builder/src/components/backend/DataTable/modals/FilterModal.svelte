<script>
  import {
    Button,
    Input,
    Body,
    Select,
    DatePicker,
    ModalContent,
    Label,
    notifications,
    Icon,
  } from "@budibase/bbui"
  import { tables, views } from "stores/backend"
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
    analytics.captureEvent("Added View Filter", {
      filters: JSON.stringify(view.filters),
    })
  }

  function removeFilter(idx) {
    view.filters.splice(idx, 1)
    view.filters = view.filters
  }

  function addFilter() {
    view.filters.push({ conjunction: "AND" })
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

  const fieldChanged = (filter) => (ev) => {
    // reset if type changed
    if (
      filter.key &&
      ev.detail &&
      viewTable.schema[filter.key].type !== viewTable.schema[ev.detail].type
    ) {
      filter.value = ""
    }
  }

  const getOptionLabel = (x) => x.name
  const getOptionValue = (x) => x.key
</script>

<ModalContent
  title="Filter"
  confirmText="Save"
  onConfirm={saveView}
  size="large"
>
  {#if view.filters.length}
    <div class="input-group-row">
      {#each view.filters as filter, idx}
        {#if idx === 0}
          <Label>Where</Label>
        {:else}
          <Select
            bind:value={filter.conjunction}
            options={CONJUNCTIONS}
            placeholder={null}
            {getOptionLabel}
            {getOptionValue}
          />
        {/if}
        <Select
          bind:value={filter.key}
          on:change={fieldChanged(filter)}
          options={fields}
        />
        <Select
          bind:value={filter.condition}
          options={CONDITIONS}
          {getOptionLabel}
          {getOptionValue}
        />
        {#if filter.key && isMultipleChoice(filter.key)}
          <Select
            bind:value={filter.value}
            options={fieldOptions(filter.key)}
            getOptionLabel={(x) => x.toString()}
          />
        {:else if filter.key && isDate(filter.key)}
          <DatePicker
            bind:value={filter.value}
            placeholder={filter.key || fields[0]}
          />
        {:else if filter.key && isNumber(filter.key)}
          <Input
            bind:value={filter.value}
            placeholder={filter.key || fields[0]}
            type="number"
          />
        {:else}
          <Input
            placeholder={filter.key || fields[0]}
            bind:value={filter.value}
          />
        {/if}
        <Icon hoverable name="Close" on:click={() => removeFilter(idx)} />
      {/each}
    </div>
  {:else}
    <Body size="S">Add a filter to get started.</Body>
  {/if}
  <div slot="footer">
    <Button secondary on:click={addFilter}>Add Filter</Button>
  </div>
</ModalContent>

<style>
  .input-group-row {
    display: grid;
    grid-template-columns: minmax(70px, auto) 1fr 1fr 1fr 15px;
    gap: var(--spacing-s);
    align-items: center;
  }
</style>
