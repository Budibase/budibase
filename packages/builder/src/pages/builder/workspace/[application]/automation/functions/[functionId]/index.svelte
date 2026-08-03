<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import { getErrorMessage } from "@/helpers/errors"
  import { appStore, builderStore, functionStore } from "@/stores/builder"
  import { admin, auth, featureFlags } from "@/stores/portal"
  import {
    Badge,
    Body,
    Button,
    Heading,
    Icon,
    notifications,
    ProgressCircle,
    Tab,
    Tabs,
  } from "@budibase/bbui"
  import { Utils } from "@budibase/frontend-core"
  import type {
    FunctionBuildDiagnostic,
    FunctionQueryCapabilityInput,
    FunctionResponse,
  } from "@budibase/types"
  import { FeatureFlag } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { onDestroy, onMount } from "svelte"
  import FunctionCodeEditor from "../FunctionCodeEditor.svelte"
  import FunctionLogs from "../FunctionLogs.svelte"
  import FunctionQueryEditor from "../FunctionQueryEditor.svelte"
  import FunctionRuntimeNotice from "../FunctionRuntimeNotice.svelte"
  import { isFunctionClientGateOpen } from "../availability"
  import { canManageFunctions } from "../permissions"

  let fn: FunctionResponse | undefined
  let loading = true
  let error = ""
  let source = ""
  let savedSource = ""
  let diagnostics: FunctionBuildDiagnostic[] = []
  let validating = false
  let saving = false
  let building = false
  let queriesDirty = false
  let actionError = ""
  let validationRequest = 0
  let selectedTab = "Code"

  $params
  $: functionId = $params.functionId
  $: enabled = $featureFlags[FeatureFlag.FUNCTIONS]
  $: clientGateOpen = isFunctionClientGateOpen({
    featureEnabled: enabled,
    cloud: $admin.cloud,
  })
  $: hasPermission = canManageFunctions($auth.user, $appStore.appId)
  $: availability = clientGateOpen ? $functionStore.availability : "unavailable"
  $: builderStore.selectResource(functionId)
  $: sourceDirty = !!fn && source !== savedSource
  $: draftDirty = sourceDirty || queriesDirty
  $: displayedReadiness = draftDirty ? "build_required" : fn?.readiness

  const readinessLabels = {
    ready: "Ready",
    build_required: "Build required",
    build_failed: "Build failed",
  }

  const toCapabilityInputs = (value: FunctionResponse) =>
    value.capabilities.map(capability => ({
      queryId: capability.queryId,
      datasourceAlias: capability.datasourceAlias,
      queryAlias: capability.queryAlias,
    }))

  const debouncedValidate = Utils.debounce(
    async (
      value: string,
      functionToValidate: FunctionResponse,
      request: number
    ) => {
      validating = true
      try {
        const response = await functionStore.compile({
          functionId: functionToValidate._id,
          name: functionToValidate.name,
          source: value,
          capabilities: toCapabilityInputs(functionToValidate),
        })
        if (request === validationRequest) {
          diagnostics = response.diagnostics
        }
      } catch (validationError) {
        if (request === validationRequest) {
          actionError =
            getErrorMessage(validationError) || "Unable to validate Function"
        }
      } finally {
        if (request === validationRequest) {
          validating = false
        }
      }
    },
    500
  )

  const validate = (value: string) => {
    if (!fn) {
      return
    }
    const request = ++validationRequest
    debouncedValidate(value, fn, request)
  }

  $: if (fn) {
    validate(source)
  }

  const load = async () => {
    loading = true
    error = ""
    try {
      const [loadedFunction] = await Promise.all([
        functionStore.fetchOne(functionId),
        functionStore.fetchQueryCatalog(),
      ])
      fn = loadedFunction
      source = loadedFunction.source
      savedSource = loadedFunction.source
      diagnostics = loadedFunction.lastBuild?.diagnostics || []
    } catch (loadError) {
      error = getErrorMessage(loadError) || "Unable to load Function"
    } finally {
      loading = false
    }
  }

  const initialise = async (force = false) => {
    if (!clientGateOpen || !hasPermission) {
      loading = false
      return
    }
    if (await functionStore.fetchStatus({ force })) {
      await load()
    } else {
      loading = false
    }
  }

  const saveCapabilities = async (
    capabilities: FunctionQueryCapabilityInput[]
  ) => {
    if (!fn?._rev) {
      throw new Error("Function revision is missing")
    }
    fn = await functionStore.save(fn, {
      _rev: fn._rev,
      name: fn.name,
      source: fn.source,
      capabilities,
    })
    diagnostics = []
    validate(source)
    notifications.success("Linked queries saved")
  }

  const saveSource = async () => {
    if (!fn?._rev || saving || !sourceDirty) {
      return
    }
    saving = true
    actionError = ""
    try {
      fn = await functionStore.save(fn, {
        _rev: fn._rev,
        name: fn.name,
        source,
        capabilities: toCapabilityInputs(fn),
      })
      savedSource = fn.source
      notifications.success("Function draft saved")
    } catch (saveError) {
      actionError = getErrorMessage(saveError) || "Unable to save Function"
    } finally {
      saving = false
    }
  }

  const build = async () => {
    if (!fn || draftDirty || building) {
      return
    }
    building = true
    actionError = ""
    try {
      fn = await functionStore.build(fn)
      diagnostics = fn.lastBuild?.diagnostics || []
      if (fn.readiness === "ready") {
        notifications.success("Function build succeeded")
      } else {
        notifications.error("Function build failed")
      }
    } catch (buildError) {
      actionError = getErrorMessage(buildError) || "Unable to build Function"
    } finally {
      building = false
    }
  }

  onMount(() => {
    initialise()
  })

  onDestroy(() => {
    validationRequest += 1
  })
