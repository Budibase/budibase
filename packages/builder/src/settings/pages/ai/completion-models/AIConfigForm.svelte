<script lang="ts">
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
  import { aiConfigsStore } from "@/stores/portal"
  import { Button, Helpers, Input, notifications, Select } from "@budibase/bbui"
  import type {
    AIConfigResponse,
    CreateAIConfigRequest,
    LLMProvider,
    RequiredKeys,
    UpdateAIConfigRequest,
  } from "@budibase/types"
  import { AIConfigType, BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
  import { onMount } from "svelte"
  import ProviderModelFields from "../ProviderModelFields.svelte"
  import { routeActions } from "../.."
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"

  export interface Props {
    configId?: string
    provider?: string | undefined
  }

  let { configId, provider }: Props = $props()

  let isBBAI = $derived(provider === BUDIBASE_AI_PROVIDER_ID)

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
          credentialsFields: Helpers.cloneDeep(config.credentialsFields),
          model: config.model,
          webSearchConfig: Helpers.cloneDeep(config.webSearchConfig),
          configType: config.configType,
          reasoningEffort: config.reasoningEffort,
          isDefault: config.isDefault,
        } satisfies RequiredKeys<UpdateAIConfigRequest>)
      : ({
          provider: provider ?? "",
          name: isBBAI ? "bbai" : "",
          model: isBBAI ? "budibase/v1" : "",
          configType: AIConfigType.COMPLETIONS,
          credentialsFields: {},
          webSearchConfig: undefined,
          reasoningEffort: undefined,
          isDefault: !$aiConfigsStore.customConfigsPerType.completions.length,
        } satisfies RequiredKeys<CreateAIConfigRequest>)

  let draft: AIConfigResponse = $state(createDraft())

  let isEdit = $derived(!!draft._id)

  const reasoningEffortOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]
  let providers = $derived($aiConfigsStore.providers)

  let providersMap = $derived(
    providers?.reduce<Record<string, LLMProvider>>((acc, p) => {
      acc[p.id] = p
      return acc
    }, {})
  )
  let selectedProvider = $derived(providersMap?.[draft.provider])

  let isSaving = $state(false)
  let savedSnapshot = $state(JSON.stringify(draft))
  let isModified = $derived(savedSnapshot !== JSON.stringify(draft))
  let canSave = $derived.by(() => {
    if (isSaving) {
      return false
    }

    if (isBBAI) {
      return isModified || !draft?._id
    }

    if (!isModified) {
      return false
    }

    return (
      !!draft.name?.trim() &&
      !!draft.model?.trim() &&
      !!draft.provider?.trim() &&
      selectedProvider &&
      !selectedProvider.credentialFields.find(
        f => f.required && !draft.credentialsFields[f.key]?.trim()
      )
    )
  })

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
        const payload = Helpers.cloneDeep(draft)
        const updated = await aiConfigsStore.updateConfig(payload)
        draft._rev = updated._rev
        payload._rev = updated._rev
        savedSnapshot = JSON.stringify(payload)
        notifications.success(`Configuration updated`)
      } else {
        const { _id, ...rest } = Helpers.cloneDeep(draft)
        if (
          !$aiConfigsStore.customConfigsPerType.completions.some(
            config => config.isDefault === true
          )
        ) {
          rest.isDefault = true
        }
        const created = await aiConfigsStore.createConfig(rest)
        draft._id = created._id
        draft._rev = created._rev
        savedSnapshot = JSON.stringify({
          ...rest,
          _id: created._id,
          _rev: created._rev,
        })
        notifications.success(`Configuration created`)
      }
      bb.settings(`/ai-config/${draft.configType}`)
    } catch (err: any) {
      notifications.error(err.message || `Failed to save configuration`)
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
          notifications.success(`Configuration deleted`)
          bb.settings(`/ai-config/${draft.configType}`)
        } catch (err: any) {
          notifications.error(err.message || `Failed to delete configuration`)
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
    <Button on:click={saveConfig} cta disabled={!canSave}>
      {#if !isEdit}
        Connect
      {:else}
        Save
      {/if}</Button
    >
  </div>
</div>

<div class="form">
  {#if !isBBAI}
    <ProviderModelFields
      configType={draft.configType}
      provider={draft.provider}
      model={draft.model}
      {providers}
      on:providerChange={event => (draft.provider = event.detail)}
      on:modelChange={event => (draft.model = event.detail)}
    />

    <Input
      label="Display name"
      description="Human readable name for the model"
      required
      bind:value={draft.name}
      placeholder="Latest ChatGPT"
    />
  {/if}

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
      <EnvVariableInput
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

  <Select
    label="Reasoning effort"
    required
    placeholder="Use provider default"
    options={reasoningEffortOptions}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    bind:value={draft.reasoningEffort}
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
