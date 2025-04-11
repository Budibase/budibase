<script lang="ts">
  import { API } from "@/api"
  import { ActionButton, Input } from "@budibase/bbui"

  let prompt: string

  async function submitPrompt(message: string) {
    await API.generateTables(message)
  }

  async function onInputKeydown(e: KeyboardEvent) {
    if (e.repeat || e.key !== "Enter") {
      return
    }

    await submitPrompt(prompt)
  }
</script>

<div class="ai-generation">
  <div class="ai-generation-prompt">
    <Input
      bind:value={prompt}
      placeholder="Generate data using AI..."
      on:keydown={onInputKeydown}
    />
  </div>

  {#each ["Create a table called tickets with title, description, status fields", "Create a table called students with name and address fields"] as prompt}
    <ActionButton on:click={() => submitPrompt(prompt)}>{prompt}</ActionButton>
  {/each}
</div>

<style>
  .ai-generation {
    max-width: 753px;
    display: grid;
    gap: 10px;

    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    margin-bottom: 36px;
  }

  .ai-generation-prompt {
    grid-column: 1 / -1;
  }
  .ai-generation :global(.spectrum-Textfield-input),
  .ai-generation :global(.spectrum-ActionButton) {
    background: #1d1d1d;
    border-radius: 20px;
  }
</style>
