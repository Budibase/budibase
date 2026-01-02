<script lang="ts">
  import {
    Modal,
    ModalContent,
    Select,
    Input,
    Body,
    notifications,
  } from "@budibase/bbui"
  import { aiConfigsStore } from "@/stores/portal"
  import { WebSearchProvider } from "@budibase/types"
  import { onMount } from "svelte"

  export let aiconfigId: string | undefined

  export const show = () => {
    const existing = $aiConfigsStore.customConfigs.find(
      config => config._id === aiconfigId
    )?.webSearchConfig
    if (existing) {
      selectedProvider = existing.provider
      apiKey = existing.apiKey || ""
    } else {
      selectedProvider = WebSearchProvider.EXA
      apiKey = ""
    }
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  let modal: Modal
  let loading = false
  let apiKey = ""
  let selectedProvider = WebSearchProvider.EXA

  const providerOptions = [
    {
      label: "Exa",
      value: WebSearchProvider.EXA,
      url: "exa.ai",
    },
    {
      label: "Parallel",
      value: WebSearchProvider.PARALLEL,
      url: "parallel.ai",
    },
  ]

  $: selectedProviderOption = providerOptions.find(
    p => p.value === selectedProvider
  )

  async function saveConfig() {
    loading = true
    try {
      if (!aiconfigId) {
        notifications.error("Missing AI configuration")
        return
      }
      const nextApiKey = apiKey

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
        webSearchConfig: {
          provider: selectedProvider,
          apiKey: nextApiKey,
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
    <Select
      label="Provider"
      bind:value={selectedProvider}
      options={providerOptions}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.value}
    />

    <Input
      label="API Key"
      type="password"
      bind:value={apiKey}
      placeholder="Enter API key"
    />

    <Body size="S">
      Get your API key from <a
        href="https://{selectedProviderOption?.url}"
        target="_blank"
        rel="noopener noreferrer">{selectedProviderOption?.url}</a
      >
    </Body>
  </ModalContent>
</Modal>

<style>
  a {
    color: var(--spectrum-global-color-blue-600);
  }
</style>
