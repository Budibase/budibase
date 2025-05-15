<script>
  import GeneralPanel from "./GeneralPanel.svelte"
  import { selectedScreen } from "@/stores/builder"
  import Panel from "@/components/design/Panel.svelte"
  import { Layout } from "@budibase/bbui"
</script>

{#if $selectedScreen}
  <Panel
    title={$selectedScreen.routing.route}
    icon={$selectedScreen.routing.route === "/" ? "Home" : "WebPage"}
    borderLeft
    wide
  >
    <Layout gap="XS" paddingX="XL" paddingY="XL">
      <GeneralPanel />
    </Layout>
  </Panel>
{/if}
