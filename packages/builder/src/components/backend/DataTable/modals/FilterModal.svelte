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
  import { _ } from "../../../../../lang/i18n"

  const CONDITIONS = [
    {
      name: $_("components.backend.DataTable.modals.FilterModal.Equals"),
      key: "EQUALS",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.Not_Equals"),
      key: "NOT_EQUALS",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.Less_Than"),
      key: "LT",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.Less_Equal"),
      key: "LTE",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.More_Than"),
      key: "MT",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.More_Equal"),
      key: "MTE",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.Contains"),
      key: "CONTAINS",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.Not_Empty"),
      key: "NOT_EMPTY",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.Is_Empty"),
      key: "EMPTY",
    },
  ]

  const CONJUNCTIONS = [
    {
      name: $_("components.backend.DataTable.modals.FilterModal.Or"),
      key: "OR",
    },
    {
      name: $_("components.backend.DataTable.modals.FilterModal.And"),
      key: "AND",
    },
  ]

  export let view = {}

  $: viewTable = $tables.list.find(
    ({ _id }) => _id === $views.selected?.tableId
  )
  $: fields = viewTable && Object.keys(viewTable.schema)
  $: schema = viewTable && viewTable.schema ? viewTable.schema : {}

  function saveView() {
    try {
      views.save(view)
      notifications.success(
        `${$_("components.backend.DataTable.modals.FilterModal.View")} ${
          view.name
        } ${$_("components.backend.DataTable.modals.FilterModal.saved")}`
      )
    } catch (error) {
      notifications.error(
        $_("components.backend.DataTable.modals.FilterModal.Error_saving")
      )
    }
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
      schema[field]?.constraints?.inclusion?.length ||
      schema[field]?.type === "boolean"
    )
  }

  function fieldOptions(field) {
    return schema[field]?.type === "options" || schema[field]?.type === "array"
      ? schema[field]?.constraints.inclusion
      : [true, false]
  }

  function isDate(field) {
    return schema[field]?.type === "datetime"
  }

  function isNumber(field) {
    return schema[field]?.type === "number"
  }

  const fieldChanged = filter => ev => {
    // Reset if type changed
    const oldType = schema[filter.key]?.type
    const newType = schema[ev.detail]?.type
    if (filter.key && ev.detail && oldType !== newType) {
      filter.value = ""
    }
  }

  const getOptionLabel = x => x.name
  const getOptionValue = x => x.key

  const showValue = filter => {
    return !(filter.condition === "EMPTY" || filter.condition === "NOT_EMPTY")
  }
</script>

<ModalContent title="Filter" confirmText="Save" onConfirm={saveView} size="L">
  {#if view.filters.length}
    <div class="input-group-row">
      {#each view.filters as filter, idx}
        {#if idx === 0}
          <Label
            >{$_(
              "components.backend.DataTable.modals.FilterModal.Where"
            )}</Label
          >
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
        {#if showValue(filter)}
          {#if filter.key && isMultipleChoice(filter.key)}
            <Select
              bind:value={filter.value}
              options={fieldOptions(filter.key)}
              getOptionLabel={x => x?.toString() || ""}
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
        {:else}
          <Icon hoverable name="Close" on:click={() => removeFilter(idx)} />
          <!-- empty div to preserve spacing -->
          <div />
        {/if}
      {/each}
    </div>
  {:else}
    <Body size="S"
      >{$_(
        "components.backend.DataTable.modals.FilterModal.Add_Filter_started"
      )}</Body
    >
  {/if}
  <div slot="footer">
    <Button secondary on:click={addFilter}
      >{$_(
        "components.backend.DataTable.modals.FilterModal.Add_Filter"
      )}</Button
    >
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
