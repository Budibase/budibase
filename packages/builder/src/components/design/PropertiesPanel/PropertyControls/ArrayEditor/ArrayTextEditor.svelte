<script>
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import ArrayTextDrawer from "./ArrayTextDrawer.svelte"
  import { _ as t } from "svelte-i18n"

  const dispatch = createEventDispatcher()

  export let value

  let drawer
  let tempValue = value || []

  const saveFilter = async () => {
    // Filter out incomplete options
    tempValue = tempValue.filter(option => option.value)
    dispatch("change", tempValue)
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>{$t("define-array")}</ActionButton>
<Drawer bind:this={drawer} title={$t("array")} cancelText={$t("cancel")}>
  <Button cta slot="buttons" on:click={saveFilter}>{$t("save")}</Button>
  <ArrayTextDrawer bind:options={tempValue} slot="body" />
</Drawer>
