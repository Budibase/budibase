<script>
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import OptionsDrawer from "./OptionsDrawer.svelte"

  const dispatch = createEventDispatcher()

  export let value

  let drawerVisible = false
  let drawer
  let valid = true
  let tempValue = value || []

  const saveFilter = async () => {
    // Filter out incomplete options, but if all are incomplete then show error
    let filteredOptions = tempValue.filter(
      option => option.value && option.label
    )
    if (filteredOptions.length > 0 || tempValue.length === 0) {
      tempValue = filteredOptions
      valid = true
      dispatch("change", tempValue)
      drawer.hide()
    } else {
      valid = false
    }
  }

  //If the drawer is hidden or error corrected, reset the validation
  $: {
    if (
      !drawerVisible ||
      tempValue.some(
        option => option.label?.length > 0 && option.value?.length > 0
      )
    ) {
      valid = true
    }
  }
</script>

<ActionButton on:click={drawer.show}>Define Options</ActionButton>
<Drawer bind:this={drawer} bind:visible={drawerVisible} title="Options">
  <svelte:fragment slot="description">
    {#if !valid}
      <span class="syntax-error"
        >You must provide option labels and values.</span
      >
    {:else}
      Define the options for this picker.
    {/if}
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <OptionsDrawer bind:options={tempValue} slot="body" />
</Drawer>

<style>
  .syntax-error {
    padding-top: var(--spacing-m);
    color: var(--red);
  }
</style>
