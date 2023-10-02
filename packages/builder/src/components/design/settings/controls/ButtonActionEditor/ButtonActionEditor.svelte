<script>
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { notifications } from "@budibase/bbui"
  import ButtonActionDrawer from "./ButtonActionDrawer.svelte"
  import { cloneDeep } from "lodash/fp"

  const dispatch = createEventDispatcher()

  export let key
  export let value = []
  export let name
  export let bindings
  export let nested
  export let componentInstance

  let drawer
  let tmpValue

  const openDrawer = () => {
    tmpValue = cloneDeep(value)
    drawer.show()
  }

  const saveEventData = async () => {
    dispatch("change", tmpValue)
    notifications.success("Component actions saved.")
    drawer.hide()
  }

  $: actionCount = value?.length
  $: actionText = `${actionCount || "No"} action${
    actionCount !== 1 ? "s" : ""
  } set`
</script>

<div class="action-editor">
  <ActionButton on:click={openDrawer}>{actionText}</ActionButton>
</div>

<Drawer bind:this={drawer} title={"Actions"} on:drawerHide on:drawerShow>
  <svelte:fragment slot="description">
    Define what actions to run.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveEventData}>Save</Button>
  <ButtonActionDrawer
    slot="body"
    bind:actions={tmpValue}
    eventType={name}
    {bindings}
    {key}
    {nested}
    {componentInstance}
  />
</Drawer>

<style>
  .action-editor :global(.spectrum-ActionButton) {
    width: 100%;
  }
</style>
