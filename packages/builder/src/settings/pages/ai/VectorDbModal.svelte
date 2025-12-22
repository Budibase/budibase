<script lang="ts">
  import { vectorDbStore } from "@/stores/portal"
  import {
    Heading,
    Input,
    keepOpen,
    Label,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import type { VectorDb } from "@budibase/types"

  export let config: VectorDb | null
  export let onDelete: (() => void) | null = null

  let draft: VectorDb = config
    ? { ...config }
    : {
        name: "",
        provider: "pgvector",
        host: "",
        port: "5432",
        database: "",
        user: "",
        password: "",
        isDefault: true,
      }

  $: isEdit = !!config?._id
  $: canSave =
    draft.name.trim().length > 0 &&
    draft.host.trim().length > 0 &&
    draft.port.trim().length > 0 &&
    draft.database.trim().length > 0

  async function confirm() {
    try {
      if (draft._id) {
        await vectorDbStore.updateVectorDb({
          ...draft,
          provider: "pgvector",
          isDefault: true,
        })
        notifications.success("Vector database updated")
      } else {
        await vectorDbStore.createVectorDb({
          ...draft,
          provider: "pgvector",
          isDefault: true,
        })
        notifications.success("Vector database created")
      }
    } catch (err: any) {
      notifications.error(err.message || "Failed to save vector database")
      return keepOpen
    }
  }

  async function deleteConfig() {
    if (!draft._id) {
      return
    }
    try {
      await vectorDbStore.deleteVectorDb(draft._id)
      notifications.success("Vector database removed")
      onDelete?.()
    } catch (err: any) {
      notifications.error(err.message || "Failed to delete vector database")
    }
  }
</script>

<ModalContent
  size="M"
  confirmText={isEdit ? "Save" : "Create"}
  cancelText="Cancel"
  onConfirm={confirm}
  disabled={!canSave}
  showSecondaryButton={isEdit}
  secondaryButtonText="Delete"
  secondaryAction={deleteConfig}
  secondaryButtonWarning
>
  <div slot="header">
    <Heading size="XS">
      {isEdit ? `Edit ${draft.name}` : "Add vector database"}
    </Heading>
  </div>

  <div class="row">
    <Label size="M">Name</Label>
    <Input bind:value={draft.name} placeholder="Production vector store" />
  </div>
  <div class="row">
    <Label size="M">Provider</Label>
    <Input value="pgvector" disabled />
  </div>
  <div class="row">
    <Label size="M">Host</Label>
    <Input bind:value={draft.host} placeholder="127.0.0.1" />
  </div>
  <div class="row">
    <Label size="M">Port</Label>
    <Input bind:value={draft.port} placeholder="5432" />
  </div>
  <div class="row">
    <Label size="M">Database</Label>
    <Input bind:value={draft.database} />
  </div>
  <div class="row">
    <Label size="M">User</Label>
    <Input bind:value={draft.user} />
  </div>
  <div class="row">
    <Label size="M">Password</Label>
    <Input type="password" bind:value={draft.password} />
  </div>
</ModalContent>

<style>
  .row {
    display: grid;
    gap: var(--spacing-s);
  }
</style>
