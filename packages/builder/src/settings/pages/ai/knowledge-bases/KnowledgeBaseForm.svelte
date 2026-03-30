<script lang="ts">
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
        }
      : {
          _id: undefined,
          _rev: undefined,
          name: "",
          type: KnowledgeBaseType.GEMINI,
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
    return !!draft.name?.trim() && !duplicateNameError
  })

  let knowledgeBaseTypeOptions = [
    { label: "Gemini", value: KnowledgeBaseType.GEMINI },
  ]

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
        }
        const updated = await knowledgeBaseStore.edit(payload)

        draft._rev = updated._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base updated")
      } else {
        const payload: CreateKnowledgeBaseRequest = {
          name: draft.name || "",
          type: KnowledgeBaseType.GEMINI,
        }

        const created = await knowledgeBaseStore.create(payload)

        draft._id = created._id
        draft._rev = created._rev
        captureSavedSnapshot()
        notifications.success("Knowledge base created")
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
