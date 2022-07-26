<script>
  import DevicePreviewSelect from "./DevicePreviewSelect.svelte"
  import AppPreview from "./AppPreview.svelte"
  import { store, selectedScreen, sortedScreens } from "builderStore"
  import { Button, Select } from "@budibase/bbui"
  import { RoleUtils } from "@budibase/frontend-core"
  import { goto } from "@roxi/routify"
</script>

<div class="app-panel">
  <div class="header">
    <div class="header-left">
      <Select
        placeholder={null}
        options={$sortedScreens}
        getOptionLabel={x => x.routing.route}
        getOptionValue={x => x._id}
        getOptionIcon={x => (x.routing.homeScreen ? "Home" : "WebPage")}
        getOptionColour={x => RoleUtils.getRoleColour(x.routing.roleId)}
        value={$store.selectedScreenId}
        on:change={e => store.actions.screens.select(e.detail)}
      />
    </div>
    <div class="header-right">
      {#if $store.clientFeatures.devicePreview}
        <DevicePreviewSelect />
      {/if}
      <Button
        newStyles
        secondary
        icon="Add"
        on:click={() => $goto(`../${$selectedScreen._id}/components/new`)}
      >
        Component
      </Button>
    </div>
  </div>
  <div class="content">
    {#key $store.version}
      <AppPreview />
    {/key}
  </div>
</div>

<style>
  .app-panel {
    flex: 1 1 auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
    padding: var(--spacing-l) var(--spacing-xl);
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-l);
  }
  .header-left,
  .header-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
  }
  .header-left :global(.spectrum-Picker) {
    width: 250px;
  }
  .content {
    flex: 1 1 auto;
  }
</style>
