<script lang="ts">
  import { goto, isActive } from "@roxi/routify"
  import type {
    ImportRestQueryInfoResponse,
    Datasource,
    UIInternalDatasource,
    DynamicVariable,
    EnrichedBinding,
  } from "@budibase/types"
  import { type UIWorkspaceConnection, AUTH_TYPE_OPTIONS } from "@/types"
  import { appStore } from "@/stores/builder/app"
  import {
    datasources,
    hasRestTemplate,
    getRestTemplateIdentifier,
  } from "@/stores/builder/datasources"
  import { sortedIntegrations as integrations } from "@/stores/builder/sortedIntegrations"
  import { IntegrationTypes } from "@/constants/backend"
  import { queries } from "@/stores/builder/queries"
  import { oauth2 } from "@/stores/builder/oauth2"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { licensing, environment } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import {
    getRestBindings,
    readableToRuntimeBinding,
    runtimeToReadableMap,
  } from "@/dataBinding"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import {
    Button,
    Input,
    Layout,
    Divider,
    Icon,
    TooltipType,
    TooltipPosition,
    Label,
    Select,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import { cloneDeep, isEqual } from "lodash"
  import { API } from "@/api"
  import HTTPAuthEditor from "./HTTPAuthEditor.svelte"
  import OAuth2Editor from "./OAuth2Editor.svelte"
  import ServerUrlInput from "./ServerUrlInput.svelte"
  import {
    RestAuthType,
    type RestAuthConfig,
    type BasicRestAuthConfig,
    type BearerRestAuthConfig,
    type RestTemplateId,
    OAuth2CredentialsMethod,
    OAuth2GrantType,
  } from "@budibase/types"

  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import { keyValueArrayToRecord } from "@/components/integration/query"
  import ViewDynamicVariables from "@/pages/builder/workspace/[application]/data/datasource/[datasourceId]/_components/panels/Variables/ViewDynamicVariables.svelte"
  import DeleteDataConfirmationModal from "@/components/backend/modals/DeleteDataConfirmationModal.svelte"

  export let selected: UIWorkspaceConnection | undefined

  $goto
  $isActive

  type HTTPRestAuthConfig = BasicRestAuthConfig | BearerRestAuthConfig
  type Mode = "auth" | "creds" | "advanced"

  // Form data
  interface ConnectionFormData {
    name: string
    baseUrl: string
    authConfigs: RestAuthConfig[]
    defaultHeaders: Record<string, string>
    staticVariables: Record<string, string>
    queryParams: Record<string, string>
    rejectUnauthorized: boolean
    downloadImages: boolean
  }

  let data: Partial<ConnectionFormData> = {}
  let originalData: Partial<ConnectionFormData> = {}
  let initialised = false
  let saving = false
  let mode: Mode = "auth"
  let errors: Record<string, string> = {}
  let openApiInfo: ImportRestQueryInfoResponse | undefined
  let addHeader: KeyValueBuilder<unknown>
  let addVariable: KeyValueBuilder<unknown>
  let addQueryParam: KeyValueBuilder<unknown>
  let headerFieldsCount = 0
  let variableFieldsCount = 0
  let queryParamFieldsCount = 0
  let authEditors: Array<HTTPAuthEditor | OAuth2Editor> = []
  let canAddConfig = true
  let deleteModal: DeleteDataConfirmationModal
  let restBindings: EnrichedBinding[] = []

  $: {
    $environment
    $licensing
    restBindings = getRestBindings()
  }
  $: datasource =
    selected?.source === "datasource"
      ? $datasources.list.find(ds => ds._id === selected.sourceId)
      : undefined

  $: if (
    isDatasource &&
    !isNewConnection &&
    datasource === undefined &&
    initialised
  ) {
    bb.settings("/connections/apis")
  }

  $: templateStaticVariableKeys = getTemplateStaticVariableKeys(
    datasource,
    openApiInfo
  )

  $: restIntegration = ($integrations || []).find(
    i => i.name === IntegrationTypes.REST
  )
  $: isDatasource = selected?.source === "datasource"
  $: isNewConnection = isDatasource && !datasource
  $: hasChanges =
    isNewConnection || (initialised && !isEqual(data, originalData))

  $: isOAuth2 = selected?.source === "oauth2"
  $: oauth2Cfg = isOAuth2
    ? $oauth2.configs.find(c => c._id === selected?.sourceId)
    : undefined

  $: template =
    restTemplates.get(getRestTemplateIdentifier(datasource)) ||
    (selected?.templateId
      ? restTemplates.getById(selected.templateId)
      : undefined)
  $: spec = template?.specs?.[0]

  $: if (spec?.url && !openApiInfo) {
    ;(async () => {
      openApiInfo = await loadOpenApiInfo()
    })()
  }

  $: seedTemplateStaticVariables(openApiInfo)
  $: init(initialised, selected)

  // Unified auth config list and type options based on source
  $: authConfigs = data.authConfigs || []
  $: authTypeOptions = AUTH_TYPE_OPTIONS.filter(
    o => o.value !== RestAuthType.API_KEY
  )
  $: if (authConfigs.length === 0) {
    canAddConfig = true
  }

  $: parsedHeaders = runtimeToReadableMap(restBindings, data.defaultHeaders)
  $: parsedQueryParams = runtimeToReadableMap(restBindings, data.queryParams)

  const init = (
    isInitialised: boolean,
    connection: UIWorkspaceConnection | undefined
  ) => {
    if (isInitialised || !connection) {
      return
    }
    initialised = true

    let authConfigs: RestAuthConfig[]
    if (connection.source === "oauth2") {
      const cfg = $oauth2.configs.find(c => c._id === connection.sourceId)
      authConfigs = cfg
        ? [
            cloneDeep({
              ...cfg,
              type: RestAuthType.OAUTH2,
            }) as RestAuthConfig,
          ]
        : []
    } else {
      const existingAuth = cloneDeep(connection.auth || []) as RestAuthConfig[]
      authConfigs = existingAuth
    }

    const ds =
      connection.source === "datasource"
        ? $datasources.list.find(d => d._id === connection.sourceId)
        : undefined

    const initial: Partial<ConnectionFormData> = {
      name: connection.name || "",
      baseUrl: ds?.config?.url || "",
      authConfigs,
      defaultHeaders: cloneDeep(connection.props?.headers || {}),
      staticVariables: cloneDeep(connection.props?.staticVariables || {}),
      queryParams: cloneDeep(connection.props?.query || {}),
      rejectUnauthorized: ds?.config?.rejectUnauthorized ?? true,
      downloadImages: ds?.config?.downloadImages ?? true,
    }
    data = { ...initial }
    originalData = cloneDeep(initial)
    headerFieldsCount = Object.keys(initial.defaultHeaders || {}).length
    variableFieldsCount = Object.keys(initial.staticVariables || {}).length
    queryParamFieldsCount = Object.keys(initial.queryParams || {}).length
  }

  async function loadOpenApiInfo() {
    if (spec?.url) {
      return API.getImportInfo({ url: spec.url })
    }
  }

  const asHTTPAuth = (auth: RestAuthConfig): HTTPRestAuthConfig =>
    auth as HTTPRestAuthConfig

  // This ensures that api template variables make it into the
  // list as locked keys
  const seedTemplateStaticVariables = (
    apiInfo: ImportRestQueryInfoResponse | undefined
  ) => {
    if (!apiInfo?.staticVariables) {
      return
    }
    const existing = data.staticVariables || {}
    let changed = false
    for (const [key, value] of Object.entries(apiInfo.staticVariables)) {
      if (existing[key] == null) {
        existing[key] = value
        changed = true
      }
    }
    if (changed) {
      data.staticVariables = { ...existing }
      data = { ...data }
    }
  }

  const onAuthConfigUpdate = (updated: RestAuthConfig) => {
    const index = (data.authConfigs || []).findIndex(c => c._id === updated._id)
    if (index >= 0 && data.authConfigs) {
      data.authConfigs[index] = updated
      data = { ...data }
    }
    if (!canAddConfig) {
      canAddConfig = authEditors
        .filter(Boolean)
        .every(e => e.getConfig() !== null)
    }
  }

  const onAuthTypeChange = (authType: RestAuthType, existingId: string) => {
    if (!authType) return
    const newCfg = createAuthConfig(authType)
    if (!newCfg) {
      notifications.error(`Invalid auth type: ${authType}`)
      return
    }
    newCfg._id = existingId
    data.authConfigs = (data.authConfigs || []).map(c =>
      c._id === existingId ? newCfg : c
    )
    data = { ...data }
  }

  const addAuthConfig = (authType: RestAuthType) => {
    if (!authType) return
    if (!validateAuth()) {
      canAddConfig = false
      return
    }
    canAddConfig = true

    let newConfig = createAuthConfig(authType)
    if (!newConfig) {
      notifications.error(`Invalid auth type: ${authType}`)
      return
    }
    data.authConfigs = [...(data.authConfigs || []), newConfig]
    data = { ...data }
  }

  const createAuthConfig = (
    authType: RestAuthType
  ): RestAuthConfig | undefined => {
    const _id = crypto.randomUUID()
    const name = ""

    switch (authType) {
      case RestAuthType.BASIC:
        return {
          _id,
          name,
          type: RestAuthType.BASIC,
          config: { username: "", password: "" },
        }
      case RestAuthType.BEARER:
        return {
          _id,
          name,
          type: RestAuthType.BEARER,
          config: { token: "" },
        }
      case RestAuthType.OAUTH2:
        return {
          _id,
          name,
          type: RestAuthType.OAUTH2,
          url: "",
          clientId: "",
          clientSecret: "",
          method: OAuth2CredentialsMethod.HEADER,
          grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
        }
    }
  }

  const deleteAuthConfig = (id: string) => {
    if (!id) return
    data.authConfigs = (data.authConfigs || []).filter(c => c._id !== id)
    data = { ...data }
  }

  const createNewDatasource = async () => {
    if (!restIntegration) {
      throw new Error("REST integration unavailable")
    }
    const ds = await datasources.create({
      integration: restIntegration,
      config: {
        url: data.baseUrl || "",
        authConfigs: data.authConfigs || [],
        staticVariables: data.staticVariables || {},
        defaultHeaders: data.defaultHeaders || {},
        defaultQueryParameters: data.queryParams || {},
        rejectUnauthorized: data.rejectUnauthorized ?? true,
        downloadImages: data.downloadImages ?? true,
      },
      name: data.name,
      restTemplateId: selected?.templateId as RestTemplateId | undefined,
    })
    originalData = cloneDeep(data)
    notifications.success("Connection created")
    workspaceConnections.select(ds._id!)
  }

  const updateDatasource = async () => {
    if (!datasource?._id || !datasource?._rev) {
      return
    }
    const { entities, ...rest } = datasource
    const updatedDatasource: Datasource = {
      ...rest,
      name: data.name!,
      config: {
        ...datasource.config,
        url: data.baseUrl,
        authConfigs: data.authConfigs,
        staticVariables: data.staticVariables,
        defaultHeaders: data.defaultHeaders,
        defaultQueryParameters: data.queryParams,
        rejectUnauthorized: data.rejectUnauthorized,
        downloadImages: data.downloadImages,
      },
    }

    const resp = await API.updateDatasource(updatedDatasource)
    datasources.replaceDatasource(resp.datasource._id!, resp.datasource)
    originalData = cloneDeep(data)
    notifications.success("API updated")
  }

  const validateAuth = (): boolean => {
    return authEditors
      .filter(Boolean)
      .every(e => e.getConfig({ showErrors: true }) !== null)
  }

  // Legacy oauth2 doc updates
  const updateOAuth2 = async () => {
    const oauth2Index = (data.authConfigs || []).findIndex(
      c => c.type === RestAuthType.OAUTH2
    )
    const oauth2Editor =
      oauth2Index >= 0 ? (authEditors[oauth2Index] as OAuth2Editor) : undefined
    const config = oauth2Editor?.getConfig({ showErrors: true })
    if (!config || !oauth2Cfg?._id) {
      return
    }
    await oauth2.edit({
      ...config,
      _id: oauth2Cfg._id,
      _rev: oauth2Cfg._rev,
    })
    originalData = cloneDeep(data)
    notifications.success("Settings saved")
  }

  const validateName = () => {
    const newErrors = { ...errors }
    if (!data.name) {
      newErrors.name = "Name is required"
    } else if (
      $datasources.list.some(
        ds => ds.name === data.name && ds._id !== datasource?._id
      )
    ) {
      newErrors.name = "A connection with this name already exists"
    } else {
      delete newErrors.name
    }
    errors = newErrors
  }

  const onSave = async () => {
    validateName()
    errors = { ...errors }
    if (Object.keys(errors).length > 0 || !validateAuth()) {
      return
    }
    saving = true
    try {
      if (isDatasource && !datasource) {
        await createNewDatasource()
      } else if (isDatasource) {
        await updateDatasource()
      } else if (isOAuth2) {
        await updateOAuth2()
      }
    } catch (e: any) {
      notifications.error("Failed to save connection")
    } finally {
      saving = false
    }
  }

  const openInApiEditor = () => {
    if (!datasource?._id) {
      return
    }
    const firstQuery = $queries.list.find(
      q => q.datasourceId === datasource!._id
    )
    const targetPath = firstQuery?._id
      ? `/builder/workspace/${$appStore.appId}/apis/query/${firstQuery._id}`
      : `/builder/workspace/${$appStore.appId}/apis/query/new/${datasource._id}`
    if ($isActive(targetPath)) {
      bb.hideSettings()
      return
    }
    $goto(targetPath)
  }

  const onHeadersChange = (
    headers: Array<{ name: string; value: unknown }>
  ) => {
    headerFieldsCount = headers.length
    data.defaultHeaders = keyValueArrayToRecord(headers, {
      filterEmpty: true,
      transform: value => readableToRuntimeBinding(restBindings, value),
    })
    data = { ...data }
  }

  const onStaticVariablesChange = (
    variables: Array<{ name: string; value: unknown }>
  ) => {
    variableFieldsCount = variables.length
    data.staticVariables = keyValueArrayToRecord(variables, {
      filterEmpty: true,
    })
    data = { ...data }
  }

  const onQueryParamsChange = (
    params: Array<{ name: string; value: unknown }>
  ) => {
    queryParamFieldsCount = params.length
    data.queryParams = keyValueArrayToRecord(params, {
      filterEmpty: true,
      transform: value => readableToRuntimeBinding(restBindings, value),
    })
    data = { ...data }
  }

  const getTemplateStaticVariableKeys = (
    ds: Datasource | UIInternalDatasource | undefined,
    apiInfo: ImportRestQueryInfoResponse | undefined
  ): string[] => {
    if (ds && hasRestTemplate(ds)) {
      const configured: string[] = ds?.config?.templateStaticVariables || []
      return Array.from(new Set(configured.filter(Boolean)))
    }
    if (apiInfo?.staticVariables) {
      return Object.keys(apiInfo.staticVariables).filter(Boolean)
    }
    return []
  }
</script>

<Layout noPadding>
  <Layout gap="S" noPadding>
    <RouteActions>
      <div class="route-buttons">
        {#if isDatasource && !isNewConnection}
          <Button on:click={() => deleteModal.show()} quiet overBackground
            >Delete</Button
          >
          <Button size="M" on:click={openInApiEditor} secondary>
            Open in API Editor
          </Button>
        {/if}
        <Button size="M" disabled={!hasChanges || saving} on:click={onSave} cta>
          Save
        </Button>
      </div>
    </RouteActions>
    <div class="details-box">
      <div class="details-box-name">
        <Input
          label="Display name"
          placeholder="Type here..."
          value={data.name}
          on:change={e => {
            data.name = e.detail
            data = { ...data }
          }}
          on:blur={validateName}
          error={errors.name}
          required
        />
      </div>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="nav">
      <div
        class="nav-tab"
        class:match={mode === "auth"}
        on:click={() => (mode = "auth")}
      >
        Authentication
      </div>

      {#if !isOAuth2}
        <div
          class="nav-tab"
          class:match={mode === "creds"}
          on:click={() => (mode = "creds")}
        >
          Credentials
        </div>
      {/if}
      {#if isDatasource}
        <div
          class="nav-tab"
          class:match={mode === "advanced"}
          on:click={() => (mode = "advanced")}
        >
          Advanced
        </div>
      {/if}
    </div>
    <div>
      {#if mode === "auth"}
        <Layout gap="S" noPadding>
          <div class="auth-box">
            {#each authConfigs as auth, i (auth._id + auth.type)}
              <div class="auth-box-item" class:first={i === 0}>
                <Layout gap="S" noPadding>
                  <Select
                    label="Type"
                    value={auth.type}
                    placeholder={false}
                    on:change={e => onAuthTypeChange(e.detail, auth._id!)}
                    options={authTypeOptions}
                    required
                  />
                  {#if auth.type === RestAuthType.BASIC || auth.type === RestAuthType.BEARER}
                    <HTTPAuthEditor
                      bind:this={authEditors[i]}
                      config={asHTTPAuth(auth)}
                      existingConfigs={authConfigs
                        .filter(
                          c =>
                            c.type === RestAuthType.BASIC ||
                            c.type === RestAuthType.BEARER
                        )
                        .map(asHTTPAuth)}
                      on:update={e => onAuthConfigUpdate(e.detail)}
                    />
                  {:else if auth.type === RestAuthType.OAUTH2}
                    <OAuth2Editor
                      bind:this={authEditors[i]}
                      config={auth}
                      existingConfigs={authConfigs.filter(
                        c => c.type === RestAuthType.OAUTH2
                      )}
                      on:update={e => onAuthConfigUpdate(e.detail)}
                    />
                  {/if}
                  {#if isDatasource}
                    <div>
                      <Button
                        quiet
                        overBackground
                        on:click={() => auth._id && deleteAuthConfig(auth._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  {/if}
                </Layout>
              </div>
            {/each}
          </div>

          {#if isDatasource}
            <div>
              <Button
                quiet
                secondary
                disabled={!canAddConfig}
                on:click={() => addAuthConfig(RestAuthType.BASIC)}
              >
                Add authentication
              </Button>
            </div>
          {/if}
        </Layout>
      {:else if mode === "advanced"}
        <div class="details-box">
          <div class="settings-item first">
            <div class="settings-item-text">
              <span>Reject Unauthorized</span>
              <span class="settings-item-blurb">
                Reject requests to servers with invalid or self-signed SSL
                certificates.
              </span>
            </div>
            <Toggle
              value={data.rejectUnauthorized ?? true}
              on:change={e => {
                data.rejectUnauthorized = e.detail
                data = { ...data }
              }}
            />
          </div>
          <div class="settings-item">
            <div class="settings-item-text">
              <span>Download images</span>
              <span class="settings-item-blurb"
                >Download and return image responses as base64 data.</span
              >
            </div>
            <Toggle
              value={data.downloadImages ?? true}
              on:change={e => {
                data.downloadImages = e.detail
                data = { ...data }
              }}
            />
          </div>
        </div>
      {:else}
        <Layout gap="M" noPadding>
          <Divider noMargin noGrid size="S" />
          <ServerUrlInput
            label="Base URL"
            value={data.baseUrl ?? ""}
            servers={openApiInfo?.servers ?? []}
            on:change={e => {
              data.baseUrl = e.detail
              data = { ...data }
            }}
          />
          <Layout gap="XXS" noPadding>
            <div class="prop-table-header">
              <Label>URL parameters</Label>
              <div class="icon-wrap">
                <Icon
                  name="plus"
                  hoverable
                  on:click={() => addQueryParam.addEntry()}
                  tooltip="Add"
                  tooltipType={TooltipType.Info}
                  tooltipPosition={TooltipPosition.Top}
                ></Icon>
              </div>
            </div>
            {#if Object.keys(parsedQueryParams || {}).length === 0 && queryParamFieldsCount === 0}
              <div class="add-entry-placeholder">
                No URL parameters configured
              </div>
            {/if}
            <KeyValueBuilder
              bind:this={addQueryParam}
              object={parsedQueryParams}
              on:change={evt => onQueryParamsChange(evt.detail.fields)}
              noAddButton
              bindings={restBindings}
              drawerForceModal
              drawerZIndex={1003}
            />
          </Layout>
          <Layout gap="XXS" noPadding>
            <div class="prop-table-header">
              <Label>Headers</Label>
              <div class="icon-wrap">
                <Icon
                  name="plus"
                  hoverable
                  on:click={() => addHeader.addEntry()}
                  tooltip="Add"
                  tooltipType={TooltipType.Info}
                  tooltipPosition={TooltipPosition.Top}
                ></Icon>
              </div>
            </div>
            {#if Object.keys(parsedHeaders || {}).length === 0 && headerFieldsCount === 0}
              <div class="add-entry-placeholder">No headers configured</div>
            {/if}
            <KeyValueBuilder
              bind:this={addHeader}
              object={parsedHeaders}
              on:change={evt => onHeadersChange(evt.detail.fields)}
              noAddButton
              bindings={restBindings}
              drawerForceModal
              drawerZIndex={1003}
            />
          </Layout>
          <Layout gap="XXS" noPadding>
            <div class="prop-table-header">
              <Label>Static Variables</Label>
              <div class="icon-wrap">
                <Icon
                  name="plus"
                  hoverable
                  on:click={() => addVariable.addEntry()}
                  tooltip="Add"
                  tooltipType={TooltipType.Info}
                  tooltipPosition={TooltipPosition.Top}
                ></Icon>
              </div>
            </div>
            {#if Object.keys(data.staticVariables || {}).length === 0 && variableFieldsCount === 0}
              <div class="add-entry-placeholder">No variables configured</div>
            {/if}
            <KeyValueBuilder
              bind:this={addVariable}
              name="Variable"
              keyPlaceholder="Name"
              object={data.staticVariables || {}}
              lockedKeys={templateStaticVariableKeys}
              on:change={evt => onStaticVariablesChange(evt.detail.fields)}
              noAddButton
            />
          </Layout>
          {#if isDatasource && datasource}
            <Layout gap="XXS" noPadding>
              <div class="prop-table-header">
                <Label>Dynamic Variables</Label>
              </div>
              <ViewDynamicVariables
                {datasource}
                onRowClick={(dv: DynamicVariable) => {
                  bb.hideSettings()
                  $goto(
                    `/builder/workspace/${$appStore.appId}/apis/query/${dv.queryId}`
                  )
                }}
              />
            </Layout>
          {/if}
        </Layout>
      {/if}
    </div>
  </Layout>
</Layout>

<DeleteDataConfirmationModal
  bind:this={deleteModal}
  source={datasource}
  onDeleted={() => bb.settings("/connections/apis")}
/>

<style>
  .icon-wrap {
    width: 20px;
  }
  .prop-table-header {
    display: flex;
    justify-content: space-between;
  }
  .nav {
    display: flex;
    gap: var(--spacing-l);
  }
  .nav-tab {
    position: relative;
    display: flex;
    cursor: pointer;
    align-items: center;
    gap: var(--spacing-s);
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
    font-size: 14px;
  }

  .nav-tab:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .match {
    color: var(--spectrum-global-color-gray-900);
  }

  .route-buttons {
    display: flex;
    gap: var(--spacing-xl);
  }

  .auth-box {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-m);
  }

  .auth-box-item {
    padding: var(--spacing-l);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  .auth-box-item.first {
    border-top: none;
  }

  .details-box {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-m);
    overflow: hidden;
  }

  .details-box-name {
    padding: var(--spacing-l);
  }

  .details-box-name :global(label) {
    margin-top: 0;
    padding-top: 0;
  }

  .settings-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-m) var(--spacing-l);
    gap: var(--spacing-xl);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  .settings-item.first {
    border-top: none;
  }

  .settings-item-text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    font-size: var(--font-size-s);
  }

  .settings-item-blurb {
    font-size: var(--font-size-xs);
    color: var(--spectrum-global-color-gray-600);
  }

  .settings-item :global(.spectrum-Switch) {
    margin-right: 0;
  }

  .add-entry-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: var(--border-radius-s);
    background: transparent;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
