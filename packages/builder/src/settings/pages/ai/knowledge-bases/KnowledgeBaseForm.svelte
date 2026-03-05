<script lang="ts">
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
  import {
    aiConfigsStore,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import { Button, Helpers, Input, notifications, Select } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { routeActions } from "../.."

  export interface Props {
    knowledgeBaseId: string
  }

  let { knowledgeBaseId }: Props = $props()

  let config = $derived(
    $knowledgeBaseStore.configs.find(kb => kb._id === knowledgeBaseId)
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
  let savedSnapshot = $state(Helpers.cloneDeep(createDraft()))
  const captureSavedSnapshot = () => {
    savedSnapshot = Helpers.cloneDeep(draft)
  }
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

  let canSave = $derived.by(() => {
    if (isSaving || !isModified) {
      return false
    }
    return (
      !!draft.name?.trim() &&
      !!draft.embeddingModel?.trim() &&
      !!draft.vectorDb?.trim()
    )
  })

  const CREATE_NEW_EMBEDDING_MODEL = "__create_new_embedding_model__"
  const CREATE_NEW_VECTOR_DB = "__create_new_vector_db__"
  let lastEmbeddingModelSelection = $state("")
  let lastVectorDbSelection = $state("")

  let embeddingModelSelectOptions = $derived([
    { label: "Create new", value: CREATE_NEW_EMBEDDING_MODEL },
    ...embeddingModelOptions.map(option => ({
      label: option.name,
      value: option._id || "",
    })),
  ])

  let vectorDbSelectOptions = $derived([
    { label: "Create new", value: CREATE_NEW_VECTOR_DB },
    ...vectorDbOptions.map(option => ({
      label: option.name,
      value: option._id || "",
    })),
  ])

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
      if (persistedDraft) {
        draft = {
          ...draft,
          ...persistedDraft,
        }
      }
      lastEmbeddingModelSelection = draft.embeddingModel || ""
      lastVectorDbSelection = draft.vectorDb || ""
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
        const updated = await knowledgeBaseStore.edit({
          _id: draft._id,
          _rev: draft._rev,
          name: draft.name || "",
          embeddingModel: draft.embeddingModel || "",
          vectorDb: draft.vectorDb || "",
        })
        draft._rev = updated._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base updated")
      } else {
        const created = await knowledgeBaseStore.create({
          name: draft.name || "",
          embeddingModel: draft.embeddingModel || "",
          vectorDb: draft.vectorDb || "",
        })
        draft._id = created._id
        draft._rev = created._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base created")
      }
      knowledgeBaseStore.clearFormDraft()
    } catch (err: any) {
      notifications.error(err.message || "Failed to save knowledge base")
    } finally {
      isSaving = false
    }
  }

  function handleEmbeddingModelChange() {
    if (draft.embeddingModel === CREATE_NEW_EMBEDDING_MODEL) {
      knowledgeBaseStore.setFormDraft(Helpers.cloneDeep(draft))
      draft.embeddingModel = lastEmbeddingModelSelection
      const currentKnowledgeBaseId = knowledgeBaseId || "new"
      bb.settings(
        `/ai-config/knowledge-bases/${currentKnowledgeBaseId}/embedding/new`
      )
      return
    }
    lastEmbeddingModelSelection = draft.embeddingModel || ""
  }

  function handleVectorDbChange() {
    if (draft.vectorDb === CREATE_NEW_VECTOR_DB) {
      knowledgeBaseStore.setFormDraft(Helpers.cloneDeep(draft))
      draft.vectorDb = lastVectorDbSelection
      const currentKnowledgeBaseId = knowledgeBaseId || "new"
      bb.settings(
        `/ai-config/knowledge-bases/${currentKnowledgeBaseId}/vectordb/new`
      )
      return
    }
    lastVectorDbSelection = draft.vectorDb || ""
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

<div use:routeActions>
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
</div>

<div class="form">
  <Input
    label="Display name"
    description="Human readable name for the knowledge base"
    required
    bind:value={draft.name}
    placeholder="HR Policies"
  />

  <Select
    label="Embedding model"
    description="Models used to convert text into vector embeddings for search and retrieval."
    required
    bind:value={draft.embeddingModel}
    options={embeddingModelSelectOptions}
    getOptionValue={option => option.value}
    getOptionLabel={option => option.label}
    placeholder={false}
    disabled={isEdit}
    on:change={handleEmbeddingModelChange}
  />

  <Select
    label="Vector database"
    description="Databases optimized for storing and querying vector embeddings. We support PGVector."
    required
    bind:value={draft.vectorDb}
    options={vectorDbSelectOptions}
    getOptionValue={option => option.value}
    getOptionLabel={option => option.label}
    placeholder={false}
    disabled={isEdit}
    on:change={handleVectorDbChange}
  />
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
</style>
