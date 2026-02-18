<script lang="ts">
  import { aiConfigsStore } from "@/stores/portal"
  import {
    Button,
    Input,
    keepOpen,
    notifications,
    Select,
  } from "@budibase/bbui"
  import type {
    AIConfigResponse,
    CreateAIConfigRequest,
    LLMProvider,
    RequiredKeys,
    UpdateAIConfigRequest,
  } from "@budibase/types"
  import { AIConfigType } from "@budibase/types"
  import { onMount } from "svelte"
  import { routeActions } from ".."
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"

  export interface Props {
    configId?: string
    provider?: string | undefined
    type: AIConfigType
  }

  let { configId, provider, type }: Props = $props()

  let config = $derived(
    $aiConfigsStore.customConfigs.find(c => c._id === configId)
  )

  const createDraft = (): AIConfigResponse =>
    config?._id && provider
      ? ({
          _id: config._id,
          _rev: config._rev,
          name: config.name,
          provider: provider,
          credentialsFields: config.credentialsFields,
          model: config.model,
          webSearchConfig: config.webSearchConfig,
          configType: config.configType,
          reasoningEffort: config.reasoningEffort,
          isDefault: config.isDefault,
        } satisfies RequiredKeys<UpdateAIConfigRequest>)
      : ({
          provider: provider ?? "",
          name: "",
          model: "",
          configType: type || config?.configType || AIConfigType.COMPLETIONS,
          credentialsFields: {},
          webSearchConfig: undefined,
          reasoningEffort: undefined,
          isDefault:
            type === AIConfigType.COMPLETIONS &&
            !$aiConfigsStore.customConfigs.length,
        } satisfies RequiredKeys<CreateAIConfigRequest>)

  let draft: AIConfigResponse = $state(createDraft())
  let draftKey = $derived(`${configId ?? ""}:${provider ?? ""}:${type ?? ""}`)
  let lastDraftKey = $state("")

  $effect(() => {
    if (lastDraftKey !== draftKey) {
      draft = createDraft()
      lastDraftKey = draftKey
    }
  })

  let isEdit = $derived(!!config?._id)
  let typeLabel = $derived(
    draft.configType === AIConfigType.EMBEDDINGS ? "embeddings" : "chat"
  )

  const reasoningEffortOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]

  let providers = $derived($aiConfigsStore.providers)

  let providerPlaceholder = $derived(
    !providers
      ? "Loading providers..."
      : providers.length
        ? "Choose a provider"
        : "No providers available"
  )

  let providersMap = $derived(
    providers?.reduce<Record<string, LLMProvider>>((acc, p) => {
      acc[p.id] = p
      return acc
    }, {})
  )
  let selectedProvider = $derived(providersMap?.[draft.provider])

  let isSaving = $state(false)
  let canSave = $derived(
    !isSaving &&
      !!draft.name.trim() &&
      !!draft.provider &&
      selectedProvider &&
      !selectedProvider.credentialFields.find(
        f => f.required && !draft.credentialsFields[f.key].trim()
      )
  )

  onMount(async () => {
    try {
      await aiConfigsStore.fetchProviders()
    } catch (err: any) {
      notifications.error(err.message || "Failed to load providers")
    }
  })

  async function saveConfig() {
    draft.name = draft.name.trim()
    draft.model = draft.model.trim()
    if (!draft.reasoningEffort) {
      draft.reasoningEffort = undefined
    }

    try {
      isSaving = true
      if (draft._id) {
        await aiConfigsStore.updateConfig(draft)
        notifications.success(
          `${typeLabel[0].toUpperCase()}${typeLabel.slice(
            1
          )} configuration updated`
        )
      } else {
        const { _id, ...rest } = draft
        if (
          rest.configType === AIConfigType.COMPLETIONS &&
          !$aiConfigsStore.customConfigs.some(
            config =>
              config.configType === AIConfigType.COMPLETIONS &&
              config.isDefault === true
          )
        ) {
          rest.isDefault = true
        }
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
    } finally {
      isSaving = false
    }
  }

  async function deleteConfig() {
    if (!draft._id) {
      return
    }

    const configId = draft._id

    await confirm({
      title: "Delete model",
      body: "Are you sure you want to permanently delete this model?",
      onConfirm: async () => {
        try {
          await aiConfigsStore.deleteConfig(configId)
          notifications.success(
            `${typeLabel[0].toUpperCase()}${typeLabel.slice(
              1
            )} configuration deleted`
          )
          bb.settings("/ai-config/configs")
        } catch (err: any) {
          notifications.error(
            err.message || `Failed to delete ${typeLabel} configuration`
          )
        }
      },
    })
  }
</script>

<div use:routeActions>
  <div class="actions">
    {#if isEdit}
      <Button on:click={deleteConfig} quiet overBackground>Delete</Button>
    {/if}
    <Button on:click={saveConfig} cta disabled={!canSave}>Save</Button>
  </div>
</div>

<div class="form">
  <Select
    label="Provider"
    required
    bind:value={draft.provider}
    options={providers}
    getOptionValue={o => o.id}
    getOptionLabel={o => o.displayName}
    placeholder={providerPlaceholder}
    loading={!providers}
  />

  <Input
    label="Model"
    description="The model you would like to connect to"
    required
    bind:value={draft.model}
    placeholder="Support chat"
  />

  <Input
    label="Display name"
    description="Human readable name for the model"
    required
    bind:value={draft.name}
    placeholder="e.g. Meta"
  />

  {#each selectedProvider?.credentialFields as field (field.key)}
    {#if field.options?.length || field.field_type === "select"}
      <Select
        label={field.label || field.key}
        required={field.required}
        description={field.tooltip ?? undefined}
        bind:value={draft.credentialsFields[field.key]}
        options={field.options || []}
        placeholder={field.placeholder ?? undefined}
        helpText={field.tooltip ?? undefined}
      />
    {:else}
      <Input
        label={field.label || field.key}
        type={field.field_type === "password" || field.key.includes("key")
          ? "password"
          : undefined}
        description={field.tooltip ?? undefined}
        required={field.required}
        bind:value={draft.credentialsFields[field.key]}
        placeholder={field.placeholder ?? undefined}
      />
    {/if}
  {/each}

  {#if draft.configType === AIConfigType.COMPLETIONS}
    <Select
      label="Reasoning effort"
      required
      placeholder="Use provider default"
      options={reasoningEffortOptions}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.value}
      bind:value={draft.reasoningEffort}
    />
  {/if}
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
