<script>
  import { Search, Layout, Select } from "@budibase/bbui"
  import NavigationPanel from "components/design/NavigationPanel/NavigationPanel.svelte"
  import { roles } from "stores/backend"
  import { store, allScreens } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenDropdownMenu from "./_components/ScreenDropdownMenu.svelte"
  import AppPanel from "components/design/AppPanel/AppPanel.svelte"
  import { RoleColours } from "constants"
  import ScreenWizard from "./_components/ScreenWizard.svelte"

  let searchString
  let accessRole = "all"
  let showNewScreenModal

  $: filteredScreens = getFilteredScreens($allScreens, searchString, accessRole)

  const getFilteredScreens = (screens, search, role) => {
    return screens
      .filter(screen => {
        const searchMatch = !search || screen.routing.route.includes(search)
        const roleMatch =
          !role || role === "all" || screen.routing.roleId === role
        return searchMatch && roleMatch
      })
      .slice()
      .sort((a, b) => {
        return a.routing.route < b.routing.route ? -1 : 1
      })
  }

  const getRoleColor = roleId => {
    return RoleColours[roleId] || "pink"
  }
</script>

<NavigationPanel
  title="Screens"
  showAddButton
  onClickAddButton={showNewScreenModal}
>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Search
      placeholder="Enter a route to search"
      value={searchString}
      on:change={e => (searchString = e.detail)}
    />
    <Select
      bind:value={accessRole}
      placeholder={null}
      getOptionLabel={role => role.name}
      getOptionValue={role => role._id}
      options={[{ name: "All screens", _id: "all" }, ...$roles]}
    />
  </Layout>
  {#each filteredScreens as screen (screen._id)}
    <NavItem
      icon={screen.routing.route === "/" ? "Home" : "WebPage"}
      indentLevel={0}
      selected={$store.selectedScreenId === screen._id}
      text={screen.routing.route}
      on:click={() => ($store.selectedScreenId = screen._id)}
      color={getRoleColor(screen.routing.roleId)}
    >
      <ScreenDropdownMenu screenId={screen._id} />
    </NavItem>
    <!--{#if selectedScreen?._id === screen.id}-->
    <!--  <ComponentTree-->
    <!--    level={1}-->
    <!--    components={selectedScreen.props._children}-->
    <!--    currentComponent={$selectedComponent}-->
    <!--    {dragDropStore}-->
    <!--  />-->
    <!--{/if}-->
  {/each}
</NavigationPanel>

<ScreenWizard bind:showModal={showNewScreenModal} />

<AppPanel />
