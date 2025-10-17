<script lang="ts">
  import CreateExternalDatasourceModal from "../data/_components/CreateExternalDatasourceModal/index.svelte"
  import DatasourceOption from "../data/_components/DatasourceOption.svelte"
  import RestTemplateOption from "../data/_components/RestTemplateOption.svelte"
  import CreationPage from "@/components/common/CreationPage.svelte"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { Body, Heading, Layout, Modal, notifications } from "@budibase/bbui"
  import {
    sortedIntegrations as integrations,
    datasources,
    queries,
  } from "@/stores/builder"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { IntegrationTypes } from "@/constants/backend"
  import { goto } from "@roxi/routify"
  import type { RestTemplate } from "@budibase/types"

  let externalDatasourceModal: CreateExternalDatasourceModal
  let externalDatasourceLoading = false
  let templateVersionModal: Modal
  let selectedTemplate: RestTemplate | null = null
  let templateLoading = false

  $: restIntegration = ($integrations || []).find(
    integration => integration.name === IntegrationTypes.REST
  )

  $: restDatasources = ($datasources.list || []).filter(
    datasource => datasource.source === IntegrationTypes.REST
  )
  $: hasRestDatasources = restDatasources.length > 0

  $: disabled = externalDatasourceLoading
  $: templateDisabled = disabled || templateLoading

  const openRestModal = () => {
    if (!restIntegration) {
      return
    }
    externalDatasourceModal.show(restIntegration)
  }

  const startTemplateImport = async (
    template: RestTemplate,
    spec: RestTemplate["specs"][number]
  ) => {
    templateLoading = true
    try {
      const response = await fetch(spec.url)
      if (!response.ok) {
        throw new Error("Unable to download specification")
      }
      const specContent = await response.text()

      const result = await queries.importQueries({
        data: specContent,
        datasource: {
          type: "datasource",
          source: IntegrationTypes.REST,
          name: template.name,
          config: {},
        },
      })

      await datasources.fetch()
      await queries.fetch()

      notifications.success(`${template.name} imported successfully`)
      $goto(`./datasource/${result.datasourceId}`)
    } catch (error: any) {
      notifications.error(
        `Error importing template - ${error?.message || "Unknown error"}`
      )
    } finally {
      templateLoading = false
    }
  }

  const selectTemplate = (template: RestTemplate) => {
    if (!template.specs.length) {
      notifications.error("Template has no specifications")
      return
    }

    if (template.specs.length === 1) {
      startTemplateImport(template, template.specs[0])
      return
    }

    selectedTemplate = template
    templateVersionModal?.show()
  }

  const importTemplateVersion = async (
    template: RestTemplate,
    spec: RestTemplate["specs"][number]
  ) => {
    templateVersionModal?.hide()
    await startTemplateImport(template, spec)
  }

  const close = () => {
    if (restDatasources.length) {
      $goto(`./datasource/${restDatasources[0]._id}`)
    } else {
      $goto("../")
    }
  }
</script>

<CreateExternalDatasourceModal
  bind:loading={externalDatasourceLoading}
  bind:this={externalDatasourceModal}
/>

<CreationPage
  showClose={hasRestDatasources}
  onClose={close}
  heading="Add new API"
>
  {#if restIntegration}
    <div class="subHeading">
      <Body>Connect to an external API</Body>
    </div>
    <div class="options bb-options">
      <DatasourceOption
        on:click={openRestModal}
        title="Custom REST API"
        description={restIntegration.type}
        disabled={templateDisabled}
      >
        <IntegrationIcon
          integrationType={restIntegration.name}
          schema={restIntegration}
          size="24"
        />
      </DatasourceOption>
    </div>
    <div class="subHeading">
      <Body>Or choose a template</Body>
    </div>
    <div class="options templateOptions">
      {#each $restTemplates.templates as template (template.name)}
        <RestTemplateOption
          on:click={() => selectTemplate(template)}
          {template}
          disabled={templateDisabled}
        />
      {/each}
    </div>
  {:else}
    <p class="empty-state">REST API integration is unavailable.</p>
  {/if}
</CreationPage>

<Modal
  bind:this={templateVersionModal}
  on:hide={() => (selectedTemplate = null)}
>
  {#if selectedTemplate}
    <Layout noPadding gap="M">
      <div class="templateModalHeader">
        <Heading size="S">{selectedTemplate.name}</Heading>
        <Body size="XS">Select a version to import</Body>
      </div>
      <div class="versionOptions">
        {#each selectedTemplate.specs as spec (spec.version)}
          <button
            class="versionOption"
            on:click={() => importTemplateVersion(selectedTemplate, spec)}
            disabled={templateLoading}
          >
            <Body size="S">{spec.version}</Body>
          </button>
        {/each}
      </div>
    </Layout>
  {/if}
</Modal>

<style>
  .subHeading {
    display: flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 24px;
    justify-content: center;
    gap: 8px;
  }
  .subHeading :global(p) {
    color: var(--spectrum-global-color-gray-600) !important;
  }
  .options {
    width: 100%;
    display: grid;
    column-gap: 24px;
    row-gap: 24px;
    grid-template-columns: repeat(auto-fit, 235px);
    justify-content: center;
    margin-bottom: 48px;
    max-width: 1050px;
  }
  .bb-options {
    max-width: calc(3 * 235px + 2 * 24px);
  }
  .templateOptions {
    margin-bottom: 24px;
  }
  .templateModalHeader {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .versionOptions {
    display: grid;
    gap: 12px;
  }
  .versionOption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border: 1px solid var(--grey-4);
    border-radius: 4px;
    background: var(--background);
    cursor: pointer;
    transition: background 130ms ease-out;
  }
  .versionOption:hover {
    background: var(--background-alt);
  }
  .versionOption:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .empty-state {
    text-align: center;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
