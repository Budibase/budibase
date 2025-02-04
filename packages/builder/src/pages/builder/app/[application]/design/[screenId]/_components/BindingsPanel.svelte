<script lang="ts">
  import { onMount } from "svelte"
  import { Helpers, notifications } from "@budibase/bbui"
  import { processObjectSync } from "@budibase/string-templates"
  import {
    previewStore,
    selectedScreen,
    componentStore,
    snippets,
  } from "@/stores/builder"
  import { getBindableProperties } from "@/dataBinding"
  import JSONViewer, {
    type JSONViewerClickEvent,
  } from "@/components/common/JSONViewer.svelte"

  // Minimal typing for the real data binding structure, as none exists
  type DataBinding = {
    category: string
    runtimeBinding: string
    readableBinding: string
  }

  $: previewContext = $previewStore.selectedComponentContext || {}
  $: selectedComponentId = $componentStore.selectedComponentId
  $: context = makeContext(previewContext, bindings)
  $: bindings = getBindableProperties($selectedScreen, selectedComponentId)

  const makeContext = (
    previewContext: Record<string, any>,
    bindings: DataBinding[]
  ) => {
    // Create a single big array to enrich in one go
    const bindingStrings = bindings.map(binding => {
      if (binding.runtimeBinding.startsWith('trim "')) {
        // Account for nasty hardcoded HBS bindings for roles, for legacy
        // compatibility
        return `{{ ${binding.runtimeBinding} }}`
      } else {
        return `{{ literal ${binding.runtimeBinding} }}`
      }
    })
    const bindingEvaluations = processObjectSync(bindingStrings, {
      ...previewContext,
      snippets: $snippets,
    }) as any[]

    // Deeply set values for all readable bindings
    const enrichedBindings: any[] = bindings.map((binding, idx) => {
      return {
        ...binding,
        value: bindingEvaluations[idx],
      }
    })
    let context = {}
    for (let binding of enrichedBindings) {
      Helpers.deepSet(context, binding.readableBinding, binding.value)
    }
    return context
  }

  const copyBinding = (e: JSONViewerClickEvent) => {
    const readableBinding = `{{ ${e.detail.path.join(".")} }}`
    Helpers.copyToClipboard(readableBinding)
    notifications.success("Binding copied to clipboard")
  }

  onMount(previewStore.requestComponentContext)
</script>

<div class="bindings-panel">
  <JSONViewer value={context} showCopyIcon on:click-copy={copyBinding} />
</div>

<style>
  .bindings-panel {
    flex: 1 1 auto;
    height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--spacing-xl) var(--spacing-l) var(--spacing-l)
      var(--spacing-l);
  }
</style>
