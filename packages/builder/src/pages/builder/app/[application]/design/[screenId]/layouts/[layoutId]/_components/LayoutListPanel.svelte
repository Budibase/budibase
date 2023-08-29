<script>
  import Panel from "components/design/Panel.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import { store } from "builderStore"
  import LayoutDropdownMenu from "./LayoutDropdownMenu.svelte"
</script>

<Panel title="Layouts" borderRight>
  <div class="layouts">
    {#each $store.layouts as layout (layout._id)}
      <NavItem
        icon="Experience"
        indentLevel={0}
        selected={$store.selectedLayoutId === layout._id}
        text={layout.name}
        on:click={() => store.actions.layouts.select(layout._id)}
      >
        <LayoutDropdownMenu {layout} />
      </NavItem>
    {/each}
  </div>
</Panel>

<style>
  .layouts {
    margin-top: var(--spacing-xl);
    overflow: hidden;
  }
</style>
