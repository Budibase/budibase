<script>
  import { ActionMenu, ActionGroup, ActionButton, MenuItem } from "@budibase/bbui"
  import { store, currentAssetName } from "builderStore"
  import structure from "./componentStructure.json"

  $: enrichedStructure = enrichStructure(structure, $store.components)

  let selectedIndex
  let anchors = []
  let popover
  $: anchor = selectedIndex === -1 ? null : anchors[selectedIndex]

  const enrichStructure = (structure, definitions) => {
    let enrichedStructure = []
    structure.forEach((item) => {
      if (typeof item === "string") {
        const def = definitions[`@budibase/standard-components/${item}`]
        if (def) {
          enrichedStructure.push({
            ...def,
            isCategory: false,
          })
        }
      } else {
        enrichedStructure.push({
          ...item,
          isCategory: true,
          children: enrichStructure(item.children || [], definitions),
        })
      }
    })
    return enrichedStructure
  }

  const onItemChosen = async (item, idx, open) => {
    if (item.isCategory) {
      // Select and open this category
      selectedIndex = idx
    } else {
      // Add this component
      await store.actions.components.create(item.component)
    }
  }
</script>

<ActionGroup>
  {#each enrichedStructure as item, idx}
    <ActionMenu disabled={!item.isCategory}>
      <ActionButton icon={item.icon} xs primary quiet slot="button" on:click={() => onItemChosen(item, idx)}>
        {item.name}
      </ActionButton>
      {#each item.children || [] as item}
        {#if !item.showOnAsset || item.showOnAsset.includes($currentAssetName)}
          <MenuItem
            dataCy={`component-${item.name}`}
            icon={item.icon}
            on:click={() => onItemChosen(item)}>
            {item.name}
          </MenuItem>
        {/if}
      {/each}
    </ActionMenu>
  {/each}
</ActionGroup>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: 24px;
    flex-wrap: wrap;
    gap: var(--spacing-l);
  }

  .category {
    color: var(--grey-7);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }
  .category span {
    font-weight: 500;
    user-select: none;
  }
  .category.active,
  .category:hover {
    color: var(--ink);
  }
  .category i:not(:last-child) {
    font-size: 16px;
  }
</style>
