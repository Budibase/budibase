<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { Button, Field, notifications, Table } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"
  import {
    AIConfigType,
    KnowledgeBaseFileStatus,
    type KnowledgeBaseFile,
  } from "@budibase/types"
  import { aiConfigsStore, knowledgeBaseStore } from "@/stores/portal"
  import { createPolling } from "@/utils/polling"
  import KnowledgeBaseFileDeleteRenderer from "./column-renderer/DeleteRenderer.svelte"
  import KnowledgeBaseFileNameRenderer from "./column-renderer/NameRenderer.svelte"
  import KnowledgeBaseFileStatusRenderer from "./column-renderer/StatusRenderer.svelte"

  export interface Props {
    knowledgeBaseId?: string
  }

  let { knowledgeBaseId }: Props = $props()

  const FILE_STATUS_POLL_MS = 1000

  let uploadingFile = $state(false)
  let uploadError = $state("")
  let fileInput = $state<HTMLInputElement>()

  let currentFiles = $derived(
    ($knowledgeBaseStore.selectedKnowledgeBase?.files || []).map(f => ({
      _id: f._id,
      filename: f.filename,
      status: f.status,
      displayStatus: formatFileStatus(f),
      mimetype: f.mimetype,
      errorMessage: f.errorMessage,
      chunkCount: f.chunkCount ?? 0,
      size: helpers.formatBytes(f.size, " "),
      updatedAt: formatTimestamp(f.processedAt || f.updatedAt || f.createdAt),
      onDelete: () => removeFile(f),
    }))
  )

  const customRenderers = [
    {
      column: "filename",
      component: KnowledgeBaseFileNameRenderer,
    },
    {
      column: "displayStatus",
      component: KnowledgeBaseFileStatusRenderer,
    },
    {
      column: "delete",
      component: KnowledgeBaseFileDeleteRenderer,
    },
  ]

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

<Field
  label="Files"
  required
  description="Add text, Markdown, OpenAPI YAML, or PDF files to ground any agent using this
  knowledge base."
>
  <div class="files-header-row">
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
        onchange={handleFileUpload}
      />
    </div>
  </div>
</Field>

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
  <Table
    data={currentFiles}
    schema={{
      filename: { displayName: "name", width: "minmax(0, 2fr)" },
      displayStatus: { displayName: "status", width: "130px" },
      chunkCount: { displayName: "# chunks", width: "88px" },
      size: { width: "100px" },
      updatedAt: { displayName: "updated", width: "180px" },
      delete: { displayName: "", width: "48px", align: "Right" },
    }}
    {customRenderers}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={false}
    allowClickRows={false}
    disableSorting
    rounded
    quiet
    compact
  ></Table>
{/if}

<style>
  .files-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    margin-top: var(--spacing-l);
  }

  .files-actions {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }

  .upload-error,
  .files-empty {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  .upload-error {
    color: var(--spectrum-semantic-negative-color-default);
  }
</style>
