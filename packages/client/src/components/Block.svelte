<script>
  import { getContext, onDestroy, onMount, setContext } from "svelte"
  import { builderStore } from "stores/builder.js"
  import { blockStore } from "stores/blocks"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  let structureLookupMap = {}

  const registerBlockComponent = (id, parentId, order, instance) => {
    // Ensure child map exists
    if (!structureLookupMap[parentId]) {
      structureLookupMap[parentId] = {}
    }
    // Add this instance in this order, overwriting any existing instance in
    // this order in case of repeaters
    structureLookupMap[parentId][id] = { order, instance }
  }

  const unregisterBlockComponent = (id, parentId) => {
    // Ensure child map exists
    if (!structureLookupMap[parentId]) {
      return
    }
    delete structureLookupMap[parentId][id]
  }

  const eject = () => {
    // Start the new structure with the root component
    const rootMap = structureLookupMap[$component.id] || {}
    let definition = Object.values(rootMap)[0]?.instance
    if (!definition) {
      return
    }

    // Copy styles from block to root component
    definition._styles = {
      ...definition._styles,
      normal: {
        ...definition._styles?.normal,
        ...$component.styles?.normal,
      },
      custom:
        (definition._styles?.custom || "") + ($component.styles?.custom || ""),
    }

    // Create component tree
    attachChildren(definition, structureLookupMap)
    builderStore.actions.ejectBlock($component.id, definition)
  }

  const attachChildren = (rootComponent, map) => {
    // Transform map into children array
    let id = rootComponent._id
    const children = Object.values(map[id] || {})
    if (!children.length) {
      return
    }

    // Sort children by order
    children.sort((a, b) => (a.order < b.order ? -1 : 1))

    // Attach all children of this component
    rootComponent._children = children.map(x => x.instance)

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

    // Name can be used down the tree in placeholders
    name: $component.name,

    // We register block components with their raw props so that we can eject
    // blocks later on
    registerComponent: registerBlockComponent,
    unregisterComponent: unregisterBlockComponent,
  })

  onMount(() => {
    // We register and unregister blocks to the block store when inside the
    // builder preview to allow for block ejection
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

<div use:styleable={$component.styles}>
  <slot />
</div>
