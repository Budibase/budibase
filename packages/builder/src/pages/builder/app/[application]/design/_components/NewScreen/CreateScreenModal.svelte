<script>
  import ScreenDetailsModal from "components/design/ScreenDetailsModal.svelte"
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
  import { goto } from "@roxi/routify"

  let pendingScreen

  // Modal refs
  let screenDetailsModal
  let datasourceModal
  let screenAccessRoleModal

  // Cache variables for workflow
  let screenAccessRole = Roles.BASIC
  let selectedTemplates = null
  let blankScreenUrl = null
  let screenMode = null

  // Creates an array of screens, checking and sanitising their URLs
  const createScreens = async ({ screens, screenAccessRole }) => {
    if (!screens?.length) {
      return
    }

    try {
      let screenId

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
        const response = await store.actions.screens.save(screen)
        screenId = response._id

        // Add link in layout. We only ever actually create 1 screen now, even
        // for autoscreens, so it's always safe to do this.
        await store.actions.links.save(
          screen.routing.route,
          capitalise(screen.routing.route.split("/")[1])
        )
      }

      // Go to new screen
      $goto(`./${screenId}`)
      store.actions.screens.select(screenId)
    } catch (error) {
      console.log(error)
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
  export const show = mode => {
    selectedTemplates = null
    blankScreenUrl = null
    screenMode = mode
    pendingScreen = null
    screenAccessRole = Roles.BASIC

    if (mode === "table") {
      datasourceModal.show()
    } else if (mode === "blank") {
      let templates = getTemplates($tables.list)
      const blankScreenTemplate = templates.find(
        t => t.id === "createFromScratch"
      )
      pendingScreen = blankScreenTemplate.create()
      screenDetailsModal.show()
    } else {
      throw new Error("Invalid mode provided")
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
      screenTemplate.autoTableId = template.resourceId
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
    if (screenMode === "blank") {
      confirmBlankScreenCreation({
        screenUrl: blankScreenUrl,
        screenAccessRole,
      })
    } else {
      completeDatasourceScreenCreation()
    }
  }

  const roleSelectBack = () => {
    if (screenMode === "blank") {
      screenDetailsModal.show()
    } else {
      datasourceModal.show()
    }
  }
</script>

<Modal bind:this={datasourceModal} autoFocus={false}>
  <DatasourceModal
    onConfirm={confirmScreenDatasources}
    initialScreens={!selectedTemplates ? [] : [...selectedTemplates]}
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
    initialUrl={blankScreenUrl}
  />
</Modal>
