<script lang="ts">
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
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
          embeddingModel: config.embeddingModel,
          vectorDb: config.vectorDb,
        }
      : {
          _id: undefined as string | undefined,
          _rev: undefined as string | undefined,
          name: "",
          embeddingModel: "",
          vectorDb: "",
        }

  let draft = $state(createDraft())

  let isEdit = $derived(!!draft._id)
  let isSaving = $state(false)
  let savedSnapshot = $state<typeof draft>()
  const captureSavedSnapshot = () => {
    savedSnapshot = Helpers.cloneDeep(draft)
  }
  captureSavedSnapshot()
  let isModified = $derived(
    JSON.stringify(savedSnapshot) !== JSON.stringify(draft)
  )

  let embeddingModelOptions = $derived(
    [...$aiConfigsStore.customConfigsPerType.embeddings].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  )
  let vectorDbOptions = $derived(
    [...$vectorDbStore.configs].sort((a, b) => a.name.localeCompare(b.name))
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
    return (
      !!draft.name?.trim() &&
      !duplicateNameError &&
      !!draft.embeddingModel?.trim() &&
      !!draft.vectorDb?.trim()
    )
  })

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

  onMount(async () => {
    try {
      await Promise.all([
        aiConfigsStore.fetch(),
        knowledgeBaseStore.fetch(),
        vectorDbStore.fetch(),
      ])

      const isCreation = knowledgeBaseId === "new"
      if (!isCreation && !config) {
        notifications.error("Knowledge base not found")
        bb.settings(`/ai-config/knowledge-bases`)
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
      let savedId: string | undefined
      if (draft._id && draft._rev) {
        const updated = await knowledgeBaseStore.edit({
          _id: draft._id,
          _rev: draft._rev,
          name: draft.name || "",
          embeddingModel: draft.embeddingModel || "",
          vectorDb: draft.vectorDb || "",
        })
        savedId = updated._id
        draft._rev = updated._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base updated")
      } else {
        const created = await knowledgeBaseStore.create({
          name: draft.name || "",
          embeddingModel: draft.embeddingModel || "",
          vectorDb: draft.vectorDb || "",
        })
        savedId = created._id
        draft._id = created._id
        draft._rev = created._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base created")
      }
      if (savedId) {
        bb.settings(`/ai-config/knowledge-bases/${savedId}`)
      }
      knowledgeBaseStore.clearFormDraft()
    } catch (err: any) {
      notifications.error(err.message || "Failed to save knowledge base")
    } finally {
      isSaving = false
    }
  }

  function createEmbeddingModel() {
    knowledgeBaseStore.setFormDraft(Helpers.cloneDeep(draft))
    const currentKnowledgeBaseId = knowledgeBaseId || "new"
    bb.settings(
      `/ai-config/knowledge-bases/${currentKnowledgeBaseId}/embedding/new`
    )
  }

  function createVectorDb() {
    knowledgeBaseStore.setFormDraft(Helpers.cloneDeep(draft))
    const currentKnowledgeBaseId = knowledgeBaseId || "new"
    bb.settings(
      `/ai-config/knowledge-bases/${currentKnowledgeBaseId}/vectordb/new`
    )
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
          bb.settings(`/ai-config/knowledge-bases`)
        } catch (err: any) {
          notifications.error(err.message || "Failed to delete knowledge base")
        }
      },
    })
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

  <div class="select">
    <Select
      label="Embedding model"
      description="Models used to convert text into vector embeddings for search and retrieval."
      required
      bind:value={draft.embeddingModel}
      options={embeddingModelSelectOptions}
      getOptionValue={option => option.value}
      getOptionLabel={option => option.label}
      disabled={isEdit}
    />
    <ActionButton
      icon="Add"
      size="M"
      disabled={isEdit}
      on:click={createEmbeddingModel}
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
      disabled={isEdit}
    />
    <ActionButton
      icon="Add"
      size="M"
      disabled={isEdit}
      on:click={createVectorDb}
    />
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
</style>
