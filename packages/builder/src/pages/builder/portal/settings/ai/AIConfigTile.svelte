<script>
  import {Body, Label, Icon, Tag} from "@budibase/bbui"
  import OpenAILogo from "./logos/OpenAI.svelte"
  import AnthropicLogo from "./logos/Anthropic.svelte"
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
    {/if}
  </div>
  <div class="header">
    <Body>{config.name}</Body>
    <Label>{config.name}</Label>
  </div>
  <div class="controls">
    <Icon
      on:click={editHandler}
      size="S"
      hoverable
      name="Edit"
    />
    <Icon
      on:click={deleteHandler}
      size="S"
      hoverable
      name="Delete"
    />
    <div>Activated</div>
  </div>
</div>

<style>
  .option {
    background-color: var(--background);
    border: 1px solid var(--grey-4);
    padding: 10px 16px 14px;
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
</style>
