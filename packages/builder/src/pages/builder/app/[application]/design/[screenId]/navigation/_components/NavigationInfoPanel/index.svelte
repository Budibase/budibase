<script>
  import RightPanel from "components/design/RightPanel.svelte"
  import CustomizePane from "./CustomizePane.svelte"
  import SettingsPane from "./SettingsPane.svelte"
</script>

<RightPanel title="Screen" icon="WebPage">
  <SettingsPane />
  <CustomizePane />
</RightPanel>
