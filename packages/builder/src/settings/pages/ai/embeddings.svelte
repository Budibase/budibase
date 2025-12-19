<script lang="ts">
  import { onMount } from "svelte"
  import {
    Button,
    Layout,
    Body,
    notifications,
    Modal,
    Input,
  } from "@budibase/bbui"
  import { aiConfigsStore, featureFlags } from "@/stores/portal"

  import { API } from "@/api"
  import CustomConfigModal from "./CustomConfigModal.svelte"
  import {
    type CustomAIProviderConfig,
    ConfigType,
    type AIConfig,
    AIConfigType,
    type VectorStore,
  } from "@budibase/types"
  import CustomAIConfigTile from "./CustomAIConfigTile.svelte"
  import { vectorStoreStore } from "@/stores/portal"

  let aiConfig: AIConfig
  let customConfigModal: { show: () => void; hide: () => void }

  let customModalConfig: CustomAIProviderConfig | null = null
  let modalConfigType: AIConfigType = AIConfigType.COMPLETIONS
  let vectorDbConfigDraft: VectorStore = {
    name: "Workspace vector store",
    provider: "pgvector",
    host: "",
    port: "5432",
    database: "",
    user: "",
    password: "",
    isDefault: true,
  }
  let vectorConfigDraftId: string | undefined
  let embeddingsConfigSection: HTMLDivElement

  $: privateLLMSEnabled = $featureFlags.PRIVATE_LLMS

  $: customConfigs = $aiConfigsStore.customConfigs || []
  $: embeddingConfigs = customConfigs.filter(
    config => config.configType === AIConfigType.EMBEDDINGS
  )
  $: currentVectorConfig = $vectorStoreStore.configs?.[0]
  $: if (
    currentVectorConfig &&
    currentVectorConfig._id !== vectorConfigDraftId
  ) {
    vectorDbConfigDraft = { ...currentVectorConfig }
    vectorConfigDraftId = currentVectorConfig._id
  } else if (!currentVectorConfig && vectorConfigDraftId) {
    vectorDbConfigDraft = {
      name: "Workspace vector store",
      provider: "pgvector",
      host: "",
      port: "5432",
      database: "",
      user: "",
      password: "",
      isDefault: true,
    }
    vectorConfigDraftId = undefined
  }

  function openCustomAIConfigModal(
    config?: CustomAIProviderConfig,
    type: AIConfigType = AIConfigType.COMPLETIONS
  ) {
    modalConfigType = type
    customModalConfig = config
      ? {
          ...config,
          apiKey: config.apiKey ?? "",
          baseUrl: config.baseUrl ?? "",
          model: config.model ?? "",
          isDefault: config.isDefault ?? false,
        }
      : null
    customConfigModal?.show()
  }

  async function saveVectorDbSettings() {
    try {
      const payload = {
        ...vectorDbConfigDraft,
        provider: "pgvector",
        isDefault: true,
      }
      if (vectorDbConfigDraft._id) {
        await vectorStoreStore.updateVectorStore({
          ...payload,
          _id: vectorDbConfigDraft._id,
          _rev: vectorDbConfigDraft._rev,
        })
      } else {
        await vectorStoreStore.createVectorStore({
          ...payload,
        })
      }
      notifications.success("Vector DB settings saved")
    } catch (err: any) {
      notifications.error(err.message || "Failed to save vector settings")
    }
  }

  onMount(async () => {
    try {
      aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig

      customConfigs = await aiConfigsStore.fetch()
      await vectorStoreStore.fetchVectorStores()
    } catch {
      notifications.error("Error fetching AI settings")
    }
  })
</script>

{#if aiConfig}
  <Layout noPadding gap="S">
    {#if privateLLMSEnabled}
      <div
        class="section"
        id="EmbeddingsConfig"
        bind:this={embeddingsConfigSection}
      >
        <div class="section-header">
          <div class="section-title">Embeddings models</div>
          <Button
            size="S"
            cta
            on:click={() =>
              openCustomAIConfigModal(undefined, AIConfigType.EMBEDDINGS)}
          >
            Add configuration
          </Button>
        </div>

        {#if embeddingConfigs.length}
          <div class="ai-list">
            {#each embeddingConfigs as config (config._id)}
              <CustomAIConfigTile
                {config}
                editHandler={() =>
                  openCustomAIConfigModal(config, AIConfigType.EMBEDDINGS)}
              />
            {/each}
          </div>
        {:else}
          <div class="no-enabled">
            <Body size="S">No embeddings configurations yet</Body>
          </div>
        {/if}
      </div>

      <div class="section vector-section">
        <div class="section-header">
          <div class="section-title">Vector database</div>
        </div>
        <div class="vector-form">
          <Input
            label="Provider"
            labelPosition="left"
            value="pgvector"
            disabled
          />
          <Input
            label="Host"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.host}
            placeholder="127.0.0.1"
          />
          <Input
            label="Port"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.port}
            placeholder="5432"
          />
          <Input
            label="Database"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.database}
          />
          <Input
            label="User"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.user}
          />
          <Input
            label="Password"
            type="password"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.password}
          />
        </div>
        <div class="vector-actions">
          <Button primary on:click={saveVectorDbSettings}>
            Save vector settings
          </Button>
        </div>
      </div>
    {/if}
  </Layout>
{/if}

<Modal bind:this={customConfigModal}>
  <CustomConfigModal
    config={customModalConfig}
    type={modalConfigType}
    on:hide={() => {
      customConfigModal.hide()
    }}
  />
</Modal>

<style>
  .ai-list {
    margin-top: var(--spacing-l);
    margin-bottom: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .no-enabled {
    padding: 16px;
    background-color: var(--grey-1);
    border: 1px solid var(--grey-4);
    border-radius: var(--border-radius-m);
  }

  .section-title {
    margin-bottom: var(--spacing-m);
    font-weight: 600;
    font-size: 16px;
    color: var(--ink);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-m);
  }

  .section-header .section-title {
    margin-bottom: 0;
  }

  .vector-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .vector-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--spacing-m);
  }

  .vector-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
