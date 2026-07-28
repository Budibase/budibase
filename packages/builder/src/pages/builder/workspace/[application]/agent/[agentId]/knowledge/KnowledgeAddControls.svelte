<script lang="ts">
  import { Button, notifications } from "@budibase/bbui"
  import { KNOWLEDGE_FILE_ACCEPT_ATTRIBUTE } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import AddKnowledgeModal from "./new/AddKnowledgeModal.svelte"
  import addKnowledgeIcons from "assets/add-knowledge-icons.svg"
  import { MAX_OPERATION_KNOWLEDGE_FILE_SIZE_LABEL } from "@/stores/portal/agents"

  export interface Props {
    agentId?: string
    operationId: string
    onUploaded?: () => Promise<void>
    onSharePoint?: () => Promise<void> | void
    disabled?: boolean
    tooltip?: string
  }

  let {
    agentId,
    operationId,
    onUploaded,
    onSharePoint,
    disabled = false,
    tooltip,
  }: Props = $props()

  let fileInput = $state<HTMLInputElement>()
  let addKnowledgeModal = $state<AddKnowledgeModal>()

  let uploadState = $derived.by(() => {
    if (!agentId || !operationId) {
      return { uploading: false, progress: "" }
    }
    const _store = $agentsStore
    return agentsStore.getOperationUploadState(agentId, operationId)
  })

  const openAddKnowledgeModal = () => {
    if (disabled) {
      return
    }
    addKnowledgeModal?.show()
  }

  const handleUploadClick = () => {
    if (uploadState.uploading) {
      return
    }
    fileInput?.click()
  }

  const handleFileUpload = async (event: Event) => {
    if (!agentId || !operationId) {
      notifications.error("Missing operation context for file upload")
      return
    }

    const target = event.currentTarget as HTMLInputElement
    const selectedFiles = Array.from(target?.files || [])
    target.value = ""
    if (selectedFiles.length === 0) {
      return
    }

    const result = await agentsStore.uploadOperationFiles(
      agentId,
      operationId,
      selectedFiles
    )

    if (result.successfulUploads > 0) {
      await onUploaded?.()
    }

    if (
      result.failedUploads.length === 0 &&
      result.oversizedUploads.length === 0
    ) {
      notifications.success(
        result.successfulUploads === 1
          ? "File uploaded"
          : `Uploaded ${result.successfulUploads} files`
      )
      return
    }

    if (result.successfulUploads > 0) {
      notifications.info(
        `Uploaded ${result.successfulUploads}/${result.totalSelected} files`
      )
    }

    const issueMessages: string[] = []
    if (result.failedUploads.length > 0) {
      issueMessages.push(
        result.failedUploads.length === 1
          ? "1 file failed"
          : `${result.failedUploads.length} files failed`
      )
    }
    if (result.oversizedUploads.length > 0) {
      issueMessages.push(
        result.oversizedUploads.length === 1
          ? `1 file exceeded ${MAX_OPERATION_KNOWLEDGE_FILE_SIZE_LABEL}`
          : `${result.oversizedUploads.length} files exceeded ${MAX_OPERATION_KNOWLEDGE_FILE_SIZE_LABEL}`
      )
    }

    notifications.error(
      issueMessages.length > 0
        ? `Some files were not uploaded: ${issueMessages.join(", ")}.`
        : "Failed to upload files"
    )
  }

  const handleSharePoint = async () => {
    await onSharePoint?.()
  }
</script>

<div class="add-knowledge-button">
  <Button
    icon="plus"
    size="S"
    secondary
    {tooltip}
    calculateTooltipWidth={target => target.getBoundingClientRect().width}
    disabled={disabled || uploadState.uploading}
    on:click={openAddKnowledgeModal}
  >
    <span class="add-knowledge-label">
      <span>
        {uploadState.uploading
          ? uploadState.progress || "Uploading..."
          : "Add knowledge"}
      </span>
      <img src={addKnowledgeIcons} alt="" />
    </span>
  </Button>
</div>

<input
  type="file"
  accept={KNOWLEDGE_FILE_ACCEPT_ATTRIBUTE}
  multiple
  hidden
  bind:this={fileInput}
  onchange={handleFileUpload}
/>

<AddKnowledgeModal
  bind:this={addKnowledgeModal}
  MAX_FILE_SIZE_LABEL={MAX_OPERATION_KNOWLEDGE_FILE_SIZE_LABEL}
  isUploading={uploadState.uploading}
  onUpload={handleUploadClick}
  onSharePoint={handleSharePoint}
/>

<style>
  .add-knowledge-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: max-content;
    flex-shrink: 0;
  }

  .add-knowledge-button {
    display: inline-flex;
    width: max-content;
  }

  .add-knowledge-label img {
    object-fit: contain;
    pointer-events: none;
    flex: 0 0 auto;
    height: 18px;
  }

  :global(.spectrum-Button-label) {
    flex-shrink: 0;
  }
</style>
