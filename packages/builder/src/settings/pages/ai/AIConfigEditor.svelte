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
    AIConfigType,
  } from "@budibase/types"
  import { BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
  import { onMount } from "svelte"
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import ProviderModelFields from "./ProviderModelFields.svelte"

  interface Props {
    configId?: string
    provider?: string | undefined
    configType: AIConfigType
    showReasoningEffort?: boolean
    disableProviderOnEdit?: boolean
    setDefaultOnFirstCreate?: boolean
    useRouteProviderOnEdit?: boolean
    onCreate?:
      | ((_created: AIConfigResponse) => void | Promise<void>)
      | undefined
    deleteBlockedMessage?: string | undefined
  }

  let {
    configId,
    provider,
    configType,
    showReasoningEffort = false,
    disableProviderOnEdit = false,
    setDefaultOnFirstCreate = false,
    useRouteProviderOnEdit = false,
    onCreate = undefined,
    deleteBlockedMessage = undefined,
  }: Props = $props()

  let isManagedProvider = $derived(provider === BUDIBASE_AI_PROVIDER_ID)
  let config = $derived(
    $aiConfigsStore.customConfigs.find(c => c._id === configId)
  )

  const createAIConfigDraft = (): AIConfigResponse =>
    config?._id
      ? ({
          _id: config._id,
          _rev: config._rev,
          name: config.name,
          provider:
            useRouteProviderOnEdit && provider ? provider : config.provider,
          credentialsFields: Helpers.cloneDeep(config.credentialsFields),
          model: config.model,
          webSearchConfig: Helpers.cloneDeep(config.webSearchConfig),
          configType: config.configType,
          reasoningEffort: config.reasoningEffort,
          isDefault: config.isDefault,
        } satisfies RequiredKeys<UpdateAIConfigRequest>)
      : ({
          provider: provider ?? "",
          name: isManagedProvider ? "Budibase AI" : "",
          model: isManagedProvider ? "budibase/v1" : "",
          configType,
          credentialsFields: {},
          webSearchConfig: undefined,
          reasoningEffort: undefined,
          isDefault: setDefaultOnFirstCreate
            ? !$aiConfigsStore.customConfigsPerType.completions.length
            : undefined,
        } satisfies RequiredKeys<CreateAIConfigRequest>)

  const createDraft = (): AIConfigResponse => createAIConfigDraft()

  let draft: AIConfigResponse = $state(createDraft())
  let isEdit = $derived(!!draft._id)

  const reasoningEffortOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]

  let providers = $derived($aiConfigsStore.providers)
  let providersMap = $derived(
    providers?.reduce<Record<string, LLMProvider>>((acc, provider) => {
      acc[provider.id] = provider
      return acc
    }, {})
  )
  let selectedProvider = $derived(providersMap?.[draft.provider])

  let isSaving = $state(false)
  let savedSnapshot = $state<typeof draft>()
  const captureSavedSnapshot = () => {
    savedSnapshot = Helpers.cloneDeep(draft)
  }
  captureSavedSnapshot()
  let isModified = $derived(
    JSON.stringify(savedSnapshot) !== JSON.stringify(draft)
  )
  let canSave = $derived.by(() => {
    if (isSaving) {
      return false
    }

    if (isManagedProvider) {
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
        field => field.required && !draft.credentialsFields[field.key]?.trim()
      )
    )
  })

  onMount(async () => {
    try {
      await aiConfigsStore.fetchProviders()

      if (configId !== "new" && config) {
        draft = createDraft()
        captureSavedSnapshot()
      }
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
        captureSavedSnapshot()
        notifications.success("Configuration updated")
      } else {
        const { _id, ...rest } = Helpers.cloneDeep(draft)
        if (
          setDefaultOnFirstCreate &&
          !$aiConfigsStore.customConfigsPerType.completions.some(
            config => config.isDefault === true
          )
        ) {
          rest.isDefault = true
        }
        const created = await aiConfigsStore.createConfig(rest)
        draft._id = created._id
        draft._rev = created._rev
        captureSavedSnapshot()
        await onCreate?.(created)
        notifications.success("Configuration created")
      }

      bb.goToParent()
    } catch (err: any) {
      notifications.error(err.message || "Failed to save configuration")
    } finally {
      isSaving = false
    }
  }

  async function deleteConfig() {
    if (!draft._id) {
      return
    }

    if (deleteBlockedMessage) {
      notifications.error(deleteBlockedMessage)
      return
    }

    const configId = draft._id

    await confirm({
      title: "Delete model",
      body: "Are you sure you want to permanently delete this model?",
      onConfirm: async () => {
        try {
          await aiConfigsStore.deleteConfig(configId)
          notifications.success("Configuration deleted")
          bb.goToParent()
        } catch (err: any) {
          notifications.error(err.message || "Failed to delete configuration")
        }
      },
    })
  }
</script>

<RouteActions>
  <div class="actions">
    {#if isEdit}
      <Button on:click={deleteConfig} quiet overBackground>Delete</Button>
    {/if}
    <Button on:click={saveConfig} cta disabled={!canSave}>
      {#if !isEdit}
        Connect
      {:else}
        Save
      {/if}
    </Button>
  </div>
</RouteActions>

<div class="form">
  {#if !isManagedProvider}
    <ProviderModelFields
      configType={draft.configType}
      provider={draft.provider}
      model={draft.model}
      {providers}
      disabled={disableProviderOnEdit && isEdit}
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

  {#if showReasoningEffort}
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
