<script>
  import { Body, Label, Icon } from "@budibase/bbui"
  import OpenAILogo from "./logos/OpenAI.svelte"
  import AnthropicLogo from "./logos/Anthropic.svelte"
  import TogetherAILogo from "./logos/TogetherAI.svelte"
  import { Providers } from "./constants"

  export let config
  export let disabled

  export let editHandler
  export let deleteHandler
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class:disabled class="option">
  <div class="icon">
    {#if config.provider === Providers.OpenAI.name}
      <OpenAILogo height="30" width="30"/>
    {:else if config.provider === Providers.Anthropic.name}
      <AnthropicLogo height="30" width="30"/>
    {:else if config.provider === Providers.TogetherAI.name}
      <TogetherAILogo height="30" width="30"/>
    {/if}
  </div>
  <div class="header">
    <Body>{config.provider}</Body>
    <Label>{config.name}</Label>
  </div>
  <div class="controls">
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
    {#if config.active}
      <div class="tag active">Activated</div>
    {:else if !config.active}
      <div class="tag disabled">Disabled</div>
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
    grid-template-columns: 6% 1fr 20%;
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
    color: var(--spectrum-body-m-text-color);
    padding: 4px 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }

  .active {
    border-radius: 5px;
    background: var(--spectrum-global-color-green-600);
  }

  .disabled {
    border-radius: 5px;
    background: var(--spectrum-global-color-red-600);
  }
</style>
