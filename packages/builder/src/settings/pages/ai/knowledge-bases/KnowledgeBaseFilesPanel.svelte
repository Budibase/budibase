<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import {
    AbsTooltip,
    ActionButton,
    Button,
    Heading,
    notifications,
  } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"
  import {
    AIConfigType,
    KnowledgeBaseFileStatus,
    type KnowledgeBaseFile,
  } from "@budibase/types"
  import { aiConfigsStore, knowledgeBaseStore } from "@/stores/portal"
  import { createPolling } from "@/utils/polling"

  export interface Props {
    knowledgeBaseId?: string
  }

  let { knowledgeBaseId }: Props = $props()

  const FILE_STATUS_POLL_MS = 1000

  let uploadingFile = $state(false)
  let uploadError = $state("")
  let fileInput = $state<HTMLInputElement>()

  let currentFiles = $derived(
    $knowledgeBaseStore.selectedKnowledgeBase?.files || []
  )
  let hasEmbeddingConfig = $derived(
    ($aiConfigsStore.customConfigs || []).some(
      config => config.configType === AIConfigType.EMBEDDINGS
    )
  )
  let shouldPoll = $derived(
    !!knowledgeBaseId &&
      currentFiles.some(
        file => file.status === KnowledgeBaseFileStatus.PROCESSING
      )
  )

  const poller = createPolling({
    intervalMs: FILE_STATUS_POLL_MS,
    shouldPoll: () =>
      !!knowledgeBaseId &&
      currentFiles.some(
        file => file.status === KnowledgeBaseFileStatus.PROCESSING
      ),
    poll: async () => {
      if (!knowledgeBaseId) {
        return
      }
      await knowledgeBaseStore.fetchFiles(knowledgeBaseId)
    },
  })

  const readableStatus: Record<KnowledgeBaseFileStatus, string> = {
    [KnowledgeBaseFileStatus.PROCESSING]: "Processing",
    [KnowledgeBaseFileStatus.READY]: "Ready",
    [KnowledgeBaseFileStatus.FAILED]: "Failed",
  }

  const formatFileStatus = (file: KnowledgeBaseFile) =>
    readableStatus[file.status] || file.status

  const formatTimestamp = (value?: string | number) => {
    if (!value) {
      return "—"
    }
    try {
      return new Date(value).toLocaleString()
    } catch (error) {
      return value
    }
  }

  $effect(() => {
    knowledgeBaseStore.selectKnowledgeBase(knowledgeBaseId)
  })

  $effect(() => {
    if (shouldPoll) {
      poller.start()
    } else {
      poller.stop()
    }
  })

  onMount(async () => {
    await knowledgeBaseStore.fetch()
  })

  async function handleFileUpload(event: Event) {
    if (!knowledgeBaseId) {
      return
    }
    const target = event.currentTarget as HTMLInputElement
    const file = target?.files?.[0]
    if (!file) {
      return
    }

    uploadError = ""
    uploadingFile = true
    try {
      await knowledgeBaseStore.uploadFile(knowledgeBaseId, file)
      notifications.success("File added to knowledge base")
    } catch (error: any) {
      console.error(error)
      uploadError = error?.message || "Failed to upload file"
      notifications.error(uploadError)
    } finally {
      uploadingFile = false
      if (target) {
        target.value = ""
      }
    }
  }

  function handleUploadClick() {
    if (!hasEmbeddingConfig) {
      notifications.info("Add an embeddings configuration to enable uploads")
      return
    }
    fileInput?.click()
  }

  async function removeFile(file: KnowledgeBaseFile) {
    if (!knowledgeBaseId) {
      return
    }
    const confirmed = window.confirm(
      `Remove "${file.filename}" from this knowledge base?`
    )
    if (!confirmed) {
      return
    }
    try {
      await knowledgeBaseStore.deleteFile(knowledgeBaseId, file._id!)
      notifications.success("File removed")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to remove file")
    }
  }

  onDestroy(() => {
    poller.stop()
    knowledgeBaseStore.selectKnowledgeBase(undefined)
  })
</script>

<div class="files-header-row">
  <Heading size="XS">Files</Heading>
  <div class="files-actions">
    <Button
      secondary
      icon="upload"
      disabled={!knowledgeBaseId || uploadingFile}
      on:click={handleUploadClick}
      >{uploadingFile ? "Uploading..." : "Upload file"}</Button
    >
    <input
      type="file"
      accept=".txt,.md,.markdown,.json,.yaml,.yml,.csv,.tsv,.pdf"
      hidden
      bind:this={fileInput}
      on:change={handleFileUpload}
    />
  </div>
</div>

<p class="files-description">
  Add text, Markdown, OpenAPI YAML, or PDF files to ground any agent using this
  knowledge base.
</p>

{#if uploadError}
  <div class="upload-error">{uploadError}</div>
{/if}

{#if !knowledgeBaseId}
  <div class="files-empty">Save the knowledge base before uploading files.</div>
{:else if currentFiles.length === 0}
  <div class="files-empty">
    No files have been uploaded for this knowledge base yet.
  </div>
{:else}
  <div class="files-table">
    <div class="files-row files-row-header">
      <div>Name</div>
      <div>Status</div>
      <div>Chunks</div>
      <div>Size</div>
      <div>Updated</div>
      <div></div>
    </div>
    {#each currentFiles as file (file._id)}
      <div class="files-row">
        <div class="file-name">
          <span class="file-title">{file.filename}</span>
          <span class="file-meta">{file.mimetype || "text"}</span>
          {#if file.status === KnowledgeBaseFileStatus.FAILED && file.errorMessage}
            <span class="file-error">{file.errorMessage}</span>
          {/if}
        </div>
        <div
          class="file-status"
          class:file-status_processing={file.status ===
            KnowledgeBaseFileStatus.PROCESSING}
          class:file-status_failed={file.status ===
            KnowledgeBaseFileStatus.FAILED}
          class:file-status_ready={file.status ===
            KnowledgeBaseFileStatus.READY}
        >
          {formatFileStatus(file)}
        </div>
        <div>{file.chunkCount ?? 0}</div>
        <div>{helpers.formatBytes(file.size, " ")}</div>
        <div>
          {formatTimestamp(
            file.processedAt || file.updatedAt || file.createdAt
          )}
        </div>
        <div class="file-actions">
          <AbsTooltip text="Remove file">
            <ActionButton
              icon="trash"
              size="S"
              on:click={() => removeFile(file)}
            />
          </AbsTooltip>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .files-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    margin-top: var(--spacing-l);
  }

  .files-description {
    margin: 0;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-700);
  }

  .files-actions {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }

  .files-table {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    overflow: hidden;
  }

  .files-row {
    display: grid;
    grid-template-columns: minmax(0, 2fr) 120px 80px 90px 180px 48px;
    gap: var(--spacing-s);
    align-items: center;
    padding: 10px 12px;
    border-top: 1px solid var(--spectrum-global-color-gray-100);
  }

  .files-row-header {
    border-top: 0;
    background: var(--spectrum-global-color-gray-50);
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-700);
  }

  .file-name {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .file-title {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-meta,
  .file-error,
  .upload-error,
  .files-empty {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  .file-error,
  .upload-error {
    color: var(--spectrum-semantic-negative-color-default);
  }

  .file-status {
    font-size: 12px;
    font-weight: 600;
  }

  .file-status_processing {
    color: var(--spectrum-semantic-notice-color-default);
  }

  .file-status_failed {
    color: var(--spectrum-semantic-negative-color-default);
  }

  .file-status_ready {
    color: var(--spectrum-semantic-positive-color-default);
  }

  .file-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
