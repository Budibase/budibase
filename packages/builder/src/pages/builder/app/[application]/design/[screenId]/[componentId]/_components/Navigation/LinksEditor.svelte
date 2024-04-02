<script>
  import { Button, Drawer } from "@budibase/bbui"
  import NavigationLinksDrawer from "./LinksDrawer.svelte"
  import { cloneDeep } from "lodash/fp"
  import { navigationStore } from "stores/builder"

  let drawer
  let links

  const openDrawer = () => {
    links = cloneDeep($navigationStore.links || [])
    drawer.show()
  }

  const save = async () => {
    let navigation = $navigationStore
    navigation.links = links
    await navigationStore.save(navigation)
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
