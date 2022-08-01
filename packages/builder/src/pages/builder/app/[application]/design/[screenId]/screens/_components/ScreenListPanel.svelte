<script>
  import { Search, Layout, Select, Body, Button } from "@budibase/bbui"
  import Panel from "components/design/Panel.svelte"
  import { roles } from "stores/backend"
  import { store, sortedScreens } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenDropdownMenu from "./ScreenDropdownMenu.svelte"
  import ScreenWizard from "./ScreenWizard.svelte"
  import RoleIndicator from "./RoleIndicator.svelte"
  import { RoleUtils } from "@budibase/frontend-core"

  let searchString
  let accessRole = "all"
  let showNewScreenModal

  $: filteredScreens = getFilteredScreens(
    $sortedScreens,
    searchString,
    accessRole
  )

  const getFilteredScreens = (screens, search, role) => {
    return screens.filter(screen => {
      const searchMatch = !search || screen.routing.route.includes(search)
      const roleMatch =
        !role || role === "all" || screen.routing.roleId === role
      return searchMatch && roleMatch
    })
  }
</script>

<Panel title="Screens" borderRight>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Button on:click={showNewScreenModal} cta>Add screen</Button>
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
      getOptionColour={role => {
        if (role?._id === "all") {
          return null
        }
        return RoleUtils.getRoleColour(role._id)
      }}
      options={[{ name: "All screens", _id: "all" }, ...$roles]}
    />
  </Layout>
  {#each filteredScreens as screen (screen._id)}
    <NavItem
      icon={screen.routing.homeScreen ? "Home" : null}
      indentLevel={0}
      selected={$store.selectedScreenId === screen._id}
      text={screen.routing.route}
      on:click={() => store.actions.screens.select(screen._id)}
      rightAlignIcon
    >
      <ScreenDropdownMenu screenId={screen._id} />
      <RoleIndicator slot="right" roleId={screen.routing.roleId} />
    </NavItem>
  {/each}
  {#if !filteredScreens?.length}
    <Layout paddingY="" paddingX="L">
      <Body size="S">
        There aren't any screens matching the current filters
      </Body>
    </Layout>
  {/if}
</Panel>

<ScreenWizard bind:showModal={showNewScreenModal} />
