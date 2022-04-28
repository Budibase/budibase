<script>
  import NavigationPanel from "components/design/navigation/NavigationPanel.svelte"
  import { Body, Layout } from "@budibase/bbui"
  import ThemeEditor from "./_components/ThemeEditor.svelte"
</script>

<NavigationPanel title="Theme">
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Body size="S">
      Your theme is set across all the screens within your app
    </Body>
    <ThemeEditor />
  </Layout>
</NavigationPanel>
