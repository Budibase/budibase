<script>
  import ScreenDetailsModal from "components/design/NavigationPanel/ScreenDetailsModal.svelte"
  import NewScreenModal from "components/design/NavigationPanel/NewScreenModal.svelte"
  import DatasourceModal from "components/design/NavigationPanel/DatasourceModal.svelte"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { Modal, notifications } from "@budibase/bbui"
  import { store, selectedAccessRole } from "builderStore"
  import analytics, { Events } from "analytics"
  import { get } from "svelte/store"
  import getTemplates from "builderStore/store/screenTemplates"
  import { tables } from "stores/backend"

  let pendingScreen
  let showProgressCircle = false

  // Modal refs
  let newScreenModal
  let screenDetailsModal
  let datasourceModal

  // External handler to show the screen wizard
  export const showModal = () => {
    newScreenModal.show()

    // Reset state when showing modal again
    pendingScreen = null
    showProgressCircle = false
  }

  // Creates an array of screens, checking and sanitising their URLs
  const createScreens = async ({ screens, screenAccessRole }) => {
    if (!screens?.length) {
      return
    }
    showProgressCircle = true

    try {
      for (let screen of screens) {
        // Check we aren't clashing with an existing URL
        if (hasExistingUrl(screen.routing.route)) {
          let suffix = 2
          let candidateUrl = makeCandidateUrl(screen, suffix)
          while (hasExistingUrl(candidateUrl)) {
            candidateUrl = makeCandidateUrl(screen, ++suffix)
          }
          screen.routing.route = candidateUrl
        }

        // Sanitise URL
        screen.routing.route = sanitizeUrl(screen.routing.route)

        // Use the currently selected role
        screen.routing.roleId = screenAccessRole
          ? screenAccessRole
          : get(selectedAccessRole) || "BASIC"

        // Create the screen
        await store.actions.screens.save(screen)

        // Analytics
        if (screen.template) {
          analytics.captureEvent(Events.SCREEN.CREATED, {
            template: screen.template,
          })
        }

        // Add link in layout for list screens
        if (screen.props._instanceName.endsWith("List")) {
          await store.actions.components.links.save(
            screen.routing.route,
            screen.routing.route.split("/")[1]
          )
        }
      }
    } catch (error) {
      notifications.error("Error creating screens")
    }

    showProgressCircle = false
  }

  // Checks if any screens exist in the store with the given route and
  // currently selected role
  const hasExistingUrl = url => {
    const roleId = get(selectedAccessRole) || "BASIC"
    const screens = get(store).screens.filter(s => s.routing.roleId === roleId)
    return !!screens.find(s => s.routing?.route === url)
  }

  // Constructs a candidate URL for a new screen, suffixing the base of the
  // screen's URL with a given suffix.
  // e.g. "/sales/:id" => "/sales-1/:id"
  const makeCandidateUrl = (screen, suffix) => {
    let url = screen.routing?.route || ""
    if (url.startsWith("/")) {
      url = url.slice(1)
    }
    if (!url.includes("/")) {
      return `/${url}-${suffix}`
    } else {
      const split = url.split("/")
      return `/${split[0]}-${suffix}/${split.slice(1).join("/")}`
    }
  }

  // Handler for NewScreenModal
  const confirmScreenSelection = async mode => {
    if (mode == "autoCreate") {
      datasourceModal.show()
    } else {
      let templates = getTemplates($store, $tables.list)
      const blankScreenTemplate = templates.find(
        t => t.id === "createFromScratch"
      )
      pendingScreen = blankScreenTemplate.create()
      screenDetailsModal.show()
    }
  }

  // Handler for DatasourceModal
  const confirmScreenDatasources = async ({ templates, screenAccessRole }) => {
    console.log("selected ", screenAccessRole)
    console.log("global ", $selectedAccessRole)
    // // Handle template selection
    if (templates?.length > 1) {
      // Autoscreens, so create immediately
      const screens = templates.map(template => template.create())
      await createScreens({ screens, screenAccessRole })
    }
  }

  // Handler for ScreenDetailsModal
  const confirmScreenDetails = async ({ screenUrl, screenAccessRole }) => {
    if (!pendingScreen) {
      return
    }
    pendingScreen.routing.route = screenUrl
    await createScreens({ screens: [pendingScreen], screenAccessRole })
  }
</script>

<Modal bind:this={newScreenModal}>
  <NewScreenModal onConfirm={confirmScreenSelection} />
</Modal>

<Modal bind:this={datasourceModal}>
  <DatasourceModal
    onConfirm={confirmScreenDatasources}
    onCancel={() => newScreenModal.show()}
  />
</Modal>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal
    onConfirm={confirmScreenDetails}
    onCancel={() => newScreenModal.show()}
  />
</Modal>
