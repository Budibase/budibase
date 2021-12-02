<script>
  import ScreenDetailsModal from "components/design/NavigationPanel/ScreenDetailsModal.svelte"
  import NewScreenModal from "components/design/NavigationPanel/NewScreenModal.svelte"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { Modal } from "@budibase/bbui"
  import { store, selectedAccessRole, allScreens } from "builderStore"
  import analytics, { Events } from "analytics"

  let newScreenModal
  let navigationSelectionModal
  let screenDetailsModal
  let screenName = ""
  let url = ""
  let selectedScreens = []
  let roleId = $selectedAccessRole || "BASIC"
  let showProgressCircle = false
  let routeError
  let createdScreens = []

  const createScreens = async () => {
    for (let screen of selectedScreens) {
      let test = screen.create()
      createdScreens.push(test)
      analytics.captureEvent(Events.SCREEN.CREATED, {
        template: screen.id || screen.name,
      })
    }
  }

  const save = async () => {
    showProgressCircle = true
    await createScreens()
    for (let screen of createdScreens) {
      await saveScreens(screen)
    }
    await store.actions.routing.fetch()
    selectedScreens = []
    createdScreens = []
    screenName = ""
    url = ""
    showProgressCircle = false
  }

  const saveScreens = async draftScreen => {
    let existingScreenCount = $store.screens.filter(
      s => s.props._instanceName == draftScreen.props._instanceName
    ).length
    if (existingScreenCount > 0) {
      let oldUrlArr = draftScreen.routing.route.split("/")
      oldUrlArr[1] = `${oldUrlArr[1]}-${existingScreenCount + 1}`
      draftScreen.routing.route = oldUrlArr.join("/")
    }

    let route = url ? sanitizeUrl(`${url}`) : draftScreen.routing.route
    if (draftScreen) {
      if (!route) {
        routeError = "URL is required"
      } else {
        if (routeExists(route, roleId)) {
          routeError = "This URL is already taken for this access role"
        } else {
          routeError = ""
        }
      }

      if (routeError) return false

      if (screenName) {
        draftScreen.props._instanceName = screenName
      }

      draftScreen.routing.route = route

      await store.actions.screens.create(draftScreen)
      if (draftScreen.props._instanceName.endsWith("List")) {
        await store.actions.components.links.save(
          draftScreen.routing.route,
          draftScreen.routing.route.split("/")[1]
        )
      }
    }
  }

  const routeExists = (route, roleId) => {
    return $allScreens.some(
      screen =>
        screen.routing.route.toLowerCase() === route.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  export const showModal = () => {
    newScreenModal.show()
  }

  const setScreens = evt => {
    selectedScreens = evt.detail.screens
  }

  const chooseModal = index => {
    /*
    0 = newScreenModal
    1 = screenDetailsModal
    2 = navigationSelectionModal
    */
    if (index === 0) {
      newScreenModal.show()
    } else if (index === 1) {
      screenDetailsModal.show()
    } else if (index === 2) {
      navigationSelectionModal.show()
    }
  }
</script>

<Modal bind:this={newScreenModal}>
  <NewScreenModal
    on:save={setScreens}
    {showProgressCircle}
    {save}
    {chooseModal}
  />
</Modal>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal
    bind:screenName
    bind:url
    {showProgressCircle}
    {save}
    {chooseModal}
  />
</Modal>
