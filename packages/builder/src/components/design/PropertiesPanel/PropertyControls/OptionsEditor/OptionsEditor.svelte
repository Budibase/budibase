<script>
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import OptionsDrawer from "./OptionsDrawer.svelte"

  const dispatch = createEventDispatcher()

  export let value

  let drawer
  let tempValue = value || []

  const saveOptions = async () => {
    // Filter out incomplete options, default if needed
    tempValue = tempValue.filter(option => option.value || option.label)
    for (let i = 0; i < tempValue.length; i++) {
      let option = tempValue[i]
      option.label = option.label ? option.label : option.value
      option.value = option.value ? option.value : option.label
      tempValue[i] = option
    }
    dispatch("change", tempValue)
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Define Options</ActionButton>
<Drawer bind:this={drawer} title="Options">
  <svelte:fragment slot="description">
    Define the options for this picker.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveOptions}>Save</Button>
  <OptionsDrawer bind:options={tempValue} slot="body" />
</Drawer>
