<script>
  import { Popover, Select } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import {
    tables as tableStore,
    datasources as datasourceStore,
    viewsV2 as viewsV2Store,
  } from "@/stores/builder"
  import DataSourceCategory from "./DataSourceSelect/DataSourceCategory.svelte"
  import { sortAndFormat } from "@/helpers/data/format"

  export let value

  let anchorRight, dropdownRight

  const dispatch = createEventDispatcher()

  $: tables = sortAndFormat.tables($tableStore.list, $datasourceStore.list)
  $: views = sortAndFormat.viewsV2($viewsV2Store.list, $datasourceStore.list)
  $: options = [...(tables || []), ...(views || [])]

  $: text = value?.label ?? "Choose an option"

  const onChange = e => {
    dispatch(
      "change",
      options.find(x => x.resourceId === e.resourceId)
    )
    dropdownRight.hide()
  }

  onMount(() => {
    // Migrate old values before "resourceId" existed
    if (value && !value.resourceId) {
      const view = views.find(x => x.resourceId === value.id)
      const table = tables.find(x => x.resourceId === value.tableId)
      dispatch("change", view || table)
    }
  })
</script>

<div class="container" bind:this={anchorRight}>
  <Select
    readonly
    value={text}
    options={[text]}
    on:click={dropdownRight.show}
  />
</div>
<Popover bind:this={dropdownRight} anchor={anchorRight}>
  <div class="dropdown">
    <DataSourceCategory
      heading="Tables"
      dataSet={tables}
      {value}
      onSelect={onChange}
    />
    {#if views?.length}
      <DataSourceCategory
        dividerState={true}
        heading="Views"
        dataSet={views}
        {value}
        onSelect={onChange}
      />
    {/if}
  </div>
</Popover>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .container :global(:first-child) {
    flex: 1 1 auto;
  }

  .dropdown {
    padding: var(--spacing-m) 0;
    z-index: 99999999;
  }
</style>
