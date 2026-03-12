<script lang="ts">
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
  import { aiConfigsStore, knowledgeBaseStore } from "@/stores/portal"
  import { Button, Helpers, Input, notifications, Select } from "@budibase/bbui"
  import type {
    AIConfigResponse,
    CreateAIConfigRequest,
    LLMProvider,
    RequiredKeys,
    UpdateAIConfigRequest,
  } from "@budibase/types"
  import { AIConfigType } from "@budibase/types"
  import { onMount } from "svelte"
  import ProviderModelFields from "../ProviderModelFields.svelte"
  import { routeActions } from "../.."
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"

  export interface Props {
    configId?: string
    provider?: string | undefined
  }

  let { configId, provider }: Props = $props()

  let config = $derived(
    $aiConfigsStore.customConfigs.find(c => c._id === configId)
  )

  const createDraft = (): AIConfigResponse =>
    config?._id
      ? ({
          _id: config._id,
          _rev: config._rev,
          name: config.name,
          provider: config.provider,
          credentialsFields: Helpers.cloneDeep(config.credentialsFields),
          model: config.model,
          webSearchConfig: Helpers.cloneDeep(config.webSearchConfig),
          configType: config.configType,
          reasoningEffort: config.reasoningEffort,
          isDefault: config.isDefault,
        } satisfies RequiredKeys<UpdateAIConfigRequest>)
      : ({
          provider: provider ?? "",
          name: "",
          model: "",
          configType: AIConfigType.EMBEDDINGS,
          credentialsFields: {},
          webSearchConfig: undefined,
          reasoningEffort: undefined,
          isDefault: undefined,
        } satisfies RequiredKeys<CreateAIConfigRequest>)

  let draft: AIConfigResponse = $state(createDraft())

  let isEdit = $derived(!!draft._id)

  let providers = $derived($aiConfigsStore.providers)

  let providersMap = $derived(
    providers?.reduce<Record<string, LLMProvider>>((acc, p) => {
      acc[p.id] = p
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
  let referencingKnowledgeBaseCount = $derived.by(
    () =>
      $knowledgeBaseStore.list.filter(
        knowledgeBase => knowledgeBase.embeddingModel === draft._id
      ).length
  )
  let isModified = $derived(
    JSON.stringify(savedSnapshot) !== JSON.stringify(draft)
  )
  let canSave = $derived.by(() => {
    if (isSaving) {
      return false
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
      await Promise.all([
        aiConfigsStore.fetch(),
        aiConfigsStore.fetchProviders(),
        knowledgeBaseStore.fetch(),
      ])

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
        notifications.success(`Configuration updated`)
      } else {
        const { _id, ...rest } = Helpers.cloneDeep(draft)
        const created = await aiConfigsStore.createConfig(rest)
        draft._id = created._id
        draft._rev = created._rev
        captureSavedSnapshot()
        notifications.success(`Configuration created`)

        const formDraft = knowledgeBaseStore.getFormDraft()
        if (formDraft && created._id) {
          knowledgeBaseStore.setFormDraft({
            ...formDraft,
            embeddingModel: created._id,
          })
        }
      }
      bb.goToParent()
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

    if (referencingKnowledgeBaseCount > 0) {
      notifications.error(
        `This embedding model can't be deleted because it's used by ${referencingKnowledgeBaseCount} knowledge base${referencingKnowledgeBaseCount === 1 ? "" : "s"}.`
      )
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
          bb.goToParent()
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
  <ProviderModelFields
    configType={draft.configType}
    provider={draft.provider}
    model={draft.model}
    {providers}
    disabled={isEdit}
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
