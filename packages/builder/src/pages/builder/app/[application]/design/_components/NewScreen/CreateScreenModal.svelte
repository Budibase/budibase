<script>
  import ScreenDetailsModal from "components/design/ScreenDetailsModal.svelte"
  import DatasourceModal from "./DatasourceModal.svelte"
  import sanitizeUrl from "helpers/sanitizeUrl"
  import FormTypeModal from "./FormTypeModal.svelte"
  import { Modal, notifications } from "@budibase/bbui"
  import {
    screenStore,
    navigationStore,
    permissions as permissionsStore,
    builderStore,
  } from "stores/builder"
  import { auth } from "stores/portal"
  import { get } from "svelte/store"
  import { capitalise } from "helpers"
  import { goto } from "@roxi/routify"
  import { TOUR_KEYS } from "components/portal/onboarding/tours.js"
  import blankScreen from "templates/blankScreen"
  import formScreen from "templates/formScreen"
  import gridScreen from "templates/gridScreen"
  import gridDetailsScreen from "templates/gridDetailsScreen"
  import { Roles } from "constants/backend"

  let mode

  let screenDetailsModal
  let datasourceModal
  let formTypeModal

  let selectedTablesAndViews = []
  let permissions = {}

  export const show = newMode => {
    mode = newMode
    selectedTablesAndViews = []
    permissions = {}

    if (mode === "grid" || mode === "gridDetails" || mode === "form") {
      datasourceModal.show()
    } else if (mode === "blank") {
      screenDetailsModal.show()
    } else {
      throw new Error("Invalid mode provided")
    }
  }

  const createScreen = async screen => {
    try {
      // Check we aren't clashing with an existing URL
      if (hasExistingUrl(screen.routing.route, screen.routing.roleId)) {
        let suffix = 2
        let candidateUrl = makeCandidateUrl(screen, suffix)
        while (hasExistingUrl(candidateUrl, screen.routing.roleId)) {
          candidateUrl = makeCandidateUrl(screen, ++suffix)
        }
        screen.routing.route = candidateUrl
      }

      screen.routing.route = sanitizeUrl(screen.routing.route)

      return await screenStore.save(screen)
    } catch (error) {
      console.error(error)
      notifications.error("Error creating screens")
    }
  }

  const addNavigationLink = async screen =>
    await navigationStore.saveLink(
      screen.routing.route,
      capitalise(screen.routing.route.split("/")[1]),
      screen.routing.roleId
    )

  // Checks if any screens exist in the store with the given route and
  // currently selected role
  const hasExistingUrl = (url, screenAccessRole) => {
    const screens = get(screenStore).screens.filter(
      s => s.routing.roleId === screenAccessRole
    )
    return !!screens.find(s => s.routing?.route === url)
  }

  // Constructs a candidate URL for a new screen, appending a given suffix to the
  // screen's URL
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

  const onSelectDatasources = async () => {
    if (mode === "form") {
      formTypeModal.show()
    } else if (mode === "grid") {
      await createGridScreen()
    } else if (mode === "gridDetails") {
      await createGridDetailsScreen()
    }
  }

  const createBlankScreen = async ({ screenUrl }) => {
    const screenTemplate = blankScreen(screenUrl)
    const screen = await createScreen(screenTemplate)
    await addNavigationLink(screenTemplate)

    loadNewScreen(screen)
  }

  const createGridScreen = async () => {
    let firstScreen = null

    for (let tableOrView of selectedTablesAndViews) {
      const screenTemplate = gridScreen(
        tableOrView,
        permissions[tableOrView.id]
      )

      const screen = await createScreen(screenTemplate)
      await addNavigationLink(screen)

      firstScreen ??= screen
    }

    loadNewScreen(firstScreen)
  }

  const createGridDetailsScreen = async () => {
    let firstScreen = null

    for (let tableOrView of selectedTablesAndViews) {
      const screenTemplate = gridDetailsScreen(
        tableOrView,
        permissions[tableOrView.id]
      )

      const screen = await createScreen(screenTemplate)
      await addNavigationLink(screen)

      firstScreen ??= screen
    }

    loadNewScreen(firstScreen)
  }

  const createFormScreen = async formType => {
    let firstScreen = null

    for (let tableOrView of selectedTablesAndViews) {
      const screenTemplate = formScreen(
        tableOrView,
        formType,
        permissions[tableOrView.id]
      )

      const screen = await createScreen(screenTemplate)
      // Only add a navigation link for `Create`, as both `Update` and `View`
      // require an `id` in their URL in order to function.
      if (formType === "Create") {
        await addNavigationLink(screen)
      }

      firstScreen ??= screen
    }

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

    loadNewScreen(firstScreen)
  }

  const loadNewScreen = screen => {
    if (screen?.props?._children.length) {
      // Focus on the main component for the screen type
      const mainComponent = screen?.props?._children?.[0]._id
      $goto(`./${screen._id}/${mainComponent}`)
    } else {
      $goto(`./${screen._id}`)
    }

    screenStore.select(screen._id)
  }

  const fetchPermission = resourceId => {
    permissions[resourceId] = { loading: true, read: null, write: null }

    permissionsStore
      .forResource(resourceId)
      .then(permission => {
        if (permissions[resourceId]?.loading) {
          permissions[resourceId] = {
            loading: false,
            read: permission?.read?.role,
            write: permission?.write?.role,
          }
        }
      })
      .catch(e => {
        console.error("Error fetching permission data: ", e)

        if (permissions[resourceId]?.loading) {
          permissions[resourceId] = {
            loading: false,
            read: Roles.PUBLIC,
            write: Roles.PUBLIC,
          }
        }
      })
  }

  const deletePermission = resourceId => {
    delete permissions[resourceId]
    permissions = permissions
  }

  const handleTableOrViewToggle = ({ detail: tableOrView }) => {
    const alreadySelected = selectedTablesAndViews.some(
      selected => selected.id === tableOrView.id
    )

    if (!alreadySelected) {
      fetchPermission(tableOrView.id)
      selectedTablesAndViews = [...selectedTablesAndViews, tableOrView]
    } else {
      deletePermission(tableOrView.id)
      selectedTablesAndViews = selectedTablesAndViews.filter(
        selected => selected.id !== tableOrView.id
      )
    }
  }
</script>

<Modal bind:this={datasourceModal} autoFocus={false}>
  <DatasourceModal
    {selectedTablesAndViews}
    {permissions}
    onConfirm={onSelectDatasources}
    on:toggle={handleTableOrViewToggle}
  />
</Modal>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal onConfirm={createBlankScreen} />
</Modal>

<Modal bind:this={formTypeModal}>
  <FormTypeModal
    onConfirm={createFormScreen}
    onCancel={() => {
      formTypeModal.hide()
      datasourceModal.show()
    }}
  />
</Modal>
