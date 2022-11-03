<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { cloneDeep } from "lodash/fp"
  import { currentAsset } from "builderStore"
  import CellConditionsDrawer from "./CellConditionsDrawer.svelte"

  export let value = []
  export let bindings
  export let componentInstance

  const dispatch = createEventDispatcher()

  let drawer
  let boundValue

  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchema($currentAsset, datasource)
  $: columns = Object.keys(schema || {})

  const getSchema = (asset, datasource) => {
    const schema = getSchemaForDatasource(asset, datasource).schema

    // Don't show ID and rev in tables
    if (schema) {
      delete schema._id
      delete schema._rev
    }

    return schema
  }

  const open = () => {
    boundValue = cloneDeep(value)
    drawer.show()
  }

  const save = () => {
    dispatch("change", boundValue)
    drawer.hide()
  }
</script>

<ActionButton on:click={open}>Configure cell conditions</ActionButton>
<Drawer bind:this={drawer} title="Cell conditions">
  <svelte:fragment slot="description">
    Alter the background and text colors of cells based on their content.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <CellConditionsDrawer
    slot="body"
    bind:conditions={boundValue}
    {bindings}
    {columns}
  />
</Drawer>
