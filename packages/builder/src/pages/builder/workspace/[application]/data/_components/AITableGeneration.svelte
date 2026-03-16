<script lang="ts">
  import { API } from "@/api"
  import AiInput from "@/components/common/ai/AIInput.svelte"
  import { datasources, tables } from "@/stores/builder"
  import { aiStore } from "@/stores/portal"
  import { ActionButton, notifications } from "@budibase/bbui"
  import { goto as gotoStore } from "@roxi/routify"

  $: goto = $gotoStore

  let promptText = ""
  let progressMessage = ""

  async function submitPrompt(message: string) {
    try {
      progressMessage = "Starting table generation..."
      const { createdTables } = await API.generateTables(
        {
          prompt: message,
        },
        message => {
          progressMessage = message
        }
      )

      const [tableToRedirect] = createdTables.sort((a, b) =>
        a.name.localeCompare(b.name)
      )

      progressMessage = ""
      notifications.success(`Tables created successfully.`)
      await datasources.fetch()
      await tables.fetch()
      goto(`./table/${tableToRedirect.id}`)
    } catch (e: any) {
      progressMessage = ""
      notifications.error(
        e?.message || e?.json?.message || "Error generating tables"
      )
    }
  }

  const examplePrompts = [
    "Create me a table for managing IT tickets",
    "Create a table called students with name and address fields",
  ]
</script>

<div class="ai-generation">
  <div class="ai-generation-prompt">
    <AiInput
      bind:value={promptText}
      placeholder="Generate data using AI..."
      onSubmit={submitPrompt}
      expandedOnly
    />
  </div>
  {#if progressMessage}
    <div class="ai-generation-secondary ai-generation-progress">
      {progressMessage}
    </div>
  {:else if $aiStore.aiEnabled}
    <div class="ai-generation-secondary ai-generation-examples">
      {#each examplePrompts as prompt}
        <ActionButton on:click={() => (promptText = prompt)}
          >{prompt}</ActionButton
        >
      {/each}
    </div>
  {/if}
</div>

<style>
  .ai-generation {
    --ai-generation-secondary-height: 90px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ai-generation-prompt {
    width: 100%;
  }

  .ai-generation-secondary {
    min-height: var(--ai-generation-secondary-height);
  }

  .ai-generation-examples {
    display: grid;
    gap: 10px;
    width: 100%;
    grid-template-columns: 1fr;
  }

  .ai-generation-progress {
    display: flex;
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
    padding: 0 8px;
  }

  @media (min-width: 833px) {
    .ai-generation {
      --ai-generation-secondary-height: 40px;
    }

    .ai-generation-examples {
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    }
  }

  .ai-generation-examples :global(.spectrum-ActionButton) {
    width: 100%;
    justify-content: center;
  }
  .ai-generation :global(.spectrum-Textfield-input),
  .ai-generation :global(.spectrum-ActionButton) {
    background: var(--spectrum-global-color-gray-75);
    border-radius: 20px;
  }
</style>
