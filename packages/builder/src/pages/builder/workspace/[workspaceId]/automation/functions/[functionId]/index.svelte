<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import { getErrorMessage } from "@/helpers/errors"
  import { appStore, builderStore, functionStore } from "@/stores/builder"
  import { auth, featureFlags } from "@/stores/portal"
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
  import { onMount } from "svelte"
  import FunctionQueryEditor from "../FunctionQueryEditor.svelte"
  import { canManageFunctions } from "../permissions"

  let fn: FunctionResponse | undefined
  let loading = true
  let error = ""

  $params
  $: functionId = $params.functionId
  $: enabled = $featureFlags[FeatureFlag.FUNCTIONS]
  $: canManage = enabled && canManageFunctions($auth.user, $appStore.appId)
  $: builderStore.selectResource(functionId)

  const load = async () => {
    loading = true
    error = ""
    try {
      const [loadedFunction] = await Promise.all([
        functionStore.fetchOne(functionId),
        functionStore.fetchQueryCatalog(),
      ])
      fn = loadedFunction
    } catch (loadError) {
      error = getErrorMessage(loadError) || "Unable to load Function"
    } finally {
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
    notifications.success("Linked queries saved")
  }

  onMount(() => {
    if (canManage) {
      load()
    } else {
      loading = false
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
    {#if !canManage}
      <div class="state" data-testid="function-permission-state">
        <Icon name="lock" size="L" />
        <Heading size="S">You don't have permission to manage Functions</Heading
        >
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
