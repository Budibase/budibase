<script>
  import NavigationPanel from "components/design/NavigationPanel/NavigationPanel.svelte"
  import { Body, Layout } from "@budibase/bbui"
  import AppPanel from "components/design/AppPanel/AppPanel.svelte"
  import ThemeEditor from "./_components/ThemeEditor.svelte"
</script>

<NavigationPanel title="Theme">
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Body>Your theme is set across all the screens within your app</Body>
    <ThemeEditor />
  </Layout>
</NavigationPanel>

<AppPanel />
