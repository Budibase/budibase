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
  import { aiConfigsStore } from "@/stores/portal"
  import { WebSearchProvider, PASSWORD_REPLACEMENT } from "@budibase/types"
  import { onMount } from "svelte"

  export let aiconfigId: string | undefined

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  let modal: Modal
  let loading = false
  let apiKey = ""

  let draft = {
    provider: WebSearchProvider.EXA,
    enabled: false,
    apiKey: "",
  }

  const providerOptions = [
    { label: "Exa", value: WebSearchProvider.EXA },
    { label: "Parallel", value: WebSearchProvider.PARALLEL },
  ]

  $: existingConfig = $aiConfigsStore.customConfigs.find(
    config => config._id === aiconfigId
  )?.webSearch

  $: if (existingConfig && !loading) {
    draft = {
      provider: existingConfig.provider,
      enabled: existingConfig.enabled,
      apiKey: PASSWORD_REPLACEMENT,
    }
  }

  async function saveConfig() {
    loading = true
    try {
      if (!aiconfigId) {
        notifications.error("Missing AI configuration")
        return
      }
      const nextApiKey =
        apiKey || (existingConfig?.apiKey ? PASSWORD_REPLACEMENT : "")

      let aiConfig = $aiConfigsStore.customConfigs.find(
        config => config._id === aiconfigId
      )
      if (!aiConfig) {
        await aiConfigsStore.fetch()
        aiConfig = $aiConfigsStore.customConfigs.find(
          config => config._id === aiconfigId
        )
      }
      if (!aiConfig) {
        notifications.error("AI configuration not found")
        return
      }

      await aiConfigsStore.updateConfig({
        ...aiConfig,
        webSearch: {
          provider: draft.provider,
          apiKey: nextApiKey,
          enabled: draft.enabled,
        },
      })
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
    if (!$aiConfigsStore.customConfigs.length) {
      await aiConfigsStore.fetch()
    }
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
        bind:value={apiKey}
        placeholder={"Enter API key"}
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
