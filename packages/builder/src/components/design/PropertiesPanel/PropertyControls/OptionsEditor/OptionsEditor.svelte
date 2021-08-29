<script>
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import OptionsDrawer from "./OptionsDrawer.svelte"
  import { _ as t } from "svelte-i18n"
  
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

<ActionButton on:click={drawer.show}>{ $t('define-options') }</ActionButton>
<Drawer bind:this={drawer} title="Options">
  <svelte:fragment slot="description">
    { $t('define-the-options-for-this-picker') }
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveFilter}>{ $t('save') }</Button>
  <OptionsDrawer bind:options={tempValue} slot="body" />
</Drawer>
