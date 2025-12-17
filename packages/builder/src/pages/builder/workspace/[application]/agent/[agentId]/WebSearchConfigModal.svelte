<script lang="ts">
  import {
    Modal,
    ModalContent,
    RadioGroup,
    Input,
    Toggle,
    Body,
    notifications,
  } from "@budibase/bbui"
  import { webSearchConfigStore } from "@/stores/portal"
  import { WebSearchProvider, PASSWORD_REPLACEMENT } from "@budibase/types"
  import { onMount } from "svelte"

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  let modal: Modal
  let loading = false

  let draft = {
    provider: WebSearchProvider.EXA,
    apiKey: "",
    enabled: false,
  }

  const providerOptions = [
    { label: "Exa", value: WebSearchProvider.EXA },
    { label: "Parallel", value: WebSearchProvider.PARALLEL },
  ]

  $: existingConfig = $webSearchConfigStore.config

  $: if (existingConfig && !loading) {
    draft = {
      provider: existingConfig.provider,
      apiKey: existingConfig.apiKey,
      enabled: existingConfig.enabled,
    }
  }

  async function saveConfig() {
    loading = true
    try {
      await webSearchConfigStore.save(
        draft.provider,
        draft.apiKey,
        draft.enabled
      )
      notifications.success("Web search configuration saved")
      modal.hide()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save web search configuration")
    } finally {
      loading = false
    }
  }

  onMount(async () => {
    await webSearchConfigStore.fetch()
  })
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Web Search Configuration"
    size="M"
    showConfirmButton
    showCancelButton
    showCloseIcon
    confirmText="Save"
    onConfirm={saveConfig}
    disabled={loading}
  >
    <div class="config-form">
      <Toggle text="Enable Web Search" bind:value={draft.enabled} />

      <div class="form-field">
        <Body size="S">Provider</Body>
        <RadioGroup
          bind:value={draft.provider}
          options={providerOptions}
          direction="horizontal"
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          disabled={!draft.enabled}
        />
      </div>

      <Input
        label="API Key"
        type="password"
        bind:value={draft.apiKey}
        placeholder={existingConfig?.apiKey === PASSWORD_REPLACEMENT
          ? "Enter new key or leave to keep existing"
          : "Enter API key"}
        disabled={!draft.enabled}
      />

      <div class="help-text">
        {#if draft.provider === WebSearchProvider.EXA}
          <Body size="XS">
            Get your API key from <a
              href="https://exa.ai"
              target="_blank"
              rel="noopener noreferrer">exa.ai</a
            >
          </Body>
        {:else}
          <Body size="XS">
            Get your API key from <a
              href="https://parallel.ai"
              target="_blank"
              rel="noopener noreferrer">parallel.ai</a
            >
          </Body>
        {/if}
      </div>
    </div>
  </ModalContent>
</Modal>

<style>
  .config-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .help-text {
    color: var(--spectrum-global-color-gray-600);
  }

  .help-text a {
    color: var(--spectrum-global-color-blue-600);
    text-decoration: none;
  }

  .help-text a:hover {
    text-decoration: underline;
  }
</style>
