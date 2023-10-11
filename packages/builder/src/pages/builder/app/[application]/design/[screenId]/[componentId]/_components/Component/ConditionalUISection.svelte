<script>
  import {
    DetailSummary,
    ActionButton,
    Drawer,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import ConditionalUIDrawer from "./ConditionalUIDrawer.svelte"

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

  $: conditionCount = componentInstance?._conditions?.length
  $: conditionText = `${conditionCount || "No"} condition${
    conditionCount !== 1 ? "s" : ""
  } set`
</script>

<DetailSummary name={"Conditions"} collapsible={false}>
  <ActionButton on:click={openDrawer}>{conditionText}</ActionButton>
</DetailSummary>
<Drawer bind:this={drawer} title="Conditions">
  <svelte:fragment slot="description">
    Show, hide and update components in response to conditions being met.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={() => save()}>Save</Button>
  <ConditionalUIDrawer slot="body" bind:conditions={tempValue} {bindings} />
</Drawer>
