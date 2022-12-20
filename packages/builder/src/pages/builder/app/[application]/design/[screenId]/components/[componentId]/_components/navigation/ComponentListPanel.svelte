<script>
  import Panel from "components/design/Panel.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import { dndStore } from "./dndStore.js"
  import { goto } from "@roxi/routify"
  import { store, selectedScreen } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ScreenslotDropdownMenu from "./ScreenslotDropdownMenu.svelte"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import { DropPosition } from "./dndStore"
  import { notifications, Button } from "@budibase/bbui"
  import ComponentKeyHandler from "./ComponentKeyHandler.svelte"
  import ComponentScrollWrapper from "./ComponentScrollWrapper.svelte"

  const onDrop = async () => {
    try {
      await dndStore.actions.drop()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving component")
    }
  }
</script>

<Panel title="Components" showExpandIcon borderRight>
  <div class="add-component">
    <Button on:click={() => $goto("./new")} cta>Add component</Button>
  </div>
  <ComponentScrollWrapper>
    <ul>
      <li>
        <NavItem
          text="Screen"
          indentLevel={0}
          selected={$store.selectedComponentId === $selectedScreen?.props._id}
          opened
          scrollable
          icon="WebPage"
          on:drop={onDrop}
          on:click={() => {
            $store.selectedComponentId = $selectedScreen?.props._id
          }}
          id={`component-${$selectedScreen?.props._id}`}
        >
          <ScreenslotDropdownMenu component={$selectedScreen?.props} />
        </NavItem>
        <ComponentTree
          level={0}
          components={$selectedScreen?.props._children}
        />

        <!-- Show drop indicators for the target and the parent -->
        {#if $dndStore.dragging && $dndStore.valid}
          <DNDPositionIndicator
            component={$dndStore.target}
            position={$dndStore.dropPosition}
          />
          {#if $dndStore.dropPosition !== DropPosition.INSIDE}
            <DNDPositionIndicator
              component={$dndStore.targetParent}
              position={DropPosition.INSIDE}
            />
          {/if}
        {/if}
      </li>
    </ul>
  </ComponentScrollWrapper>
</Panel>
<ComponentKeyHandler />

<style>
  .add-component {
    padding: var(--spacing-xl) var(--spacing-l);
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    position: relative;
  }
  ul,
  li {
    min-width: max-content;
  }
</style>
