<script>
  import {
    notifications,
    ActionButton,
    Button,
    Drawer,
    Body,
    DrawerContent,
    Layout,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import LuceneFilterBuilder from "./LuceneFilterBuilder.svelte"
  import { currentAsset } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value = []
  export let componentInstance
  let drawer
  let tempValue = value || []

  $: numFilters = Array.isArray(tempValue)
    ? tempValue.length
    : Object.keys(tempValue || {}).length
  $: dataSource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, dataSource)?.schema
  $: schemaFields = Object.values(schema || {})
  $: internalTable = dataSource?.type === "table"

  const saveFilter = async () => {
    dispatch("change", tempValue)
    notifications.success("Filters saved.")
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Define filters</ActionButton>
<Drawer bind:this={drawer} title="Filtering">
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <DrawerContent slot="body">
    <Layout noPadding>
      <Body size="S">
        {#if !numFilters}
          Add your first filter column.
        {:else}
          Results are filtered to only those which match all of the following
          constraints.
        {/if}
      </Body>
      <LuceneFilterBuilder bind:value={tempValue} {schemaFields} />
    </Layout>
  </DrawerContent>
</Drawer>
