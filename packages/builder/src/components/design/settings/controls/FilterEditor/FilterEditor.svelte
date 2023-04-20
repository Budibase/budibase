<script>
  import { _ } from "../../../../../../lang/i18n"
  import { notifications, ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import FilterDrawer from "./FilterDrawer.svelte"
  import { currentAsset } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value = []
  export let componentInstance
  export let bindings = []

  let drawer

  $: tempValue = value
  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, datasource)?.schema
  $: schemaFields = Object.values(schema || {})

  async function saveFilter() {
    dispatch("change", tempValue)
    notifications.success(
      $_(
        "components.design.settings.controls.FilterEditor.FilterEditor.Filters_saved"
      )
    )
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}
  >{$_(
    "components.design.settings.controls.FilterEditor.FilterEditor.Define_filters"
  )}</ActionButton
>
<Drawer
  bind:this={drawer}
  title={$_(
    "components.design.settings.controls.FilterEditor.FilterEditor.Filtering"
  )}
>
  <Button cta slot="buttons" on:click={saveFilter}
    >{$_(
      "components.design.settings.controls.FilterEditor.FilterEditor.Save"
    )}</Button
  >
  <FilterDrawer
    slot="body"
    filters={value}
    {bindings}
    {schemaFields}
    {datasource}
    on:change={e => (tempValue = e.detail)}
  />
</Drawer>
