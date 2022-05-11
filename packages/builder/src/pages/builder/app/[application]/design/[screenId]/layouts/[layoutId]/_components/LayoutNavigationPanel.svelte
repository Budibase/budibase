<script>
  import NavigationPanel from "components/design/navigation/NavigationPanel.svelte"
  import { Banner, Layout } from "@budibase/bbui"
  import NavItem from "components/common/NavItem.svelte"
  import { store } from "builderStore"
  import LayoutDropdownMenu from "./LayoutDropdownMenu.svelte"
</script>

<NavigationPanel title="Layouts">
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Banner
      type="warning"
      showCloseButton={false}
      extraButtonText="View details"
      extraButtonAction={() => {}}
    >
      Custom layouts are being deprecated. They will be removed from June 1st.
    </Banner>
  </Layout>
  {#each $store.layouts as layout (layout._id)}
    <NavItem
      icon="Experience"
      indentLevel={0}
      selected={$store.selectedLayoutId === layout._id}
      text={layout.name}
      on:click={() => ($store.selectedLayoutId = layout._id)}
    >
      <LayoutDropdownMenu {layout} />
    </NavItem>
  {/each}
</NavigationPanel>

<!--      -->
<!--      color={RoleUtils.getRoleColour(screen.routing.roleId)}-->
