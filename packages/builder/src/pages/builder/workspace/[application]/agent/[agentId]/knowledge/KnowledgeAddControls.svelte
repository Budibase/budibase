<script lang="ts">
  import { Button } from "@budibase/bbui"
  import { KNOWLEDGE_FILE_ACCEPT_ATTRIBUTE } from "@budibase/types"
  import { notifications } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import AddKnowledgeModal from "./AddKnowledgeModal.svelte"
  import type { PendingUpload } from "./knowledgeTableRows"

  const BYTES_IN_MB = 1024 * 1024
  const MAX_FILE_SIZE_BYTES = 100 * BYTES_IN_MB
  const MAX_FILE_SIZE_LABEL = "100MB"

  export interface Props {
    agentId?: string
    isUploading?: boolean
    uploadProgress?: string
    onPendingUploadsAdded?: (
      _agentId: string,
      _uploads: PendingUpload[]
    ) => void
    onPendingUploadRemoved?: (_agentId: string, _tempId: string) => void
    onUploadingChange?: (
      _agentId: string,
      _uploading: boolean,
      _progress: string
    ) => void
    onUploaded?: (_agentId: string) => Promise<void>
    onSharePoint?: () => Promise<void> | void
  }

  let {
    agentId,
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
    if (!agentId) {
      notifications.error("Missing agent context for file upload")
      return
    }
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
      agentId,
      uploads.map(upload => ({
        tempId: upload.tempId,
        filename: upload.file.name,
        size: upload.file.size,
        mimetype: upload.file.type || undefined,
        createdAt: upload.createdAt,
      }))
    )

    onUploadingChange?.(agentId, true, "")

    let successfulUploads = 0
    const successfulTempIds: string[] = []
    const failedUploads: string[] = []
    const oversizedUploads: string[] = []

    try {
      for (const [index, upload] of uploads.entries()) {
        onUploadingChange?.(
          agentId,
          true,
          `Uploading ${index + 1}/${uploads.length}...`
        )

        if (upload.file.size > MAX_FILE_SIZE_BYTES) {
          oversizedUploads.push(upload.file.name)
          onPendingUploadRemoved?.(agentId, upload.tempId)
          continue
        }

        try {
          await agentsStore.uploadAgentFile(agentId, upload.file)
          successfulUploads += 1
          successfulTempIds.push(upload.tempId)
        } catch (error) {
          console.error(error)
          failedUploads.push(upload.file.name)
          onPendingUploadRemoved?.(agentId, upload.tempId)
        }
      }

      await onUploaded?.(agentId)
      for (const tempId of successfulTempIds) {
        onPendingUploadRemoved?.(agentId, tempId)
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
          `Uploaded ${successfulUploads}/${uploads.length} files`
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
      onUploadingChange?.(agentId, false, "")
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
  >{isUploading ? uploadProgress || "Uploading..." : "Add knowledge"}</Button
>

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
