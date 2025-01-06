<script>
  import ScreenDetailsModal from "@/components/design/ScreenDetailsModal.svelte"
  import DatasourceModal from "./DatasourceModal.svelte"
  import TypeModal from "./TypeModal.svelte"
  import tableTypes from "./tableTypes"
  import formTypes from "./formTypes"
  import { Modal, notifications } from "@budibase/bbui"
  import {
    screenStore,
    navigationStore,
    permissions as permissionsStore,
    builderStore,
    datasources,
    appStore,
  } from "@/stores/builder"
  import { auth } from "@/stores/portal"
  import { goto } from "@roxi/routify"
  import { TOUR_KEYS } from "@/components/portal/onboarding/tours.js"
  import * as screenTemplating from "@/templates/screenTemplating"
  import { Roles } from "@/constants/backend"
  import { AutoScreenTypes } from "@/constants"
  import { makeTableOption, makeViewOption } from "./utils"

  let mode

  let screenDetailsModal
  let datasourceModal
  let formTypeModal
  let tableTypeModal
  let selectedTablesAndViews = []
  let permissions = {}
  let hasPreselectedDatasource = false

  $: screens = $screenStore.screens

  export const show = (newMode, preselectedDatasource) => {
    mode = newMode
    selectedTablesAndViews = []
    permissions = {}
    hasPreselectedDatasource = preselectedDatasource != null

    if (mode === AutoScreenTypes.TABLE || mode === AutoScreenTypes.FORM) {
      if (preselectedDatasource) {
        // If preselecting a datasource, skip a step
        const isTable = preselectedDatasource.type === "table"
        const tableOrView = isTable
          ? makeTableOption(preselectedDatasource, $datasources.list)
          : makeViewOption(preselectedDatasource)
        fetchPermission(tableOrView.id)
        selectedTablesAndViews.push(tableOrView)
        onSelectDatasources()
      } else {
        // Otherwise choose a datasource
        datasourceModal.show()
      }
    } else if (mode === AutoScreenTypes.BLANK) {
      screenDetailsModal.show()
    } else {
      throw new Error("Invalid mode provided")
    }
  }

  const createScreen = async screenTemplate => {
    try {
      return await screenStore.save(screenTemplate)
    } catch (error) {
      console.error(error)
      notifications.error("Error creating screens")
    }
  }

  const createScreens = async screenTemplates => {
    const newScreens = []

    for (let screenTemplate of screenTemplates) {
      await addNavigationLink(
        screenTemplate.data,
        screenTemplate.navigationLinkLabel
      )
      newScreens.push(await createScreen(screenTemplate.data))
    }

    return newScreens
  }

  const addNavigationLink = async (screen, linkLabel) => {
    if (linkLabel == null) return

    await navigationStore.saveLink(
      screen.routing.route,
      linkLabel,
      screen.routing.roleId
    )
  }

  const onSelectDatasources = async () => {
    if (mode === AutoScreenTypes.FORM) {
      formTypeModal.show()
    } else if (mode === AutoScreenTypes.TABLE) {
      tableTypeModal.show()
    }
  }

  const createBlankScreen = async ({ route }) => {
    const screenTemplates = screenTemplating.blank({ route, screens })
    const newScreens = await createScreens(screenTemplates)
    loadNewScreen(newScreens[0])
  }

  const createTableScreen = async type => {
    const screenTemplates = (
      await Promise.all(
        selectedTablesAndViews.map(tableOrView =>
          screenTemplating.table({
            screens,
            tableOrView,
            type,
            permissions: permissions[tableOrView.id],
          })
        )
      )
    ).flat()
    const newScreens = await createScreens(screenTemplates)
    loadNewScreen(newScreens[0])
  }

  const createFormScreen = async type => {
    const screenTemplates = (
      await Promise.all(
        selectedTablesAndViews.map(tableOrView =>
          screenTemplating.form({
            screens,
            tableOrView,
            type,
            permissions: permissions[tableOrView.id],
          })
        )
      )
    ).flat()
    const newScreens = await createScreens(screenTemplates)

    if (type === "update" || type === "create") {
      const associatedTour =
        type === "update"
          ? TOUR_KEYS.BUILDER_FORM_VIEW_UPDATE
          : TOUR_KEYS.BUILDER_FORM_CREATE

      const tourRequired = !$auth?.user?.tours?.[associatedTour]
      if (tourRequired) {
        builderStore.setTour(associatedTour)
      }
    }

    loadNewScreen(newScreens[0])
  }

  const loadNewScreen = screen => {
    if (screen?.props?._children.length) {
      // Focus on the main component for the screen type
      const mainComponent = screen?.props?._children?.[0]._id
      $goto(
        `/builder/app/${$appStore.appId}/design/${screen._id}/${mainComponent}`
      )
    } else {
      $goto(`/builder/app/${$appStore.appId}/design/${screen._id}`)
    }

    screenStore.select(screen._id)
  }

  const fetchPermission = resourceId => {
    permissions[resourceId] = {
      loading: true,
      read: Roles.BASIC,
      write: Roles.BASIC,
    }

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
            read: Roles.BASIC,
            write: Roles.BASIC,
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
    onConfirm={onSelectDatasources}
    on:toggle={handleTableOrViewToggle}
  />
</Modal>

<Modal bind:this={tableTypeModal}>
  <TypeModal
    title="Choose how you want to manage rows"
    types={tableTypes}
    onConfirm={createTableScreen}
    onCancel={() => {
      tableTypeModal.hide()
      datasourceModal.show()
    }}
    showCancelButton={!hasPreselectedDatasource}
  />
</Modal>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal onConfirm={createBlankScreen} />
</Modal>

<Modal bind:this={formTypeModal}>
  <TypeModal
    title="Select form type"
    types={formTypes}
    onConfirm={createFormScreen}
    onCancel={() => {
      formTypeModal.hide()
      datasourceModal.show()
    }}
    showCancelButton={!hasPreselectedDatasource}
  />
</Modal>
