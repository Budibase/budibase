<script>
  import { selectedScreen } from "builderStore"
  import ScreenListPanel from "./_components/ScreenListPanel.svelte"
  import ScreenSettingsPanel from "./_components/ScreenSettingsPanel.svelte"
</script>

<ScreenListPanel />
{#if $selectedScreen}
  {#key $selectedScreen._id}
    <ScreenSettingsPanel />
  {/key}
{/if}
