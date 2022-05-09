<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import MapLayersDrawer from "./MapLayersDrawer.svelte"
  import { cloneDeep } from "lodash/fp"
  import { createEventDispatcher } from "svelte"
  import { getBindableProperties } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"

  export let componentInstance
  export let value = []

  const dispatch = createEventDispatcher()

  $: bindableProperties = getBindableProperties(
    $currentAsset,
    componentInstance._id
  )
  $: updateBoundValue(value)

  const updateBoundValue = value => {
    boundValue = cloneDeep(value)
  }

  let boundValue
  let drawer

  const open = () => {
    if (!value?.length) {
      value = [
        {
          type: "XYZ",
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          visibility: "true",
          leafletOptions:
            '{{ js "cmV0dXJuIHsKCWF0dHJpYnV0aW9uOiAnJmNvcHk7IDxhIGhyZWY9Imh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJywKfTs=" }}',
        },
      ]
    }
    updateBoundValue(value)
    drawer.show()
  }

  const save = () => {
    dispatch("change", boundValue)
    drawer.hide()
  }
</script>

<ActionButton on:click={open}>Configure Layers</ActionButton>
<Drawer bind:this={drawer} title="Map Layers">
  <svelte:fragment slot="description">
    Configure the layers in your map.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <MapLayersDrawer
    slot="body"
    bind:tileLayers={boundValue}
    {bindableProperties}
  />
</Drawer>
