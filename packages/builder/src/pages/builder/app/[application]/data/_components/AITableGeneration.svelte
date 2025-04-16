<script lang="ts">
  import { API } from "@/api"
  import AiInput from "@/components/common/ai/AIInput.svelte"
  import { featureFlag } from "@/helpers"
  import { ActionButton } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"

  $: isEnabled = featureFlag.isEnabled(FeatureFlag.AI_TABLE_GENERATION)

  async function submitPrompt(message: string) {
    await API.generateTables(message)
  }
</script>

<div class="ai-generation">
  <div class="ai-generation-prompt">
    <AiInput placeholder="Generate data using AI..." onSubmit={submitPrompt} />
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
