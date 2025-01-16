<script lang="ts">
  import { ActionButton, Modal, ModalContent, Helpers } from "@budibase/bbui"
  import {
    previewStore,
    selectedScreen,
    componentStore,
    snippets,
  } from "@/stores/builder"
  import { getBindableProperties } from "@/dataBinding"
  import BindingNode from "./BindingExplorer/BindingNode.svelte"
  import { processObjectSync } from "@budibase/string-templates"

  // Minimal typing for the real data binding structure, as none exists
  type DataBinding = {
    category: string
    runtimeBinding: string
    readableBinding: string
  }

  let modal: any

  $: previewContext = $previewStore.selectedComponentContext || {}
  $: selectedComponentId = $componentStore.selectedComponentId
  $: context = makeContext(previewContext, bindings)
  $: bindings = getBindableProperties($selectedScreen, selectedComponentId)

  const show = () => {
    previewStore.requestComponentContext()
    modal.show()
  }

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

    // Enrich bindings with evaluations and highlighted HTML
    const enrichedBindings: any[] = bindings.map((binding, idx) => {
      return {
        ...binding,
        value: bindingEvaluations[idx],
      }
    })

    let context = {
      _dataTypes: {
        date: new Date(),
        string: "foo",
        number: 1234,
        undefined: undefined,
        null: null,
        true: true,
        false: false,
        array: [1, 2, 3],
        object: { foo: "bar" },
        error: new Error(),
      },
    }
    for (let binding of enrichedBindings) {
      Helpers.deepSet(context, binding.readableBinding, binding.value)
    }
    return context
  }
</script>

<ActionButton on:click={show}>Bindings</ActionButton>

<Modal bind:this={modal}>
  <ModalContent
    title="Bindings"
    showConfirmButton={false}
    cancelText="Close"
    size="M"
  >
    <BindingNode value={context} />
  </ModalContent>
</Modal>
