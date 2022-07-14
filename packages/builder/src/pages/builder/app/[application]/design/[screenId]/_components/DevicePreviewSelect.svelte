<script>
  import { ActionGroup, ActionButton } from "@budibase/bbui"
  import { store } from "builderStore"
</script>

<ActionGroup compact>
  <ActionButton
    icon="DeviceDesktop"
    selected={$store.previewDevice === "desktop"}
    on:click={() => store.actions.preview.setDevice("desktop")}
  />
  <ActionButton
    icon="DeviceTablet"
    selected={$store.previewDevice === "tablet"}
    on:click={() => store.actions.preview.setDevice("tablet")}
  />
  <ActionButton
    icon="DevicePhone"
    selected={$store.previewDevice === "mobile"}
    on:click={() => store.actions.preview.setDevice("mobile")}
  />
</ActionGroup>
