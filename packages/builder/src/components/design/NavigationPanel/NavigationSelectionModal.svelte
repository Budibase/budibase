<script>
  import { ModalContent, Body, Detail } from "@budibase/bbui"
  import { store, selectedAccessRole, allScreens } from "builderStore"
  import { cloneDeep } from "lodash/fp"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { onDestroy } from "svelte"

  export let selectedScreens
  export let screenName
  export let url
  export let chooseModal

  let roleId = $selectedAccessRole || "BASIC"

  let routeError
  let selectedNav
  let createdScreens = []
  $: {
    selectedScreens?.forEach(screen => {
      createdScreens = [...createdScreens, screen.create()]
    })
  }

  $: blankSelected = selectedScreens.length === 1

  const save = async screens => {
    for (let screen of screens) {
      await saveScreens(screen)
    }

    let navLayout = cloneDeep(
      $store.layouts.find(layout => layout._id === "layout_private_master")
    )
    navLayout.props.navigation = selectedNav

    await store.actions.routing.fetch()
    await store.actions.layouts.save(navLayout)
    selectedScreens = []
    screenName = ""
    url = ""
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

  onDestroy(() => {
    selectedScreens = []
    screenName = ""
    url = ""
  })
</script>

<ModalContent
  title="Select navigation"
  cancelText="Back"
  onCancel={() => (blankSelected ? chooseModal(1) : chooseModal(0))}
  size="M"
  onConfirm={() => {
    save(createdScreens)
  }}
  disabled={!selectedNav}
>
  <Body size="S"
    >Please select your preferred layout for the new application:</Body
  >

  <div class="wrapper">
    <div
      data-cy="left-nav"
      on:click={() => (selectedNav = "Left")}
      class:unselected={selectedNav && selectedNav !== "Left"}
    >
      <div class="box">
        <div class="side-nav" />
      </div>
      <div><Detail>Side Nav</Detail></div>
    </div>
    <div
      on:click={() => (selectedNav = "Top")}
      class:unselected={selectedNav && selectedNav !== "Top"}
    >
      <div class="box">
        <div class="top-nav" />
      </div>
      <div><Detail>Top Nav</Detail></div>
    </div>
    <div
      on:click={() => (selectedNav = "None")}
      class:unselected={selectedNav && selectedNav !== "None"}
    >
      <div class="box" />
      <div><Detail>No Nav</Detail></div>
    </div>
  </div>
</ModalContent>

<style>
  .side-nav {
    float: left;
    background: #d3d3d3 0% 0% no-repeat padding-box;
    border-radius: 2px 0px 0px 2px;
    height: 100%;
    width: 10%;
  }

  .top-nav {
    background: #d3d3d3 0% 0% no-repeat padding-box;
    vertical-align: top;
    width: 100%;
    height: 15%;
  }
  .box {
    display: inline-block;
    background: #eaeaea 0% 0% no-repeat padding-box;
    border: 1px solid #d3d3d3;
    border-radius: 2px;
    opacity: 1;
    width: 120px;
    height: 70px;
    margin-right: 20px;
  }

  .wrapper {
    display: flex;
    padding-top: 4%;
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-right: 5%;
  }
  .unselected {
    opacity: 0.3;
  }
</style>
