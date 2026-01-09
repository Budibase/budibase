<script lang="ts">
  import { onDestroy } from "svelte"
  import CreateExternalDatasourceModal from "../data/_components/CreateExternalDatasourceModal/index.svelte"
  import DatasourceOption from "../data/_components/DatasourceOption.svelte"
  import RestTemplateOption from "../data/_components/RestTemplateOption.svelte"
  import CreationPage from "@/components/common/CreationPage.svelte"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import QueryVerbBadge from "@/components/common/QueryVerbBadge.svelte"
  import DescriptionViewer from "@/components/common/DescriptionViewer.svelte"
  import {
    Body,
    Heading,
    Layout,
    Modal,
    ModalContent,
    notifications,
    Select,
    ProgressCircle,
    keepOpen,
    ModalCancelFrom,
    Popover,
    Icon,
    PopoverAlignment,
    Link,
    type PopoverAPI,
  } from "@budibase/bbui"
  import {
    sortedIntegrations as integrations,
    datasources,
    queries,
  } from "@/stores/builder"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { configFromIntegration } from "@/stores/selectors"
  import { customQueryIconColor } from "@/helpers/data/utils"
  import {
    formatEndpointLabel,
    getRestTemplateImportInfoRequest,
  } from "@/helpers/restTemplates"
  import { IntegrationTypes } from "@/constants/backend"
  import { goto as gotoStore } from "@roxi/routify"
  import type {
    RestTemplate,
    ImportEndpoint,
    Datasource,
    ImportRestQueryRequest,
  } from "@budibase/types"
  import { SourceName } from "@budibase/types"

  $: goto = $gotoStore

  let externalDatasourceModal: CreateExternalDatasourceModal
  let externalDatasourceLoading = false
  let templateVersionModal: Modal
  let templateEndpointModal: Modal
  let selectedTemplate: RestTemplate | null = null
  let templateLoading = false
  let templateLoadingPhase: "info" | "import" | null = null
  let pendingTemplate: RestTemplate | null = null
  let pendingSpec: RestTemplate["specs"][number] | null = null
  let templateEndpoints: ImportEndpoint[] = []
  let selectedEndpointId: string | undefined = undefined
  let templateDocsBaseUrl: string | undefined = undefined
  let templatesInfoPopover: PopoverAPI | undefined
  let templatesInfoAnchor: HTMLElement | undefined
  let templatesInfoOpen = false
  let templatesInfoTimeout: ReturnType<typeof setTimeout> | undefined
  $: selectedEndpoint = templateEndpoints.find(
    endpoint => endpoint.id === selectedEndpointId
  )

  $: restIntegration = ($integrations || []).find(
    integration => integration.name === IntegrationTypes.REST
  )

  $: restDatasources = ($datasources.list || []).filter(
    datasource => datasource.source === IntegrationTypes.REST
  )
  $: hasRestDatasources = restDatasources.length > 0
  $: restTemplatesList = $restTemplates.templates || []
  $: verifiedRestTemplates = restTemplatesList.filter(
    template => template.verified
  )
  $: unverifiedRestTemplates = restTemplatesList.filter(
    template => !template.verified
  )

  $: disabled = externalDatasourceLoading
  $: templateDisabled = disabled || templateLoading

  $: selectedEndpointDescription = selectedEndpoint?.description || ""

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

  const handleTemplateSelection = async (
    template: RestTemplate,
    spec: RestTemplate["specs"][number]
  ) => {
    if (!restIntegration) {
      notifications.error("REST API integration is unavailable.")
      return
    }

    await importTemplateSelection(template, spec)
  }

  const importTemplateSelection = async (
    template: RestTemplate,
    spec: RestTemplate["specs"][number]
  ) => {
    templateLoading = true
    templateLoadingPhase = "info"
    try {
      const request = getRestTemplateImportInfoRequest(spec)
      if (!request) {
        throw new Error("Template metadata is unavailable")
      }
      const info = await queries.fetchImportInfo(request)

      if (!info.endpoints?.length) {
        throw new Error("No endpoints found in this template")
      }

      pendingTemplate = template
      pendingSpec = spec
      templateDocsBaseUrl = info.docsUrl
      templateEndpoints = info.endpoints
        ?.slice()
        .sort((a, b) => compareEndpointOrder(a, b))
      selectedEndpointId = templateEndpoints[0]?.id
      templateEndpointModal?.show()
    } catch (error: any) {
      notifications.error(
        `Error importing template - ${error?.message || "Unknown error"}`
      )
    } finally {
      templateLoading = false
      templateLoadingPhase = null
    }
  }

  const getEndpointIcon = (endpoint: ImportEndpoint) => {
    const method = (endpoint.method || "").toUpperCase()
    if (!method) {
      return undefined
    }
    const verbKey = endpoint.queryVerb || method.toLowerCase()
    const color = customQueryIconColor(verbKey)
    return {
      component: QueryVerbBadge,
      props: {
        verb: method,
        color,
      },
    }
  }

  const verbOrder: Record<string, number> = {
    GET: 0,
    POST: 1,
    PUT: 2,
    PATCH: 3,
    DELETE: 4,
  }

  const compareEndpointOrder = (a: ImportEndpoint, b: ImportEndpoint) => {
    const methodA = (a.method || "").toUpperCase()
    const methodB = (b.method || "").toUpperCase()
    const orderA = verbOrder[methodA] ?? 999
    const orderB = verbOrder[methodB] ?? 999
    if (orderA !== orderB) {
      return orderA - orderB
    }
    const labelA = formatEndpointLabel(a)
    const labelB = formatEndpointLabel(b)
    return labelA.localeCompare(labelB)
  }

  const importTemplate = async () => {
    if (
      !pendingTemplate ||
      !pendingSpec ||
      !selectedEndpointId ||
      !restIntegration
    ) {
      notifications.error("Select an endpoint to import")
      return keepOpen
    }

    templateLoading = true
    templateLoadingPhase = "import"
    try {
      if (!restIntegration) {
        throw new Error("REST API integration is unavailable.")
      }

      const config = configFromIntegration(restIntegration)

      const datasourcePayload: Datasource = {
        type: "datasource",
        source: restIntegration.name as SourceName,
        config,
        name: buildDatasourceName(pendingTemplate, pendingSpec),
        plus:
          restIntegration.plus &&
          (restIntegration.name as SourceName) !== SourceName.REST
            ? restIntegration.plus
            : undefined,
        isSQL: restIntegration.isSQL,
        restTemplate: pendingTemplate.name,
        restTemplateVersion: pendingSpec.version,
      }

      const importBody: ImportRestQueryRequest = {
        datasource: datasourcePayload,
        selectedEndpointId,
      }
      if (pendingSpec.url) {
        importBody.url = pendingSpec.url
      }
      if (pendingSpec.data) {
        importBody.data = pendingSpec.data
      }
      const importResult = await queries.importQueries(importBody)

      await Promise.all([datasources.fetch(), queries.fetch()])

      notifications.success(`${pendingTemplate.name} imported successfully`)
      await templateEndpointModal?.hide()
      goto(`./datasource/${importResult.datasourceId}`)
    } catch (error: any) {
      notifications.error(
        `Error importing template - ${error?.message || "Unknown error"}`
      )
      return keepOpen
    } finally {
      templateLoading = false
      templateLoadingPhase = null
    }
  }

  const onSelectEndpoint = (event: CustomEvent<string>) => {
    selectedEndpointId = event.detail
  }

  const resetEndpointSelection = () => {
    pendingTemplate = null
    pendingSpec = null
    templateEndpoints = []
    selectedEndpointId = undefined
    templateDocsBaseUrl = undefined
  }

  const cancelEndpointSelection = () => {
    resetEndpointSelection()
  }

  const handleTemplateCancel = (event: CustomEvent<ModalCancelFrom>) => {
    if (event.detail === ModalCancelFrom.OUTSIDE_CLICK) {
      // Prevent outside clicks from closing the modal
      queryMicrotask(() => templateEndpointModal?.show())
      return
    }
    cancelEndpointSelection()
  }

  const queryMicrotask = (fn: () => void) => {
    Promise.resolve().then(fn)
  }

  const selectTemplate = (template: RestTemplate) => {
    if (!template.specs.length) {
      notifications.error("Template has no specifications")
      return
    }

    if (template.specs.length === 1) {
      handleTemplateSelection(template, template.specs[0])
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
    await handleTemplateSelection(template, spec)
  }

  const close = () => {
    if (restDatasources.length) {
      goto(`./datasource/${restDatasources[0]._id}`)
    } else {
      goto("../")
    }
  }

  onDestroy(() => {
    if (templatesInfoTimeout) {
      clearTimeout(templatesInfoTimeout)
    }
  })
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
  <br />
    <div class="options bb-options">
      <DatasourceOption
        on:click={openRestModal}
        title="Custom REST API"
        disabled={templateDisabled}
      >
        <IntegrationIcon
          integrationType={restIntegration.name}
          schema={restIntegration}
          size="20"
        />
      </DatasourceOption>
    </div>

    {#if verifiedRestTemplates.length}
      <div class="templates-header">
        <Body size="S" weight="500" color="var(--spectrum-global-color-gray-900)"
          >Verified templates</Body
        >
      </div>
      <div class="options templateOptions">
        {#each verifiedRestTemplates as template (template.name)}
          <RestTemplateOption
            on:click={() => selectTemplate(template)}
            {template}
            disabled={templateDisabled}
          />
        {/each}
      </div>
    {/if}
    {#if unverifiedRestTemplates.length}
      <div class="templates-header">
        <Body size="S" weight="500" color="var(--spectrum-global-color-gray-900)"
          >Templates</Body
        >
        <div
          class="info-icon-wrapper"
          bind:this={templatesInfoAnchor}
          role="button"
          tabindex="0"
          on:mouseenter={() => {
            if (templatesInfoTimeout) {
              clearTimeout(templatesInfoTimeout)
            }
            templatesInfoPopover?.show()
          }}
          on:mouseleave={() => {
            templatesInfoTimeout = setTimeout(() => {
              templatesInfoPopover?.hide()
            }, 100)
          }}
        >
          <Icon
            name="info"
            size="S"
            color="var(--spectrum-global-color-gray-600)"
          />
        </div>
      </div>
      <div class="options templateOptions">
        {#each unverifiedRestTemplates as template (template.name)}
          <RestTemplateOption
            on:click={() => selectTemplate(template)}
            {template}
            disabled={templateDisabled}
          />
        {/each}
      </div>
    {/if}
  {:else}
    <p class="empty-state">REST API integration is unavailable.</p>
  {/if}
</CreationPage>

<Popover
  bind:this={templatesInfoPopover}
  bind:open={templatesInfoOpen}
  anchor={templatesInfoAnchor}
  align={PopoverAlignment.Left}
  minWidth={400}
  maxWidth={400}
  dismissible={false}
  clickOutsideOverride={true}
  on:mouseenter={() => {
    if (templatesInfoTimeout) {
      clearTimeout(templatesInfoTimeout)
    }
  }}
  on:mouseleave={() => {
    templatesInfoTimeout = setTimeout(() => {
      templatesInfoPopover?.hide()
    }, 100)
  }}
>
  <div class="templates-popover-content">
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      These templates are not verified by Budibase and we cannot guarantee the
      validity of them. You can review all specs using the following link:{" "}
      <Link
        href="https://github.com/Budibase/openapi-rest-templates"
        target="_blank"
      >
        https://github.com/Budibase/openapi-rest-templates
      </Link>
    </Body>
  </div>
</Popover>

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
            on:click={() =>
              selectedTemplate && importTemplateVersion(selectedTemplate, spec)}
            disabled={templateLoading}
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
  on:hide={resetEndpointSelection}
  on:cancel={handleTemplateCancel}
>
  <ModalContent
    size="L"
    confirmText="Import"
    cancelText="Cancel"
    onConfirm={importTemplate}
    onCancel={cancelEndpointSelection}
    disabled={!selectedEndpointId || templateLoading}
  >
    <Layout noPadding gap="S">
      <div class="endpoint-heading">
        <IntegrationIcon
          iconUrl={pendingTemplate?.icon}
          integrationType={restIntegration?.name || IntegrationTypes.REST}
          schema={restIntegration}
          size="32"
        />
      </div>
      <Heading size="S">{pendingTemplate?.name}</Heading>
      <Body size="M">
        Select the action/endpoint you want to import from {pendingTemplate?.name}:
      </Body>
      {#if templateLoading && templateLoadingPhase === "info"}
        <div class="endpoint-loading">
          <ProgressCircle size="S" />
          <Body size="XS">Loading actions…</Body>
        </div>
      {:else if templateLoading && templateLoadingPhase === "import"}
        <div class="endpoint-loading">
          <ProgressCircle size="S" />
          <Body size="XS">Importing selected action…</Body>
        </div>
      {:else if templateEndpoints.length > 0}
        <Select
          size="L"
          value={selectedEndpointId}
          options={templateEndpoints}
          getOptionValue={endpoint => endpoint.id}
          getOptionLabel={formatEndpointLabel}
          getOptionIcon={getEndpointIcon}
          autocomplete={true}
          placeholder="Select an action"
          on:change={onSelectEndpoint}
        />
        <DescriptionViewer
          description={selectedEndpointDescription}
          baseUrl={templateDocsBaseUrl}
        />
      {:else}
        <Body size="XS">No actions available for this template.</Body>
      {/if}
    </Layout>
  </ModalContent>
</Modal>

<style>
  .options {
    width: 100%;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, 235px);
    margin-bottom: 20px;
    max-width: 1050px;
  }
  .templateOptions {
    margin-bottom: 20px;
  }
  .templateModalHeader {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .templates-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 12px 0;
    font-weight: 600;
  }
  .info-icon-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .info-icon-wrapper :global(svg) {
    width: 20px;
    height: 20px;
  }
  .templates-popover-content {
    padding: 16px;
    margin: 0;
  }
  .templates-popover-content :global(p) {
    margin: 0;
  }
  :global(.spectrum-Popover:has(.templates-popover-content)) {
    background-color: var(--background);
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
    border: 0.5px solid var(--grey-2);
    border-radius: 8px;
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

  .endpoint-loading {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .endpoint-heading {
    display: flex;
    justify-content: flex-start;
  }
</style>
