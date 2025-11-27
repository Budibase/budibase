<script lang="ts">
  import { goto } from "@roxi/routify"
  import {
    keepOpen,
    ModalContent,
    notifications,
    Body,
    Layout,
    Heading,
    Select,
    InlineAlert,
    ProgressCircle,
  } from "@budibase/bbui"
  import {
    datasources,
    queries,
    sortedIntegrations as integrations,
  } from "@/stores/builder"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import QueryVerbBadge from "@/components/common/QueryVerbBadge.svelte"
  import DescriptionViewer from "@/components/common/DescriptionViewer.svelte"
  import { customQueryIconColor } from "@/helpers/data/utils"
  import { formatEndpointLabel } from "@/helpers/restTemplates"
  import { IntegrationTypes } from "@/constants/backend"
  import type {
    Datasource,
    ImportRestQueryRequest,
    QueryImportEndpoint,
  } from "@budibase/types"

  export let navigateDatasource = false
  export let datasourceId: string | undefined = undefined
  export let createDatasource = false
  export let onCancel: (() => void) | undefined = undefined

  $: datasource = $datasources.selected as Datasource
  $: restTemplateList = $restTemplates.templates
  let selectedEndpoint: QueryImportEndpoint | undefined
  $: restIntegration = ($integrations || []).find(
    integration => integration.name === datasource?.source
  )
  $: template = datasource?.restTemplate
    ? restTemplateList.find(
        template => template.name === datasource.restTemplate
      )
    : undefined
  $: selectedTemplateSpec = template
    ? template.specs?.find(
        spec => spec.version === datasource?.restTemplateVersion
      ) || template.specs?.[0]
    : undefined
  $: resolvedTemplateSpecUrl = selectedTemplateSpec?.url
  $: templateName = template?.name
  $: templateIcon = template?.icon
  $: isTemplateDatasource = Boolean(datasource?.restTemplate && template)
  $: templateEndpointDescription = selectedEndpoint?.description || ""
  let endpointOptions: QueryImportEndpoint[] = []
  let selectedEndpointId: string | undefined = undefined
  let endpointsLoading = false
  let endpointsError: string | null = null
  let endpointsSourceUrl: string | undefined
  let loadRequestId = 0
  $: confirmDisabled = !selectedEndpointId || endpointsLoading
  let currentTemplateUrl: string | undefined
  let templateDocsBaseUrl: string | undefined

  const resetEndpoints = () => {
    loadRequestId += 1
    endpointOptions = []
    selectedEndpointId = undefined
    endpointsError = null
    endpointsLoading = false
    endpointsSourceUrl = undefined
    templateDocsBaseUrl = undefined
  }

  const loadTemplateEndpoints = async (specUrl: string) => {
    resetEndpoints()
    const requestId = ++loadRequestId
    endpointsLoading = true
    endpointsError = null

    try {
      const info = await queries.fetchImportInfo({ url: specUrl })
      if (requestId !== loadRequestId) {
        return
      }
      endpointsSourceUrl = specUrl
      templateDocsBaseUrl = info.docsUrl
      endpointOptions = (info.endpoints || [])
        .slice()
        .sort((a, b) => compareEndpointOrder(a, b))
      selectedEndpointId = endpointOptions[0]?.id
    } catch (error: any) {
      if (requestId !== loadRequestId) {
        return
      }
      endpointsError = error?.message || "Failed to load endpoints"
      endpointOptions = []
      selectedEndpointId = undefined
      endpointsSourceUrl = undefined
    } finally {
      if (requestId === loadRequestId) {
        endpointsLoading = false
      }
    }
  }

  $: if (isTemplateDatasource) {
    const specUrl = resolvedTemplateSpecUrl
    if (specUrl && specUrl !== currentTemplateUrl) {
      currentTemplateUrl = specUrl
      loadTemplateEndpoints(specUrl)
    }
  } else if (currentTemplateUrl) {
    currentTemplateUrl = undefined
  }

  const getEndpointId = (endpoint: QueryImportEndpoint) => endpoint.id

  const getEndpointIcon = (endpoint: QueryImportEndpoint) => {
    const method = (endpoint.method || "").toUpperCase()
    if (!method) {
      return undefined
    }
    const verbKey = endpoint.queryVerb || method.toLowerCase()
    return {
      component: QueryVerbBadge,
      props: {
        verb: method,
        color: customQueryIconColor(verbKey),
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

  const compareEndpointOrder = (
    a: QueryImportEndpoint,
    b: QueryImportEndpoint
  ) => {
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

  const onSelectEndpoint = (event: CustomEvent<string | undefined>) => {
    selectedEndpointId = event.detail
  }

  $: selectedEndpoint = endpointOptions.find(
    endpoint => endpoint.id === selectedEndpointId
  )

  async function importQueries() {
    try {
      if (!selectedEndpointId) {
        notifications.error("Select an endpoint to import")
        return keepOpen
      }

      if (!endpointsSourceUrl) {
        notifications.error("Import data is missing")
        return keepOpen
      }

      if (!datasourceId && !createDatasource) {
        throw new Error("No datasource id")
      }

      const body: ImportRestQueryRequest = {
        url: endpointsSourceUrl,
        datasourceId,
        datasource,
        selectedEndpointId,
      }
      const importResult = await queries.importQueries(body)
      if (!datasourceId) {
        datasourceId = importResult.datasourceId
      }

      // reload
      await datasources.fetch()
      await queries.fetch()

      if (navigateDatasource) {
        $goto(`./datasource/${datasourceId}`)
      }

      notifications.success("Imported successfully")
    } catch (error: any) {
      notifications.error(`Error importing queries - ${error.message}`)

      return keepOpen
    }
  }
</script>

<ModalContent
  onConfirm={() => importQueries()}
  {onCancel}
  confirmText={"Import"}
  cancelText={"Cancel"}
  size="L"
  disabled={confirmDisabled}
>
  <Layout noPadding>
    {#if isTemplateDatasource}
      <div class="template-modal">
        <div class="endpoint-heading">
          <IntegrationIcon
            iconUrl={templateIcon}
            integrationType={datasource?.source || IntegrationTypes.REST}
            schema={restIntegration}
            size="32"
          />
        </div>
        <Heading size="S">Select action</Heading>
        <Body size="XS">
          Choose the action you want to import from
          {templateName || datasource?.name || "this template"}.
        </Body>
        {#if endpointsLoading}
          <div class="endpoint-loading">
            <ProgressCircle size="S" />
            <Body size="XS">Loading actions…</Body>
          </div>
        {:else if endpointsError}
          <InlineAlert
            type="error"
            header="Unable to load actions"
            message={endpointsError}
          />
        {:else if endpointOptions.length > 0}
          <Select
            label="Action"
            value={selectedEndpointId}
            options={endpointOptions}
            getOptionValue={getEndpointId}
            getOptionLabel={formatEndpointLabel}
            getOptionIcon={getEndpointIcon}
            placeholder="Select an action"
            autocomplete={true}
            on:change={onSelectEndpoint}
          />
          <DescriptionViewer
            description={templateEndpointDescription}
            baseUrl={templateDocsBaseUrl}
          />
        {:else}
          <Body size="XS">No actions were found for this template.</Body>
        {/if}
      </div>
    {:else}
      <div class="template-modal">
        <Heading size="S">Template unavailable</Heading>
        <Body size="XS">
          We couldn't find a template configuration for this datasource. Close
          the modal and try importing a custom collection instead.
        </Body>
      </div>
    {/if}
  </Layout>
</ModalContent>

<style>
  .template-modal {
    display: grid;
    gap: 24px;
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
