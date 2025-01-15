<script lang="ts">
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"
  import {
    previewStore,
    selectedScreen,
    componentStore,
    snippets,
  } from "@/stores/builder"
  import { getBindableProperties } from "@/dataBinding"
  import { processObjectSync } from "@budibase/string-templates"
  import BindingNode from "./BindingExplorer/BindingNode.svelte"

  enum ValueType {
    Object = "Object",
    Array = "Array",
    Primitive = "Primitive",
  }

  // Minimal typing for the real data binding structure, as none exists
  type DataBinding = {
    category: string
    runtimeBinding: string
    readableBinding: string
  }

  type BindingEntry = {
    readableBinding: string
    runtimeBinding: string | null
    value: any
    valueType: ValueType
  }

  type BindingMap = {
    [key: string]: BindingEntry
  }

  let modal: any

  $: context = {
    ...($previewStore.selectedComponentContext || {}),
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
  }
  $: selectedComponentId = $componentStore.selectedComponentId
  $: bindings = getBindableProperties($selectedScreen, selectedComponentId)
  $: enrichedBindings = enrichBindings(bindings, context, $snippets)

  const show = () => {
    previewStore.requestComponentContext()
    modal.show()
  }

  const enrichBindings = (
    bindings: DataBinding[],
    context: Record<string, any>,
    snippets: any
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
    const bindingEvauations = processObjectSync(bindingStrings, {
      ...context,
      snippets,
    }) as any[]

    // Enrich bindings with evaluations and highlighted HTML
    const flatBindings = bindings.map((binding, idx) => ({
      ...binding,
      value: bindingEvauations[idx],
    }))

    return flatBindings
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
