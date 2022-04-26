<script>
  import DevicePreviewSelect from "./DevicePreviewSelect.svelte"
  import AppPreview from "./AppPreview.svelte"
  import { store, selectedScreen } from "builderStore"
  import { Button, Select, StatusLight, Body } from "@budibase/bbui"
  import { RoleColours } from "constants"
  import { roles } from "stores/backend"
  import { goto } from "@roxi/routify"

  $: roleId = $selectedScreen?.routing.roleId
  $: roleColor = getRoleColor(roleId)
  $: roleName = $roles.find(x => x._id === roleId)?.name || "Unknown"

  // Needs to be absolute as we embed this component from multiple different URLs
  $: newComponentUrl = `/builder/app/${store.appId}/design/components/${$selectedScreen?._id}/new`

  const getRoleColor = roleId => {
    return RoleColours[roleId] || "#ffa500"
  }
</script>

<div class="app-panel">
  <div class="header">
    <div class="header-left">
      <Select
        options={$store.screens}
        getOptionLabel={x => x.routing.route}
        getOptionValue={x => x._id}
        getOptionIcon={x => (x.routing.homeScreen ? "Home" : "WebPage")}
        bind:value={$store.selectedScreenId}
      />
      <StatusLight custom color={roleColor}>
        <Body size="S">
          {roleName} access
        </Body>
      </StatusLight>
    </div>
    <div class="header-right">
      {#if $store.clientFeatures.devicePreview}
        <DevicePreviewSelect />
      {/if}
      <Button cta icon="Add" on:click={() => $goto(newComponentUrl)}>
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
    width: 240px;
  }
  .content {
    flex: 1 1 auto;
  }
</style>
