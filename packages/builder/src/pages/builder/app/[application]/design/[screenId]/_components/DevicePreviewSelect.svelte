<script>
  import { ActionGroup, ActionButton } from "@budibase/bbui"
  import { store } from "builderStore"
</script>

<ActionGroup compact quiet>
  <ActionButton
    quiet
    icon="DeviceDesktop"
    selected={$store.previewDevice === "desktop"}
    on:click={() => store.actions.preview.setDevice("desktop")}
  />
  <ActionButton
    quiet
    icon="DeviceTablet"
    selected={$store.previewDevice === "tablet"}
    on:click={() => store.actions.preview.setDevice("tablet")}
  />
  <ActionButton
    quiet
    icon="DevicePhone"
    selected={$store.previewDevice === "mobile"}
    on:click={() => store.actions.preview.setDevice("mobile")}
  />
</ActionGroup>
