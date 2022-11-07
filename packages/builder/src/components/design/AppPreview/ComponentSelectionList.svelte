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

  $: enrichedStructure = enrichStructure(
    structure,
    $store.components,
    $store.customComponents
  )

  const isChildAllowed = ({ name }, selectedComponent) => {
    const currentComponent = store.actions.components.getDefinition(
      selectedComponent?._component
    )
    return currentComponent?.illegalChildren?.includes(name.toLowerCase())
  }

  // Parses the structure in the manifest and returns an enriched structure with
  // explicit categories
  const enrichStructure = (structure, definitions, customComponents) => {
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

    // Add custom components category
    if (customComponents?.length) {
      enrichedStructure.push({
        name: "Plugins",
        icon: "Plug",
        isCategory: true,
        children: customComponents
          .map(x => ({
            ...definitions[x],
            name: definitions[x].friendlyName || definitions[x].name,
          }))
          .sort((a, b) => {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
          }),
      })
    }

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
