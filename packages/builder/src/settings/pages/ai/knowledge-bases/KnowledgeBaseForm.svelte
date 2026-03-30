<script lang="ts">
  import { API } from "@/api"
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
  import {
    aiConfigsStore,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import { Button, Helpers, Input, notifications, Select } from "@budibase/bbui"
  import {
    KnowledgeBaseType,
    type CreateKnowledgeBaseRequest,
    type Datasource,
    type SharePointKnowledgeBaseSource,
    SourceName,
    type UpdateKnowledgeBaseRequest,
  } from "@budibase/types"
  import { onMount } from "svelte"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import KnowledgeBaseFilesPanel from "./files-panel/index.svelte"

  export interface Props {
    knowledgeBaseId: string
  }

  interface KnowledgeBaseFormDraft {
    _id?: string
    _rev?: string
    name: string
    type: KnowledgeBaseType
    sharepointSources: SharePointKnowledgeBaseSource[]
  }

  let { knowledgeBaseId }: Props = $props()

  let config = $derived(
    $knowledgeBaseStore.list.find(kb => kb._id === knowledgeBaseId)
  )

  const createDraft = (): KnowledgeBaseFormDraft =>
    config?._id
      ? {
          _id: config._id,
          _rev: config._rev,
          name: config.name,
          type: config.type,
          sharepointSources: Helpers.cloneDeep(config.sharepointSources || []),
        }
      : {
          _id: undefined,
          _rev: undefined,
          name: "",
          type: KnowledgeBaseType.GEMINI,
          sharepointSources: [],
        }

  let draft = $state<KnowledgeBaseFormDraft>(createDraft())

  let isEdit = $derived(!!draft._id)
  let isSaving = $state(false)
  let savedSnapshot = $state<KnowledgeBaseFormDraft>()
  const captureSavedSnapshot = () => {
    savedSnapshot = Helpers.cloneDeep(draft)
  }
  captureSavedSnapshot()
  let isModified = $derived(
    JSON.stringify(savedSnapshot) !== JSON.stringify(draft)
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
    const hasInvalidSharePointSource = draft.sharepointSources.some(
      source => !source.datasourceId?.trim() || !source.siteId?.trim()
    )
    return (
      !!draft.name?.trim() && !duplicateNameError && !hasInvalidSharePointSource
    )
  })

  let knowledgeBaseTypeOptions = [
    { label: "Gemini", value: KnowledgeBaseType.GEMINI },
  ]
  let datasources = $state<Datasource[]>([])
  let datasourceOptions = $derived(
    datasources
      .filter(datasource => datasource.source === SourceName.REST)
      .map(datasource => ({
        label: datasource.name || datasource._id || "Untitled connection",
        value: datasource._id || "",
      }))
  )

  onMount(async () => {
    try {
      await Promise.all([
        aiConfigsStore.fetch(),
        knowledgeBaseStore.fetch(),
        vectorDbStore.fetch(),
      ])
      datasources = await API.getDatasources()

      const isCreation = knowledgeBaseId === "new"
      if (!isCreation && !config) {
        notifications.error("Knowledge base not found")
        bb.settings(`/connections/knowledge-bases`)
        return
      }

      draft = createDraft()
      captureSavedSnapshot()
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
        const payload: UpdateKnowledgeBaseRequest = {
          _id: draft._id,
          _rev: draft._rev,
          name: draft.name,
          type: KnowledgeBaseType.GEMINI,
          sharepointSources: draft.sharepointSources,
        }
        const updated = await knowledgeBaseStore.edit(payload)

        draft._rev = updated._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base updated")
      } else {
        const payload: CreateKnowledgeBaseRequest = {
          name: draft.name || "",
          type: KnowledgeBaseType.GEMINI,
          sharepointSources: draft.sharepointSources,
        }

        const created = await knowledgeBaseStore.create(payload)

        draft._id = created._id
        draft._rev = created._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base created")
      }
      if (draft._id && draft.sharepointSources.length > 0) {
        try {
          const syncResult = await knowledgeBaseStore.sync(draft._id)
          notifications.success(
            `SharePoint sync complete (${syncResult.synced} synced, ${syncResult.failed} failed)`
          )
        } catch (syncError: any) {
          notifications.warning(
            syncError.message ||
              "Knowledge base saved, but SharePoint sync did not complete"
          )
        }
      }
      bb.settings(`/connections/knowledge-bases/${draft._id}`)
    } catch (err: any) {
      notifications.error(err.message || "Failed to save knowledge base")
    } finally {
      isSaving = false
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
          notifications.success("Knowledge base deleted")
          bb.settings(`/connections/knowledge-bases`)
        } catch (err: any) {
          notifications.error(err.message || "Failed to delete knowledge base")
        }
      },
    })
  }

  function addSharePointSource() {
    draft.sharepointSources = [
      ...draft.sharepointSources,
      { datasourceId: "", siteId: "" },
    ]
  }

  function removeSharePointSource(index: number) {
    draft.sharepointSources = draft.sharepointSources.filter(
      (_, i) => i !== index
    )
  }

  async function syncSharePointSources() {
    if (!draft._id) {
      notifications.warning("Save the knowledge base before syncing")
      return
    }
    if (draft.sharepointSources.length === 0) {
      notifications.warning("Add at least one SharePoint source to sync")
      return
    }

    try {
      const syncResult = await knowledgeBaseStore.sync(draft._id)
      await knowledgeBaseStore.fetchFiles(draft._id)
      notifications.success(
        `SharePoint sync complete (${syncResult.synced} synced, ${syncResult.failed} failed)`
      )
    } catch (err: any) {
      notifications.error(err.message || "Failed to sync SharePoint sources")
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
    {#if isEdit}
      <Button on:click={syncSharePointSources}>Sync SharePoint now</Button>
    {/if}
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

  {#if knowledgeBaseTypeOptions.length > 1}
    <div class="select">
      <Select
        label="Knowledge base type"
        description="Choose where retrieval is handled."
        required
        bind:value={draft.type}
        options={knowledgeBaseTypeOptions}
        getOptionValue={option => option.value}
        getOptionLabel={option => option.label}
        disabled={isEdit}
      />
    </div>
  {/if}

  <div class="sharepoint-section">
    <div class="sharepoint-header">
      <h4>SharePoint sources</h4>
      <Button size="S" on:click={addSharePointSource}>Add source</Button>
    </div>
    {#if draft.sharepointSources.length === 0}
      <p class="muted">
        No SharePoint sources configured. Local files can still be uploaded
        below.
      </p>
    {:else}
      {#each draft.sharepointSources as source, index}
        <div class="sharepoint-row">
          <Select
            label="Connection"
            bind:value={source.datasourceId}
            options={datasourceOptions}
            getOptionValue={option => option.value}
            getOptionLabel={option => option.label}
          />
          <Input label="Site ID" bind:value={source.siteId} />
          <Input label="Site name (optional)" bind:value={source.siteName} />
          <Button on:click={() => removeSharePointSource(index)} quiet
            >Remove</Button
          >
        </div>
      {/each}
    {/if}
  </div>

  <KnowledgeBaseFilesPanel knowledgeBaseId={draft._id} />
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

  .sharepoint-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .sharepoint-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sharepoint-header h4 {
    margin: 0;
  }

  .sharepoint-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: var(--spacing-s);
    align-items: end;
  }

  .muted {
    color: var(--spectrum-global-color-gray-700);
    margin: 0;
  }
</style>
