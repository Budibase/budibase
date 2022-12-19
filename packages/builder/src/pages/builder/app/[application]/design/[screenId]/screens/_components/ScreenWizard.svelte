<script>
  import ScreenDetailsModal from "./ScreenDetailsModal.svelte"
  import NewScreenModal from "./NewScreenModal.svelte"
  import DatasourceModal from "./DatasourceModal.svelte"
  import ScreenRoleModal from "./ScreenRoleModal.svelte"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { Modal, notifications } from "@budibase/bbui"
  import { store } from "builderStore"
  import { get } from "svelte/store"
  import getTemplates from "builderStore/store/screenTemplates"
  import { tables } from "stores/backend"
  import { Roles } from "constants/backend"
  import { capitalise } from "helpers"

  let pendingScreen

  // Modal refs
  let newScreenModal
  let screenDetailsModal
  let datasourceModal
  let screenAccessRoleModal

  // Cache variables for workflow
  let screenAccessRole = Roles.BASIC
  let selectedTemplates = null
  let blankScreenUrl = null
  let screenMode = null

  // External handler to show the screen wizard
  export const showModal = () => {
    selectedTemplates = null
    blankScreenUrl = null
    screenMode = null
    pendingScreen = null
    screenAccessRole = Roles.BASIC
    newScreenModal.show()
  }

  // Creates an array of screens, checking and sanitising their URLs
  const createScreens = async ({ screens, screenAccessRole }) => {
    if (!screens?.length) {
      return
    }

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
        if (!screenAccessRole) {
          return
        }
        screen.routing.roleId = screenAccessRole

        // Create the screen
        await store.actions.screens.save(screen)

        // Add link in layout for list screens
        if (screen.props._instanceName.endsWith("List")) {
          await store.actions.links.save(
            screen.routing.route,
            capitalise(screen.routing.route.split("/")[1])
          )
        }
      }
    } catch (error) {
      notifications.error("Error creating screens")
    }
  }

  // Checks if any screens exist in the store with the given route and
  // currently selected role
  const hasExistingUrl = url => {
    const roleId = screenAccessRole
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
    screenMode = mode

    if (mode === "autoCreate") {
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

  // Handler for DatasourceModal confirmation, move to screen access select
  const confirmScreenDatasources = async ({ templates }) => {
    selectedTemplates = templates
    screenAccessRoleModal.show()
  }

  // Handler for Datasource Screen Creation
  const completeDatasourceScreenCreation = async () => {
    const screens = selectedTemplates.map(template => {
      let screenTemplate = template.create()
      screenTemplate.datasource = template.datasource
      screenTemplate.autoTableId = template.table
      return screenTemplate
    })
    await createScreens({ screens, screenAccessRole })
  }

  const confirmScreenBlank = async ({ screenUrl }) => {
    blankScreenUrl = screenUrl
    screenAccessRoleModal.show()
  }

  // Submit request for a blank screen
  const confirmBlankScreenCreation = async ({
    screenUrl,
    screenAccessRole,
  }) => {
    if (!pendingScreen) {
      return
    }
    pendingScreen.routing.route = screenUrl
    await createScreens({ screens: [pendingScreen], screenAccessRole })
  }

  // Submit screen config for creation.
  const confirmScreenCreation = async () => {
    if (screenMode === "blankScreen") {
      confirmBlankScreenCreation({
        screenUrl: blankScreenUrl,
        screenAccessRole,
      })
    } else {
      completeDatasourceScreenCreation()
    }
  }

  const roleSelectBack = () => {
    if (screenMode === "blankScreen") {
      screenDetailsModal.show()
    } else {
      datasourceModal.show()
    }
  }
</script>

<Modal bind:this={newScreenModal}>
  <NewScreenModal onConfirm={confirmScreenSelection} />
</Modal>

<Modal bind:this={datasourceModal}>
  <DatasourceModal
    onConfirm={confirmScreenDatasources}
    onCancel={() => newScreenModal.show()}
    initalScreens={!selectedTemplates ? [] : [...selectedTemplates]}
  />
</Modal>

<Modal bind:this={screenAccessRoleModal}>
  <ScreenRoleModal
    onConfirm={confirmScreenCreation}
    onCancel={roleSelectBack}
    bind:screenAccessRole
    screenUrl={blankScreenUrl}
  />
</Modal>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal
    onConfirm={confirmScreenBlank}
    onCancel={() => newScreenModal.show()}
    initialUrl={blankScreenUrl}
  />
</Modal>
