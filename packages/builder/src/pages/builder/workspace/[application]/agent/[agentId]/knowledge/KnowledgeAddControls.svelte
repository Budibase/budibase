<script lang="ts">
  import { Button } from "@budibase/bbui"
  import { KNOWLEDGE_FILE_ACCEPT_ATTRIBUTE } from "@budibase/types"
  import { notifications } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import AddKnowledgeModal from "./new/AddKnowledgeModal.svelte"
  import type { PendingUpload } from "./knowledgeTableRows"
  import addKnowledgeIcons from "assets/add-knowledge-icons.svg"

  const BYTES_IN_MB = 1024 * 1024
  const MAX_FILE_SIZE_BYTES = 100 * BYTES_IN_MB
  const MAX_FILE_SIZE_LABEL = "100MB"

  export interface Props {
    agentId?: string
    operationId: string
    isUploading?: boolean
    uploadProgress?: string
    onPendingUploadsAdded?: (cacheKey: string, uploads: PendingUpload[]) => void
    onPendingUploadRemoved?: (cacheKey: string, tempId: string) => void
    onUploadingChange?: (
      cacheKey: string,
      uploading: boolean,
      progress: string
    ) => void
    onUploaded?: (agentId: string, operationId: string) => Promise<void>
    onSharePoint?: () => Promise<void> | void
  }

  let {
    agentId,
    operationId,
    isUploading = false,
    uploadProgress = "",
    onPendingUploadsAdded,
    onPendingUploadRemoved,
    onUploadingChange,
    onUploaded,
    onSharePoint,
  }: Props = $props()

  let fileInput = $state<HTMLInputElement>()
  let addKnowledgeModal = $state<AddKnowledgeModal>()
  const getOperationCacheKey = (agentId: string, operationId: string) =>
    `${agentId}:${operationId}`

  const openAddKnowledgeModal = () => {
    addKnowledgeModal?.show()
  }

  const handleUploadClick = () => {
    if (isUploading) {
      return
    }
    fileInput?.click()
  }

  const handleFileUpload = async (event: Event) => {
    if (!agentId || !operationId) {
      notifications.error("Missing operation context for file upload")
      return
    }
    const cacheKey = getOperationCacheKey(agentId, operationId)
    const target = event.currentTarget as HTMLInputElement
    const selectedFiles = Array.from(target?.files || [])
    target.value = ""
    if (selectedFiles.length === 0) {
      return
    }

    const uploads = selectedFiles.map((file, index) => ({
      file,
      tempId: `pending-upload-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
    }))

    onPendingUploadsAdded?.(
      cacheKey,
      uploads.map(upload => ({
        tempId: upload.tempId,
        filename: upload.file.name,
        size: upload.file.size,
        mimetype: upload.file.type || undefined,
        createdAt: upload.createdAt,
      }))
    )

    onUploadingChange?.(cacheKey, true, "")

    let successfulUploads = 0
    const failedUploads: string[] = []
    const oversizedUploads: string[] = []

    try {
      for (const [index, upload] of uploads.entries()) {
        onUploadingChange?.(
          cacheKey,
          true,
          `Uploading ${index + 1}/${uploads.length}...`
        )

        if (upload.file.size > MAX_FILE_SIZE_BYTES) {
          oversizedUploads.push(upload.file.name)
          onPendingUploadRemoved?.(cacheKey, upload.tempId)
          continue
        }

        try {
          await agentsStore.uploadOperationFile(
            agentId,
            operationId,
            upload.file
          )
          successfulUploads += 1
          onPendingUploadRemoved?.(cacheKey, upload.tempId)
        } catch (error) {
          console.error(error)
          failedUploads.push(upload.file.name)
          onPendingUploadRemoved?.(cacheKey, upload.tempId)
        }
      }

      if (successfulUploads > 0) {
        await onUploaded?.(agentId, operationId)
      }

      if (failedUploads.length === 0 && oversizedUploads.length === 0) {
        notifications.success(
          successfulUploads === 1
            ? "File uploaded"
            : `Uploaded ${successfulUploads} files`
        )
        return
      }

      if (successfulUploads > 0) {
        notifications.info(
          `Uploaded ${successfulUploads}/${selectedFiles.length} files`
        )
      }

      const issueMessages: string[] = []
      if (failedUploads.length > 0) {
        issueMessages.push(
          failedUploads.length === 1
            ? "1 file failed"
            : `${failedUploads.length} files failed`
        )
      }
      if (oversizedUploads.length > 0) {
        issueMessages.push(
          oversizedUploads.length === 1
            ? `1 file exceeded ${MAX_FILE_SIZE_LABEL}`
            : `${oversizedUploads.length} files exceeded ${MAX_FILE_SIZE_LABEL}`
        )
      }

      notifications.error(
        issueMessages.length > 0
          ? `Some files were not uploaded: ${issueMessages.join(", ")}.`
          : "Failed to upload files"
      )
    } finally {
      onUploadingChange?.(cacheKey, false, "")
    }
  }

  const handleSharePoint = async () => {
    await onSharePoint?.()
  }
</script>

<Button
  icon="plus"
  size="S"
  secondary
  disabled={isUploading}
  on:click={openAddKnowledgeModal}
>
  <span class="add-knowledge-label">
    <span
      >{isUploading ? uploadProgress || "Uploading..." : "Add knowledge"}</span
    >
    <img src={addKnowledgeIcons} alt="" />
  </span>
</Button>

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
  {MAX_FILE_SIZE_LABEL}
  {isUploading}
  onUpload={handleUploadClick}
  onSharePoint={handleSharePoint}
/>

<style>
  .add-knowledge-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .add-knowledge-label img {
    object-fit: contain;
    pointer-events: none;
    height: 18px;
  }
</style>
