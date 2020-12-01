<script>
  import { params, leftover, goto } from "@sveltech/routify"
  import { store, allScreens } from "builderStore"

  // Get any leftover params not caught by Routifys params store.
  const componentIds = $leftover.split("/").filter(id => id !== "")

  const currentScreenId = decodeURI($params.screen)
  const validScreen = $allScreens.some(screen => screen._id === currentScreenId)

  console.log({ 
    validScreen, 
    currentScreenId,
    componentIds
  })

  if (!validScreen) {
    // Go to main layout if URL set to invalid screen
    console.error("Invalid screen", $params.screen)
    const firstScreenId = $allScreens[0]?._id
    store.actions.screens.select(firstScreenId)
    $goto(`./${firstScreenId}`)
  } else {
    // Otherwise proceed to set screen
    store.actions.screens.select(currentScreenId)

    // There are leftover stuff, like IDs, so navigate the components and find the ID and select it.
    if ($leftover) {
      console.log("leftover", $params.screen)
      // Get the correct screen children.
      const screenChildren = allScreens.find(
        screen =>
          screen._id === $params.screen ||
          screen._id === decodeURIComponent($params.screen)
      ).props._children
      findComponent(componentIds, screenChildren)
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
