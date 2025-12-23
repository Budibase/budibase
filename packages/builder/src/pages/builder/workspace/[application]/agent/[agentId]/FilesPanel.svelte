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

  export let currentAgentId: string | undefined

  let uploadingFile = false
  let uploadError = ""
  let fileInput: HTMLInputElement | undefined
  let currentFiles: AgentFile[] = []

  $: currentFiles = $agentsStore.files || []
  $: hasEmbeddingConfig = ($aiConfigsStore.customConfigs || []).some(
    config => config.configType === AIConfigType.EMBEDDINGS
  )

  const formatBytes = (size?: number) => {
    if (!size) {
      return "—"
    }
    const units = ["B", "KB", "MB", "GB"]
    let value = size
    let unitIndex = 0
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024
      unitIndex += 1
    }
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`
  }

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

  const formatFileStatus = (file: AgentFile) => {
    switch (file.status) {
      case AgentFileStatus.PROCESSING:
        return "Processing"
      case AgentFileStatus.FAILED:
        return "Failed"
      case AgentFileStatus.READY:
        return "Ready"
      default:
        return file.status
    }
  }

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
      <div />
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
        <div class={`file-status status-${(file.status || "").toLowerCase()}`}>
          {formatFileStatus(file)}
        </div>
        <div>{file.chunkCount ?? 0}</div>
        <div>{formatBytes(file.size)}</div>
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
  .config-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
    background: var(--background);
  }

  .config-page {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    height: 0;
    overflow: hidden;
    padding: var(--spacing-xl) var(--spacing-l) var(--spacing-xl);
    gap: var(--spacing-l);
  }

  .config-pane {
    min-width: 0;
    height: calc(100% - var(--spacing-xl) * 2);
    padding: var(--spacing-xl);
    border-radius: 16px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-alias-background-color-primary);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .config-content {
    flex: 0 0 auto;
    width: 50%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
  }

  .config-preview {
    flex: 1 1 auto;
  }

  .config-form {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--spacing-m);
  }

  .form-field {
    min-width: 0;
  }

  .form-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--spectrum-alias-item-height-m);
    height: var(--spectrum-alias-item-height-m);
    flex-shrink: 0;
  }

  .start-pause-row {
    display: flex;
    justify-content: flex-end;
  }

  .status-icons {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    margin-right: var(--spacing-m);
  }

  /* Override input backgrounds to match design */
  :global(
    .config-form .spectrum-Textfield-input,
    .config-form .spectrum-Picker
  ) {
    background-color: var(--background) !important;
  }

  /* Align left-position labels into a clean column */
  :global(.config-form .spectrum-Form-item:not(.above)) {
    display: grid;
    grid-template-columns: 120px 1fr 20px;
    column-gap: var(--spacing-m);
  }

  :global(.config-form .container) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    gap: var(--spectrum-alias-grid-gutter-medium);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    flex-shrink: 0;
  }

  .section:first-of-type {
    flex: 1;
    min-height: 0;
  }

  .tools-section {
    flex-shrink: 0;
    margin-bottom: calc(-1 * var(--spacing-l));
  }

  :global(.tools-popover-container .spectrum-Popover) {
    background-color: var(--background-alt);
  }

  .title-tools-bar {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xxs);
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .prompt-editor-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    overflow: hidden;
  }

  .prompt-editor {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .prompt-editor :global(.cm-editor) {
    background: var(--background-alt) !important;
  }

  .bindings-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m) var(--spacing-l);
    background: var(--background-alt);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    flex-shrink: 0;
  }

  .bindings-bar-text {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .bindings-pill {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 6px 10px;
    border-radius: 10px;
    background: var(--background-alt);
    border: 1px solid var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-50);
    font-weight: 500;
    line-height: 1;
  }

  .bindings-pill-text {
    color: var(--spectrum-global-color-gray-900);
    font-size: 13px;
  }

  .tools-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    margin-top: var(--spacing-s);
  }

  .tool-card {
    display: flex;
    height: 25px;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    padding: var(--spacing-xs) var(--spacing-l) var(--spacing-xs)
      var(--spacing-l);
    border: 1px solid var(--spectrum-global-color-gray-200);
  }

  .tool-main {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    min-width: 0;
  }

  .tool-item-icon {
    width: 14px;
    height: 14px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .tool-label {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 500;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tool-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .tool-menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    transition: background 130ms ease-out;
  }

  .tool-menu-trigger:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }

  .files-section {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    padding-top: var(--spacing-m);
    gap: var(--spacing-s);
  }

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

  .status-processing {
    color: var(--spectrum-global-color-orange-600);
  }

  .status-ready {
    color: var(--spectrum-global-color-green-600);
  }

  .status-failed {
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
