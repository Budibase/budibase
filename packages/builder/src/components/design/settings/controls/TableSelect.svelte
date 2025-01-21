<script>
  import { Popover, Select } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import { builderStore, viewsV2 } from "@/stores/builder"
  import { datasourceSelect as format } from "@/helpers/data/format"
  import DataSourceCategory from "./DataSourceSelect/DataSourceCategory.svelte"

  export let value

  let anchorRight, dropdownRight

  const dispatch = createEventDispatcher()

  $: tables = $builderStore.formatedTableNames
  $: views = $viewsV2.list.map(format.viewV2)
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
