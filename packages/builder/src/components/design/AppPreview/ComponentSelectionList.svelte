<script>
  import {
    ActionMenu,
    ActionGroup,
    ActionButton,
    MenuItem,
    Icon,
  } from "@budibase/bbui"
  import { store, currentAssetName } from "builderStore"
  import structure from "./componentStructure.json"

  $: enrichedStructure = enrichStructure(structure, $store.components)

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

  const onItemChosen = async item => {
    if (!item.isCategory) {
      await store.actions.components.create(item.component)
    }
  }
</script>

<div class="components">
  {#each enrichedStructure as item}
    <ActionMenu disabled={!item.isCategory}>
      <ActionButton
        icon={item.icon}
        quiet
        size="S"
        slot="control"
        dataCy={`category-${item.name}`}
        on:click={() => onItemChosen(item)}>
        <div class="buttonContent">
          {item.name}
          {#if item.isCategory}
            <Icon size="S" name="ChevronDown" />
          {/if}
        </div>
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
</div>

<style>
  .components {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    margin-top: -10px;
  }
  .components :global(> *) {
    margin-top: 10px;
  }

  .buttonContent {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
  }
  .buttonContent :global(svg) {
    margin-left: 2px !important;
    margin-right: 0 !important;
    margin-bottom: -1px;
  }
</style>
