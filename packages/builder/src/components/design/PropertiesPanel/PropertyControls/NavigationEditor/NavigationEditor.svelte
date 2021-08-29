<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import NavigationDrawer from "./NavigationDrawer.svelte"
  import { _ as t } from "svelte-i18n"

  export let value = []
  let drawer

  const dispatch = createEventDispatcher()
  const save = () => {
    dispatch("change", value)
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>{$t("configure-links")}</ActionButton>
<Drawer bind:this={drawer} title={"Navigation Links"}>
  <svelte:fragment slot="description">
    {$t("configure-the-links-in-your-navigation-bar")}
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>{$t("save")}</Button>
  <NavigationDrawer slot="body" bind:links={value} />
</Drawer>
