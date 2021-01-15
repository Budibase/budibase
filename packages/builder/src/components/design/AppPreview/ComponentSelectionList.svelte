<script>
  import { goto } from "@sveltech/routify"
  import {
    store,
    currentAssetName,
    selectedComponent,
    currentAssetId,
  } from "builderStore"
  import structure from "./componentStructure.json"
  import { DropdownMenu } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  $: enrichedStructure = enrichStructure(structure, $store.components)

  let selectedIndex
  let anchors = []
  let popover
  $: anchor = selectedIndex === -1 ? null : anchors[selectedIndex]

  const enrichStructure = (structure, definitions) => {
    let enrichedStructure = []
    structure.forEach(item => {
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

  const onItemChosen = (item, idx) => {
    if (item.isCategory) {
      // Select and open this category
      selectedIndex = idx
      popover.show()
    } else {
      // Add this component
      store.actions.components.create(item.component)
      popover.hide()
    }
  }
</script>

<div class="container">
  {#each enrichedStructure as item, idx}
    <div
      bind:this={anchors[idx]}
      class="category"
      on:click={() => onItemChosen(item, idx)}
      class:active={idx === selectedIndex}>
      {#if item.icon}<i class={item.icon} />{/if}
      <span>{item.name}</span>
      {#if item.isCategory}<i class="ri-arrow-down-s-line arrow" />{/if}
    </div>
  {/each}
</div>
<DropdownMenu
  on:close={() => (selectedIndex = null)}
  bind:this={popover}
  {anchor}
  align="left">
  <DropdownContainer>
    {#each enrichedStructure[selectedIndex].children as item}
      {#if !item.showOnAsset || item.showOnAsset.includes($currentAssetName)}
        <DropdownItem
          icon={item.icon}
          title={item.name}
          on:click={() => onItemChosen(item)} />
      {/if}
    {/each}
  </DropdownContainer>
</DropdownMenu>

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
    gap: var(--spacing-xs);
    font-size: var(--font-size-xs);
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
