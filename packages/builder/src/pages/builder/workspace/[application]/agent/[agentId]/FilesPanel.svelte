<script lang="ts">
  import { bb } from "@/stores/bb"
  import { agentsStore, aiConfigsStore } from "@/stores/portal"
  import {
    AbsTooltip,
    ActionButton,
    Button,
    Heading,
    notifications,
  } from "@budibase/bbui"
  import {
    AgentFileStatus,
    AIConfigType,
    type AgentFile,
  } from "@budibase/types"
  import { helpers } from "@budibase/shared-core"

  export let currentAgentId: string | undefined

  let uploadingFile = false
  let uploadError = ""
  let fileInput: HTMLInputElement | undefined
  let currentFiles: AgentFile[] = []

  $: currentFiles = $agentsStore.files || []
  $: hasEmbeddingConfig = ($aiConfigsStore.customConfigs || []).some(
    config => config.configType === AIConfigType.EMBEDDINGS
  )

  const formatTimestamp = (value?: string | number) => {
    if (!value) {
      return "—"
    }
    try {
      const date = new Date(value)
      return date.toLocaleString()
    } catch (error) {
      return value
    }
  }

  const readableStatus: Record<AgentFileStatus, string> = {
    [AgentFileStatus.PROCESSING]: "Processing",
    [AgentFileStatus.READY]: "Failed",
    [AgentFileStatus.FAILED]: "Ready",
  }

  const formatFileStatus = (file: AgentFile) =>
    readableStatus[file.status] || file.status

  async function handleFileUpload(event: Event) {
    if (!currentAgentId) {
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
      await agentsStore.uploadAgentFile(currentAgentId, file)
      notifications.success("File added to agent knowledge")
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
      bb.settings("/ai#EmbeddingsConfig")
      return
    }
    fileInput?.click()
  }

  async function removeFile(file: AgentFile) {
    if (!currentAgentId) {
      return
    }
    const confirmed = window.confirm(
      `Remove "${file.filename}" from this agent?`
    )
    if (!confirmed) {
      return
    }
    try {
      await agentsStore.deleteAgentFile(currentAgentId, file._id!)
      notifications.success("File removed")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to remove file")
    }
  }
</script>

<div class="files-header-row">
  <Heading size="XS">Knowledge base</Heading>
  <div class="files-actions">
    <Button
      secondary
      icon="upload"
      disabled={!currentAgentId || uploadingFile}
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
  Add text, Markdown, OpenAPI YAML, or PDF files to ground agent replies with
  your own knowledge.
</p>
{#if uploadError}
  <div class="upload-error">{uploadError}</div>
{/if}
{#if currentFiles.length === 0}
  <div class="files-empty">No files have been uploaded for this agent yet.</div>
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
          {#if file.status === AgentFileStatus.FAILED && file.errorMessage}
            <span class="file-error">{file.errorMessage}</span>
          {/if}
        </div>
        <div
          class="file-status"
          class:file-status_processing={file.status ===
            AgentFileStatus.PROCESSING}
          class:file-status_failed={file.status === AgentFileStatus.FAILED}
          class:file-status_ready={file.status === AgentFileStatus.READY}
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
    grid-template-columns: 2fr 1fr 0.7fr 0.7fr 1fr 40px;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-m);
    align-items: center;
  }

  .files-row:nth-child(even) {
    background: var(--spectrum-global-color-gray-75);
  }

  .files-row-header {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--spectrum-global-color-gray-600);
    background: var(--spectrum-global-color-gray-100);
  }

  .file-name {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .file-title {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-meta {
    font-size: 11px;
    color: var(--spectrum-global-color-gray-600);
  }

  .file-error {
    font-size: 11px;
    color: var(--spectrum-semantic-negative-color-default, #c92532);
  }

  .file-status {
    font-weight: 600;
    font-size: 13px;
  }

  .file-status_processing {
    color: var(--spectrum-global-color-orange-600);
  }

  .file-status_ready {
    color: var(--spectrum-global-color-green-600);
  }

  .file-status_failed {
    color: var(--spectrum-semantic-negative-color-default, #c92532);
  }

  .files-empty {
    border: 1px dashed var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    padding: var(--spacing-l);
    text-align: center;
    color: var(--spectrum-global-color-gray-600);
  }

  .upload-error {
    color: var(--spectrum-semantic-negative-color-default, #c92532);
    font-size: 12px;
  }

  .file-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
