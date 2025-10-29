<script lang="ts">
  import { aiConfigsStore } from "@/stores/portal"
  import {
    ModalContent,
    Label,
    Input,
    Toggle,
    Heading,
    notifications,
    keepOpen,
  } from "@budibase/bbui"
  import { type CustomAIProviderConfig } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  export let config: CustomAIProviderConfig | null

  const dispatch = createEventDispatcher<{ hide: void }>()

  let draft: CustomAIProviderConfig = config
    ? { ...config }
    : {
        provider: "",
        name: "",
        isDefault: false,
        baseUrl: "",
        model: "",
        apiKey: "",
        liteLLMModelId: "",
      }

  $: isEdit = !!config
  $: trimmedName = (draft.name || "").trim()
  $: trimmedProvider = (draft.provider || "").trim()
  $: canSave = !!trimmedName && !!trimmedProvider

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
      return keepOpen
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
  showSecondaryButton={isEdit}
  secondaryButtonText={"Delete"}
  secondaryAction={deleteConfig}
  secondaryButtonWarning
>
  <div slot="header">
    <Heading size="XS">
      {isEdit ? `Edit ${draft.name}` : "Add chat configuration"}
    </Heading>
  </div>

  <div class="row">
    <Label size="M">Name</Label>
    <Input bind:value={draft.name} placeholder="Support chat" />
  </div>

  <div class="row">
    <Label size="M">Provider</Label>
    <Input bind:value={draft.provider} />
  </div>

  <div class="row">
    <Label size="M">API Key</Label>
    <Input type="password" bind:value={draft.apiKey} />
  </div>

  <div class="row">
    <Label size="M">Base URL</Label>
    <Input placeholder="https://api.openai.com" bind:value={draft.baseUrl} />
  </div>

  <div class="row">
    <Label size="M">Model</Label>
    <Input placeholder="gpt-4o-mini" bind:value={draft.model} />
  </div>

  <div class="row">
    <Label size="M">Use as default configuration</Label>
    <Toggle bind:value={draft.isDefault} />
  </div>
</ModalContent>

<style>
  .row {
    display: grid;
    gap: var(--spacing-s);
  }
</style>
