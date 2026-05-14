<script lang="ts">
  import { Body, Button, Modal, notifications } from "@budibase/bbui"
  import { AIConfigType, type AgentTestCase } from "@budibase/types"
  import { validateReviewer } from "@budibase/shared-core"
  import { bb } from "@/stores/bb"
  import TestCaseFields from "./TestCaseFields.svelte"
  import TestReviewersEditor from "./TestReviewersEditor.svelte"

  type ToolOption = { label: string; value: string }
  type AIConfigOption = { label: string; value: string }

  type Props = {
    toolOptions: ToolOption[]
    groupOptions: ToolOption[]
    aiConfigOptions: AIConfigOption[]
    defaultAiConfigId?: string
    isExisting: (_id: string) => boolean
    disabled?: boolean
    onSave: (_testCase: AgentTestCase) => Promise<boolean>
  }

  let {
    toolOptions,
    groupOptions,
    aiConfigOptions,
    defaultAiConfigId,
    isExisting,
    disabled = false,
    onSave,
  }: Props = $props()

  let modal: Modal
  let loading = $state(false)
  let draftCase = $state<AgentTestCase | null>(null)

  const truncate = (text: string, max: number) =>
    text.length <= max ? text : `${text.slice(0, max - 1)}…`

  const fallbackName = (testCase: AgentTestCase): string => {
    const explicitName = testCase.name.trim()
    if (explicitName) return explicitName

    const inputPreview = testCase.input.trim().replace(/\s+/g, " ")
    return inputPreview ? truncate(inputPreview, 48) : "Untitled test"
  }

  const copyCase = (testCase: AgentTestCase): AgentTestCase => ({
    id: testCase.id,
    groupId: testCase.groupId,
    name: testCase.name,
    input: testCase.input,
    context: testCase.context,
    aiConfigIds: testCase.aiConfigIds
      ? [...testCase.aiConfigIds]
      : defaultAiConfigId
        ? [defaultAiConfigId]
        : [],
    reviewers: testCase.reviewers.map(reviewer => ({ ...reviewer })),
    lastResult: testCase.lastResult,
    lastResults: testCase.lastResults,
  })

  const normalizeCaseForSave = (testCase: AgentTestCase): AgentTestCase => ({
    ...copyCase(testCase),
    name: fallbackName(testCase),
  })

  export const show = (testCase: AgentTestCase) => {
    if (disabled) return

    draftCase = copyCase(testCase)
    loading = false
    modal.show()
  }

  const updateDraftCase = (
    updater: (_testCase: AgentTestCase) => AgentTestCase
  ) => {
    if (!draftCase) return
    draftCase = updater(draftCase)
  }

  const toggleAiConfig = (aiConfigId: string) => {
    updateDraftCase(testCase => {
      const selected = testCase.aiConfigIds || []
      if (selected.includes(aiConfigId)) {
        return {
          ...testCase,
          aiConfigIds: selected.filter(id => id !== aiConfigId),
        }
      }

      if (selected.length >= 3) return testCase

      return {
        ...testCase,
        aiConfigIds: [...selected, aiConfigId],
      }
    })
  }

  const isDraftValid = (testCase: AgentTestCase | null) => {
    if (!testCase) return false
    if (!testCase.input.trim()) return false
    if (!testCase.aiConfigIds?.length) return false
    if (!testCase.reviewers.length) return false
    return testCase.reviewers.every(
      reviewer => validateReviewer(reviewer) === null
    )
  }

  let canRunTest = $derived(isDraftValid(draftCase))

  const handleConfirm = async () => {
    if (!draftCase || loading || disabled || !canRunTest) return

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
            <h3>Compare AI models</h3>
            <p>
              Select up to 3 AI models to compare response. To add models, go to{" "}
              <button
                class="link-button"
                onclick={() => {
                  modal.hide()
                  bb.settings(`/connections/${AIConfigType.COMPLETIONS}`)
                }}
              >
                AI Connectors
              </button>.
            </p>
          </div>

          {#if aiConfigOptions.length}
            <div class="ai-config-pills">
              {#each aiConfigOptions as option (option.value)}
                {@const selected = draftCase.aiConfigIds?.includes(
                  option.value
                )}
                <button
                  type="button"
                  class:selected
                  class="ai-config-pill"
                  disabled={!selected &&
                    (draftCase.aiConfigIds?.length || 0) >= 3}
                  onclick={() => toggleAiConfig(option.value)}
                >
                  {option.label}
                </button>
              {/each}
            </div>
          {:else}
            <Body size="S" color="var(--spectrum-global-color-gray-600)">
              No AI configs available.
            </Body>
          {/if}
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

      <div class="modal-footer">
        <Button secondary disabled={loading} on:click={() => modal.hide()}>
          Cancel
        </Button>

        <Button
          cta
          disabled={loading || disabled || !canRunTest}
          on:click={handleConfirm}
        >
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

  .link-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: var(--spectrum-global-color-gray-800);
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    cursor: pointer;
  }

  .link-button:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .section-divider {
    height: 1px;
    background: var(--spectrum-global-color-gray-200);
  }

  .ai-config-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ai-config-pill {
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 999px;
    background: var(--background-alt);
    color: var(--ink);
    padding: 7px 12px;
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
  }

  .ai-config-pill.selected {
    border-color: var(--spectrum-global-color-blue-500);
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-blue-500) 22%,
      var(--background-alt)
    );
    color: var(--spectrum-global-color-blue-700);
  }

  .ai-config-pill:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px 40px 28px;
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
  }
</style>
