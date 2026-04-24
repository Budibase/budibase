<script lang="ts">
  import { Button, Modal, notifications } from "@budibase/bbui"
  import type { AgentTestCase } from "@budibase/types"
  import { validateReviewer } from "@budibase/shared-core"
  import TestCaseFields from "./TestCaseFields.svelte"
  import TestReviewersEditor from "./TestReviewersEditor.svelte"

  type ToolOption = { label: string; value: string }

  type Props = {
    toolOptions: ToolOption[]
    groupOptions: ToolOption[]
    isExisting: (_id: string) => boolean
    onSave: (_testCase: AgentTestCase) => Promise<boolean>
  }

  let { toolOptions, groupOptions, isExisting, onSave }: Props = $props()

  let modal: Modal
  let loading = $state(false)
  let draftCase = $state<AgentTestCase | null>(null)

  const truncate = (value: string, max: number) =>
    value.length <= max ? value : `${value.slice(0, max - 1)}…`

  const fallbackName = (testCase: AgentTestCase): string => {
    const explicitName = testCase.name.trim()
    if (explicitName) return explicitName

    const inputPreview = testCase.input.trim().replace(/\s+/g, " ")
    return inputPreview ? truncate(inputPreview, 48) : "Untitled test"
  }

  const normalizeCaseForSave = (testCase: AgentTestCase): AgentTestCase => ({
    ...structuredClone(testCase),
    name: fallbackName(testCase),
  })

  export const show = (testCase: AgentTestCase) => {
    draftCase = structuredClone(testCase)
    loading = false
    modal.show()
  }

  const updateDraftCase = (
    updater: (_testCase: AgentTestCase) => AgentTestCase
  ) => {
    if (!draftCase) return
    draftCase = updater(draftCase)
  }

  const getValidationMessages = (testCase: AgentTestCase | null) => {
    if (!testCase) return []

    const messages: string[] = []
    if (!testCase.input.trim()) {
      messages.push("Input is required.")
    }
    if (!testCase.reviewers.length) {
      messages.push("At least one test criteria is required.")
    }

    testCase.reviewers.forEach((reviewer, index) => {
      const error = validateReviewer(reviewer)
      if (error) {
        messages.push(`Criteria ${index + 1} ${error}.`)
      }
    })

    return messages
  }

  let validationMessages = $derived(getValidationMessages(draftCase))
  let canRunTest = $derived(validationMessages.length === 0)

  const handleConfirm = async () => {
    if (!draftCase || loading || !canRunTest) return

    loading = true
    try {
      const saved = await onSave(normalizeCaseForSave(draftCase))
      if (!saved) return
      modal.hide()
    } catch (error) {
      console.error("Failed to save test", error)
      notifications.error("Failed to save test")
    } finally {
      loading = false
    }
  }

  let editing = $derived(draftCase ? isExisting(draftCase.id) : false)
</script>

<Modal bind:this={modal} autoFocus={false}>
  {#if draftCase}
    <div class="test-case-modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="modal-heading">
          <h2>{editing ? "Edit test case" : "Add test case"}</h2>
        </div>
      </div>

      <div class="modal-body">
        <section class="section">
          <div class="section-header">
            <h3>Test input</h3>
            <p>What the user or system will send to the agent.</p>
          </div>

          <TestCaseFields
            selectedCase={draftCase}
            {groupOptions}
            onUpdateCase={updateDraftCase}
          />
        </section>

        <div class="section-divider"></div>

        <section class="section">
          <div class="section-header">
            <h3>Test criteria</h3>
            <p>Describe what a good response looks like.</p>
          </div>

          <TestReviewersEditor
            selectedCase={draftCase}
            {toolOptions}
            onUpdateCase={updateDraftCase}
          />
        </section>
      </div>

      {#if validationMessages.length}
        <div class="validation-summary">
          {#each validationMessages as message}
            <span>{message}</span>
          {/each}
        </div>
      {/if}

      <div class="modal-footer">
        <Button secondary disabled={loading} on:click={() => modal.hide()}>
          Cancel
        </Button>

        <Button cta disabled={loading || !canRunTest} on:click={handleConfirm}>
          {loading ? "Running..." : "Run test"}
        </Button>
      </div>
    </div>
  {/if}
</Modal>

<style>
  .test-case-modal {
    width: min(600px, calc(100vw - 32px));
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
    color: var(--ink);
    overflow: hidden;
  }

  .modal-header {
    padding: 24px 40px 0;
  }

  .modal-heading h2 {
    margin: 0;
    font-size: 17px;
    line-height: 1.3;
    font-weight: 500;
    color: var(--ink);
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 40px 0;
    max-height: min(72vh, 760px);
    overflow: auto;
    scrollbar-width: thin;
  }

  .modal-body::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .modal-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-body::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 999px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .section-header h3 {
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    font-weight: 600;
    color: var(--ink);
  }

  .section-header p {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: var(--spectrum-global-color-gray-600);
  }

  .section-divider {
    height: 1px;
    background: var(--spectrum-global-color-gray-200);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px 40px 28px;
  }

  .validation-summary {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 16px 40px 0;
    padding: 10px 12px;
    border: 1px solid
      color-mix(
        in srgb,
        var(--color-orange-500) 35%,
        var(--spectrum-global-color-gray-200)
      );
    border-radius: 6px;
    background: color-mix(
      in srgb,
      var(--color-orange-500) 8%,
      var(--background-alt)
    );
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
    line-height: 1.45;
  }

  :global(.spectrum-Modal:has(.test-case-modal)) {
    border: none;
    background: transparent;
    box-shadow: none;
  }

  @media (max-width: 720px) {
    .modal-header,
    .modal-body,
    .modal-footer {
      padding-left: 20px;
      padding-right: 20px;
    }

    .validation-summary {
      margin-left: 20px;
      margin-right: 20px;
    }
  }
</style>
