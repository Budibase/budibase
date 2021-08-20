<script>
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import OptionsDrawer from "./OptionsDrawer.svelte"

  const dispatch = createEventDispatcher()

  export let value

  let drawer
  let tempValue = value || []

  const saveFilter = async () => {
    // Filter out incomplete options
    tempValue = tempValue.filter(option => option.value && option.label)
    dispatch("change", tempValue)
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Define Options</ActionButton>
<Drawer bind:this={drawer} title="Options">
  <svelte:fragment slot="description">
    Define the options for this picker.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <OptionsDrawer bind:options={tempValue} slot="body" />
</Drawer>
