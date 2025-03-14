<script lang="ts">
  import {
    ActionButton,
    ActionGroup,
    ActionMenu,
    Body,
    Button,
    Divider,
    Layout,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"

  export let authConfigId: string
  export let authConfigs: { label: string; value: string }[]
  export let datasourceId: string

  let menu: ActionMenu

  $: authConfig = authConfigs.find(c => c.value === authConfigId)

  function closeMenu() {
    menu.hide()
  }

  function addBasicConfiguration() {
    $goto(`../../datasource/${datasourceId}?&tab=Authentication`)
  }

  function selectConfiguration(id: string) {
    authConfigId = id
    menu.hide()
  }
</script>

<ActionMenu align="right" bind:this={menu}>
  <div slot="control">
    <ActionButton icon="LockClosed" quiet selected>
      {#if !authConfig}
        Authentication
      {:else}
        Auth: {authConfig.label}
      {/if}
    </ActionButton>
  </div>

  <Layout>
    <div class="header-container">
      <Body size="M">Authentication</Body>
      <ActionButton
        quiet
        noPadding
        size="S"
        icon="Close"
        on:click={closeMenu}
      />
    </div>
  </Layout>
  <Divider />
  <Layout gap="S">
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Basic (Username & Password Authentication)
    </Body>

    <div class="auth-options">
      <ActionGroup vertical compact>
        <!-- Hack to first config margin to not work as expected -->
        <div class="spectrum-ActionGroup-item hidden" />
        {#each authConfigs as config}
          <ActionButton on:click={() => selectConfiguration(config.value)}>
            {config.label}
          </ActionButton>
        {/each}
      </ActionGroup>
    </div>
    <div>
      <Button secondary icon="Add" on:click={addBasicConfiguration}
        >Add Basic</Button
      >
    </div>
  </Layout>
</ActionMenu>

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
