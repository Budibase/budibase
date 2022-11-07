<script>
  import {
    DetailSummary,
    ActionButton,
    Drawer,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import ConditionalUIDrawer from "./PropertyControls/ConditionalUIDrawer.svelte"

  export let componentInstance
  export let bindings

  let tempValue
  let drawer

  const openDrawer = () => {
    tempValue = JSON.parse(JSON.stringify(componentInstance?._conditions ?? []))
    drawer.show()
  }

  const save = async () => {
    try {
      await store.actions.components.updateConditions(tempValue)
    } catch (error) {
      notifications.error("Error updating conditions")
    }
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
<Drawer bind:this={drawer} title="Conditions">
  <svelte:fragment slot="description">
    Show, hide and update components in response to conditions being met.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={() => save()}>Save</Button>
  <ConditionalUIDrawer slot="body" bind:conditions={tempValue} {bindings} />
</Drawer>
