<script>
  import {
    notifications,
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
  import SaveFields from "../EventsEditor/actions/SaveFields.svelte"

  const dispatch = createEventDispatcher()

  export let value = []
  export let componentInstance
  let drawer
  let tempValue = value

  $: numFilters = Array.isArray(tempValue)
    ? tempValue.length
    : Object.keys(tempValue || {}).length
  $: dataSource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource(dataSource)?.schema
  $: schemaFields = Object.values(schema || {})
  $: internalTable = dataSource?.type === "table"

  // Reset value if value is wrong type for the datasource.
  // Lucene editor needs an array, and simple editor needs an object.
  $: {
    if (internalTable && !Array.isArray(value)) {
      tempValue = []
      dispatch("change", [])
    } else if (!internalTable && Array.isArray(value)) {
      tempValue = {}
      dispatch("change", {})
    }
  }

  const saveFilter = async () => {
    dispatch("change", tempValue)
    notifications.success("Filters saved.")
    drawer.hide()
  }
</script>

<Button secondary on:click={drawer.show}>Define Filters</Button>
<Drawer bind:this={drawer} title="Filtering">
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <DrawerContent slot="body">
    <Layout>
      <Body size="S">
        {#if !numFilters}
          Add your first filter column.
        {:else}
          Results are filtered to only those which match all of the following
          constaints.
        {/if}
      </Body>
      {#if internalTable}
        <LuceneFilterBuilder bind:value={tempValue} {schemaFields} />
      {:else}
        <div class="fields">
          <SaveFields
            parameterFields={Array.isArray(value) ? {} : value}
            {schemaFields}
            valueLabel="Equals"
            on:change={e => (tempValue = e.detail)}
          />
        </div>
      {/if}
    </Layout>
  </DrawerContent>
</Drawer>

<style>
  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: auto 1fr auto 1fr auto;
  }
</style>
