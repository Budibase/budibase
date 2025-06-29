<script lang="ts">
  import { Body, ActionButton } from "@budibase/bbui"
  import OpenAILogo from "./logos/OpenAI.svelte"
  import AzureOpenAILogo from "./logos/AzureOpenAI.svelte"
  import BudibaseAILogo from "./logos/BBAI.svelte"
  import type { AIProvider, ProviderConfig } from "@budibase/types"
  import { type ComponentType } from "svelte"

  const logos: Partial<Record<AIProvider, ComponentType>> = {
    BudibaseAI: BudibaseAILogo,
    OpenAI: OpenAILogo,
    AzureOpenAI: AzureOpenAILogo,
  }

  export let config: ProviderConfig
  export let editHandler: (() => void) | null
  export let disableHandler: (() => void) | null
</script>

<div class="option">
  <div class="details">
    <div class="icon">
      <svelte:component this={logos[config.provider]} height="26" width="26" />
    </div>
    <div class="header">
      <Body size="S" weight={"600"}>{config.name}</Body>
    </div>
    <div class="controls">
      {#if config.active}
        <div class="tag active">Enabled</div>
      {:else}
        <div class="tag disabled">Disabled</div>
      {/if}
    </div>
  </div>
  <div>
    {#if config.provider === "BudibaseAI"}
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
      <!-- OpenAI or AzureOpenAI -->
      <ActionButton on:click={() => editHandler && editHandler()}>
        {#if config.apiKey}Edit{:else}Set up{/if}
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
    color: var(--spectrum-global-color-gray-900);
  }

  .icon {
    background-color: var(--spectrum-global-color-gray-200);
    height: 40px;
    width: 40px;
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
    color: #fff;
  }

  .active {
    background: #004c2e;
  }

  .disabled {
    background: var(--grey-3);
  }
</style>
