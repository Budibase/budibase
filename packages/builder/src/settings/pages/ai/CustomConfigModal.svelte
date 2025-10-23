<script lang="ts">
  import { aiConfigsStore } from "@/stores/portal"
  import {
    ModalContent,
    Label,
    Input,
    Toggle,
    Heading,
    ActionButton,
    notifications,
  } from "@budibase/bbui"
  import { type CustomAIProviderConfig } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  export let config: CustomAIProviderConfig | null

  const dispatch = createEventDispatcher<{ hide: void }>()

  let draft: CustomAIProviderConfig = config
    ? { ...config }
    : {
        name: "",
        isDefault: false,
        baseUrl: "",
        model: "",
        apiKey: "",
        liteLLMKey: "",
      }

  $: isEdit = !!config
  $: trimmedName = (draft.name || "").trim()
  $: canSave = trimmedName.length > 0

  async function confirm() {
    try {
      if (draft._id) {
        await aiConfigsStore.updateConfig(draft)
        notifications.success("Chat configuration updated")
      } else {
        const { _id, _rev, ...rest } = draft
        await aiConfigsStore.createConfig(rest)
        notifications.success("Chat configuration created")
      }
    } catch (err: any) {
      notifications.error(err.message || "Failed to save chat configuration")
    }
  }

  async function deleteConfig() {
    if (!draft._id) {
      return
    }

    try {
      await aiConfigsStore.deleteConfig(draft._id)
      notifications.success("Chat configuration deleted")
      dispatch("hide")
    } catch (err: any) {
      notifications.error(err.message || "Failed to delete chat configuration")
    }
  }
</script>

<ModalContent
  size="M"
  confirmText={isEdit ? "Save" : "Create"}
  cancelText="Cancel"
  onConfirm={confirm}
  disabled={!canSave}
>
  <div slot="header">
    <Heading size="XS">
      {isEdit ? `Edit ${draft.name}` : "Add chat configuration"}
    </Heading>
  </div>

  <div class="form-row">
    <Label size="M">Name</Label>
    <Input bind:value={draft.name} placeholder="Support chat" />
  </div>

  <div class="form-row">
    <Label size="M">API Key</Label>
    <Input type="password" bind:value={draft.apiKey} />
  </div>

  <div class="form-row">
    <Label size="M">Base URL</Label>
    <Input placeholder="https://api.openai.com" bind:value={draft.baseUrl} />
  </div>

  <div class="form-row">
    <Label size="M">Model</Label>
    <Input placeholder="gpt-4o-mini" bind:value={draft.model} />
  </div>

  <div class="toggle-row">
    <Label size="M">Default</Label>
    <Toggle bind:value={draft.isDefault} />
  </div>

  {#if isEdit}
    <div class="delete">
      <ActionButton quiet on:click={deleteConfig}>
        Delete configuration
      </ActionButton>
    </div>
  {/if}
</ModalContent>

<style>
  .form-row {
    display: grid;
    gap: var(--spacing-s);
  }

  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xxs) 0;
  }

  .delete {
    display: flex;
    justify-content: flex-start;
    margin-top: var(--spacing-xs);
  }
</style>
