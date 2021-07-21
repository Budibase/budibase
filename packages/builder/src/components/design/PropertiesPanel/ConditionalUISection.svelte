<script>
  import { DetailSummary, ActionButton, Drawer, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import ConditionalUIDrawer from "./PropertyControls/ConditionalUIDrawer.svelte"

  export let componentInstance

  let tempValue
  let drawer

  const openDrawer = () => {
    tempValue = JSON.parse(JSON.stringify(componentInstance?._conditions ?? []))
    drawer.show()
  }

  const save = () => {
    store.actions.components.updateConditions(tempValue)
    drawer.hide()
  }
</script>

<DetailSummary
  name={`Conditions${componentInstance?._conditions ? " *" : ""}`}
  collapsible={false}
>
  <div>
    <ActionButton on:click={openDrawer}>Configure conditions</ActionButton>
  </div>
</DetailSummary>
{#key componentInstance?._id}
  <Drawer bind:this={drawer} title="Conditions">
    <svelte:fragment slot="description">
      Show, hide and update components in response to conditions being met.
    </svelte:fragment>
    <Button cta slot="buttons" on:click={save}>Save</Button>
    <ConditionalUIDrawer slot="body" bind:conditions={tempValue} />
  </Drawer>
{/key}
