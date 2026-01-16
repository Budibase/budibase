<script lang="ts">
  import { API } from "@/api"
  import AiInput from "@/components/common/ai/AIInput.svelte"
  import { datasources, tables } from "@/stores/builder"
  import { auth, licensing } from "@/stores/portal"
  import { ActionButton, notifications } from "@budibase/bbui"
  import { goto as gotoStore } from "@roxi/routify"

  $: goto = $gotoStore

  let promptText = ""

  $: isEnabled = $auth?.user?.llm && !$licensing.aiCreditsExceeded

  async function submitPrompt(message: string) {
    try {
      const { createdTables } = await API.generateTables({
        prompt: message,
      })

      const [tableToRedirect] = createdTables.sort((a, b) =>
        a.name.localeCompare(b.name)
      )

      notifications.success(`Tables created successfully.`)
      await datasources.fetch()
      await tables.fetch()
      goto(`./table/${tableToRedirect.id}`)
    } catch (e: any) {
      notifications.error(e.message)
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
  <div class="ai-generation-examples">
    {#if isEnabled}
      {#each examplePrompts as prompt}
        <ActionButton on:click={() => (promptText = prompt)}
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

  .ai-generation-prompt {
    width: 100%;
  }

  .ai-generation-examples {
    display: grid;
    gap: 10px;
    width: 100%;
    grid-template-columns: 1fr;
  }

  @media (min-width: 833px) {
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
