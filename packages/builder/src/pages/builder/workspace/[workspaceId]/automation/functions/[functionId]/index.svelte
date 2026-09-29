<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import { getErrorMessage } from "@/helpers/errors"
  import { builderStore, functionStore } from "@/stores/builder"
  import { featureFlags } from "@/stores/portal"
  import {
    Body,
    Button,
    Heading,
    Icon,
    notifications,
    ProgressCircle,
  } from "@budibase/bbui"
  import type {
    FunctionQueryCapabilityInput,
    FunctionResponse,
  } from "@budibase/types"
  import { FeatureFlag } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { onDestroy } from "svelte"
  import FunctionQueryEditor from "../FunctionQueryEditor.svelte"

  let fn: FunctionResponse | undefined
  let loading = true
  let error = ""
  let currentLoad: Promise<FunctionResponse> | undefined

  $params
  $: functionId = $params.functionId
  $: enabled = $featureFlags[FeatureFlag.FUNCTIONS]
  $: if (enabled && functionId && fn?._id === functionId && !loading) {
    builderStore.selectResource(functionId)
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
    loading = true
    error = ""
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
    error = loadError
    loading = false
  }

  const saveCapabilities = async (
    capabilities: FunctionQueryCapabilityInput[]
  ) => {
    if (!fn || fn._id !== functionId) {
      throw new Error("Function is no longer selected")
    }
    if (!fn._rev) {
      throw new Error("Function revision is missing")
    }
    const functionToSave = fn
    const revision = fn._rev
    const saved = await functionStore.save(functionToSave, {
      _rev: revision,
      name: functionToSave.name,
      source: functionToSave.source,
      capabilities,
    })
    if (fn === functionToSave && functionId === functionToSave._id && enabled) {
      fn = saved
      notifications.success("Linked queries saved")
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
    fn = undefined
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
        <Heading size="L">{fn.name}</Heading>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Configure the saved queries this Function is allowed to call.
        </Body>
      </div>

      <FunctionQueryEditor
        capabilities={fn.capabilities}
        catalog={$functionStore.queryCatalog}
        catalogLoading={$functionStore.catalogLoading}
        catalogError={$functionStore.catalogError}
        onRetry={() => functionStore.fetchQueryCatalog()}
        onSave={saveCapabilities}
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
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xl);
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
