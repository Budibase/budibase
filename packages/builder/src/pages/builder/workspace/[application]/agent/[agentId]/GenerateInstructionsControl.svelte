<script lang="ts">
  import {
    Button,
    Modal,
    ModalContent,
    TextArea,
    notifications,
  } from "@budibase/bbui"
  import { type EnrichedBinding } from "@budibase/types"
  import { featureFlags } from "@/stores/portal"
  import { API } from "@/api"
  import { tick } from "svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"
  import { getIncludedToolRuntimeBindings } from "./toolBindingUtils"

  const AI_AGENT_INSTRUCTIONS_FLAG = "AI_AGENT_INSTRUCTIONS"

  export interface Props {
    agentName?: string
    goal?: string
    promptInstructions?: string
    promptBindings?: EnrichedBinding[]
    bindingIcons?: Record<string, string | undefined>
    onApplyInstructions?: (_instructions: string) => void
  }

  let {
    agentName = "",
    goal = "",
    promptInstructions = "",
    promptBindings = [],
    bindingIcons = {},
    onApplyInstructions = () => {},
  }: Props = $props()

  let readableToRuntimeBinding = $derived.by(() => {
    return promptBindings.reduce<Record<string, string>>((acc, binding) => {
      if (binding.readableBinding && binding.runtimeBinding) {
        acc[binding.readableBinding] = binding.runtimeBinding
      }
      return acc
    }, {})
  })

  let includedToolRuntimeBindings = $derived(
    getIncludedToolRuntimeBindings(promptInstructions, readableToRuntimeBinding)
  )

  let includedToolsWithDetails = $derived(
    includedToolRuntimeBindings
      .map(runtimeBinding =>
        promptBindings.find(
          binding => binding.runtimeBinding === runtimeBinding
        )
      )
      .filter((binding): binding is EnrichedBinding => !!binding)
  )

  let enabledToolReferences = $derived(
    includedToolsWithDetails
      .map(tool => tool.readableBinding)
      .filter((binding): binding is string => !!binding)
      .map(binding => `{{ ${binding} }}`)
  )

  let enabled = $derived(
    !!($featureFlags as Record<string, boolean>)[AI_AGENT_INSTRUCTIONS_FLAG]
  )
  let modal = $state<Modal>()
  let promptField = $state<TextArea>()
  let prompt = $state("")
  let generatedInstructions = $state("")
  let generating = $state(false)
  let requestToken = $state(0)

  function resetState() {
    requestToken += 1
    prompt = ""
    generatedInstructions = ""
    generating = false
  }

  function hideModal() {
    modal?.hide()
  }

  function applyGeneratedInstructions() {
    onApplyInstructions(generatedInstructions)
    hideModal()
    notifications.success("Instructions updated successfully")
  }

  async function generateInstructions() {
    if (generating) {
      return
    }

    const currentRequestToken = ++requestToken
    generating = true

    try {
      const { instructions } = await API.generateAgentInstructions({
        prompt,
        agentName,
        goal,
        toolReferences: enabledToolReferences,
      })

      if (currentRequestToken !== requestToken) {
        return
      }

      notifications.success("Instructions generated successfully")
      generatedInstructions = instructions
    } catch (error: any) {
      if (currentRequestToken !== requestToken) {
        return
      }

      notifications.error(
        error?.message ||
          error?.json?.message ||
          "Error generating instructions"
      )
    } finally {
      if (currentRequestToken === requestToken) {
        generating = false
      }
    }
  }
</script>

{#if enabled}
  <Button secondary size="S" icon="sparkle" on:click={() => modal?.show()}>
    Generate
  </Button>

  <Modal
    bind:this={modal}
    on:show={async () => {
      await tick()
      promptField?.focus()
    }}
    on:hide={resetState}
  >
    <ModalContent
      title={generatedInstructions
        ? "Review Generated Instructions"
        : "Generate Instructions"}
      size="M"
      showCloseIcon
      showConfirmButton={false}
      showCancelButton={false}
    >
      {#if generatedInstructions}
        <div class="generated-instructions-preview">
          <CodeEditor
            value={generatedInstructions}
            bindings={promptBindings}
            {bindingIcons}
            mode={EditorModes.Handlebars}
            renderBindingsAsTags={true}
            renderMarkdownDecorations={true}
            placeholder=""
            on:change={event => {
              generatedInstructions = event.detail || ""
            }}
          />
        </div>
        <div class="generate-instructions-actions">
          <Button secondary on:click={hideModal}>Cancel</Button>
          <Button cta on:click={applyGeneratedInstructions}
            >Replace current</Button
          >
        </div>
      {:else}
        <TextArea
          label="Prompt"
          bind:this={promptField}
          bind:value={prompt}
          minHeight={140}
          disabled={generating}
          placeholder="Describe what kind of instructions you want to generate..."
        />
        <div class="generate-instructions-actions">
          <Button secondary disabled={generating} on:click={hideModal}
            >Cancel</Button
          >
          <Button
            cta
            icon="sparkle"
            disabled={generating || !prompt.trim()}
            on:click={generateInstructions}
          >
            {generating ? "Generating..." : "Generate"}
          </Button>
        </div>
      {/if}
    </ModalContent>
  </Modal>
{/if}

<style>
  .generate-instructions-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-s);
    margin-top: var(--spacing-m);
  }

  .generated-instructions-preview {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    overflow: hidden;
    min-height: 220px;
  }
</style>
