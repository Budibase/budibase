<script lang="ts">
  import { Body, Label, Icon, ActionButton } from "@budibase/bbui"
  import BudibaseLogo from "./logos/Budibase.svelte"
  import OpenAILogo from "./logos/OpenAI.svelte"
  import AnthropicLogo from "./logos/Anthropic.svelte"
  import TogetherAILogo from "./logos/TogetherAI.svelte"
  import AzureOpenAILogo from "./logos/AzureOpenAI.svelte"
  import BudibaseAILogo from "./logos/BBAI.svelte"
  import { Providers } from "./constants"
  import type { ProviderConfig } from "@budibase/types"
  const logos = {
    ["Budibase AI"]: BudibaseAILogo,
    [Providers.OpenAI.name]: OpenAILogo,
    [Providers.AzureOpenAI.name]: AzureOpenAILogo,
    // legacy/custom providers
    ["Anthropic"]: AnthropicLogo,
    ["TogetherAI"]: TogetherAILogo,
  }
  export let config: ProviderConfig
  export let editHandler: (() => void) | null
  /** Invoke to disable this provider (for Budibase AI) */
  export let disableHandler: (() => void) | null
  /** Override for active state display */
  export let activeOverride: boolean | undefined
  $: console.log(config)
</script>

<div class="option">
  <div class="details">
    <div class="icon">
      <svelte:component
        this={logos[config.name || config.provider]}
        height="18"
        width="18"
      />
    </div>
    <div class="header">
      <Body>{config.name}</Body>
    </div>
    <div class="controls">
      {#if activeOverride ?? config.active}
        <div class="tag active">Enabled</div>
      {:else}
        <div class="tag disabled">Disabled</div>
      {/if}
    </div>
  </div>
  <div>
    {#if config.isBudibaseAI}
      {#if config.active}
        <ActionButton on:click={() => disableHandler && disableHandler()}>
          Disable
        </ActionButton>
      {:else}
        <ActionButton on:click={() => editHandler && editHandler()}>
          Enable
        </ActionButton>
      {/if}
    {:else}
      <ActionButton on:click={() => editHandler && editHandler()}>
        Edit
      </ActionButton>
    {/if}
  </div>
</div>

<style>
  .option {
    background-color: var(--background);
    border: 1px solid var(--grey-4);
    padding: 16px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .details {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .option :global(label) {
    cursor: pointer;
  }

  .option:hover {
    background-color: var(--background-alt);
  }

  .header {
    align-items: center;
  }

  .icon {
    background-color: var(--grey-2);
    height: 38px;
    width: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
  }

  .disabled {
    pointer-events: none;
  }

  .tag {
    padding: 4px 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    border-radius: 5px;
  }

  .active {
    background: var(--spectrum-global-color-green-600);
  }

  .disabled {
    background: var(--grey-3);
  }
</style>
