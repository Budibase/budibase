<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import { getErrorMessage } from "@/helpers/errors"
  import { builderStore, functionStore } from "@/stores/builder"
  import { toCapabilityInputs } from "@/stores/builder/functions"
  import { featureFlags } from "@/stores/portal"
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
  import { FeatureFlag } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { debounce } from "lodash"
  import { createSaveCoordinator } from "../../../saveCoordinator"
  import FunctionCodeEditor from "../FunctionCodeEditor.svelte"
  import FunctionQueryEditor from "../FunctionQueryEditor.svelte"

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

  $params
  $: functionId = $params.functionId
  $: enabled = $featureFlags[FeatureFlag.FUNCTIONS]
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
    if (!fn?._rev) {
      return false
    }
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
      fn = await functionStore.save(fn, {
        _rev: fn._rev,
        name: fn.name,
        source: sourceToSave,
        capabilities: capabilitiesToSave || toCapabilityInputs(fn),
      })
      savedSource = sourceToSave
      if (pendingCapabilities === capabilitiesToSave) {
        pendingCapabilities = undefined
      }
      if (source !== sourceToSave && !destroyed) {
        void saveCoordinator.save()
      }
      return true
    } catch (saveError) {
      actionError = getErrorMessage(saveError) || "Unable to save Function"
      if (pendingCapabilities === capabilitiesToSave) {
        pendingCapabilities = undefined
      }
      return false
    } finally {
      saving = false
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
      { text: "Automations", url: "../../" },
      { text: "Functions", url: "../" },
      { text: fn?.name || "Function" },
    ]}
    icon="code"
  />

  <main class="function-page">
    {#if !enabled}
      <div class="state" data-testid="function-permission-state">
        <Icon name="lock" size="L" />
        <Heading size="S">Functions are not available</Heading>
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
        <Button secondary on:click={() => load(functionId)}>Retry</Button>
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
            Write TypeScript. Changes save automatically; build to use the
            latest revision.
          </Body>
        </div>
        <div class="actions">
          <Button primary disabled={buildDisabled} on:click={build}>
            {building ? "Building..." : "Build"}
          </Button>
        </div>
      </div>

      {#if actionError}
        <div class="action-error" role="alert">
          <Icon name="warning-circle" size="S" />
          <span>{actionError}</span>
          <Button secondary on:click={() => load(functionId)}>
            Reload saved revision
          </Button>
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
