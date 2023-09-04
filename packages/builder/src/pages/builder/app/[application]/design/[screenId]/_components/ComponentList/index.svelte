<script>
  import { notifications, Icon, Body } from "@budibase/bbui"
  import { isActive, goto } from "@roxi/routify"
  import { store, selectedScreen, userSelectedResourceMap } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import { dndStore } from "./dndStore.js"
  import ScreenslotDropdownMenu from "./ScreenslotDropdownMenu.svelte"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import { DropPosition } from "./dndStore"
  import ComponentKeyHandler from "./ComponentKeyHandler.svelte"
  import ComponentScrollWrapper from "./ComponentScrollWrapper.svelte"

  let scrolling = false

  const toNewComponentRoute = () => {
    if ($isActive(`./:componentId/new`)) {
      $goto(`./:componentId`)
    } else {
      $goto(`./:componentId/new`)
    }
  }

  const onDrop = async () => {
    try {
      await dndStore.actions.drop()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving component")
    }
  }

  const handleScroll = e => {
    scrolling = e.target.scrollTop !== 0
  }
</script>

<div class="components">
  <div class="header" class:scrolling>
    <Body size="S">Components</Body>
    <div on:click={toNewComponentRoute} class="addButton">
      <Icon name="Add" />
    </div>
  </div>
  <div class="list-panel">
    <ComponentScrollWrapper on:scroll={handleScroll}>
      <ul>
        <li>
          <NavItem
            text="Screen"
            indentLevel={0}
            selected={$store.selectedComponentId ===
              `${$store.selectedScreenId}-screen`}
            opened
            scrollable
            icon="WebPage"
            on:drop={onDrop}
            on:click={() => {
              $store.selectedComponentId = `${$store.selectedScreenId}-screen`
            }}
            id={`component-screen`}
            selectedBy={$userSelectedResourceMap[
              `${$store.selectedScreenId}-screen`
            ]}
          >
            <ScreenslotDropdownMenu component={$selectedScreen?.props} />
          </NavItem>
          <NavItem
            text="Navigation"
            indentLevel={0}
            selected={$store.selectedComponentId ===
              `${$store.selectedScreenId}-navigation`}
            opened
            scrollable
            icon={$selectedScreen.showNavigation
              ? "Visibility"
              : "VisibilityOff"}
            on:drop={onDrop}
            on:click={() => {
              $store.selectedComponentId = `${$store.selectedScreenId}-navigation`
            }}
            id={`component-nav`}
            selectedBy={$userSelectedResourceMap[
              `${$store.selectedScreenId}-navigation`
            ]}
          />
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
  </div>
  <ComponentKeyHandler />
</div>

<style>
  .components {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .header {
    height: 50px;
    box-sizing: border-box;
    padding: var(--spacing-l);
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: border-bottom 130ms ease-out;
  }
  .header.scrolling {
    border-bottom: var(--border-light);
  }

  .components :global(.nav-item) {
    padding-right: 8px !important;
  }

  .addButton {
    margin-left: auto;
    color: var(--grey-7);
    cursor: pointer;
  }

  .addButton:hover {
    color: var(--ink);
  }

  .list-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
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
