<script>
  import { Button, Drawer, Spacer, Body } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { notifications } from "@budibase/bbui"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import SaveFields from "./EventsEditor/actions/SaveFields.svelte"
  import { currentAsset } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value = {}
  export let componentInstance
  let drawer
  let tempValue = value

  $: schemaFields = getSchemaFields(componentInstance)

  const getSchemaFields = component => {
    const datasource = getDatasourceForProvider($currentAsset, component)
    const { schema } = getSchemaForDatasource(datasource)
    return Object.values(schema || {})
  }

  const saveFilter = async () => {
    dispatch("change", tempValue)
    notifications.success("Filters saved.")
    drawer.hide()
  }

  const onFieldsChanged = event => {
    tempValue = event.detail
  }
</script>

<Button secondary wide on:click={drawer.show}>Define Filters</Button>
<Drawer bind:this={drawer} title='Filtering'>
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <div class="root" slot="body">
    <Body s>
      {#if !Object.keys(tempValue || {}).length}
        Add your first filter column.
      {:else}
        Results are filtered to only those which match all of the following
        constaints.
      {/if}
    </Body>
    <Spacer medium />
    <div class="fields">
      <SaveFields
        parameterFields={value}
        {schemaFields}
        valueLabel="Equals"
        on:change={onFieldsChanged} />
    </div>
  </div>
</Drawer>

<style>
  .root {
    padding: var(--spacing-l);
    min-height: calc(40vh - 2 * var(--spacing-l));
    max-width: 800px;
    margin: 0 auto;
  }

  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: auto 1fr auto 1fr auto;
  }
</style>
