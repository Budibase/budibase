<script lang="ts">
  import { API } from "@/api"
  import { featureFlag } from "@/helpers"
  import { ActionButton, Input } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"

  let prompt: string

  $: isEnabled = featureFlag.isEnabled(FeatureFlag.AI_TABLE_GENERATION)

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
      disabled={!isEnabled}
    />
  </div>
  <div class="ai-generation-examples">
    {#if isEnabled}
      {#each ["Create a table called tickets with title, description, status fields", "Create a table called students with name and address fields"] as prompt}
        <ActionButton on:click={() => submitPrompt(prompt)}
          >{prompt}</ActionButton
        >
      {/each}
    {/if}
  </div>
</div>

<style>
  .ai-generation {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ai-generation-examples {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  .ai-generation :global(.spectrum-Textfield-input),
  .ai-generation :global(.spectrum-ActionButton) {
    background: #1d1d1d;
    border-radius: 20px;
  }
</style>
