<script>
  import ScreenDetailsModal from "components/design/ScreenDetailsModal.svelte"
  import DatasourceModal from "./DatasourceModal.svelte"
  import ScreenRoleModal from "./ScreenRoleModal.svelte"
  import sanitizeUrl from "helpers/sanitizeUrl"
  import FormTypeModal from "./FormTypeModal.svelte"
  import { Modal, notifications } from "@budibase/bbui"
  import {
    screenStore,
    navigationStore,
    tables,
    builderStore,
  } from "stores/builder"
  import { auth } from "stores/portal"
  import { get } from "svelte/store"
  import getTemplates from "templates"
  import { Roles } from "constants/backend"
  import { capitalise } from "helpers"
  import { goto } from "@roxi/routify"
  import { TOUR_KEYS } from "components/portal/onboarding/tours.js"
  import formScreen from "templates/formScreen"
  import gridListScreen from "templates/gridListScreen"
  import gridDetailsScreen from "templates/gridDetailsScreen"

  let mode
  let pendingScreen

  // Modal refs
  let screenDetailsModal
  let datasourceModal
  let screenAccessRoleModal
  let formTypeModal

  // Cache variables for workflow
  let screenAccessRole = Roles.BASIC

  let templates = null
  let screens = null

  let selectedDatasources = null
  let blankScreenUrl = null
  let screenMode = null
  let formType = null

  // Creates an array of screens, checking and sanitising their URLs
  const createScreens = async ({ screens, screenAccessRole }) => {
    if (!screens?.length) {
      return
    }

    try {
      let createdScreens = []

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
        const response = await screenStore.save(screen)
        createdScreens.push(response)

        // Add link in layout. We only ever actually create 1 screen now, even
        // for autoscreens, so it's always safe to do this.
        await navigationStore.saveLink(
          screen.routing.route,
          capitalise(screen.routing.route.split("/")[1])
        )
      }

      return createdScreens
    } catch (error) {
      console.error(error)
      notifications.error("Error creating screens")
    }
  }

  // Checks if any screens exist in the store with the given route and
  // currently selected role
  const hasExistingUrl = url => {
    const roleId = screenAccessRole
    const screens = get(screenStore).screens.filter(
      s => s.routing.roleId === roleId
    )
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
  export const show = newMode => {
    mode = newMode
    templates = null
    screens = null
    selectedDatasources = null
    blankScreenUrl = null
    screenMode = mode
    pendingScreen = null
    screenAccessRole = Roles.BASIC
    formType = null

    if (mode === "grid" || mode === "gridDetails" || mode === "form") {
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
  const confirmScreenDatasources = async ({ datasources }) => {
    selectedDatasources = datasources
    if (screenMode === "form") {
      formTypeModal.show()
    } else {
      screenAccessRoleModal.show()
    }
  }

  // Handler for Datasource Screen Creation
  const completeDatasourceScreenCreation = async () => {
    templates =
      mode === "grid"
        ? gridListScreen(selectedDatasources)
        : gridDetailsScreen(selectedDatasources)

    const screens = templates.map(template => {
      let screenTemplate = template.create()
      screenTemplate.autoTableId = template.resourceId
      return screenTemplate
    })
    const createdScreens = await createScreens({ screens, screenAccessRole })
    loadNewScreen(createdScreens)
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
    const createdScreens = await createScreens({
      screens: [pendingScreen],
      screenAccessRole,
    })
    loadNewScreen(createdScreens)
  }

  const onConfirmFormType = () => {
    screenAccessRoleModal.show()
  }

  const loadNewScreen = createdScreens => {
    const lastScreen = createdScreens.slice(-1)[0]

    // Go to new screen
    if (lastScreen?.props?._children.length) {
      // Focus on the main component for the streen type
      const mainComponent = lastScreen?.props?._children?.[0]._id
      $goto(`./${lastScreen._id}/${mainComponent}`)
    } else {
      $goto(`./${lastScreen._id}`)
    }

    screenStore.select(lastScreen._id)
  }

  const confirmFormScreenCreation = async () => {
    templates = formScreen(selectedDatasources, { actionType: formType })
    screens = templates.map(template => {
      let screenTemplate = template.create()
      return screenTemplate
    })
    const createdScreens = await createScreens({ screens, screenAccessRole })

    if (formType === "Update" || formType === "Create") {
      const associatedTour =
        formType === "Update"
          ? TOUR_KEYS.BUILDER_FORM_VIEW_UPDATE
          : TOUR_KEYS.BUILDER_FORM_CREATE

      const tourRequired = !$auth?.user?.tours?.[associatedTour]
      if (tourRequired) {
        builderStore.setTour(associatedTour)
      }
    }

    // Go to new screen
    loadNewScreen(createdScreens)
  }

  // Submit screen config for creation.
  const confirmScreenCreation = async () => {
    if (screenMode === "blank") {
      confirmBlankScreenCreation({
        screenUrl: blankScreenUrl,
        screenAccessRole,
      })
    } else if (screenMode === "form") {
      confirmFormScreenCreation()
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
  <DatasourceModal {mode} onConfirm={confirmScreenDatasources} />
</Modal>

<Modal bind:this={screenAccessRoleModal}>
  <ScreenRoleModal
    onConfirm={() => {
      confirmScreenCreation()
    }}
    bind:screenAccessRole
    onCancel={roleSelectBack}
    screenUrl={blankScreenUrl}
    confirmText={screenMode === "form" ? "Confirm" : "Done"}
  />
</Modal>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal
    onConfirm={confirmScreenBlank}
    initialUrl={blankScreenUrl}
  />
</Modal>

<Modal bind:this={formTypeModal}>
  <FormTypeModal
    onConfirm={onConfirmFormType}
    onCancel={() => {
      formTypeModal.hide()
      datasourceModal.show()
    }}
    on:select={e => {
      formType = e.detail
    }}
    type={formType}
  />
</Modal>
