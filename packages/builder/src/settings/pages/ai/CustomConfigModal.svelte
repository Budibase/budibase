<script lang="ts">
  import { aiConfigsStore } from "@/stores/portal"
  import {
    ModalContent,
    Label,
    Input,
    Select,
    Heading,
    notifications,
    keepOpen,
  } from "@budibase/bbui"
  import { AIConfigType, type CustomAIProviderConfig } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"

  export let config: CustomAIProviderConfig | null
  export let type: AIConfigType

  const dispatch = createEventDispatcher<{ hide: void }>()

  let draft: CustomAIProviderConfig = config
    ? { ...config }
    : {
        provider: "",
        name: "",
        baseUrl: "",
        model: "",
        apiKey: "",
        liteLLMModelId: "",
        configType: type,
      }

  $: isEdit = !!config
  $: trimmedName = (draft.name || "").trim()
  $: trimmedProvider = (draft.provider || "").trim()
  $: canSave = !!trimmedName && !!trimmedProvider
  $: typeLabel =
    draft.configType === AIConfigType.EMBEDDINGS ? "embeddings" : "chat"

  let loadingProviders = true
  let providers: string[] = []

  $: providerOptions = Array.from(
    new Set([...(providers || []), trimmedProvider].filter(Boolean))
  )
  $: providerPlaceholder = loadingProviders
    ? "Loading providers..."
    : providerOptions.length
      ? "Choose a provider"
      : "No providers available"

  onMount(async () => {
    try {
      providers = await aiConfigsStore.fetchProviders()
    } catch (err: any) {
      notifications.error(err.message || "Failed to load providers")
    } finally {
      loadingProviders = false
    }
  })

  async function confirm() {
    try {
      if (draft._id) {
        await aiConfigsStore.updateConfig(draft)
        notifications.success(
          `${typeLabel[0].toUpperCase()}${typeLabel.slice(
            1
          )} configuration updated`
        )
      } else {
        const { _id, _rev, ...rest } = draft
        await aiConfigsStore.createConfig(rest)
        notifications.success(
          `${typeLabel[0].toUpperCase()}${typeLabel.slice(
            1
          )} configuration created`
        )
      }
    } catch (err: any) {
      notifications.error(
        err.message || `Failed to save ${typeLabel} configuration`
      )
      return keepOpen
    }
  }

  async function deleteConfig() {
    if (!draft._id) {
      return
    }

    try {
      await aiConfigsStore.deleteConfig(draft._id)
      notifications.success(
        `${typeLabel[0].toUpperCase()}${typeLabel.slice(
          1
        )} configuration deleted`
      )
      dispatch("hide")
    } catch (err: any) {
      notifications.error(
        err.message || `Failed to delete ${typeLabel} configuration`
      )
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
      {#if isEdit}
        Edit {draft.name}
      {:else}
        Add {typeLabel} configuration
      {/if}
    </Heading>
  </div>

  <div class="row">
    <Label size="M">Name</Label>
    <Input bind:value={draft.name} placeholder="Support chat" />
  </div>

  <div class="row">
    <Label size="M">Provider</Label>
    <Select
      bind:value={draft.provider}
      options={providerOptions}
      placeholder={providerPlaceholder}
      loading={loadingProviders}
    />
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
</ModalContent>

<style>
  .row {
    display: grid;
    gap: var(--spacing-s);
  }
</style>
