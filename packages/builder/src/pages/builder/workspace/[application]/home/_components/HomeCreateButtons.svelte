<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Icon, Tag } from "@budibase/bbui"

  export let agentsEnabled = false

  const dispatch = createEventDispatcher<{
    createAutomation: void
    createApp: void
    createAgent: void
    createChat: void
  }>()
</script>

<div class="create-buttons">
  <button
    class="create-button"
    type="button"
    on:click={() => dispatch("createAutomation")}
  >
    <Icon name="path" size="S" color="#89B5E2" weight="fill" />
    <Body size="S">Automation</Body>
  </button>

  <button
    class="create-button"
    type="button"
    on:click={() => dispatch("createApp")}
  >
    <Icon name="browsers" size="S" color="#D4A27F" weight="fill" />
    <Body size="S">App</Body>
  </button>

  {#if agentsEnabled}
    <button
      class="create-button"
      type="button"
      on:click={() => dispatch("createAgent")}
    >
      <Icon name="sparkle" size="S" color="#BDB0F5" weight="fill" />
      <Body size="S">Agent</Body>
      <Tag emphasized>Beta</Tag>
    </button>

    <button
      class="create-button create-button--disabled"
      type="button"
      disabled
      title="Coming soon"
      on:click={() => dispatch("createChat")}
    >
      <Icon name="chat-circle" size="S" color="#8CA171" weight="fill" />
      <Body size="S">Chat</Body>
      <Tag emphasized>Alpha</Tag>
    </button>
  {/if}
</div>

<style>
  .create-buttons {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }

  .create-button {
    background: var(--spectrum-global-color-gray-200);
    border: none;
    border-radius: 100px;
    padding: 7px 15px 8px;
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-xs) + 4px);
    cursor: pointer;
    transition: background 130ms ease-out;
    color: var(--spectrum-global-color-gray-900);
    font-size: 14px;
    height: 32px;
    box-sizing: border-box;
  }

  .create-button :global(.spectrum-Body) {
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }

  .create-button:hover {
    background: var(--spectrum-global-color-gray-300);
  }

  .create-button--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>
