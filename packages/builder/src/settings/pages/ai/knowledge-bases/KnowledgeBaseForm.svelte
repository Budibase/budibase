<script lang="ts">
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
  import {
    aiConfigsStore,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import { Button, Input, notifications, Select } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { routeActions } from "../.."

  export interface Props {
    configId?: string
  }

  let { configId }: Props = $props()

  let config = $derived(
    $knowledgeBaseStore.configs.find(kb => kb._id === configId)
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
          name: "",
          embeddingModel: "",
          vectorDb: "",
        }

  let draft = $state(createDraft())

  let isEdit = $derived(!!draft._id)
  let isSaving = $state(false)
  let savedSnapshot = $state(JSON.stringify(draft))
  let isModified = $derived(savedSnapshot !== JSON.stringify(draft))

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

  onMount(async () => {
    try {
      await Promise.all([
        aiConfigsStore.fetch(),
        knowledgeBaseStore.fetch(),
        vectorDbStore.fetch(),
      ])

      if (configId && configId !== "new" && !config) {
        notifications.error("Knowledge base not found")
        bb.settings(`/ai-config/knowledge-bases`)
        return
      }

      draft = createDraft()
      savedSnapshot = JSON.stringify(draft)
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
        savedSnapshot = JSON.stringify({ ...draft, _rev: updated._rev })
        notifications.success("Knowledge base updated")
      } else {
        const created = await knowledgeBaseStore.create({
          name: draft.name || "",
          embeddingModel: draft.embeddingModel || "",
          vectorDb: draft.vectorDb || "",
        })
        draft._id = created._id
        draft._rev = created._rev
        savedSnapshot = JSON.stringify({
          ...draft,
          _id: created._id,
          _rev: created._rev,
        })
        notifications.success("Knowledge base created")
      }
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
    options={embeddingModelOptions}
    getOptionValue={option => option._id || ""}
    getOptionLabel={option => option.name}
    placeholder="Select embedding model"
    disabled={!embeddingModelOptions.length}
  />

  <Select
    label="Vector database"
    description="Databases optimized for storing and querying vector embeddings. We support PGVector."
    required
    bind:value={draft.vectorDb}
    options={vectorDbOptions}
    getOptionValue={option => option._id || ""}
    getOptionLabel={option => option.name}
    placeholder="Select vector database"
    disabled={!vectorDbOptions.length}
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
