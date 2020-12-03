<script>
  import { params, leftover, goto } from "@sveltech/routify"
  import { store, allScreens } from "builderStore"

  // Get any leftover params not caught by Routifys params store.
  const componentIds = $leftover.split("/").filter(id => id !== "")

  const currentLayoutId = decodeURI($params.layout)
  const validLayout = $store.layouts.some(layout => layout._id === currentLayoutId)

  if (!validLayout) {
    const firstLayoutId = $store.layouts[0]?._id
    store.actions.layouts.select($params.layout)
    $goto(`./${firstLayoutId}`)
  } else {
    // Otherwise proceed to set layout
    store.actions.layouts.select($params.layout)

    // There are leftover stuff, like IDs, so navigate the components and find the ID and select it.
    if ($leftover) {
      // Get the correct layout children.
      const layoutChildren = $store.layouts.find(
        layout =>
          layout._id === $params.layout ||
          layout._id === decodeURIComponent($params.layout)
      ).props._children
      findComponent(componentIds, layoutChildren)
    }
  }

  // Find Component with ID and continue
  function findComponent(ids, children) {
    // Setup stuff
    let componentToSelect
    let currentChildren = children

    // Loop through each ID
    ids.forEach(id => {
      // Find ID
      const component = currentChildren.find(child => child._id === id)

      // If it does not exist, ignore (use last valid route)
      if (!component) return

      componentToSelect = component

      // Update childrens array to selected components children
      currentChildren = componentToSelect._children
    })

    // Select Component!
    if (componentToSelect) store.actions.components.select(componentToSelect)
  }
</script>

<slot />
