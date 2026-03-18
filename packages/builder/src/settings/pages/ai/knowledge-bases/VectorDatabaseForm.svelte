<script lang="ts">
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
  import { knowledgeBaseStore, vectorDbStore } from "@/stores/portal"
  import { Button, Helpers, Input, notifications } from "@budibase/bbui"
  import { VectorDbProvider, type VectorDb } from "@budibase/types"
  import { onMount } from "svelte"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"

  export interface Props {
    id?: string
  }

  let { id }: Props = $props()

  let config = $derived($vectorDbStore.configs.find(db => db._id === id))

  const createDraft = (): VectorDb =>
    config
      ? { ...config }
      : {
          name: "",
          provider: VectorDbProvider.PGVECTOR,
          host: "",
          port: 5432,
          database: "",
          user: "",
          password: "",
        }

  let draft = $state(createDraft())
  let isEdit = $derived(!!draft._id)
  let isSaving = $state(false)
  let savedSnapshot = $state<typeof draft>()
  const captureSavedSnapshot = () => {
    savedSnapshot = Helpers.cloneDeep(draft)
  }
  captureSavedSnapshot()
  let referencingKnowledgeBaseCount = $derived.by(
    () =>
      $knowledgeBaseStore.list.filter(
        knowledgeBase => knowledgeBase.vectorDb === draft._id
      ).length
  )

  let isModified = $derived(
    JSON.stringify(savedSnapshot) !== JSON.stringify(draft)
  )

  let canSave = $derived.by(() => {
    if (isSaving || !isModified) {
      return false
    }

    return (
      draft.name.trim().length > 0 &&
      draft.host.trim().length > 0 &&
      draft.port > 0 &&
      draft.database.trim().length > 0
    )
  })

  onMount(async () => {
    try {
      const [configs] = await Promise.all([
        vectorDbStore.fetch(),
        knowledgeBaseStore.fetch(),
      ])
      const isCreation = id === "new"
      if (!isCreation && id && !configs.find(db => db._id === id)) {
        notifications.error("Vector database not found")
        bb.settings("/connections/knowledge-bases")
        return
      }

      draft = createDraft()
      captureSavedSnapshot()
    } catch (err: any) {
      notifications.error(err.message || "Failed to load vector databases")
    }
  })

  async function saveVectorDb() {
    const normalizedPort = Number(draft.port)
    if (!Number.isFinite(normalizedPort) || normalizedPort <= 0) {
      notifications.error("Port must be a valid positive number")
      return
    }

    const payload: VectorDb = {
      ...draft,
      port: normalizedPort,
    }

    try {
      isSaving = true
      if (payload._id) {
        const updated = await vectorDbStore.edit(payload)
        draft._rev = updated._rev
        draft.port = payload.port
        captureSavedSnapshot()
        notifications.success("Vector database updated")
      } else {
        const created = await vectorDbStore.create(payload)
        draft._id = created._id
        draft._rev = created._rev
        draft.port = payload.port
        captureSavedSnapshot()
        notifications.success("Vector database created")

        const formDraft = knowledgeBaseStore.getFormDraft()
        if (formDraft && created._id) {
          knowledgeBaseStore.setFormDraft({
            ...formDraft,
            vectorDb: created._id,
          })
        }
      }
      bb.goToParent()
    } catch (err: any) {
      notifications.error(err.message || "Failed to save vector database")
    } finally {
      isSaving = false
    }
  }

  async function deleteVectorDb() {
    if (!draft._id) {
      return
    }

    if (referencingKnowledgeBaseCount > 0) {
      notifications.error(
        `This vector database can't be deleted because it's used by ${referencingKnowledgeBaseCount} knowledge base${referencingKnowledgeBaseCount === 1 ? "" : "s"}.`
      )
      return
    }

    const vectorDbId = draft._id

    await confirm({
      title: "Delete vector database",
      body: "Are you sure you want to permanently delete this vector database?",
      onConfirm: async () => {
        try {
          await vectorDbStore.delete(vectorDbId)
          notifications.success("Vector database deleted")
          bb.goToParent()
        } catch (err: any) {
          notifications.error(err.message || "Failed to delete vector database")
        }
      },
    })
  }
</script>

<RouteActions>
  <div class="actions">
    {#if isEdit}
      <Button on:click={deleteVectorDb} quiet overBackground>Delete</Button>
    {/if}
    <Button on:click={saveVectorDb} cta disabled={!canSave}>
      {#if !isEdit}
        Create
      {:else}
        Save
      {/if}
    </Button>
  </div>
</RouteActions>

<div class="form">
  <Input
    label="Name"
    description="Human readable name for this vector database connection."
    required
    bind:value={draft.name}
  />
  <Input
    label="Provider"
    description="Vector database provider. Currently PGVector is supported."
    bind:value={draft.provider}
    disabled
  />
  <EnvVariableInput
    label="Host"
    description="Hostname or IP address of your PostgreSQL instance."
    required
    bind:value={draft.host}
    placeholder="127.0.0.1"
  />
  <EnvVariableInput
    label="Port"
    description="Port used by your PostgreSQL instance."
    type="number"
    required
    bind:value={draft.port}
    placeholder="5432"
  />
  <EnvVariableInput
    label="Database"
    description="Database name where vector data will be stored."
    required
    bind:value={draft.database}
  />
  <EnvVariableInput
    label="User"
    description="Database user with permission to read and write vector data."
    bind:value={draft.user}
  />
  <EnvVariableInput
    label="Password"
    description="Password for the database user."
    type="password"
    bind:value={draft.password}
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
