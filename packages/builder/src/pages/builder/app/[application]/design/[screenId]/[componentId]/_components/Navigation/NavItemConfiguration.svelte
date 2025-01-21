<script>
  import { navigationStore } from "@/stores/builder"
  import DraggableList from "@/components/design/settings/controls/DraggableList/DraggableList.svelte"
  import NavItem from "./NavItem.svelte"
  import { generate } from "shortid"
  import { getSequentialName } from "@/helpers/duplicate"
  import { Constants } from "@budibase/frontend-core"

  export let bindings

  $: navItems = enrichNavItems($navigationStore.links)
  $: navItemProps = {
    removeNavItem,
    bindings,
  }

  const enrichNavItems = links => {
    return (links || []).map(link => ({
      ...link,
      id: link.id || generate(),
    }))
  }

  const save = async links => {
    await navigationStore.save({ ...$navigationStore, links })
  }

  const handleNavItemUpdate = async e => {
    const newNavItem = e.detail
    const newLinks = [...navItems]
    const idx = newLinks.findIndex(link => {
      return link.id === newNavItem?.id
    })
    if (idx === -1) {
      newLinks.push(newNavItem)
    } else {
      newLinks[idx] = newNavItem
    }
    await save(newLinks)
  }

  const handleListUpdate = async e => {
    await save([...e.detail])
  }

  const addNavItem = async () => {
    await save([
      ...navItems,
      {
        id: generate(),
        text: getSequentialName(navItems, "Nav Item ", {
          getName: x => x.text,
        }),
        url: "",
        roleId: Constants.Roles.BASIC,
        type: "link",
      },
    ])
  }

  const removeNavItem = async id => {
    await save(navItems.filter(navItem => navItem.id !== id))
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="link-configuration">
  {#if navItems.length}
    <DraggableList
      on:change={handleListUpdate}
      on:itemChange={handleNavItemUpdate}
      items={navItems}
      listItemKey="id"
      listType={NavItem}
      listTypeProps={navItemProps}
      draggable={navItems.length > 1}
    />
  {/if}

  <div class="list-footer" on:click={addNavItem} class:empty={!navItems.length}>
    <div class="add-button">Add nav item</div>
  </div>
</div>

<style>
  .link-configuration :global(.list-wrap > li:last-child),
  .link-configuration :global(.list-wrap) {
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
    border-bottom: none;
  }
  .list-footer {
    width: 100%;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    transition: background-color ease-in-out 130ms;
    display: flex;
    justify-content: center;
    border: 1px solid var(--spectrum-alias-border-color-mid);
    cursor: pointer;
  }
  .list-footer.empty {
    border-radius: 4px;
  }
  .list-footer:hover {
    background-color: var(
      --spectrum-table-row-background-color-hover,
      var(--spectrum-alias-highlight-hover)
    );
  }

  .add-button {
    margin: var(--spacing-s);
  }
</style>
