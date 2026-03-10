<script lang="ts">
  import { bb } from "@/stores/bb"
  import { knowledgeBaseStore, vectorDbStore } from "@/stores/portal"
  import { Button, Input, notifications } from "@budibase/bbui"
  import { VectorDbProvider, type VectorDb } from "@budibase/types"
  import { onMount } from "svelte"
  import { routeActions } from "../.."

  export interface Props {
    id?: string
    knowledgeBaseId?: string
  }

  let { id, knowledgeBaseId }: Props = $props()

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
    savedSnapshot = structuredClone(draft)
  }
  captureSavedSnapshot()

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
      const configs = await vectorDbStore.fetch()
      const isCreation = id === "new"
      if (!isCreation && id && !configs.find(db => db._id === id)) {
        notifications.error("Vector database not found")
        bb.settings("/ai-config/knowledge-bases")
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

        if (knowledgeBaseId) {
          bb.settings(`/ai-config/knowledge-bases/${knowledgeBaseId}`)
        }
      }
    } catch (err: any) {
      notifications.error(err.message || "Failed to save vector database")
    } finally {
      isSaving = false
    }
  }
</script>

<div use:routeActions>
  <div class="actions">
    <Button on:click={saveVectorDb} cta disabled={!canSave}>
      {#if !isEdit}
        Create
      {:else}
        Save
      {/if}
    </Button>
  </div>
</div>

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
  <Input
    label="Host"
    description="Hostname or IP address of your PostgreSQL instance."
    required
    bind:value={draft.host}
    placeholder="127.0.0.1"
  />
  <Input
    label="Port"
    description="Port used by your PostgreSQL instance."
    type="number"
    required
    bind:value={draft.port}
    placeholder="5432"
  />
  <Input
    label="Database"
    description="Database name where vector data will be stored."
    required
    bind:value={draft.database}
  />
  <Input
    label="User"
    description="Database user with permission to read and write vector data."
    bind:value={draft.user}
    autocomplete={"off"}
  />
  <Input
    label="Password"
    description="Password for the database user."
    type="password"
    bind:value={draft.password}
    autocomplete={"off"}
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