</script>

<div class="wrapper">
  <TopBar
    breadcrumbs={[
      { text: "Automations", url: "../../" },
      { text: "Functions", url: "../" },
      { text: fn?.name || "Function" },
    ]}
    icon="code"
  />

  <main class="function-page">
    {#if !clientGateOpen || availability === "unavailable"}
      <div class="state" data-testid="function-unavailable-state">
        <Icon name="lock" size="L" />
        <Heading size="S">Functions are not available</Heading>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Functions require an enabled self-hosted installation and product
          rollout.
        </Body>
      </div>
    {:else if !hasPermission}
      <div class="state" data-testid="function-permission-state">
        <Icon name="lock" size="L" />
        <Heading size="S">You don't have permission to manage Functions</Heading
        >
      </div>
    {:else if availability === "unknown" || availability === "checking"}
      <div class="state" data-testid="function-availability-loading">
        <ProgressCircle size="M" />
        <Body size="S">Checking Functions availability...</Body>
      </div>
    {:else if availability === "error"}
      <div class="state" data-testid="function-availability-error" role="alert">
        <Icon name="warning-circle" size="L" />
        <Heading size="S">Unable to check Functions availability</Heading>
        {#if $functionStore.runnerStatusError}
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            {$functionStore.runnerStatusError}
          </Body>
        {/if}
        <Button secondary on:click={() => initialise(true)}>Retry</Button>
      </div>
    {:else if loading}
      <div class="state" data-testid="function-loading-state">
        <ProgressCircle size="M" />
        <Body size="S">Loading Function...</Body>
      </div>
    {:else if error || !fn}
      <div class="state" data-testid="function-error-state">
        <Icon name="warning-circle" size="L" />
        <Heading size="S">Unable to load Function</Heading>
        {#if error}
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            {error}
          </Body>
        {/if}
        <Button secondary on:click={load}>Retry</Button>
      </div>
    {:else}
      <div class="heading">
        <div>
          <div class="title">
            <Heading size="L">{fn.name}</Heading>
            {#if displayedReadiness}
              <Badge
                grey={displayedReadiness === "build_required"}
                red={displayedReadiness === "build_failed"}
                green={displayedReadiness === "ready"}
              >
                {readinessLabels[displayedReadiness]}
              </Badge>
            {/if}
          </div>
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            {selectedTab === "Code"
              ? "Write TypeScript, save the draft, then build its saved revision."
              : "Review sanitized development and published execution history."}
          </Body>
        </div>
        {#if selectedTab === "Code"}
          <div class="actions">
            <Button
              secondary
              disabled={!sourceDirty || saving || building}
              on:click={saveSource}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              primary
              disabled={draftDirty || saving || building}
              on:click={build}
            >
              {building ? "Building..." : "Build"}
            </Button>
          </div>
        {/if}
      </div>

      <FunctionRuntimeNotice
        status={$functionStore.runnerStatus}
        loading={$functionStore.runnerStatusLoading}
        error={$functionStore.runnerStatusError}
        onretry={() => functionStore.fetchStatus({ force: true })}
      />

      <Tabs
        noHorizPadding
        selected={selectedTab}
        on:select={event => (selectedTab = event.detail)}
      >
        <Tab title="Code">
          {#if actionError}
            <div class="action-error" role="alert">
              <Icon name="warning-circle" size="S" />
              <span>{actionError}</span>
              <Button secondary on:click={load}>Reload saved revision</Button>
            </div>
          {/if}

          <section class="source-editor">
            <div class="section-heading">
              <div>
                <Heading size="M">Source</Heading>
                <Body size="S" color="var(--spectrum-global-color-gray-600)">
                  TypeScript diagnostics are authoritative and do not prevent
                  saving.
                </Body>
              </div>
              {#if validating}
                <div class="validating">
                  <ProgressCircle size="S" />
                  <Body size="S">Checking...</Body>
                </div>
              {/if}
            </div>
            <FunctionCodeEditor
              bind:value={source}
              capabilities={fn.capabilities}
              {diagnostics}
            />
            {#if diagnostics.length}
              <div class="diagnostics" aria-label="Function diagnostics">
                {#each diagnostics as diagnostic}
                  <div class="diagnostic">
                    <code>{diagnostic.code}</code>
                    {#if diagnostic.line}
                      <span>
                        Line {diagnostic.line}{diagnostic.column
                          ? `:${diagnostic.column}`
                          : ""}
                      </span>
                    {/if}
                    <span>{diagnostic.message}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </section>

          <FunctionQueryEditor
            capabilities={fn.capabilities}
            catalog={$functionStore.queryCatalog}
            catalogLoading={$functionStore.catalogLoading}
            catalogError={$functionStore.catalogError}
            onRetry={() => functionStore.fetchQueryCatalog()}
            onSave={saveCapabilities}
            onDirtyChange={dirty => (queriesDirty = dirty)}
          />
        </Tab>
        <Tab title="Logs">
          <FunctionLogs functionId={fn._id} />
        </Tab>
      </Tabs>
    {/if}
  </main>
</div>

<style>
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .function-page {
    flex: 1;
    overflow: auto;
    padding: var(--spacing-xl);
  }
  .heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-l);
    margin-bottom: var(--spacing-xl);
  }
  .heading > div:first-child,
  .source-editor,
  .diagnostics {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
  .title,
  .actions,
  .section-heading,
  .validating,
  .action-error,
  .diagnostic {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .section-heading {
    align-items: flex-start;
    justify-content: space-between;
  }
  .section-heading > div:first-child {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .source-editor {
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-xl);
  }
  .action-error {
    margin-bottom: var(--spacing-l);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-red-400);
    border-radius: var(--radius-m);
    color: var(--spectrum-global-color-red-700);
  }
  .action-error span {
    flex: 1;
  }
  .diagnostics {
    max-height: 180px;
    overflow: auto;
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-red-300);
    border-radius: var(--radius-m);
    background: var(--spectrum-global-color-red-100);
  }
  .diagnostic {
    align-items: flex-start;
    color: var(--spectrum-global-color-red-800);
    font-size: 12px;
  }
  .diagnostic code,
  .diagnostic > span:first-of-type {
    flex: 0 0 auto;
  }
  .state {
    display: flex;
    min-height: 320px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    text-align: center;
  }
</style>
