<script lang="ts">
  import {
    ActionButton,
    Body,
    Button,
    List,
    ListItem,
    PopoverAlignment,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { appStore } from "@/stores/builder"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  export let authConfigId: string | undefined
  export let authConfigs: { label: string; value: string }[]
  export let datasourceId: string

  let popover: DetailPopover

  $: authConfig = authConfigs.find(c => c.value === authConfigId)

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

<DetailPopover bind:this={popover} {title} align={PopoverAlignment.Right}>
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
    Basic & Bearer Authentication
  </Body>

  {#if authConfigs.length}
    <List>
      {#each authConfigs as config}
        <ListItem
          title={config.label}
          on:click={() => selectConfiguration(config.value)}
          selected={config.value === authConfigId}
        />
      {/each}
    </List>
  {/if}
  <div>
    <Button secondary icon="Add" on:click={addBasicConfiguration}
      >Add config</Button
    >
  </div>
</DetailPopover>
