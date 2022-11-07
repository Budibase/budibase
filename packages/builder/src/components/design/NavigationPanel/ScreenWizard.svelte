<script>
  import ScreenDetailsModal from "components/design/NavigationPanel/ScreenDetailsModal.svelte"
  import NewScreenModal from "components/design/NavigationPanel/NewScreenModal.svelte"
  import DatasourceModal from "components/design/NavigationPanel/DatasourceModal.svelte"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { Modal, ModalContent, Select, notifications } from "@budibase/bbui"
  import { store, selectedAccessRole } from "builderStore"
  import { get } from "svelte/store"
  import getTemplates from "builderStore/store/screenTemplates"
  import { tables, roles } from "stores/backend"

  let pendingScreen

  // Modal refs
  let newScreenModal
  let screenDetailsModal
  let datasourceModal
  let screenAccessRoleModal

  // Cache variables for workflow
  let screenAccessRole = $selectedAccessRole + ""
  let selectedTemplates = null
  let blankScreenUrl = null

  let screenMode = null

  // External handler to show the screen wizard
  export const showModal = () => {
    selectedTemplates = null
    blankScreenUrl = null
    screenMode = null

    newScreenModal.show()
    // Reset state when showing modal again
    pendingScreen = null
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
        screen.routing.roleId = screenAccessRole
          ? screenAccessRole
          : get(selectedAccessRole) || "BASIC"

        // Create the screen
        await store.actions.screens.save(screen)

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
    screenMode = mode

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

  // Handler for DatasourceModal confirmation, move to screen access select
  const confirmScreenDatasources = async ({ templates }) => {
    selectedTemplates = templates
    screenAccessRoleModal.show()
  }

  // Handler for Datasource Screen Creation
  const completeDatasourceScreenCreation = async () => {
    // // Handle template selection
    if (selectedTemplates?.length > 1) {
      // Autoscreens, so create immediately
      const screens = selectedTemplates.map(template => {
        let screenTemplate = template.create()
        screenTemplate.datasource = template.datasource
        return screenTemplate
      })
      await createScreens({ screens, screenAccessRole })
    }
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
  <ModalContent
    title={"Create CRUD Screens"}
    confirmText={"Done"}
    cancelText={"Back"}
    onConfirm={confirmScreenCreation}
    onCancel={roleSelectBack}
  >
    Select which level of access you want your screens to have
    <Select
      bind:value={screenAccessRole}
      label="Access"
      getOptionLabel={role => role.name}
      getOptionValue={role => role._id}
      getOptionColor={role => role.color}
      options={$roles}
    />
  </ModalContent>
</Modal>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal
    onConfirm={confirmScreenBlank}
    onCancel={() => newScreenModal.show()}
    initialUrl={blankScreenUrl}
  />
</Modal>
