<script lang="ts">
  import { functionsAvailable } from "@/stores/builder/functionsAvailability"
  import FunctionTrustNotice from "../FunctionTrustNotice.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { getErrorMessage } from "@/helpers/errors"
  import { builderStore } from "@/stores/builder"
  import { functionStore, toCapabilityInputs } from "@/stores/builder/functions"
  import { auth } from "@/stores/portal"
  import {
    Badge,
    Body,
    Button,
    Heading,
    Icon,
    notifications,
    ProgressCircle,
  } from "@budibase/bbui"
  import { Utils } from "@budibase/frontend-core"
  import type {
    FunctionBuildDiagnostic,
    FunctionQueryCapabilityInput,
    FunctionResponse,
  } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { debounce } from "lodash"
  import { onDestroy } from "svelte"
  import { createSaveCoordinator } from "../../saveCoordinator"
  import FunctionCodeEditor from "../FunctionCodeEditor.svelte"
  import FunctionLogs from "../FunctionLogs.svelte"
  import FunctionQueryEditor from "../FunctionQueryEditor.svelte"
  import { canManageFunctions } from "../permissions"

  let fn: FunctionResponse | undefined
  let loading = true
  let error = ""
  let currentLoad: Promise<FunctionResponse> | undefined
  let source = ""
  let savedSource = ""
  let diagnostics: FunctionBuildDiagnostic[] = []
  let validating = false
  let validationFailed = false
  let saving = false
  let building = false
  let queriesDirty = false
  let actionError = ""
  let validationRequest = 0
  let lastObservedSource = ""
  let pendingCapabilities: FunctionQueryCapabilityInput[] | undefined
  let destroyed = false
  let railTab: "Queries" | "Logs" = "Queries"

  $params
  $: functionId = $params.functionId
  $: available = $functionsAvailable
  $: enabled = available && canManageFunctions($auth.user, $params.workspaceId)
  $: if (enabled && functionId && fn?._id === functionId && !loading) {
    builderStore.selectResource(functionId)
  }
  $: sourceDirty = !!fn && source !== savedSource
  $: draftDirty = sourceDirty || queriesDirty
  $: buildDisabled =
    draftDirty ||
    fn?.readiness === "ready" ||
    saving ||
    building ||
    validating ||
    validationFailed ||
    diagnostics.length > 0
  $: displayedReadiness = draftDirty ? "build_required" : fn?.readiness

  const readinessLabels = {
    ready: "Ready",
    build_required: "Build required",
    build_failed: "Build failed",
  }

  const debouncedValidate = Utils.debounce(
    async (
      value: string,
      functionToValidate: FunctionResponse,
      request: number
    ) => {
      if (request !== validationRequest) {
        return
      }
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
          validationFailed = true
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
    validating = true
    if (validationFailed) {
      actionError = ""
    }
    validationFailed = false
    debouncedValidate(value, fn, request)
  }

  const validateChangedSource = (value: string) => {
    if (value !== lastObservedSource) {
      lastObservedSource = value
      validate(value)
      if (value !== savedSource) {
        debouncedSave()
      } else {
        debouncedSave.cancel()
      }
    }
  }

  $: if (fn) {
    validateChangedSource(source)
  }

  const fetchFunction = async (id: string): Promise<FunctionResponse> => {
    const [loadedFunction] = await Promise.all([
      functionStore.fetchOne(id),
      functionStore.fetchQueryCatalog(),
    ])
    return loadedFunction
  }

  const load = async (id: string) => {
    fn = undefined
    debouncedSave.cancel()
    pendingCapabilities = undefined
    queriesDirty = false
    saving = false
    loading = true
    error = ""
    actionError = ""
    const pendingLoad = fetchFunction(id)
    currentLoad = pendingLoad
    let loadedFunction: FunctionResponse | undefined
    let loadError = ""
    try {
      loadedFunction = await pendingLoad
    } catch (caughtError) {
      loadError = getErrorMessage(caughtError) || "Unable to load Function"
    }
    if (currentLoad !== pendingLoad) {
      return
    }
    fn = loadedFunction
    if (loadedFunction) {
      lastObservedSource = loadedFunction.source
      source = loadedFunction.source
      savedSource = loadedFunction.source
      diagnostics =
        loadedFunction.readiness === "build_failed"
          ? loadedFunction.lastBuild?.diagnostics || []
          : []
      validate(source)
    }
    error = loadError
    loading = false
  }

  const saveCapabilities = async (
    capabilities: FunctionQueryCapabilityInput[]
  ) => {
    if (!fn || fn._id !== functionId) {
      throw new Error("Function is no longer selected")
    }
    const id = fn._id
    debouncedSave.cancel()
    pendingCapabilities = capabilities
    if (!(await saveCoordinator.save())) {
      throw new Error(actionError || "Unable to save linked queries")
    }
    if (!destroyed && enabled && functionId === id) {
      validate(source)
      notifications.success("Linked queries saved")
    }
  }

  const persistDraft = async (): Promise<boolean> => {
    const functionToSave = fn
    if (!functionToSave?._rev || functionToSave._id !== functionId) {
      return false
    }
    const isCurrentFunction = () =>
      fn?._id === functionToSave._id && functionId === functionToSave._id
    const capabilitiesToSave = pendingCapabilities
    if (source === savedSource && !capabilitiesToSave) {
      return true
    }
    const sourceToSave = source
    saving = true
    if (!validationFailed) {
      actionError = ""
    }
    try {
      const savedFunction = await functionStore.save(functionToSave, {
        _rev: functionToSave._rev,
        name: functionToSave.name,
        source: sourceToSave,
        capabilities: capabilitiesToSave || toCapabilityInputs(functionToSave),
      })
      if (!isCurrentFunction()) {
        return true
      }
      fn = savedFunction
      savedSource = sourceToSave
      if (pendingCapabilities === capabilitiesToSave) {
        pendingCapabilities = undefined
      }
      if (source !== sourceToSave && !destroyed) {
        void saveCoordinator.save()
      }
      return true
    } catch (saveError) {
      if (!isCurrentFunction()) {
        return false
      }
      actionError = getErrorMessage(saveError) || "Unable to save Function"
      if (pendingCapabilities === capabilitiesToSave) {
        pendingCapabilities = undefined
      }
      return false
    } finally {
      if (isCurrentFunction()) {
        saving = false
      }
    }
  }

  const saveCoordinator = createSaveCoordinator(persistDraft)
  const debouncedSave = debounce(() => saveCoordinator.save(), 500)

  const build = async () => {
    if (!fn || buildDisabled) {
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

  $: if (enabled && functionId) {
    void load(functionId)
  } else {
    currentLoad = undefined
    fn = undefined
    loading = false
  }

  onDestroy(() => {
    currentLoad = undefined
    destroyed = true
    validationRequest += 1
    debouncedSave.cancel()
    if (source !== savedSource || saving) {
      void saveCoordinator.save()
    }
  })
</script>

<div class="wrapper">
  <TopBar
    breadcrumbs={[
      { text: "Functions", url: "../../home?type=function", tag: "Alpha" },
      { text: fn?.name || "Function" },
    ]}
    icon="function"
  />

  <div class="function-page">
    {#if !enabled}
      <div class="state" data-testid="function-permission-state">
        <Icon name="lock" size="L" />
        <Heading size="S">
          {available
            ? "You don't have permission to manage Functions"
            : "Functions are not available"}
        </Heading>
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
          <Body size="S" color="var(--spectrum-global-color-gray-600)"
            >{error}</Body
          >
        {/if}
        <Button secondary on:click={() => load(functionId)}>Retry</Button>
      </div>
    {:else}
      <FunctionTrustNotice />
      <div class="function-content">
        <main class="code-pane">
          <div class="code-header">
            <div class="code-title">
              <Body size="S" weight="500">Code</Body>
              {#if displayedReadiness}
                <Badge
                  size="S"
                  grey={displayedReadiness === "build_required"}
                  red={displayedReadiness === "build_failed"}
                  green={displayedReadiness === "ready"}
                >
                  {readinessLabels[displayedReadiness]}
                </Badge>
              {/if}
            </div>
            <div class="code-actions">
              <Button
                primary
                size="S"
                disabled={buildDisabled}
                on:click={build}
              >
                {building ? "Building..." : "Build"}
              </Button>
            </div>
          </div>

          {#if actionError}
            <div class="action-error" role="alert">
              <Icon name="warning-circle" size="S" />
              <span>{actionError}</span>
              <Button secondary size="S" on:click={() => load(functionId)}
                >Reload saved revision</Button
              >
            </div>
          {/if}
          <div class="editor-shell">
            <div class="editor-body">
              <FunctionCodeEditor
                bind:value={source}
                capabilities={fn.capabilities}
                {diagnostics}
              />
            </div>
            <div class="editor-footer">
              <span
                >TypeScript · {saving
                  ? "Saving..."
                  : "Changes save automatically"}</span
              >
              {#if validating}
                <span class="validating"
                  ><ProgressCircle size="S" /> Checking...</span
                >
              {/if}
            </div>
          </div>
          {#if diagnostics.length}
            <div class="diagnostics" aria-label="Function diagnostics">
              {#each diagnostics as diagnostic}
                <div class="diagnostic">
                  <code>{diagnostic.code}</code>
                  {#if diagnostic.line}
                    <span
                      >Line {diagnostic.line}{diagnostic.column
                        ? `:${diagnostic.column}`
                        : ""}</span
                    >
                  {/if}
                  <span>{diagnostic.message}</span>
                </div>
              {/each}
            </div>
          {/if}
        </main>

        <aside class="settings-rail" aria-label="Function settings">
          <div class="rail-tabs" role="tablist" aria-label="Function settings">
            <button
              type="button"
              role="tab"
              id="function-queries-tab"
              aria-selected={railTab === "Queries"}
              aria-controls="function-settings-panel"
              class:active={railTab === "Queries"}
              onclick={() => (railTab = "Queries")}>Queries</button
            >
            <button
              type="button"
              role="tab"
              id="function-logs-tab"
              aria-selected={railTab === "Logs"}
              aria-controls="function-settings-panel"
              class:active={railTab === "Logs"}
              onclick={() => (railTab = "Logs")}>Logs</button
            >
          </div>
          <div
            class="rail-content"
            role="tabpanel"
            id="function-settings-panel"
            aria-labelledby={railTab === "Queries"
              ? "function-queries-tab"
              : "function-logs-tab"}
          >
            <div hidden={railTab !== "Queries"}>
              <FunctionQueryEditor
                capabilities={fn.capabilities}
                catalog={$functionStore.queryCatalog}
                catalogLoading={$functionStore.catalogLoading}
                catalogError={$functionStore.catalogError}
                onRetry={() => functionStore.fetchQueryCatalog()}
                onSave={saveCapabilities}
                onDirtyChange={dirty => (queriesDirty = dirty)}
              />
            </div>
            {#if railTab === "Logs"}
              <FunctionLogs functionId={fn._id} compact />
            {/if}
          </div>
        </aside>
      </div>
    {/if}
  </div>
</div>

<style>
  .wrapper,
  .function-page,
  .code-pane,
  .settings-rail {
    display: flex;
    min-height: 0;
    flex-direction: column;
  }
  .wrapper,
  .function-page {
    height: 100%;
  }
  .function-page {
    flex: 1;
    overflow: hidden;
    background: var(--background);
  }
  .function-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    min-height: 0;
    flex: 1;
  }
  .code-pane {
    min-width: 0;
    gap: 10px;
    padding: 10px 12px 12px;
  }
  .code-header,
  .code-title,
  .code-actions,
  .validating,
  .action-error,
  .diagnostic {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .code-header {
    justify-content: space-between;
    min-height: 30px;
  }
  .code-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .editor-shell {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    background: var(--spectrum-global-color-gray-100);
  }
  .editor-body {
    min-height: 0;
    flex: 1;
  }
  .editor-body :global(.function-code-editor) {
    min-height: 100%;
    border: 0;
    border-radius: 0;
  }
  .editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 34px;
    padding: 0 var(--spacing-m);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
  .settings-rail {
    min-width: 0;
    border-left: 1px solid var(--spectrum-global-color-gray-200);
  }
  .rail-tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 2px 12px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }
  .rail-tabs button {
    padding: 4px 8px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--spectrum-global-color-gray-700);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }
  .rail-tabs button.active {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
  }
  .rail-content {
    min-height: 0;
    flex: 1;
    overflow: auto;
    padding: 20px 12px;
  }
  .action-error {
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-red-400);
    border-radius: var(--radius-m);
    color: var(--spectrum-global-color-red-700);
  }
  .action-error span {
    flex: 1;
  }
  .diagnostics {
    max-height: 150px;
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
  .state {
    display: flex;
    min-height: 320px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    text-align: center;
  }
  @media (max-width: 900px) {
    .function-content {
      grid-template-columns: minmax(0, 1fr) 300px;
    }
  }
</style>
