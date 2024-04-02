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

<div class="options-wrap">
  <div><ActionButton on:click={drawer.show}>Define Options</ActionButton></div>
</div>
<Drawer bind:this={drawer} title="Options" on:drawerHide on:drawerShow>
  <svelte:fragment slot="description">
    Define the options for this picker.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveOptions}>Save</Button>
  <OptionsDrawer bind:options={tempValue} slot="body" />
</Drawer>

<style>
  .options-wrap {
    gap: 8px;
    display: grid;
    grid-template-columns: 90px 1fr;
  }
</style>
