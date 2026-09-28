<svelte:options runes={true} />

<script lang="ts">
  import { API } from "@/api"
  import { getErrorMessage } from "@/helpers/errors"
  import {
    Button,
    Modal,
    ModalContent,
    notifications,
    TextArea,
  } from "@budibase/bbui"
  import type { FunctionQueryCapability } from "@budibase/types"
  import { tick } from "svelte"

  export interface Props {
    functionName: string
    source: string
    capabilities: FunctionQueryCapability[]
    onApply: (_source: string) => void
  }

  let { functionName, source, capabilities, onApply }: Props = $props()
  let modal = $state<Modal>()
  let promptField = $state<TextArea>()
  let promptInputKey = $state(0)
  let request = $state("")
  let generatedCode = $state("")
  let generating = $state(false)
  let requestToken = $state(0)

  const close = () => modal?.hide()

  const generate = async () => {
    if (!request.trim() || generating) return
    const token = ++requestToken
    generating = true
    try {
      const response = await API.generateFunctionCode({
        prompt: request,
        functionName,
        source,
        queries: capabilities.map(capability => ({
          datasourceAlias: capability.datasourceAlias,
          queryAlias: capability.queryAlias,
          parameterNames: [...capability.parameterNames],
        })),
      })
      if (token !== requestToken) return
      generatedCode = response.code.trim()
      if (!generatedCode) {
        notifications.error(
          "No code was generated. Try a more specific request."
        )
      }
    } catch (generationError) {
      if (token === requestToken) {
        notifications.error(
          getErrorMessage(generationError) || "Unable to generate code"
        )
      }
    } finally {
      if (token === requestToken) generating = false
    }
  }

  const apply = () => {
    onApply(generatedCode)
    close()
    notifications.success("Generated code added to the draft")
  }
</script>

<Button secondary size="S" icon="sparkle" on:click={() => modal?.show()}>
  Help write code
</Button>

<Modal
  bind:this={modal}
  on:show={async () => {
    await tick()
    promptField?.focus()
  }}
  on:hide={() => {
    requestToken += 1
    promptInputKey += 1
    generating = false
    request = ""
    generatedCode = ""
  }}
>
  <ModalContent
    title="Generate Code"
    size="L"
    showCloseIcon
    showConfirmButton={false}
    showCancelButton={false}
  >
    {#if generatedCode}
      <label class="field-label" for="generated-function-code"
        >Review the generated code</label
      >
      <textarea
        id="generated-function-code"
        class="code-preview"
        bind:value={generatedCode}
        spellcheck="false"
      ></textarea>
      <div class="modal-actions">
        <Button secondary on:click={() => (generatedCode = "")}>Back</Button>
        <Button cta disabled={!generatedCode.trim()} on:click={apply}>
          Replace current code
        </Button>
      </div>
    {:else}
      {#key promptInputKey}
        <TextArea
          label="What should this Function do?"
          bind:this={promptField}
          updateOnChange
          minHeight={140}
          disabled={generating}
          placeholder="Describe the inputs, linked queries, and output you need..."
          on:change={event => (request = event.detail || "")}
        />
      {/key}
      <div class="modal-actions">
        <Button secondary disabled={generating} on:click={close}>Cancel</Button>
        <Button
          cta
          icon="sparkle"
          disabled={generating || !request.trim()}
          on:click={generate}
        >
          {generating ? "Generating..." : "Generate code"}
        </Button>
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .field-label {
    display: block;
    margin-bottom: var(--spacing-s);
    font-size: var(--font-size-s);
    font-weight: 500;
  }
  .code-preview {
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-m);
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-900);
    resize: vertical;
  }
  .code-preview {
    min-height: 340px;
    font-family: var(--font-family-code);
    font-size: 13px;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-s);
    margin-top: var(--spacing-m);
  }
</style>
