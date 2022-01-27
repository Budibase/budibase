<script>
  import {
    ActionMenu,
    ActionButton,
    MenuItem,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import { store, currentAssetName, selectedComponent } from "builderStore"
  import structure from "./componentStructure.json"
  import { randomizeIds } from "../../../builderStore/componentUtils"
  import { cloneDeep } from "lodash/fp"

  $: enrichedStructure = enrichStructure(structure, $store.components)

  const isChildAllowed = ({ name }, selectedComponent) => {
    const currentComponent = store.actions.components.getDefinition(
      selectedComponent?._component
    )
    return currentComponent?.illegalChildren?.includes(name.toLowerCase())
  }

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
      try {
        await store.actions.components.create(item.component)
      } catch (error) {
        notifications.error("Error creating component")
      }
    }
  }

  const onCustomBlockChosen = async customBlock => {
    try {
      // Randomize all ID's inside the block definition
      const definition = cloneDeep(customBlock.definition)
      randomizeIds(definition)
      await store.actions.components.create("customblock", {
        ...customBlock,
        definition,
      })
    } catch (error) {
      notifications.error("Error creating component")
    }
  }
</script>

<div class="components">
  {#each enrichedStructure as item}
    <ActionMenu disabled={!item.isCategory}>
      <ActionButton
        icon={item.icon}
        disabled={!item.isCategory && isChildAllowed(item, $selectedComponent)}
        quiet
        size="S"
        slot="control"
        dataCy={`category-${item.name}`}
        on:click={() => onItemChosen(item)}
      >
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
            on:click={() => onItemChosen(item)}
            disabled={isChildAllowed(item, $selectedComponent)}
          >
            {item.name}
          </MenuItem>
        {/if}
      {/each}
    </ActionMenu>
  {/each}
  {#if $store.customBlocks?.length}
    <ActionMenu>
      <ActionButton
        icon="Article"
        quiet
        size="S"
        slot="control"
        dataCy="category-custom"
      >
        <div class="buttonContent">
          Custom blocks
          <Icon size="S" name="ChevronDown" />
        </div>
      </ActionButton>
      {#each $store.customBlocks as block}
        <MenuItem
          dataCy={`component-custom-${block.name}`}
          icon="Article"
          on:click={() => onCustomBlockChosen(block)}
        >
          {block.name}
        </MenuItem>
      {/each}
    </ActionMenu>
  {/if}
</div>

<style>
  .components {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .components :global(> *) {
    height: 32px;
    display: grid;
    place-items: center;
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
