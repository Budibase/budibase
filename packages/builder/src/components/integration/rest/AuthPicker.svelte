<script lang="ts">
  import {
    ActionButton,
    ActionMenu,
    Body,
    Button,
    Divider,
    Layout,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"

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

  onMount(() => {
    menu.show()
  })
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
  <Layout>
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Basic (Username & Password Authentication)
    </Body>
    <div>
      <Button secondary icon="Add" on:click={addBasicConfiguration}
        >Add Basic</Button
      >
    </div>
  </Layout>
</ActionMenu>

<style>
  .header-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
