<script>
  import Panel from "components/design/Panel.svelte"
  import { Body, Layout, Banner } from "@budibase/bbui"
  import { selectedScreen, store } from "builderStore"
  import { get } from "svelte/store"

  const removeCustomLayout = async () => {
    return store.actions.screens.removeCustomLayout(get(selectedScreen))
  }
</script>

<Panel borderLeft title="Navigation" icon="InfoOutline" wide>
  <Layout paddingX="L" paddingY="XL" gap="S">
    {#if $selectedScreen.layoutId}
      <Banner
        type="warning"
        extraButtonText="Detach custom layout"
        extraButtonAction={removeCustomLayout}
        showCloseButton={false}
      >
        You can't preview your navigation settings using this screen as it uses
        a custom layout, which is deprecated
      </Banner>
    {/if}
    <Body size="S">
      Your navigation is configured for all the screens within your app.
    </Body>
    <Body size="S">
      You can hide and show your navigation for each screen in the screen
      settings.
    </Body>
  </Layout>
</Panel>
