<script>
  import RightPanel from "components/design/RightPanel.svelte"
  import GeneralPane from "./GeneralPane.svelte"
  import ThemePane from "./ThemePane.svelte"

  import { selectedScreen } from "builderStore"
</script>

<RightPanel
  title={$selectedScreen.routing.route}
  icon={$selectedScreen.routing.route === "/" ? "Home" : "WebPage"}
>
  <GeneralPane />
  <ThemePane />
</RightPanel>
