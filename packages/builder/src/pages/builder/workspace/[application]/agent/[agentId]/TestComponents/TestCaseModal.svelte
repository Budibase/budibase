<script lang="ts">
  import { Modal, ModalContent, keepOpen, notifications } from "@budibase/bbui"
  import type { AgentTestCase } from "@budibase/types"
  import TestCaseFields from "./TestCaseFields.svelte"
  import TestReviewersEditor from "./TestReviewersEditor.svelte"

  type ToolOption = { label: string; value: string }

  type Props = {
    toolOptions: ToolOption[]
    isExisting: (_id: string) => boolean
    onSave: (_testCase: AgentTestCase) => Promise<boolean>
  }

  let { toolOptions, isExisting, onSave }: Props = $props()

  let modal: Modal
  let loading = $state(false)
  let draftCase = $state<AgentTestCase | null>(null)

  const cloneCase = (testCase: AgentTestCase): AgentTestCase => ({
    ...testCase,
    reviewers: testCase.reviewers.map(reviewer => ({ ...reviewer })),
  })

  export const show = (testCase: AgentTestCase) => {
    draftCase = cloneCase(testCase)
    loading = false
    modal.show()
  }

  const updateDraftCase = (
    updater: (_testCase: AgentTestCase) => AgentTestCase
  ) => {
    if (!draftCase) return
    draftCase = updater(draftCase)
  }

  const handleConfirm = async () => {
    if (!draftCase || loading) return keepOpen

    loading = true
    try {
      const saved = await onSave(cloneCase(draftCase))
      if (!saved) return keepOpen
      modal.hide()
    } catch (error) {
      console.error("Failed to save test", error)
      notifications.error("Failed to save test")
      return keepOpen
    } finally {
      loading = false
    }
  }

  let editing = $derived(draftCase ? isExisting(draftCase.id) : false)
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={editing ? "Edit test" : "Add test"}
    confirmText={editing ? "Save changes" : "Add test"}
    size="L"
    showConfirmButton
    showCancelButton
    showCloseIcon
    disabled={loading || !draftCase}
    onConfirm={handleConfirm}
  >
    {#if draftCase}
      <div class="modal-body">
        <section class="section">
          <TestCaseFields
            selectedCase={draftCase}
            onUpdateCase={updateDraftCase}
          />
        </section>

        <section class="section">
          <div class="section-header">
            <div>
              <h4>Reviewers</h4>
              <p>Add checks for the final response or tool usage.</p>
            </div>
          </div>

          <TestReviewersEditor
            selectedCase={draftCase}
            {toolOptions}
            onUpdateCase={updateDraftCase}
          />
        </section>
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .section-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .section-header p {
    margin: 4px 0 0;
    font-size: 12px;
    line-height: 1.5;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
