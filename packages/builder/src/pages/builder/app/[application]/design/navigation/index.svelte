<script>
  import NavigationPanel from "components/design/navigation/NavigationPanel.svelte"
  import { Body, Layout } from "@budibase/bbui"
  import NavigationEditor from "./_components/NavigationEditor.svelte"
</script>

<NavigationPanel title="Navigation">
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Body size="S">
      Your navigation is configured for all the screens within your app
    </Body>
    <Body size="S">
      You can hide and show your navigation for each screen in the screen
      settings
    </Body>
    <NavigationEditor />
  </Layout>
</NavigationPanel>
