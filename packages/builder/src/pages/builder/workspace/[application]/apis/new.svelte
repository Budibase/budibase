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
    CollapsibleSearch,
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
    RestTemplateGroup,
    RestTemplateGroupName,
    GroupTemplateName,
    RestTemplateName,
    RestTemplateWithoutIcon,
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
  let templateGroupModal: Modal
  let selectedTemplate: RestTemplate | null = null
  let selectedTemplateGroup: RestTemplateGroup<RestTemplateGroupName> | null =
    null
  let selectedGroupTemplateName: GroupTemplateName | null = null
  let selectedTemplateGroupItem: RestTemplateWithoutIcon<GroupTemplateName> | null =
    null
  let selectedTemplateGroupItemDescription = ""
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
  let templateSearchValue = ""
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
  $: templateGroupsList = $restTemplates.templateGroups || []
  $: groupedTemplateNames = new Set<RestTemplateName>(
    templateGroupsList.flatMap(group =>
      group.templates.map(template => template.name)
    )
  )
  $: restTemplatesList = ($restTemplates.templates || []).filter(
    template => !groupedTemplateNames.has(template.name)
  )
  $: normalizedTemplateSearch = templateSearchValue.trim().toLowerCase()
  $: filteredTemplateGroups = normalizedTemplateSearch
    ? templateGroupsList.filter(
        group =>
          group.name.toLowerCase().includes(normalizedTemplateSearch) ||
          group.templates.some(template =>
            template.name.toLowerCase().includes(normalizedTemplateSearch)
          )
      )
    : templateGroupsList
  $: filteredRestTemplates = normalizedTemplateSearch
    ? restTemplatesList.filter(template =>
        template.name.toLowerCase().includes(normalizedTemplateSearch)
      )
    : restTemplatesList
  $: verifiedRestTemplates = filteredRestTemplates.filter(
    template => template.verified
  )
  $: unverifiedRestTemplates = filteredRestTemplates.filter(
    template => !template.verified
  )
  $: verifiedTemplateGroups = filteredTemplateGroups.filter(
    group => group.verified
  )
  $: unverifiedTemplateGroups = filteredTemplateGroups.filter(
    group => !group.verified
  )
  $: verifiedTemplateOptions = [
    ...verifiedTemplateGroups.map(group => ({
      type: "group" as const,
      name: group.name,
      group,
    })),
    ...verifiedRestTemplates.map(template => ({
      type: "template" as const,
      name: template.name,
      template,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name))
  $: unverifiedTemplateOptions = [
    ...unverifiedTemplateGroups.map(group => ({
      type: "group" as const,
      name: group.name,
      group,
    })),
    ...unverifiedRestTemplates.map(template => ({
      type: "template" as const,
      name: template.name,
      template,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name))
  $: selectedTemplateGroupItem =
    selectedTemplateGroup && selectedGroupTemplateName
      ? selectedTemplateGroup.templates.find(
          template => template.name === selectedGroupTemplateName
        ) || null
      : null
  $: selectedTemplateGroupItemDescription =
    selectedTemplateGroupItem?.description || ""
  $: groupTemplateOptions = selectedTemplateGroup
    ? selectedTemplateGroup.templates.map(template => ({
        label: template.name,
        value: template.name,
        description: template.description,
      }))
    : []

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

  const selectTemplateGroup = (
    group: RestTemplateGroup<RestTemplateGroupName>
  ) => {
    selectedTemplateGroup = group
    selectedGroupTemplateName = group.templates[0]?.name || null
    templateGroupModal?.show()
  }

  const cancelGroupSelection = () => {
    selectedTemplateGroup = null
    selectedGroupTemplateName = null
  }

  const confirmGroupSelection = () => {
    if (!selectedTemplateGroup || !selectedGroupTemplateName) {
      notifications.error("Select a template")
      return
    }
    if (!selectedTemplateGroupItem) {
      notifications.error("Selected template could not be found.")
      return
    }
    templateGroupModal?.hide()
    selectTemplate({
      name: selectedTemplateGroupItem.name,
      description: selectedTemplateGroupItem.description,
      specs: selectedTemplateGroupItem.specs,
      icon: selectedTemplateGroup.icon,
      verified: selectedTemplateGroup.verified,
      operationsCount: selectedTemplateGroup.operationsCount,
    })
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
    <div class="template-actions">
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
      <div class="template-search">
        <CollapsibleSearch
          placeholder="Search templates"
          value={templateSearchValue}
          on:change={event => (templateSearchValue = event.detail)}
        />
      </div>
    </div>

    {#if normalizedTemplateSearch && !verifiedTemplateOptions.length && !unverifiedTemplateOptions.length}
      <p class="empty-state">No templates match your search.</p>
    {/if}

    {#if verifiedTemplateOptions.length}
      <div class="templates-header">
        <Body
          size="S"
          weight="500"
          color="var(--spectrum-global-color-gray-900)">Verified templates</Body
        >
      </div>
      <div class="options templateOptions">
        {#each verifiedTemplateOptions as option (option.name)}
          <RestTemplateOption
            on:click={() =>
              option.type === "group"
                ? selectTemplateGroup(option.group)
                : selectTemplate(option.template)}
            template={option.type === "group" ? option.group : option.template}
            disabled={templateDisabled}
          />
        {/each}
      </div>
    {/if}
    {#if unverifiedTemplateOptions.length}
      <div class="templates-header">
        <Body
          size="S"
          weight="500"
          color="var(--spectrum-global-color-gray-900)">Templates</Body
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
        {#each unverifiedTemplateOptions as option (option.name)}
          <RestTemplateOption
            on:click={() =>
              option.type === "group"
                ? selectTemplateGroup(option.group)
                : selectTemplate(option.template)}
            template={option.type === "group" ? option.group : option.template}
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

<Modal bind:this={templateGroupModal} on:hide={cancelGroupSelection}>
  {#if selectedTemplateGroup}
    <ModalContent
      size="M"
      confirmText="Select"
      cancelText="Cancel"
      onConfirm={confirmGroupSelection}
      onCancel={cancelGroupSelection}
      disabled={!selectedGroupTemplateName || templateLoading}
    >
      <Layout noPadding gap="S">
        <div class="endpoint-heading">
          <IntegrationIcon
            iconUrl={selectedTemplateGroup.icon}
            integrationType={restIntegration?.name || IntegrationTypes.REST}
            schema={restIntegration}
            size="32"
          />
        </div>
        <Heading size="S">{selectedTemplateGroup.name}</Heading>
        <Body size="M">Select a template to import:</Body>
        <Select
          label="Select category"
          options={groupTemplateOptions}
          bind:value={selectedGroupTemplateName}
          disabled={templateLoading}
        />
        {#if selectedTemplateGroupItemDescription}
          <DescriptionViewer
            description={selectedTemplateGroupItemDescription}
            label={undefined}
          />
        {/if}
      </Layout>
    </ModalContent>
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
      <div class="endpoint-modal">
        <div class="endpoint-heading">
          <IntegrationIcon
            iconUrl={pendingTemplate?.icon}
            integrationType={restIntegration?.name || IntegrationTypes.REST}
            schema={restIntegration}
            size="32"
          />
        </div>
        <Heading size="S">{pendingTemplate?.name}</Heading>
        <Body size="S">
          Select the action you want to import from {pendingTemplate?.name}:
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
      </div>
    </Layout>
  </ModalContent>
</Modal>

<style>
  .options {
    width: 100%;
    min-width: 100%;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, 235px);
    justify-content: flex-start;
    margin-bottom: 20px;
    max-width: calc(4 * 235px + 3 * 16px);
    margin-left: auto;
    margin-right: auto;
  }
  .templateOptions {
    margin-bottom: 20px;
  }
  .template-actions {
    width: 100%;
    min-width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 235px);
    gap: 16px;
    align-items: center;
    max-width: calc(4 * 235px + 3 * 16px);
    margin: 12px auto 24px auto;
  }
  .template-search {
    grid-column: -2 / -1;
    width: 235px;
    display: flex;
    justify-content: flex-end;
  }
  @media (max-width: 720px) {
    .template-actions {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    .template-search {
      width: 100%;
      justify-content: flex-start;
    }
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

  .endpoint-modal {
    display: grid;
    gap: 16px;
    min-width: 0;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .endpoint-modal > * {
    min-width: 0;
  }

  .endpoint-modal :global(.spectrum-Field) {
    width: 100%;
    max-width: 100%;
  }

  .endpoint-modal :global(.spectrum-FieldGroup),
  .endpoint-modal :global(.spectrum-InputGroup),
  .endpoint-modal :global(.spectrum-Textfield) {
    width: 100%;
    max-width: 100%;
  }

  .endpoint-modal :global(.description-viewer) {
    max-width: 100%;
  }

  .endpoint-modal :global(.description-content),
  .endpoint-modal :global(.description-content p),
  .endpoint-modal :global(.description-content a),
  .endpoint-modal :global(.description-content code),
  .endpoint-modal :global(.description-content pre) {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .endpoint-modal :global(.description-content pre),
  .endpoint-modal :global(.description-content code) {
    white-space: pre-wrap;
  }

  .endpoint-heading {
    display: flex;
    justify-content: flex-start;
  }
</style>
