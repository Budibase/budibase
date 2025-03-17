<script lang="ts">
  import { ActionButton, ActionGroup, Body, Button } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { appStore } from "@/stores/builder"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  export let authConfigId: string | undefined
  export let authConfigs: { label: string; value: string }[]
  export let datasourceId: string

  let popover: DetailPopover

  $: authConfig = authConfigs.find(c => c.value === authConfigId)

  function closeMenu() {
    popover.hide()
  }

  function addBasicConfiguration() {
    $goto(
      `/builder/app/${$appStore.appId}/data/datasource/${datasourceId}?&tab=Authentication`
    )
  }

  function selectConfiguration(id: string) {
    if (authConfigId === id) {
      authConfigId = undefined
    } else {
      authConfigId = id
    }
    popover.hide()
  }

  $: title = !authConfig ? "Authentication" : `Auth: ${authConfig.label}`
</script>

<DetailPopover bind:this={popover} {title}>
  <div slot="anchor">
    <ActionButton icon="LockClosed" quiet selected>
      {#if !authConfig}
        Authentication
      {:else}
        Auth: {authConfig.label}
      {/if}
    </ActionButton>
  </div>

  <Body size="S" color="var(--spectrum-global-color-gray-700)">
    Basic (Username & Password Authentication)
  </Body>

  {#if authConfigs.length}
    <div class="auth-options">
      <ActionGroup vertical compact>
        <!-- Hack to first config margin to not work as expected -->
        <div class="spectrum-ActionGroup-item hidden" />
        {#each authConfigs as config}
          <ActionButton
            on:click={() => selectConfiguration(config.value)}
            selected={config.value === authConfigId}
            accentColor="#066CE7"
          >
            {config.label}
          </ActionButton>
        {/each}
      </ActionGroup>
    </div>
  {/if}
  <div>
    <Button secondary icon="Add" on:click={addBasicConfiguration}
      >Add Basic</Button
    >
  </div>
</DetailPopover>

<style>
  .hidden {
    display: none;
  }
  .header-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .auth-options :global(.spectrum-ActionGroup) {
    width: 100%;
  }
  .auth-options :global(.spectrum-ActionButton) {
    justify-content: start;
    cursor: pointer;
    pointer-events: auto;
  }
</style>
