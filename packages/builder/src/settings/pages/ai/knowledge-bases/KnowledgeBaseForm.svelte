<script lang="ts">
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
  import { datasources, oauth2, workspaceConnections } from "@/stores/builder"
  import {
    aiConfigsStore,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import {
    ActionButton,
    Button,
    Helpers,
    Input,
    notifications,
    Select,
  } from "@budibase/bbui"
  import { KnowledgeBaseType, type SharePointSiteReference } from "@budibase/types"
  import { onMount } from "svelte"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import KnowledgeBaseFilesPanel from "./files-panel/index.svelte"

  export interface Props {
    knowledgeBaseId: string
  }

  let { knowledgeBaseId }: Props = $props()

  let config = $derived(
    $knowledgeBaseStore.list.find(kb => kb._id === knowledgeBaseId)
  )

  const createDraft = () =>
    config?._id
      ? {
          _id: config._id,
          _rev: config._rev,
          name: config.name,
          type: config.type,
          embeddingModel:
            config.type === KnowledgeBaseType.LOCAL
              ? config.embeddingModel
              : "",
          vectorDb:
            config.type === KnowledgeBaseType.LOCAL ? config.vectorDb : "",
          connectionId:
            config.type !== KnowledgeBaseType.LOCAL ? config.connectionId : "",
          scope: config.type !== KnowledgeBaseType.LOCAL ? config.scope : undefined,
        }
      : {
          _id: undefined as string | undefined,
          _rev: undefined as string | undefined,
          name: "",
          type: KnowledgeBaseType.LOCAL,
          embeddingModel: "",
          vectorDb: "",
          connectionId: "",
          scope: undefined as Record<string, unknown> | undefined,
        }

  let draft = $state(createDraft())

  let isEdit = $derived(!!draft._id)
  let isSaving = $state(false)
  let isSyncing = $state(false)
  let isLoadingSharePointSites = $state(false)
  let sharePointSites = $state<SharePointSiteReference[]>([])
  let selectedSharePointSiteId = $state("")
  let lastLoadedSharePointSitesKey = $state("")
  let savedSnapshot = $state<typeof draft>()
  const captureSavedSnapshot = () => {
    savedSnapshot = Helpers.cloneDeep(draft)
  }
  captureSavedSnapshot()
  let isModified = $derived(
    JSON.stringify(savedSnapshot) !== JSON.stringify(draft)
  )
  let hasReferenceChanges = $derived.by(
    () =>
      savedSnapshot?.type !== draft.type ||
      savedSnapshot?.embeddingModel !== draft.embeddingModel ||
      savedSnapshot?.vectorDb !== draft.vectorDb ||
      savedSnapshot?.connectionId !== draft.connectionId ||
      JSON.stringify(savedSnapshot?.scope || {}) !==
        JSON.stringify(draft.scope || {})
  )

  let embeddingModelOptions = $derived(
    [...$aiConfigsStore.customConfigsPerType.embeddings].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  )
  let vectorDbOptions = $derived(
    [...$vectorDbStore.configs].sort((a, b) => a.name.localeCompare(b.name))
  )
  let isLocalType = $derived(draft.type === KnowledgeBaseType.LOCAL)
  let canEditReferences = $derived(
    draft.type !== KnowledgeBaseType.LOCAL || (config?.files.length || 0) === 0
  )
  let duplicateNameError = $derived.by(() => {
    const normalizedDraftName = draft.name?.trim().toLowerCase()
    if (!normalizedDraftName) {
      return undefined
    }

    const duplicate = $knowledgeBaseStore.list.find(
      knowledgeBase =>
        knowledgeBase._id !== draft._id &&
        knowledgeBase.name.trim().toLowerCase() === normalizedDraftName
    )

    return duplicate
      ? "A knowledge base with this name already exists"
      : undefined
  })

  let canSave = $derived.by(() => {
    if (isSaving || !isModified) {
      return false
    }
    if (!draft.name?.trim() || duplicateNameError) {
      return false
    }

    if (draft.type === KnowledgeBaseType.LOCAL) {
      return !!draft.embeddingModel?.trim() && !!draft.vectorDb?.trim()
    }

    return !!draft.connectionId?.trim()
  })

  let sharePointSiteOptions = $derived(
    sharePointSites.map(site => ({
      label: site.webUrl ? `${site.name} (${site.webUrl})` : site.name,
      value: site.id,
    }))
  )

  let embeddingModelSelectOptions = $derived(
    embeddingModelOptions.map(option => ({
      label: option.name,
      value: option._id || "",
    }))
  )

  let vectorDbSelectOptions = $derived(
    vectorDbOptions.map(option => ({
      label: option.name,
      value: option._id || "",
    }))
  )

  const typeOptions = [
    { label: "Local files", value: KnowledgeBaseType.LOCAL },
    { label: "SharePoint", value: KnowledgeBaseType.SHAREPOINT },
    { label: "Google Drive", value: KnowledgeBaseType.GOOGLE_DRIVE },
    { label: "Confluence", value: KnowledgeBaseType.CONFLUENCE },
  ]

  const matchConnectionForType = (
    connection: { name: string; templateId?: string; source: string },
    type: Exclude<KnowledgeBaseType, KnowledgeBaseType.LOCAL>
  ) => {
    if (connection.source !== "datasource") {
      return false
    }

    const templateId = connection.templateId?.toLowerCase() || ""
    const connectionName = connection.name?.toLowerCase() || ""

    switch (type) {
      case KnowledgeBaseType.SHAREPOINT:
        return templateId.includes("sharepoint") || connectionName.includes("sharepoint")
      case KnowledgeBaseType.GOOGLE_DRIVE:
        return (
          (templateId.includes("google") && templateId.includes("drive")) ||
          (connectionName.includes("google") && connectionName.includes("drive"))
        )
      case KnowledgeBaseType.CONFLUENCE:
        return templateId.includes("confluence") || connectionName.includes("confluence")
    }
  }

  let connectorConnections = $derived.by(() => {
    if (draft.type === KnowledgeBaseType.LOCAL) {
      return []
    }

    const connectorType = draft.type
    const datasourceConnections = $workspaceConnections.list.filter(
      connection => connection.source === "datasource"
    )

    const typeConnections = datasourceConnections.filter(connection =>
      matchConnectionForType(connection, connectorType)
    )

    return typeConnections.length > 0 ? typeConnections : datasourceConnections
  })

  let connectionSelectOptions = $derived(
    connectorConnections.map(connection => ({
      label: `${connection.name} (${connection.sourceId})`,
      value: connection.sourceId,
    }))
  )

  onMount(async () => {
    try {
      await Promise.all([
        aiConfigsStore.fetch(),
        knowledgeBaseStore.fetch(),
        vectorDbStore.fetch(),
        datasources.fetch(),
        oauth2.fetch(),
      ])

      const isCreation = knowledgeBaseId === "new"
      if (!isCreation && !config) {
        notifications.error("Knowledge base not found")
        bb.settings(`/connections/knowledge-bases`)
        return
      }

      draft = createDraft()
      const persistedDraft = isCreation
        ? knowledgeBaseStore.getFormDraft()
        : undefined
      captureSavedSnapshot()
      if (persistedDraft) {
        draft = {
          ...draft,
          ...persistedDraft,
        }
      }
      selectedSharePointSiteId =
        draft.type === KnowledgeBaseType.SHAREPOINT &&
        draft.scope &&
        typeof draft.scope.siteId === "string"
          ? draft.scope.siteId
          : ""

      await refreshSharePointSitesForSelection()
    } catch (err: any) {
      notifications.error(
        err.message || "Failed to load knowledge base settings"
      )
    }
  })

  async function saveKnowledgeBase() {
    draft.name = draft.name?.trim() || ""

    try {
      isSaving = true

      if (draft._id && draft._rev) {
        const updated =
          draft.type === KnowledgeBaseType.LOCAL
            ? await knowledgeBaseStore.edit({
                _id: draft._id,
                _rev: draft._rev,
                name: draft.name || "",
                type: KnowledgeBaseType.LOCAL,
                embeddingModel: draft.embeddingModel || "",
                vectorDb: draft.vectorDb || "",
              })
            : await knowledgeBaseStore.edit({
                _id: draft._id,
                _rev: draft._rev,
                name: draft.name || "",
                type: draft.type,
                connectionId: draft.connectionId || "",
                scope: draft.scope,
              })

        draft._rev = updated._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base updated")
      } else {
        const created =
          draft.type === KnowledgeBaseType.LOCAL
            ? await knowledgeBaseStore.create({
                name: draft.name || "",
                type: KnowledgeBaseType.LOCAL,
                embeddingModel: draft.embeddingModel || "",
                vectorDb: draft.vectorDb || "",
              })
            : await knowledgeBaseStore.create({
                name: draft.name || "",
                type: draft.type,
                connectionId: draft.connectionId || "",
                scope: draft.scope,
              })

        draft._id = created._id
        draft._rev = created._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base created")
      }
      knowledgeBaseStore.clearFormDraft()
      bb.settings(`/connections/knowledge-bases/${draft._id}`)
    } catch (err: any) {
      notifications.error(err.message || "Failed to save knowledge base")
    } finally {
      isSaving = false
    }
  }

  function createNewEmbeddingModel() {
    knowledgeBaseStore.setFormDraft(Helpers.cloneDeep(draft))
    bb.settings(`/connections/knowledge-bases/${knowledgeBaseId}/embedding/new`)
  }

  function createNewVectorDb() {
    knowledgeBaseStore.setFormDraft(Helpers.cloneDeep(draft))
    bb.settings(`/connections/knowledge-bases/${knowledgeBaseId}/vectordb/new`)
  }

  function openConnections() {
    bb.settings(`/connections/apis`)
  }

  const handleKnowledgeTypeChange = (type: KnowledgeBaseType) => {
    draft.type = type

    if (type !== KnowledgeBaseType.SHAREPOINT) {
      sharePointSites = []
      selectedSharePointSiteId = ""
      return
    }

    lastLoadedSharePointSitesKey = ""
    refreshSharePointSitesForSelection().catch(() => undefined)
  }

  const handleConnectionChange = (connectionId: string) => {
    draft.connectionId = connectionId

    if (draft.type !== KnowledgeBaseType.SHAREPOINT) {
      return
    }

    updateSelectedSharePointSite("")
    lastLoadedSharePointSitesKey = ""
    refreshSharePointSitesForSelection().catch(() => undefined)
  }

  const updateSelectedSharePointSite = (siteId: string) => {
    selectedSharePointSiteId = siteId
    const selectedSite = sharePointSites.find(site => site.id === siteId)
    if (!selectedSite) {
      draft.scope = undefined
      return
    }

    draft.scope = {
      ...(draft.scope || {}),
      siteId: selectedSite.id,
      siteName: selectedSite.name,
      siteWebUrl: selectedSite.webUrl,
    }
  }

  async function deleteKnowledgeBase() {
    if (!draft._id) {
      return
    }

    const knowledgeBaseId = draft._id

    await confirm({
      title: "Delete knowledge base",
      body: "Are you sure you want to permanently delete this knowledge base?",
      onConfirm: async () => {
        try {
          await knowledgeBaseStore.delete(knowledgeBaseId)
          knowledgeBaseStore.clearFormDraft()
          notifications.success("Knowledge base deleted")
          bb.settings(`/connections/knowledge-bases`)
        } catch (err: any) {
          notifications.error(err.message || "Failed to delete knowledge base")
        }
      },
    })
  }

  async function syncKnowledgeBase() {
    if (!draft._id) {
      return
    }

    try {
      isSyncing = true
      const result = await knowledgeBaseStore.sync(draft._id)
      notifications.success(
        `Fetched ${result.files.length} file references from connector`
      )
    } catch (err: any) {
      notifications.error(err.message || "Failed to sync knowledge base")
    } finally {
      isSyncing = false
    }
  }

  async function refreshSharePointSitesForSelection() {
    if (draft.type !== KnowledgeBaseType.SHAREPOINT) {
      return
    }
    if (!draft._id || !draft.connectionId?.trim()) {
      sharePointSites = []
      selectedSharePointSiteId = ""
      return
    }

    const syncKey = `${draft._id}:${draft.connectionId}`
    if (lastLoadedSharePointSitesKey === syncKey) {
      return
    }

    try {
      isLoadingSharePointSites = true
      const response = await knowledgeBaseStore.fetchSharePointSites(draft._id)
      sharePointSites = response.sites
      lastLoadedSharePointSitesKey = syncKey

      if (
        selectedSharePointSiteId &&
        !response.sites.some(site => site.id === selectedSharePointSiteId)
      ) {
        updateSelectedSharePointSite("")
      }
      if (!selectedSharePointSiteId && response.sites.length === 1) {
        updateSelectedSharePointSite(response.sites[0].id)
      }
    } catch (err: any) {
      notifications.error(err.message || "Failed to fetch SharePoint sites")
    } finally {
      isLoadingSharePointSites = false
    }
  }
</script>

<RouteActions>
  <div class="actions">
    {#if isEdit}
      <Button on:click={deleteKnowledgeBase} quiet overBackground>Delete</Button
      >
    {/if}
    <Button on:click={saveKnowledgeBase} cta disabled={!canSave}>
      {#if !isEdit}
        Create knowledge base
      {:else}
        Save
      {/if}
    </Button>
  </div>
</RouteActions>

<div class="form">
  <Input
    label="Display name"
    description="Human readable name for the knowledge base"
    required
    bind:value={draft.name}
    error={duplicateNameError}
    placeholder="HR Policies"
  />

  <Select
    label="Knowledge type"
    description="Choose where this knowledge base retrieves content from."
    required
    value={draft.type}
    options={typeOptions}
    getOptionValue={option => option.value}
    getOptionLabel={option => option.label}
    on:change={({ detail }) => handleKnowledgeTypeChange(detail)}
  />

  {#if isLocalType}
    <div class="select">
      <Select
        label="Embedding model"
        description="Models used to convert text into vector embeddings for search and retrieval."
        required
        bind:value={draft.embeddingModel}
        options={embeddingModelSelectOptions}
        getOptionValue={option => option.value}
        getOptionLabel={option => option.label}
        disabled={!canEditReferences}
        tooltip={!canEditReferences
          ? "Remove all files to change the embedding model."
          : ""}
      />
      <ActionButton
        icon={"Add"}
        size="M"
        disabled={!canEditReferences}
        on:click={createNewEmbeddingModel}
      />
    </div>

    <div class="select">
      <Select
        label="Vector database"
        description="Databases optimized for storing and querying vector embeddings. We support PGVector."
        required
        bind:value={draft.vectorDb}
        options={vectorDbSelectOptions}
        getOptionValue={option => option.value}
        getOptionLabel={option => option.label}
        disabled={!canEditReferences}
        tooltip={!canEditReferences
          ? "Remove all files to change the vector database."
          : ""}
      />
      <ActionButton
        icon={"Add"}
        size="M"
        disabled={!canEditReferences}
        on:click={createNewVectorDb}
      />
    </div>
  {:else}
    <Button
      disabled={!draft._id || isSyncing}
      on:click={syncKnowledgeBase}
    >
      {isSyncing ? "Syncing..." : "Sync now"}
    </Button>

    {#if connectionSelectOptions.length > 0}
      <div class="select">
        <Select
          label="Connection"
          description="Choose an existing connection for this knowledge base source."
          required
          value={draft.connectionId}
          options={connectionSelectOptions}
          getOptionValue={option => option.value}
          getOptionLabel={option => option.label}
          on:change={({ detail }) => handleConnectionChange(detail)}
        />
        <ActionButton icon={"Edit"} size="M" on:click={openConnections} />
      </div>
    {:else}
      <Input
        label="Connection ID"
        description="No matching connections found. Paste a connection ID or create one in Connections."
        required
        bind:value={draft.connectionId}
        placeholder="connector-connection-id"
      />
    {/if}

    {#if draft.type === KnowledgeBaseType.SHAREPOINT}
      <Select
        label="SharePoint site"
        description={isLoadingSharePointSites
          ? "Loading sites from selected connection..."
          : "Pick the site this knowledge base should sync from."}
        value={selectedSharePointSiteId}
        options={sharePointSiteOptions}
        getOptionValue={option => option.value}
        getOptionLabel={option => option.label}
        disabled={!draft.connectionId || isLoadingSharePointSites}
        on:change={({ detail }) => updateSelectedSharePointSite(detail)}
      />
    {/if}
  {/if}

  {#if isLocalType}
    <KnowledgeBaseFilesPanel
      knowledgeBaseId={draft._id}
      {hasReferenceChanges}
    />
  {/if}
</div>

<style>
  .form {
    display: flex;
    gap: var(--spacing-s);
    flex-direction: column;
  }

  .actions {
    display: flex;
    gap: var(--spacing-s);
  }

  .select {
    display: flex;
    gap: var(--spacing-s);
    align-items: flex-end;
  }

  .select :global(.spectrum-Form-item) {
    flex: 1;
  }
</style>
