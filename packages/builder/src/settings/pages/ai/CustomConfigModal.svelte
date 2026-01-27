<script lang="ts">
  import { aiConfigsStore } from "@/stores/portal"
  import {
    Heading,
    Input,
    keepOpen,
    Label,
    ModalContent,
    notifications,
    Select,
  } from "@budibase/bbui"
  import type {
    CustomAIProviderConfig,
    LLMProvider,
    RequiredKeys,
    ToDocCreateMetadata,
    ToDocUpdateMetadata,
  } from "@budibase/types"
  import { AIConfigType } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"

  type ReasoningEffort = "low" | "medium" | "high"
  type CustomAIProviderConfigDraft = CustomAIProviderConfig & {
    reasoningEffort?: ReasoningEffort
  }

  export let config: CustomAIProviderConfigDraft | null
  export let type: AIConfigType

  const dispatch = createEventDispatcher<{ hide: void }>()

  let draft: CustomAIProviderConfigDraft = config
    ? ({
        _id: config._id!,
        _rev: config._rev!,

        name: config.name,
        provider: config.provider,
        credentialsFields: config.credentialsFields ?? {},

        model: config.model,
        liteLLMModelId: config.liteLLMModelId,
        webSearchConfig: config.webSearchConfig,
        configType: config.configType,
        reasoningEffort: config.reasoningEffort,
      } satisfies RequiredKeys<
        ToDocUpdateMetadata<CustomAIProviderConfigDraft>
      >)
    : ({
        _id: "",
        provider: "",
        name: "",
        model: "",
        liteLLMModelId: "",
        configType: type,
        credentialsFields: {},
        webSearchConfig: undefined,
        reasoningEffort: undefined,
      } satisfies RequiredKeys<
        ToDocCreateMetadata<CustomAIProviderConfigDraft>
      >)

  $: isEdit = !!config
  $: canSave = !!draft.name.trim() && !!draft.provider
  $: typeLabel =
    draft.configType === AIConfigType.EMBEDDINGS ? "embeddings" : "chat"

  const reasoningEffortOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]

  $: providers = $aiConfigsStore.providers

  $: providerPlaceholder = !providers
    ? "Loading providers..."
    : providers.length
      ? "Choose a provider"
      : "No providers available"

  $: providersMap = providers?.reduce<Record<string, LLMProvider>>((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})
  $: selectedProvider = providersMap?.[draft.provider]

  onMount(async () => {
    try {
      await aiConfigsStore.fetchProviders()
    } catch (err: any) {
      notifications.error(err.message || "Failed to load providers")
    }
  })

  async function confirm() {
    draft.name = draft.name.trim()
    draft.model = draft.model.trim()
    if (!draft.reasoningEffort) {
      draft.reasoningEffort = undefined
    }

    try {
      if (draft._id) {
        await aiConfigsStore.updateConfig(draft)
        notifications.success(
          `${typeLabel[0].toUpperCase()}${typeLabel.slice(
            1
          )} configuration updated`
        )
      } else {
        const { _id, ...rest } = draft
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
      if (draft._id) {
        // Update rev if the llm validation failed (as the doc might be persisted)
        await aiConfigsStore.fetch()
        draft._rev = $aiConfigsStore.customConfigs.find(
          c => c._id === draft._id
        )?._rev
      }
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
      options={providers}
      getOptionValue={o => o.id}
      getOptionLabel={o => o.displayName}
      placeholder={providerPlaceholder}
      loading={!providers}
    />
  </div>

  <div class="row">
    <Label size="M">Model</Label>
    <Input bind:value={draft.model} />
  </div>

  {#if draft.configType === AIConfigType.COMPLETIONS}
    <div class="row">
      <Label size="M">Reasoning effort</Label>
      <Select
        placeholder="Use provider default"
        options={reasoningEffortOptions}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.value}
        bind:value={draft.reasoningEffort}
      />
    </div>
  {/if}

  {#each selectedProvider?.credentialFields as field (field.key)}
    <div class="row">
      <Label size="M">{field.label || field.key}</Label>
      {#if field.options?.length || field.field_type === "select"}
        <Select
          bind:value={draft.credentialsFields[field.key]}
          options={field.options || []}
          placeholder={field.placeholder ?? undefined}
          helpText={field.tooltip ?? undefined}
        />
      {:else}
        <Input
          bind:value={draft.credentialsFields[field.key]}
          type={field.field_type === "password" || field.key.includes("key")
            ? "password"
            : "text"}
          placeholder={field.placeholder ?? undefined}
          helpText={field.tooltip ?? undefined}
        />
      {/if}
    </div>
  {/each}
</ModalContent>

<style>
  .row {
    display: grid;
    gap: var(--spacing-s);
  }
</style>
