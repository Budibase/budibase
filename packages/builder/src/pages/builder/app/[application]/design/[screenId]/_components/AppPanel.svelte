<script>
  import DevicePreviewSelect from "./DevicePreviewSelect.svelte"
  import AppPreview from "./AppPreview.svelte"
  import { store, sortedScreens } from "builderStore"
  import { Select } from "@budibase/bbui"
  import { RoleUtils } from "@budibase/frontend-core"
</script>

<div class="app-panel">
  <div class="header">
    <div class="header-left">
      <Select
        placeholder={null}
        options={$sortedScreens}
        getOptionLabel={x => x.routing.route}
        getOptionValue={x => x._id}
        getOptionColour={x => RoleUtils.getRoleColour(x.routing.roleId)}
        value={$store.selectedScreenId}
        on:change={e => store.actions.screens.select(e.detail)}
        quiet
        autoWidth
      />
    </div>
    <div class="header-right">
      {#if $store.clientFeatures.devicePreview}
        <DevicePreviewSelect />
      {/if}
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
    margin: 0 2px;
  }
  .header-left,
  .header-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
  }
  .header-left {
    flex: 1 1 auto;
    width: 0;
  }
  .header-left :global(> *) {
    max-width: 100%;
  }
  .header-left :global(.spectrum-Picker) {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }
  .content {
    flex: 1 1 auto;
  }
</style>
