<script lang="ts">
  import { goto, isActive } from "@roxi/routify"
  import type {
    ImportRestQueryInfoResponse,
    Datasource,
    UIInternalDatasource,
  } from "@budibase/types"
  import { type UIWorkspaceConnection, AUTH_TYPE_OPTIONS } from "@/types"
  import { appStore } from "@/stores/builder/app"
  import {
    datasources,
    hasRestTemplate,
    getRestTemplateIdentifier,
  } from "@/stores/builder/datasources"
  import { queries } from "@/stores/builder/queries"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import { oauth2 } from "@/stores/builder/oauth2"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { licensing } from "@/stores/portal/licensing"
  import { bb } from "@/stores/bb"
  import {
    getRestBindings,
    getEnvironmentBindings,
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
    notifications,
  } from "@budibase/bbui"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { cloneDeep, isEqual } from "lodash"
  import { API } from "@/api"
  import HTTPAuthEditor from "./HTTPAuthEditor.svelte"
  import OAuth2Editor from "./OAuth2Editor.svelte"
  import {
    RestAuthType,
    type WorkspaceAuthConfig,
    WorkspaceConnectionType,
    ApiKeyLocation,
    OAuth2CredentialsMethod,
    OAuth2GrantType,
  } from "@budibase/types"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import { keyValueArrayToRecord } from "@/components/integration/query"

  $goto
  $isActive

  type Mode = "auth" | "creds"

  export let selected: UIWorkspaceConnection | undefined
  export let create: boolean = false

  // Form data
  interface ConnectionFormData {
    name: string
    authConfigs: WorkspaceAuthConfig[]
    defaultHeaders: Record<string, string>
    staticVariables: Record<string, string>
    queryParams: Record<string, string>
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
  let restBindings = getRestBindings()
  let headerFieldsCount = 0
  let variableFieldsCount = 0
  let queryParamFieldsCount = 0
  let deleteConfirmDialog: ConfirmDialog
  let httpAuthEditor: HTTPAuthEditor
  let oauth2Editor: OAuth2Editor

  // Resolve datasource from selected if it's a datasource source type
  $: datasource =
    selected?.source === "datasource"
      ? $datasources.list.find(ds => ds._id === selected.sourceId)
      : undefined

  $: templateStaticVariableKeys = getTemplateStaticVariableKeys(
    datasource,
    openApiInfo
  )

  $: hasChanges = initialised && !isEqual(data, originalData)
  $: isDatasource = selected?.source === "datasource"
  $: isWorkspaceConnection = selected?.source === "workspace_connection"
  $: isOAuth2 = selected?.source === "oauth2"
  $: oauth2Cfg = isOAuth2
    ? $oauth2.configs.find(c => c._id === selected?.sourceId)
    : undefined
  $: isCreation = create || !selected?._id

  $: template =
    restTemplates.get(getRestTemplateIdentifier(datasource)) ||
    (selected?.templateId
      ? restTemplates.getById(selected.templateId)
      : undefined)

  $: isRestTemplate = !!template
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
  $: authTypeOptions = isDatasource
    ? AUTH_TYPE_OPTIONS.filter(
        o => o.value === RestAuthType.BASIC || o.value === RestAuthType.BEARER
      )
    : AUTH_TYPE_OPTIONS.filter(o => o.value !== RestAuthType.API_KEY)

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

    let authConfigs: WorkspaceAuthConfig[]
    if (connection.source === "oauth2") {
      const cfg = $oauth2.configs.find(c => c._id === connection.sourceId)
      authConfigs = cfg
        ? [
            cloneDeep({
              ...cfg,
              type: RestAuthType.OAUTH2,
            }) as WorkspaceAuthConfig,
          ]
        : []
    } else {
      const existingAuth = cloneDeep(
        connection.auth || []
      ) as WorkspaceAuthConfig[]
      authConfigs =
        existingAuth.length === 0 &&
        connection.source === "workspace_connection"
          ? [createAuthConfig(RestAuthType.BASIC)]
          : existingAuth
    }

    const initial: Partial<ConnectionFormData> = {
      name: connection.name || "",
      authConfigs,
      defaultHeaders: cloneDeep(connection.props?.headers || {}),
      staticVariables: cloneDeep(connection.props?.staticVariables || {}),
      queryParams: cloneDeep(connection.props?.query || {}),
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

  // This ensures that api template variables make it into the
  // list as locked keys
  const seedTemplateStaticVariables = (
    apiInfo: ImportRestQueryInfoResponse | undefined
  ) => {
    if (!apiInfo?.staticVariables || !isWorkspaceConnection) {
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

  const onAuthConfigUpdate = (updated: WorkspaceAuthConfig) => {
    const index = (data.authConfigs || []).findIndex(c => c._id === updated._id)
    if (index >= 0 && data.authConfigs) {
      data.authConfigs[index] = updated
      data = { ...data }
    }
  }

  const onAuthTypeChange = (authType: RestAuthType) => {
    if (!authType) return
    data.authConfigs = [createAuthConfig(authType)]
    data = { ...data }
  }

  const addAuthConfig = (authType: RestAuthType) => {
    if (!authType) return
    data.authConfigs = [...(data.authConfigs || []), createAuthConfig(authType)]
    data = { ...data }
  }

  const createAuthConfig = (authType: RestAuthType): WorkspaceAuthConfig => {
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
      case RestAuthType.API_KEY:
        return {
          _id,
          name,
          type: RestAuthType.API_KEY,
          config: { location: ApiKeyLocation.HEADER, key: "", value: "" },
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

  // Legacy datasource save
  const updateDatasource = async () => {
    if (!datasource?._id || !datasource?._rev) {
      return
    }
    const { entities, ...rest } = datasource
    const updatedDatasource: Datasource = {
      ...rest,
      config: {
        ...datasource.config,
        authConfigs: data.authConfigs,
        staticVariables: data.staticVariables,
        defaultHeaders: data.defaultHeaders,
      },
    }

    const resp = await API.updateDatasource(updatedDatasource)
    datasources.replaceDatasource(resp.datasource._id!, resp.datasource)
    originalData = cloneDeep(data)
    notifications.success("API updated")
  }

  // Workspace connection save
  const updateWorkspaceConnection = async () => {
    const payload = {
      name: data.name!,
      type: WorkspaceConnectionType.WORKSPACE_CONNECTION,
      templateId: selected?.templateId,
      templateVersion: selected?.templateVersion,
      auth: data.authConfigs || [],
      props: {
        headers: data.defaultHeaders || {},
        staticVariables: data.staticVariables || {},
        query: data.queryParams || {},
      },
    }
    if (isCreation) {
      const created = await workspaceConnections.create(payload)
      notifications.success("Connection created")
      bb.settings(`/connections/${created._id}`)
    } else {
      await workspaceConnections.edit({
        ...payload,
        _id: selected!._id!,
        _rev: selected!._rev!,
      })
      originalData = cloneDeep(data)
      notifications.success("Connection saved")
    }
  }

  const validateAuth = (): boolean => {
    const editor = httpAuthEditor || oauth2Editor
    return !editor || editor.getConfig({ showErrors: true }) !== null
  }

  // Legacy oauth2 doc updates
  const updateOAuth2 = async () => {
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

  const onSave = async () => {
    if (!validateAuth()) {
      return
    }
    saving = true
    try {
      if (isDatasource) {
        await updateDatasource()
      } else if (isWorkspaceConnection) {
        await updateWorkspaceConnection()
      } else if (isOAuth2) {
        await updateOAuth2()
      }
    } catch (e: any) {
      notifications.error("Failed to save connection")
    } finally {
      saving = false
    }
  }

  const onDelete = async () => {
    if (!selected?._id || !selected?._rev) {
      return
    }
    try {
      await workspaceConnections.delete(selected._id, selected._rev)
      notifications.success("Connection deleted")
      bb.settings("/connections")
    } catch (e: any) {
      notifications.error("Failed to delete connection")
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
        {#if isDatasource}
          <Button size="M" on:click={openInApiEditor} secondary>
            Open in API Editor
          </Button>
        {/if}
        <!-- Maybe a cancel button too for non-create?-->
        {#if isWorkspaceConnection && !isCreation}
          <Button
            size="M"
            quiet
            secondary
            on:click={() => deleteConfirmDialog.show()}
          >
            Delete
          </Button>
        {/if}
        <Button size="M" disabled={!hasChanges || saving} on:click={onSave} cta>
          Save
        </Button>
      </div>
    </RouteActions>
    <Input
      label="Display name"
      placeholder="Type here..."
      value={data.name}
      on:change={e => {
        data.name = e.detail
        data = { ...data }
      }}
      error={errors.name}
      required={!isDatasource && !isOAuth2}
      disabled={isDatasource || isOAuth2}
    />
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
    </div>
    <div>
      {#if mode === "auth"}
        <Layout gap="S" noPadding>
          <Divider noMargin noGrid size="S" />
          {#each authConfigs as auth (auth._id)}
            <Layout gap="S" noPadding>
              <Select
                label="Type"
                value={auth.type || null}
                placeholder="Select authentication type..."
                on:change={e => {
                  if (e.detail) {
                    if (isWorkspaceConnection) {
                      onAuthTypeChange(e.detail)
                    } else {
                      addAuthConfig(e.detail)
                    }
                  }
                }}
                options={authTypeOptions}
                disabled={isOAuth2 ||
                  (isWorkspaceConnection &&
                    !isCreation &&
                    authConfigs.length > 0)}
                required
              />
              {#if auth.type === RestAuthType.BASIC || auth.type === RestAuthType.BEARER}
                <HTTPAuthEditor
                  bind:this={httpAuthEditor}
                  config={auth}
                  existingConfigs={authConfigs.filter(
                    c =>
                      c.type === RestAuthType.BASIC ||
                      c.type === RestAuthType.BEARER
                  )}
                  on:update={e => onAuthConfigUpdate(e.detail)}
                />
              {:else if auth.type === RestAuthType.OAUTH2}
                <OAuth2Editor
                  bind:this={oauth2Editor}
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
                    secondary
                    on:click={() => auth._id && deleteAuthConfig(auth._id)}
                  >
                    Delete
                  </Button>
                </div>
                <Divider noMargin noGrid size="S" />
              {/if}
            </Layout>
          {/each}

          {#if isDatasource}
            <div>
              <Button
                quiet
                secondary
                on:click={() => addAuthConfig(RestAuthType.BASIC)}
              >
                Add config
              </Button>
            </div>
          {/if}
        </Layout>
      {:else}
        <Layout gap="M" noPadding>
          <Divider noMargin noGrid size="S" />
          {#if isRestTemplate}
            <Input
              label="Base URL"
              value={openApiInfo?.url + ""}
              disabled={!!openApiInfo}
            />
          {/if}
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
              bindings={$licensing.environmentVariablesEnabled
                ? getEnvironmentBindings()
                : []}
            />
          </Layout>
        </Layout>
      {/if}
    </div>
  </Layout>
</Layout>

<ConfirmDialog
  bind:this={deleteConfirmDialog}
  title="Delete connection"
  okText="Delete"
  onOk={onDelete}
  warning
>
  Are you sure you want to delete the connection <b>{data.name}</b>?
</ConfirmDialog>

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
