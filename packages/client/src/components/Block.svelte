<script>
  import { getContext, onDestroy, onMount, setContext } from "svelte"
  import { builderStore } from "stores/builder.js"
  import { blockStore } from "stores/blocks.js"
  import { Button } from "@budibase/bbui"

  const component = getContext("component")

  let structureLookupMap = {}

  const registerBlockComponent = (id, order, parentId, instance) => {
    // Ensure child array exists
    if (!structureLookupMap[parentId]) {
      structureLookupMap[parentId] = []
    }
    // Remove existing instance of this component in case props changed
    structureLookupMap[parentId] = structureLookupMap[parentId].filter(
      blockComponent => blockComponent.instance._id !== id
    )
    // Add new instance of this component
    structureLookupMap[parentId].push({ order, instance })
  }

  const eject = () => {
    // Start the new structure with the first top level component
    let definition = structureLookupMap[$component.id][0].instance
    attachChildren(definition, structureLookupMap)
    builderStore.actions.ejectBlock($component.id, definition)
  }

  const attachChildren = (rootComponent, map) => {
    let id = rootComponent._id
    if (!map[id]?.length) {
      return
    }

    // Sort children by order
    map[id].sort((a, b) => (a.order < b.order ? -1 : 1))

    // Attach all children of this component
    rootComponent._children = map[id].map(x => x.instance)

    // Recurse for each child
    rootComponent._children.forEach(child => {
      attachChildren(child, map)
    })
  }

  setContext("block", {
    // We need to set a block context to know we're inside a block, but also
    // to be able to reference the actual component ID of the block from
    // any depth
    id: $component.id,

    // We register block components with their raw props so that we can eject
    // blocks later on
    registerComponent: registerBlockComponent,
  })

  onMount(() => {
    if ($builderStore.inBuilder) {
      blockStore.actions.registerBlock($component.id, { eject })
    }
  })

  onDestroy(() => {
    if ($builderStore.inBuilder) {
      blockStore.actions.unregisterBlock($component.id)
    }
  })
</script>

<slot />

{#if $component.selected}
  <div>
    <Button cta on:click={eject}>Eject block</Button>
  </div>
{/if}
