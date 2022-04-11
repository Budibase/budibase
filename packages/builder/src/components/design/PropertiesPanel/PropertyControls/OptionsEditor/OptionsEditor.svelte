<script>
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import OptionsDrawer from "./OptionsDrawer.svelte"

  const dispatch = createEventDispatcher()

  export let value

  let drawer
  let tempValue = value || []

  const saveFilter = async () => {
    let hasError = false
    for (let i = 0; i < tempValue.length; i++) {
      let option = tempValue[i]
      if (!(option.label && option.value)) {
        option.error = {
          label: option.label ? undefined : "You must provide a label.",
          value: option.value ? undefined : "You must provide a value.",
        }
        tempValue[i] = option
        hasError = true
      }
    }
    if (!hasError) {
      drawer.hide()
    }
    dispatch("change", tempValue)
  }

  const clearOptionErrors = () => {
    for (let i = 0; i < tempValue.length; i++) {
      let option = tempValue[i]
      option.error = undefined
      tempValue[i] = option
    }
  }

  $: {
    for (let i = 0; i < tempValue.length; i++) {
      let option = tempValue[i]
      if (option.error?.label && option.label) {
        option.error.label = undefined
      }
      if (option.error?.value && option.value) {
        option.error.value = undefined
      }
      tempValue[i] = option
    }
  }
</script>

<ActionButton
  on:click={() => {
    clearOptionErrors()
    drawer.show()
  }}>Define Options</ActionButton
>
<Drawer bind:this={drawer} title="Options">
  <svelte:fragment slot="description">
    Define the options for this picker.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <OptionsDrawer bind:options={tempValue} slot="body" />
</Drawer>
