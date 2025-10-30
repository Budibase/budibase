<script lang="ts">
  import { goto } from "@roxi/routify"
  import {
    keepOpen,
    ModalContent,
    notifications,
    Body,
    Layout,
    Tabs,
    Tab,
    Heading,
    TextArea,
    Dropzone,
    Combobox,
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
  import { customQueryIconColor } from "@/helpers/data/utils"
  import { IntegrationTypes } from "@/constants/backend"
  import { writable } from "svelte/store"
  import type {
    Datasource,
    ImportRestQueryRequest,
    QueryImportEndpoint,
    RestConfig,
    RestTemplate,
    UIFile,
  } from "@budibase/types"

  export let navigateDatasource = false
  export let datasourceId: string | undefined = undefined
  export let createDatasource = false
  export let onCancel: (() => void) | undefined = undefined

  interface ImportFormData {
    url: string
    raw: string
    file?: File
  }

  const data = writable<ImportFormData>({
    url: "",
    raw: "",
  })

  let lastTouched: "url" | "file" | "raw" = "url"

  let datasource: Datasource
  $: datasource = $datasources.selected as Datasource
  $: restTemplateList = $restTemplates.templates
  let selectedEndpoint: QueryImportEndpoint | undefined
  $: restIntegration = ($integrations || []).find(
    integration => integration.name === datasource?.source
  )
  $: datasourceTemplateUrl = getTemplateSpecUrl(datasource)
  $: template = getMatchingTemplate(
    datasource,
    restTemplateList,
    datasourceTemplateUrl
  )
  $: resolvedTemplateSpecUrl = template
    ? template.specs?.find(spec => spec.url === datasourceTemplateUrl)?.url ||
      template.specs?.[0]?.url
    : undefined
  $: templateName = template?.name
  $: templateIcon = template?.icon
  $: isTemplateDatasource = Boolean(datasource?.isRestTemplate && template)
  $: templateEndpointDescription = selectedEndpoint?.description || ""
  let endpointOptions: QueryImportEndpoint[] = []
  let selectedEndpointId: string | undefined = undefined
  let endpointsLoading = false
  let endpointsError: string | null = null
  let dataStringCache: string | undefined
  let loadRequestId = 0
  $: confirmDisabled = !selectedEndpointId || endpointsLoading
  let currentTemplateUrl: string | undefined

  const getTemplateSpecUrl = (source: Datasource | undefined) => {
    if (!source?.isRestTemplate) {
      return undefined
    }
    const config = (source.config || {}) as Partial<RestConfig>
    return typeof config.url === "string" ? config.url : undefined
  }

  const getMatchingTemplate = (
    source: Datasource | undefined,
    templates: RestTemplate[],
    specUrl: string | undefined
  ) => {
    if (!source?.isRestTemplate) {
      return undefined
    }

    let match = specUrl
      ? templates.find(template =>
          template.specs?.some(spec => spec.url === specUrl)
        )
      : undefined

    if (!match && source.uiMetadata?.iconUrl) {
      match = templates.find(template => template.icon === source.uiMetadata?.iconUrl)
    }

    if (!match && source.name) {
      match = templates.find(template => template.name === source.name)
    }

    return match
  }

  const resetEndpoints = () => {
    loadRequestId += 1
    endpointOptions = []
    selectedEndpointId = undefined
    endpointsError = null
    endpointsLoading = false
    dataStringCache = undefined
  }

  const loadTemplateEndpoints = async (specUrl: string) => {
    resetEndpoints()
    const requestId = ++loadRequestId
    endpointsLoading = true
    endpointsError = null

    try {
      const response = await fetch(specUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch template (${response.status})`)
      }
      const dataString = await response.text()
      const info = await queries.fetchImportInfo({ data: dataString })
      if (requestId !== loadRequestId) {
        return
      }
      dataStringCache = dataString
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
      dataStringCache = undefined
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

  const getData = async (): Promise<string> => {
    let dataString

    // parse the file into memory and send as string
    if (lastTouched === "file") {
      dataString = await $data.file?.text()
    } else if (lastTouched === "url") {
      const response = await fetch($data.url)
      dataString = await response.text()
    } else if (lastTouched === "raw") {
      dataString = $data.raw
    }

    if (typeof dataString !== "string") {
      return ""
    }

    const trimmed = dataString.trim()
    if (!trimmed) {
      return ""
    }

    return dataString
  }

  const formatEndpointLabel = (endpoint: QueryImportEndpoint) => {
    const path = endpoint.path || ""
    const label = path || endpoint.name
    if (label && endpoint.name && endpoint.name !== path) {
      return `${label} – ${endpoint.name}`
    }
    return label
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

  const triggerEndpointLoad = async () => {
    const dataString = await getData()
    if (!dataString) {
      resetEndpoints()
      return
    }

    if (dataString === dataStringCache && endpointOptions.length) {
      return
    }

    const requestId = ++loadRequestId
    endpointsLoading = true
    endpointsError = null

    try {
      const info = await queries.fetchImportInfo({ data: dataString })
      if (requestId !== loadRequestId) {
        return
      }
      dataStringCache = dataString
      endpointOptions = (info.endpoints || [])
        .slice()
        .sort((a, b) => compareEndpointOrder(a, b))

      if (endpointOptions.length === 1) {
        selectedEndpointId = endpointOptions[0].id
      } else if (
        !endpointOptions.find(endpoint => endpoint.id === selectedEndpointId)
      ) {
        selectedEndpointId = undefined
      }
    } catch (error: any) {
      if (requestId !== loadRequestId) {
        return
      }
      endpointsError = error?.message || "Failed to load endpoints"
      endpointOptions = []
      selectedEndpointId = undefined
      dataStringCache = undefined
    } finally {
      if (requestId === loadRequestId) {
        endpointsLoading = false
      }
    }
  }

  const onFileChange = async (
    event: CustomEvent<(File | UIFile | undefined)[]>
  ) => {
    const [file] = event.detail ?? []
    $data.file = file instanceof File ? file : undefined
    lastTouched = "file"
    resetEndpoints()
    if ($data.file) {
      await triggerEndpointLoad()
    }
  }

  const onRawChange = async () => {
    lastTouched = "raw"
    resetEndpoints()
    if ($data.raw?.trim()) {
      await triggerEndpointLoad()
    }
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

      const dataString = dataStringCache || (await getData())
      if (!dataString) {
        notifications.error("Import data is missing")
        return keepOpen
      }

      dataStringCache = dataString

      if (!datasourceId && !createDatasource) {
        throw new Error("No datasource id")
      }

      const body: ImportRestQueryRequest = {
        data: dataString,
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
  cancelText={isTemplateDatasource ? "Cancel" : "Back"}
  size="L"
  disabled={confirmDisabled}
>
  <Layout noPadding>
    {#if isTemplateDatasource}
      <div class="template-modal">
        <div class="endpoint-heading">
          <IntegrationIcon
            iconUrl={templateIcon || datasource?.uiMetadata?.iconUrl}
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
          <TextArea
            label="Description"
            value={templateEndpointDescription}
            readonly
            placeholder="No description provided"
            minHeight={120}
          />
        {:else}
          <Body size="XS">No actions were found for this template.</Body>
        {/if}
      </div>
    {:else}
      <Heading size="S">Import</Heading>
      <Body size="XS"
        >Import your rest collection using one of the options below</Body
      >
      <Tabs selected="File">
        <Tab title="File">
          <Dropzone
            gallery={false}
            value={$data.file ? [$data.file] : []}
            on:change={onFileChange}
            fileTags={[
              "OpenAPI 3.0",
              "OpenAPI 2.0",
              "Swagger 2.0",
              "cURL",
              "YAML",
              "JSON",
            ]}
            maximum={1}
          />
        </Tab>
        <Tab title="Raw Text">
          <TextArea
            bind:value={$data.raw}
            on:change={onRawChange}
            label={"Paste raw text"}
            placeholder={'e.g. curl --location --request GET "https://example.com"'}
          />
        </Tab>
      </Tabs>
      <div class="endpoint-select">
        <Heading size="S">Select endpoint</Heading>
        <Body size="XS"
          >Choose the endpoint you want to import from this template.</Body
        >
        {#if endpointsLoading}
          <div class="endpoint-loading">
            <ProgressCircle size="S" />
            <Body size="XS">Loading endpoints…</Body>
          </div>
        {:else if endpointsError}
          <InlineAlert
            type="error"
            header="Unable to load endpoints"
            message={endpointsError}
          />
        {:else if endpointOptions.length > 0}
          <Combobox
            label="Endpoint"
            value={selectedEndpointId}
            options={endpointOptions}
            on:change={onSelectEndpoint}
            getOptionValue={getEndpointId}
            getOptionLabel={formatEndpointLabel}
            helpText="Only one endpoint can be imported at a time."
          />
        {:else if dataStringCache}
          <Body size="XS">No endpoints were found in the provided template.</Body>
        {:else}
          <Body size="XS"
            >Add a file or paste a template to load available endpoints.</Body
          >
        {/if}
      </div>
    {/if}
  </Layout>
</ModalContent>

<style>
  .template-modal {
    display: grid;
    gap: 24px;
  }

  .endpoint-select {
    margin-top: 24px;
    display: grid;
    gap: 12px;
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
