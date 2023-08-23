<script>
  import { Button, Drawer } from "@budibase/bbui"
  import NavigationLinksDrawer from "./LinksDrawer.svelte"
  import { cloneDeep } from "lodash/fp"
  import { store } from "builderStore"

  let drawer
  let links

  const openDrawer = () => {
    links = cloneDeep($store.navigation.links || [])
    drawer.show()
  }

  const save = async () => {
    let navigation = $store.navigation
    navigation.links = links
    await store.actions.navigation.save(navigation)
    drawer.hide()
  }
</script>

<Button cta on:click={openDrawer}>Configure Links</Button>
<Drawer bind:this={drawer} title={"Navigation Links"}>
  <svelte:fragment slot="description">
    Configure the links in your navigation bar.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <NavigationLinksDrawer slot="body" bind:links />
</Drawer>
