<script>
  import { _ } from "../../../../../../../../../lang/i18n"
  import { Button, Drawer } from "@budibase/bbui"
  import NavigationLinksDrawer from "./NavigationLinksDrawer.svelte"
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

<Button cta on:click={openDrawer}
  >{$_(
    "pages.builder.app.application.design.screenId.navigation._components.NavigationLinksEditor.Configure_links"
  )}</Button
>
<Drawer
  bind:this={drawer}
  title={$_(
    "pages.builder.app.application.design.screenId.navigation._components.NavigationLinksEditor.Navigation_Links"
  )}
  width="calc(100% - 334px)"
>
  <svelte:fragment slot="description">
    {$_(
      "pages.builder.app.application.design.screenId.navigation._components.NavigationLinksEditor.Configure_links_navbar"
    )}
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}
    >{$_(
      "pages.builder.app.application.design.screenId.navigation._components.NavigationLinksEditor.Save"
    )}</Button
  >
  <NavigationLinksDrawer slot="body" bind:links />
</Drawer>
