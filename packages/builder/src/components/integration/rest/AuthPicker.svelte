<script lang="ts">
  import {
    ActionButton,
    ActionMenu,
    Body,
    Divider,
    Layout,
  } from "@budibase/bbui"
  import { onMount } from "svelte"

  export let authConfigId: string
  export let authConfigs: { label: string; value: string }[]

  let menu: ActionMenu

  $: authConfig = authConfigs.find(c => c.value === authConfigId)

  function closeMenu() {
    menu.hide()
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
  </Layout>
</ActionMenu>

<style>
  .header-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
