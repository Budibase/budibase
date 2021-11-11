<script>
  import { ModalContent, Body, Detail } from "@budibase/bbui"
  import { store, selectedAccessRole, allScreens } from "builderStore"

  export let screenNameModal
  export let selectedScreens
  export let modal

  let roleId = $selectedAccessRole || "BASIC"

  let routeError
  let selectedNav
  let createdScreens = []
  $: {
    selectedScreens.forEach(screen => {
      createdScreens = [...createdScreens, screen.create()]
    })
  }

  $: blankSelected = selectedScreens.find(x => x.id === "createFromScratch")

  const save = async draftScreen => {
    if (draftScreen) {
      console.log(draftScreen)
      if (!draftScreen.routing.route) {
        routeError = "URL is required"
      } else {
        if (routeExists(draftScreen.routing.route, roleId)) {
          routeError = "This URL is already taken for this access role"
        } else {
          routeError = ""
        }
      }
      console.log(routeError)
      if (routeError) return false

      draftScreen.props.navigation = selectedNav
      await store.actions.screens.create(draftScreen)
      await store.actions.routing.fetch()
    }
  }

  const routeExists = (route, roleId) => {
    return $allScreens.some(
      screen =>
        screen.routing.route.toLowerCase() === route.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }
</script>

<ModalContent
  title="Select navigation"
  cancelText="Back"
  onCancel={() => (blankSelected ? screenNameModal.show() : modal.show())}
  size="M"
  onConfirm={() => {
    save(createdScreens.forEach(screen => save(screen)))
  }}
  disabled={!selectedNav}
>
  <Body size="S"
    >Please select your preferred layout for the new application:</Body
  >

  <div class="wrapper">
    <div
      on:click={() => (selectedNav = "side")}
      class:unselected={selectedNav && selectedNav !== "side"}
    >
      <div class="box">
        <div class="side-nav" />
      </div>
      <div><Detail>Side Nav</Detail></div>
    </div>
    <div
      on:click={() => (selectedNav = "top")}
      class:unselected={selectedNav && selectedNav !== "top"}
    >
      <div class="box">
        <div class="top-nav" />
      </div>
      <div><Detail>Top Nav</Detail></div>
    </div>
    <div
      on:click={() => (selectedNav = "none")}
      class:unselected={selectedNav && selectedNav !== "none"}
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
