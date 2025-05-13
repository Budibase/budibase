<script lang="ts">
  import {
    ActionButton,
    Body,
    Button,
    Divider,
    List,
    ListItem,
    PopoverAlignment,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { appStore, oauth2 } from "@/stores/builder"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { RestAuthType } from "@budibase/types"
  import { onMount } from "svelte"

  type Config = { label: string; value: string }

  export let authConfigId: string | undefined
  export let authConfigType: RestAuthType | undefined
  export let authConfigs: Config[]
  export let datasourceId: string

  let popover: DetailPopover
  let allConfigs: Config[]

  $: allConfigs = [
    ...authConfigs,
    ...$oauth2.configs.map(c => ({
      label: c.name,
      value: c._id,
    })),
  ]
  $: authConfig = allConfigs.find(c => c.value === authConfigId)

  function addBasicConfiguration() {
    $goto(
      `/builder/app/${$appStore.appId}/data/datasource/${datasourceId}?&tab=Authentication`
    )
  }

  function addOAuth2Configuration() {
    $goto(`/builder/app/${$appStore.appId}/settings/oauth2`)
  }

  function selectConfiguration(id: string, type?: RestAuthType) {
    if (authConfigId === id) {
      authConfigId = undefined
      authConfigType = undefined
    } else {
      authConfigId = id
      authConfigType = type
    }
    popover.hide()
  }

  $: title = !authConfig ? "Authentication" : `Auth: ${authConfig.label}`

  onMount(() => {
    oauth2.fetch()
  })
</script>

<DetailPopover bind:this={popover} {title} align={PopoverAlignment.Right}>
  <div slot="anchor" class:display-new={!authConfig}>
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

  <Divider />

  <Body size="S" color="var(--spectrum-global-color-gray-700)">
    OAuth 2.0 (Token-Based Authentication)
  </Body>

  {#if $oauth2.configs.length}
    <List>
      {#each $oauth2.configs as config}
        <ListItem
          title={config.name}
          on:click={() => selectConfiguration(config._id, RestAuthType.OAUTH2)}
          selected={config._id === authConfigId}
        />
      {/each}
    </List>
  {/if}
  <div>
    <Button secondary icon="Add" on:click={addOAuth2Configuration}
      >Add OAuth2</Button
    >
  </div>
</DetailPopover>

<style>
  .display-new :global(.spectrum-ActionButton)::before {
    content: "NEW";
    font-size: 10px;
    background: var(--bb-indigo);
    border-radius: 4px;
    padding: 2px 4px;
    margin-right: var(--spacing-s);
    color: white;
    font-weight: bold;
  }
</style>
