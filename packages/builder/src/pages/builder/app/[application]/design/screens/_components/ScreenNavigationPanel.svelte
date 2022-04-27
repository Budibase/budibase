<script>
  import { Search, Layout, Select, Body } from "@budibase/bbui"
  import NavigationPanel from "components/design/navigation/NavigationPanel.svelte"
  import { roles } from "stores/backend"
  import { store } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenDropdownMenu from "./ScreenDropdownMenu.svelte"
  import { RoleColours, RolePriorities } from "constants"
  import ScreenWizard from "./ScreenWizard.svelte"
  let searchString
  let accessRole = "all"
  let showNewScreenModal

  $: filteredScreens = getFilteredScreens(
    $store.screens,
    searchString,
    accessRole
  )

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
        // Sort by role first
        const roleA = RolePriorities[a.routing.roleId]
        const roleB = RolePriorities[b.routing.roleId]
        if (roleA !== roleB) {
          return roleA > roleB ? -1 : 1
        }
        // Then put home screens first
        const homeA = !!a.routing.homeScreen
        const homeB = !!b.routing.homeScreen
        if (homeA !== homeB) {
          return homeA ? -1 : 1
        }
        // Finally sort alphabetically by route
        return a.routing.route < b.routing.route ? -1 : 1
      })
  }

  const getRoleColor = roleId => {
    return RoleColours[roleId] || "#ffa500"
  }
</script>

<NavigationPanel
  title="Screens"
  showAddButton
  onClickAddButton={showNewScreenModal}
>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Search
      placeholder="Search"
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
      icon={screen.routing.homeScreen ? "Home" : "WebPage"}
      indentLevel={0}
      selected={$store.selectedScreenId === screen._id}
      text={screen.routing.route}
      on:click={() => ($store.selectedScreenId = screen._id)}
      color={getRoleColor(screen.routing.roleId)}
    >
      <ScreenDropdownMenu screenId={screen._id} />
    </NavItem>
  {/each}
  {#if !filteredScreens?.length}
    <Layout paddingY="" paddingX="L">
      <Body size="S">
        There aren't any screens matching the current filters
      </Body>
    </Layout>
  {/if}
</NavigationPanel>

<ScreenWizard bind:showModal={showNewScreenModal} />
