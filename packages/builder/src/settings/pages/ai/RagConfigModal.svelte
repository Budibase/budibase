<script lang="ts">
  import {
    ragConfigStore,
    aiConfigsStore,
    vectorDbStore,
  } from "@/stores/portal"
  import {
    Heading,
    Input,
    keepOpen,
    Label,
    ModalContent,
    Select,
    notifications,
  } from "@budibase/bbui"
  import { AIConfigType, type RagConfig } from "@budibase/types"
  import type { ZodType } from "zod"
  import { z } from "zod"

  export let config: RagConfig | null
  export let onDelete: (() => void) | null = null

  let submitted = false
  let touched: Record<string, boolean> = {}
  let fieldErrors: Record<string, string> = {}
  let draft: RagConfig = config
    ? { ...config }
    : {
        name: "",
        embeddingModel: "",
        vectorDb: "",
        ragMinDistance: 0.7,
        ragTopK: 4,
      }

  $: isEdit = !!config?._id
  $: embeddingConfigs = ($aiConfigsStore.customConfigs || []).filter(
    cfg => cfg.configType === AIConfigType.EMBEDDINGS
  )
  $: embeddingOptions = embeddingConfigs.map(cfg => ({
    label: cfg.name || cfg._id || "Unnamed",
    value: cfg._id || "",
  }))
  $: vectorDbOptions = ($vectorDbStore.configs || []).map(cfg => ({
    label: cfg.name || cfg._id || "Unnamed",
    value: cfg._id || "",
  }))

  const requiredString = (errorMessage: string) =>
    z.string({ required_error: errorMessage }).trim().min(1, errorMessage)

  const requiredNumber = (errorMessage: string) =>
    z.number({
      required_error: errorMessage,
      invalid_type_error: errorMessage,
    })

  const ragConfigSchema = z.object({
    name: requiredString("Name is required."),
    embeddingModel: requiredString("Embeddings model is required."),
    vectorDb: requiredString("Vector database is required."),
    ragMinDistance: requiredNumber("Minimum similarity is required.")
      .min(0, "Minimum similarity must be between 0 and 1.")
      .max(1, "Minimum similarity must be between 0 and 1."),
    ragTopK: requiredNumber("Chunks to retrieve is required.")
      .int("Chunks to retrieve must be a whole number.")
      .min(1, "Chunks to retrieve must be between 1 and 10.")
      .max(10, "Chunks to retrieve must be between 1 and 10."),
  }) satisfies ZodType<RagConfig>

  const validateDraft = (draft: RagConfig) => ragConfigSchema.safeParse(draft)

  $: touchField = (field: string) => {
    touched = { ...touched, [field]: true }
  }

  $: getError = (field: string) =>
    submitted || touched[field] ? fieldErrors[field] : undefined

  $: validationResult = validateDraft(draft)
  $: fieldErrors = validationResult.success
    ? {}
    : Object.values(validationResult.error.issues).reduce<
        Record<string, string>
      >((acc, issue) => {
        const field = issue.path[0]
        acc[field] = issue.message
        return acc
      }, {})

  async function confirm() {
    try {
      submitted = true
      if (!validationResult.success) {
        return keepOpen
      }
      const validated = validationResult.data
      if (config?._id) {
        await ragConfigStore.edit({
          _id: config._id,
          _rev: config._rev,
          ...validated,
        })
        notifications.success("RAG configuration updated")
      } else {
        await ragConfigStore.create(validated)
        notifications.success("RAG configuration created")
      }
    } catch (err: any) {
      notifications.error(err.message || "Failed to save RAG configuration")
      return keepOpen
    }
  }

  async function deleteConfig() {
    if (!draft._id) {
      return
    }
    try {
      await ragConfigStore.delete(draft._id)
      notifications.success("RAG configuration removed")
      onDelete?.()
    } catch (err: any) {
      notifications.error(err.message || "Failed to delete RAG configuration")
    }
  }
</script>

<ModalContent
  size="M"
  confirmText={isEdit ? "Save" : "Create"}
  cancelText="Cancel"
  onConfirm={confirm}
  showSecondaryButton={isEdit}
  secondaryButtonText="Delete"
  secondaryAction={deleteConfig}
  secondaryButtonWarning
>
  <div slot="header">
    <Heading size="XS">
      {isEdit ? `Edit ${draft.name}` : "Add RAG configuration"}
    </Heading>
  </div>

  <div class="row">
    <Label size="M">Name</Label>
    <Input
      bind:value={draft.name}
      placeholder="Knowledge base RAG"
      error={getError("name")}
      on:blur={() => touchField("name")}
    />
  </div>
  <div class="row">
    <Label size="M">Embeddings model</Label>
    <Select
      bind:value={draft.embeddingModel}
      options={embeddingOptions}
      placeholder="Select embeddings model"
      disabled={!embeddingOptions.length}
      error={getError("embeddingModel")}
      on:change={() => touchField("embeddingModel")}
    />
  </div>
  <div class="row">
    <Label size="M">Vector database</Label>
    <Select
      bind:value={draft.vectorDb}
      options={vectorDbOptions}
      placeholder="Select vector database"
      disabled={!vectorDbOptions.length}
      error={getError("vectorDb")}
      on:change={() => touchField("vectorDb")}
    />
  </div>
  <div class="row">
    <Label size="M">Minimum similarity</Label>
    <Input
      bind:value={draft.ragMinDistance}
      type="number"
      error={getError("ragMinDistance")}
      on:blur={() => touchField("ragMinDistance")}
    />
  </div>
  <div class="row">
    <Label size="M">Chunks to retrieve</Label>
    <Input
      bind:value={draft.ragTopK}
      type="number"
      error={getError("ragTopK")}
      on:blur={() => touchField("ragTopK")}
    />
  </div>
</ModalContent>

<style>
  .row {
    display: grid;
    gap: var(--spacing-s);
  }
</style>
