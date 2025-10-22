<script lang="ts">
  import {
    ModalContent,
    Label,
    Input,
    Toggle,
    Heading,
    ActionButton,
  } from "@budibase/bbui"
  import {
    PASSWORD_REPLACEMENT,
    type CustomAIProviderConfig,
  } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  export let config: CustomAIProviderConfig

  const dispatch = createEventDispatcher<{
    save: CustomAIProviderConfig
    cancel: void
    delete: CustomAIProviderConfig
  }>()

  let draft: CustomAIProviderConfig = { ...config }

  $: draft.provider = "Custom"
  $: isEdit = !!config
  $: hasApiKey =
    typeof draft.apiKey === "string" &&
    (draft.apiKey === PASSWORD_REPLACEMENT || draft.apiKey.trim().length > 0)
  $: trimmedName = (draft.name || "").trim()
  $: canSave = trimmedName.length > 0 && hasApiKey

  const confirm = () => dispatch("save", { ...draft })
  const cancel = () => dispatch("cancel")
  const deleteConfig = () => dispatch("delete", { ...draft })
</script>

<ModalContent
  size="M"
  confirmText={isEdit ? "Save" : "Create"}
  cancelText="Cancel"
  onConfirm={confirm}
  onCancel={cancel}
  disabled={!canSave}
>
  <div slot="header">
    <Heading size="XS">
      {isEdit ? `Edit ${config.name}` : "Add chat configuration"}
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
    <Input placeholder="gpt-4o-mini" bind:value={draft.defaultModel} />
  </div>

  <div class="toggle-row">
    <Label size="M">Active</Label>
    <Toggle bind:value={draft.active} />
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
