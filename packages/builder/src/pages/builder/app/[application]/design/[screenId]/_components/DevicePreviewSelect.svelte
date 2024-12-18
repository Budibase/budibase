<script>
  import { ActionGroup, ActionButton } from "@budibase/bbui"
  import { previewStore } from "@/stores/builder"
</script>

<ActionGroup compact quiet>
  <ActionButton
    quiet
    icon="DeviceDesktop"
    selected={$previewStore.previewDevice === "desktop"}
    on:click={() => previewStore.setDevice("desktop")}
  />
  <ActionButton
    quiet
    icon="DeviceTablet"
    selected={$previewStore.previewDevice === "tablet"}
    on:click={() => previewStore.setDevice("tablet")}
  />
  <ActionButton
    quiet
    icon="DevicePhone"
    selected={$previewStore.previewDevice === "mobile"}
    on:click={() => previewStore.setDevice("mobile")}
  />
</ActionGroup>
