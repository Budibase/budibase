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
    AIConfigResponse,
    CreateAIConfigRequest,
    LLMProvider,
    RequiredKeys,
  } from "@budibase/types"
  import {
    AIConfigType,
    BUDIBASE_AI_MODELS,
    BUDIBASE_AI_PROVIDER_ID,
  } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"

  export let config: AIConfigResponse | undefined
  export let type: AIConfigType

  const dispatch = createEventDispatcher<{ hide: void }>()

  let draft: AIConfigResponse = config
    ? structuredClone(config)
    : ({
        provider: BUDIBASE_AI_PROVIDER_ID,
        name: "Budibase AI",
        model: BUDIBASE_AI_MODELS.length === 1 ? BUDIBASE_AI_MODELS[0].id : "",
        configType: type,
        credentialsFields: {},
        webSearchConfig: undefined,
        reasoningEffort: undefined,
        isDefault: !$aiConfigsStore.customConfigsPerType.completions.length,
      } satisfies RequiredKeys<CreateAIConfigRequest>)

  $: isEdit = !!config
  $: canSave = !!draft.model
  $: typeLabel =
    draft.configType === AIConfigType.EMBEDDINGS ? "embeddings" : "chat"

  const reasoningEffortOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]

  $: providers = $aiConfigsStore.providers

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
        Edit Budibase AI
      {:else}
        Setup Budibase AI
      {/if}
    </Heading>
  </div>

  {#if BUDIBASE_AI_MODELS.length > 1}
    <div class="row">
      <Label size="M">Model</Label>
      <Select
        placeholder="Select a model"
        options={BUDIBASE_AI_MODELS}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.id}
        bind:value={draft.model}
      />
    </div>
  {/if}

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
      {:else if field.field_type === "password" || field.key.includes("key")}
        <div class="secret-input">
          <Input
            bind:value={draft.credentialsFields[field.key]}
            type="password"
            autocomplete="new-password"
            placeholder={field.placeholder ?? undefined}
            helpText={field.tooltip ?? undefined}
          />
        </div>
      {:else}
        <Input
          bind:value={draft.credentialsFields[field.key]}
          type="password"
          autocomplete="new-password"
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

  .secret-input :global(input) {
    -webkit-text-security: disc;
  }
</style>
