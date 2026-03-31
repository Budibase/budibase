<script lang="ts">
  import {
    Body,
    Button,
    Layout,
    ProgressCircle,
    notifications,
    Table,
  } from "@budibase/bbui"
  import { createPolling } from "@/utils/polling"
  import { confirm } from "@/helpers"
  import { helpers } from "@budibase/shared-core"
  import {
    KnowledgeBaseFileStatus,
    type Agent,
    type KnowledgeBaseFile,
  } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import KnowledgeIconRenderer from "./renderers/KnowledgeIconRenderer.svelte"
  import KnowledgeNameRenderer from "./renderers/KnowledgeNameRenderer.svelte"
  import KnowledgeStatusRenderer from "./renderers/KnowledgeStatusRenderer.svelte"
  import KnowledgeDeleteRenderer from "./renderers/KnowledgeDeleteRenderer.svelte"
  import { onDestroy, onMount } from "svelte"

  const FILE_STATUS_POLL_MS = 1000

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let loading = $state(true)
  let files = $state<KnowledgeBaseFile[]>([])
  let fileInput = $state<HTMLInputElement>()
  let loadedAgentId = $state<string | undefined>()

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

  const fetchFiles = async (agentId: string) => {
    const { files: fetched } = await agentsStore.fetchAgentFiles(agentId)
    files = fetched
  }

  const shouldPoll = () =>
    files.some(file => file.status === KnowledgeBaseFileStatus.PROCESSING)

  const poller = createPolling({
    intervalMs: FILE_STATUS_POLL_MS,
    shouldPoll,
    poll: async () => {
      if (!currentAgent?._id) {
        return
      }
      await fetchFiles(currentAgent._id)
    },
  })

  let tableRows = $derived.by(() =>
    files
      .map(file => ({
        _id: file._id,
        filename: file.filename,
        status: file.status,
        displayStatus: formatFileStatus(file),
        size: helpers.formatBytes(file.size, " "),
        updatedAt: formatTimestamp(
          file.processedAt || file.updatedAt || file.createdAt
        ),
        onDelete: () => removeFile(file),
        errorMessage: file.errorMessage,
      }))
      .sort((a, b) => a.filename.localeCompare(b.filename))
  )

  const customRenderers = [
    { column: "icon", component: KnowledgeIconRenderer },
    { column: "filename", component: KnowledgeNameRenderer },
    { column: "displayStatus", component: KnowledgeStatusRenderer },
    { column: "delete", component: KnowledgeDeleteRenderer },
  ]

  const loadAgentFiles = async () => {
    const agentId = currentAgent?._id
    if (!agentId) {
      files = []
      loading = false
      loadedAgentId = undefined
      return
    }
    loading = true
    try {
      await fetchFiles(agentId)
      loadedAgentId = agentId
    } finally {
      loading = false
    }
  }

  $effect(() => {
    const agentId = currentAgent?._id
    if (!agentId || loadedAgentId !== agentId) {
      loadAgentFiles().catch(error => {
        console.error(error)
        notifications.error("Failed to load files")
      })
    }
  })

  $effect(() => {
    if (shouldPoll()) {
      poller.start()
    } else {
      poller.stop()
    }
  })

  onMount(async () => {
    try {
      if (!$agentsStore.agentsLoaded) {
        await agentsStore.init()
      }
      await loadAgentFiles()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to load files")
    }
  })

  async function handleFileUpload(event: Event) {
    const agentId = currentAgent?._id
    if (!agentId) {
      return
    }
    const target = event.currentTarget as HTMLInputElement
    const file = target?.files?.[0]
    if (!file) {
      return
    }

    try {
      await agentsStore.uploadAgentFile(agentId, file)
      await fetchFiles(agentId)
      notifications.success("File uploaded")
    } catch (error: any) {
      console.error(error)
      notifications.error("Failed to upload file")
    } finally {
      if (target) {
        target.value = ""
      }
    }
  }

  function handleUploadClick() {
    fileInput?.click()
  }

  async function removeFile(file: KnowledgeBaseFile) {
    const agentId = currentAgent?._id
    const fileId = file._id
    if (!agentId || !fileId) {
      return
    }

    await confirm({
      title: "Confirm deletion",
      body: `Are you sure you want to remove ${file.filename}? This action can't be undone.`,
      okText: "Delete",
      onConfirm: async () => {
        try {
          await agentsStore.deleteAgentFile(agentId, fileId)
          await fetchFiles(agentId)
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
  })
</script>

<Layout gap="S" noPadding>
  <Body size="M">Give your agent knowledge</Body>
  <div class="knowledge-header">
    <Body size="S">Knowledge bases</Body>

    <Button icon="plus" size="S" secondary on:click={handleUploadClick}
      >Add knowledge</Button
    >

    <input
      type="file"
      accept=".txt,.md,.markdown,.json,.yaml,.yml,.csv,.tsv,.pdf"
      hidden
      bind:this={fileInput}
      onchange={handleFileUpload}
    />
  </div>

  {#if loading}
    <div class="loading-state">
      <ProgressCircle size="S" />
      <Body size="S">Loading files...</Body>
    </div>
  {:else if tableRows.length === 0}
    <div class="empty-state">
      <Body size="S">No files uploaded yet</Body>
    </div>
  {:else}
    <Table
      compact
      quiet
      rounded
      hideHeader
      allowClickRows={false}
      allowEditRows={false}
      allowEditColumns={false}
      data={tableRows}
      schema={{
        icon: { width: "36px" },
        filename: { displayName: "Name", width: "minmax(0, 2fr)" },
        displayStatus: { displayName: "Status", width: "130px" },
        delete: { displayName: "", width: "48px", align: "Right" },
      }}
      {customRenderers}
    />
  {/if}
</Layout>

<style>
  .knowledge-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-s);
    padding: 24px 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    padding: 24px 16px;
    text-align: center;
  }
</style>
