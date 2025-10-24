<script lang="ts">
  import CreateExternalDatasourceModal from "../data/_components/CreateExternalDatasourceModal/index.svelte"
  import DatasourceOption from "../data/_components/DatasourceOption.svelte"
  import RestTemplateOption from "../data/_components/RestTemplateOption.svelte"
  import CreationPage from "@/components/common/CreationPage.svelte"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import {
    Body,
    Checkbox,
    Heading,
    Input,
    Layout,
    Modal,
    ModalContent,
    keepOpen,
    notifications,
  } from "@budibase/bbui"
  import {
    sortedIntegrations as integrations,
    datasources,
    queries,
  } from "@/stores/builder"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { configFromIntegration } from "@/stores/selectors"
  import { IntegrationTypes } from "@/constants/backend"
  import { goto } from "@roxi/routify"
  import type {
    ImportRestQueryInfoResponse,
    RestTemplate,
  } from "@budibase/types"

  let externalDatasourceModal: CreateExternalDatasourceModal
  let externalDatasourceLoading = false
  let templateVersionModal: Modal
  let templateEndpointModal: Modal
  let selectedTemplate: RestTemplate | null = null
  let selectedSpec: RestTemplate["specs"][number] | null = null
  let templateProcessing = false
  let modalLoading = false
  let templateImportInfo: ImportRestQueryInfoResponse | null = null
  let selectedEndpointIds: Set<string> = new Set()
  let endpointSearch = ""

  $: restIntegration = ($integrations || []).find(
    integration => integration.name === IntegrationTypes.REST
  )

  $: restDatasources = ($datasources.list || []).filter(
    datasource => datasource.source === IntegrationTypes.REST
  )
  $: hasRestDatasources = restDatasources.length > 0

  $: disabled = externalDatasourceLoading
  $: templateDisabled = disabled || templateProcessing
  $: endpointOptions = templateImportInfo?.queries || []
  $: searchTerm = endpointSearch.trim().toLowerCase()
  $: filteredEndpointOptions = endpointOptions.filter(option => {
    if (!searchTerm) {
      return true
    }
    const haystack = [
      option.name,
      option.method,
      option.path,
      option.description,
      ...(option.tags || []),
    ]
      .filter(Boolean)
      .map(value => (value || "").toLowerCase())
    return haystack.some(value => value.includes(searchTerm))
  })
  $: selectedCount = endpointOptions.reduce((count, option) => {
    return selectedEndpointIds.has(option.id) ? count + 1 : count
  }, 0)
  $: allEndpointsSelected =
    endpointOptions.length > 0 && selectedCount === endpointOptions.length

  const openRestModal = () => {
    if (!restIntegration) {
      return
    }
    externalDatasourceModal.show(restIntegration)
  }

  const buildDatasourceName = (
    template: RestTemplate,
    spec: RestTemplate["specs"][number]
  ) => {
    if (template.specs.length > 1 && spec.version) {
      return `${template.name} (${spec.version})`
    }
    return template.name
  }

  const resetTemplateSelection = () => {
    selectedSpec = null
    templateImportInfo = null
    selectedEndpointIds = new Set()
    endpointSearch = ""
    modalLoading = false
  }

  const setEndpointSelection = (id: string, selected: boolean) => {
    const updated = new Set(selectedEndpointIds)
    if (selected) {
      updated.add(id)
    } else {
      updated.delete(id)
    }
    selectedEndpointIds = updated
  }

  const toggleAllEndpoints = (selectAll: boolean) => {
    if (selectAll) {
      selectedEndpointIds = new Set(endpointOptions.map(option => option.id))
    } else {
      selectedEndpointIds = new Set()
    }
  }

  const prepareTemplateImport = async (
    template: RestTemplate,
    spec: RestTemplate["specs"][number]
  ) => {
    if (!restIntegration) {
      notifications.error("REST API integration is unavailable.")
      return
    }

    templateProcessing = true
    selectedTemplate = template
    selectedSpec = spec

    try {
      const info = await queries.importQueriesInfo({ data: spec.url })
      templateImportInfo = info
      const options = info.queries || []
      selectedEndpointIds = new Set(options.map(option => option.id))
      endpointSearch = ""
      templateVersionModal?.hide()
      templateEndpointModal?.show()
    } catch (error: any) {
      notifications.error(
        `Error loading template endpoints - ${error?.message || "Unknown error"}`
      )
      resetTemplateSelection()
    } finally {
      templateProcessing = false
    }
  }

  const selectTemplate = (template: RestTemplate) => {
    if (!template.specs.length) {
      notifications.error("Template has no specifications")
      return
    }

    if (template.specs.length === 1) {
      prepareTemplateImport(template, template.specs[0])
      return
    }

    selectedTemplate = template
    templateVersionModal?.show()
  }

  const importTemplateVersion = async (
    template: RestTemplate,
    spec: RestTemplate["specs"][number]
  ) => {
    await prepareTemplateImport(template, spec)
  }

  const importSelectedEndpoints = async () => {
    if (!restIntegration || !selectedTemplate || !selectedSpec) {
      notifications.error("Unable to import template")
      return keepOpen
    }

    if (selectedEndpointIds.size === 0) {
      notifications.error("Select at least one endpoint to import")
      return keepOpen
    }

    modalLoading = true
    templateProcessing = true

    try {
      const config = {
        ...configFromIntegration(restIntegration),
        url: selectedSpec.url,
      }

      const datasource = await datasources.create({
        integration: restIntegration,
        config,
        name: buildDatasourceName(selectedTemplate, selectedSpec),
        uiMetadata: { iconUrl: selectedTemplate.icon },
      })

      if (!datasource?._id) {
        throw new Error("Datasource identifier missing")
      }

      await queries.importQueries({
        data: selectedSpec.url,
        datasource,
        datasourceId: datasource._id,
        selectedQueryIds: Array.from(selectedEndpointIds),
      })

      await Promise.all([datasources.fetch(), queries.fetch()])

      notifications.success(`${selectedTemplate.name} imported successfully`)
      templateEndpointModal?.hide()
      resetTemplateSelection()
      $goto(`./datasource/${datasource._id}`)
    } catch (error: any) {
      notifications.error(
        `Error importing template - ${error?.message || "Unknown error"}`
      )
      return keepOpen
    } finally {
      modalLoading = false
      templateProcessing = false
    }
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
        disabled={templateDisabled}
      >
        <IntegrationIcon
          integrationType={restIntegration.name}
          schema={restIntegration}
          size="32"
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
        <Heading size="S">{selectedTemplate?.name}</Heading>
        <Body size="XS">Select a version to import</Body>
      </div>
      <div class="versionOptions">
        {#each selectedTemplate.specs as spec (spec.version)}
          <button
            class="versionOption"
            on:click={() =>
              selectedTemplate && importTemplateVersion(selectedTemplate, spec)}
            disabled={templateProcessing}
          >
            <Body size="S">{spec.version}</Body>
          </button>
        {/each}
      </div>
    </Layout>
  {/if}
</Modal>

<Modal
  bind:this={templateEndpointModal}
  on:hide={() => {
    resetTemplateSelection()
    selectedTemplate = null
  }}
>
  {#if selectedTemplate && templateImportInfo}
    <ModalContent
      onConfirm={() => importSelectedEndpoints()}
      confirmText="Import endpoints"
      confirmDisabled={modalLoading || selectedCount === 0}
      confirmLoading={modalLoading}
      cancelText="Back"
      size="L"
    >
      <Layout noPadding gap="M">
        <div class="templateModalHeader">
          <Heading size="S">{selectedTemplate?.name}</Heading>
          <Body size="XS">Select the endpoints you want to import</Body>
        </div>
        <div class="endpointControls">
          <Input
            placeholder="Search endpoints"
            bind:value={endpointSearch}
            quiet
          />
          <div class="endpointSummary">
            <Checkbox
              text={allEndpointsSelected ? "Deselect all" : "Select all"}
              value={allEndpointsSelected}
              on:change={event => toggleAllEndpoints(event.detail)}
            />
            <Body size="XS">{selectedCount} selected</Body>
          </div>
        </div>
        {#if filteredEndpointOptions.length}
          <div class="endpointList">
            {#each filteredEndpointOptions as option (option.id)}
              <label class="endpointOption">
                <Checkbox
                  value={selectedEndpointIds.has(option.id)}
                  on:change={event =>
                    setEndpointSelection(option.id, event.detail)}
                />
                <div class="endpointDetails">
                  <Body size="S">{option.name}</Body>
                  <Body size="XS" class="endpointMeta"
                    >{option.method} {option.path}</Body
                  >
                  {#if option.description}
                    <Body size="XS" class="endpointDescription"
                      >{option.description}</Body
                    >
                  {/if}
                  {#if option.tags?.length}
                    <Body size="XS" class="endpointTags"
                      >{option.tags.join(", ")}</Body
                    >
                  {/if}
                </div>
              </label>
            {/each}
          </div>
        {:else}
          <div class="emptyState">
            <Body size="XS">No endpoints match your search.</Body>
          </div>
        {/if}
      </Layout>
    </ModalContent>
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
  .endpointControls {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .endpointSummary {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .endpointList {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 340px;
    overflow-y: auto;
  }
  .endpointOption {
    display: flex;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--grey-4);
    border-radius: 4px;
    align-items: flex-start;
    background: var(--background);
  }
  .endpointDetails {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }
  .endpointMeta {
    color: var(--spectrum-global-color-gray-600);
  }
  .endpointDescription {
    color: var(--spectrum-global-color-gray-600);
  }
  .endpointTags {
    color: var(--spectrum-global-color-gray-500);
  }
  .emptyState {
    display: flex;
    justify-content: center;
    padding: 24px 12px;
    border: 1px dashed var(--grey-4);
    border-radius: 4px;
  }
  .empty-state {
    text-align: center;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
