<script>
  import { Body, Label, Icon } from "@budibase/bbui"
  import BudibaseLogo from "./logos/Budibase.svelte"
  import OpenAILogo from "./logos/OpenAI.svelte"
  import AnthropicLogo from "./logos/Anthropic.svelte"
  import TogetherAILogo from "./logos/TogetherAI.svelte"
  import AzureOpenAILogo from "./logos/AzureOpenAI.svelte"
  import { Providers } from "./constants"

  const logos = {
    ["Budibase AI"]: BudibaseLogo,
    [Providers.OpenAI.name]: OpenAILogo,
    [Providers.Anthropic.name]: AnthropicLogo,
    [Providers.TogetherAI.name]: TogetherAILogo,
    [Providers.AzureOpenAI.name]: AzureOpenAILogo,
  }

  export let config
  export let disabled

  export let editHandler
  export let deleteHandler
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class:disabled class="option">
  <div class="icon">
    <svelte:component
      this={logos[config.name || config.provider]}
      height="18"
      width="18"
    />
  </div>
  <div class="header">
    <Body>{config.provider}</Body>
    <Label>{config.name}</Label>
  </div>
  <div class="controls">
    {#if config.name !== "Budibase AI"}
      <Icon
        on:click={editHandler}
        color="var(--grey-6)"
        size="S"
        hoverable
        name="Edit"
      />
      <Icon
        on:click={deleteHandler}
        color="var(--grey-6)"
        size="S"
        hoverable
        name="Delete"
      />
    {/if}
    {#if config.active}
      <div class="tag active">Activated</div>
    {:else if !config.active}
      <div class="tag disabled">Disabled</div>
    {/if}
    {#if config.isDefault}
      <div class="tag default">Default</div>
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
    display: grid;
    grid-template-columns: 6% 1fr auto;
    grid-gap: 20px;
    align-items: center;
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
    background-color: white;
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

  .controls {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 10px;
    align-items: center;
  }

  .tag {
    display: flex;
    color: #ffffff;
    padding: 4px 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    border-radius: 5px;
  }

  .default {
    background: var(--grey-6);
  }

  .active {
    background: var(--spectrum-global-color-green-600);
  }

  .disabled {
    background: var(--spectrum-global-color-red-600);
  }
</style>
