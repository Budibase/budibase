<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import {
    Button,
    FieldLabel,
    Label,
    notifications,
    Table,
  } from "@budibase/bbui"
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
  import { confirm } from "@/helpers"

  export interface Props {
    knowledgeBaseId?: string
    hasReferenceChanges?: boolean
  }

  let { knowledgeBaseId, hasReferenceChanges = false }: Props = $props()

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
    if (!knowledgeBaseId || hasReferenceChanges) {
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
    if (hasReferenceChanges) {
      notifications.info(
        "Save your embedding model and vector database changes before uploading files"
      )
      return
    }
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
    await confirm({
      title: `Confirm deletion`,
      body: `Are you sure to remove this file from this knowledge base? This action can't be undone.`,
      okText: "Delete",
      onConfirm: async () => {
        try {
          await knowledgeBaseStore.deleteFile(knowledgeBaseId, file._id!)
          notifications.success("File removed")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to remove file")
        }
      },
    })
  }

  onDestroy(() => {
    poller.stop()
    knowledgeBaseStore.selectKnowledgeBase(undefined)
  })
</script>

<div class="files-panel">
  <div class="files-header-row">
    <div class="files-meta">
      <FieldLabel label="Files" required />
      <Label muted
        >Add text, Markdown, OpenAPI YAML, or PDF files to ground any agent
        using this knowledge base.</Label
      >
    </div>
    <div class="files-actions">
      <Button
        secondary
        icon="upload"
        disabled={!knowledgeBaseId || uploadingFile || hasReferenceChanges}
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

  {#if uploadError}
    <div class="upload-error">{uploadError}</div>
  {/if}

  {#if !knowledgeBaseId}
    <Label size="L" muted>
      Save the knowledge base before uploading files.
    </Label>
  {:else if hasReferenceChanges}
    <Label size="L" muted>
      Save your embedding model and vector database changes before uploading
      files.
    </Label>
  {:else if currentFiles.length === 0}
    <Label size="L" muted>
      No files have been uploaded for this knowledge base yet.
    </Label>
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
</div>

<style>
  .files-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .files-header-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .upload-error {
    color: var(--spectrum-semantic-negative-color-default);
  }
</style>
