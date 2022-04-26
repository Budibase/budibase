<script>
  import NavigationPanel from "components/design/NavigationPanel/NavigationPanel.svelte"
  import { goto } from "@roxi/routify"
  import {
    Layout,
    ActionGroup,
    ActionButton,
    Search,
    DetailSummary,
    Icon,
    Body,
  } from "@budibase/bbui"
  import structure from "./componentStructure.json"
  import { store } from "builderStore"

  let section = "components"
  let searchString

  $: enrichedStructure = enrichStructure(structure, $store.components)
  $: filteredStructure = filterStructure(
    enrichedStructure,
    section,
    searchString
  )

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

  const filterStructure = (structure, section, search) => {
    if (!structure?.length) {
      return []
    }

    if (section === "components") {
      structure = structure.filter(category => category.name !== "Blocks")
    } else {
      structure = structure.filter(category => category.name === "Blocks")
    }
    if (search) {
      let filteredStructure = []
      structure.forEach(category => {
        let matchedChildren = category.children.filter(child => {
          return child.name.toLowerCase().includes(search.toLowerCase())
        })
        if (matchedChildren.length) {
          filteredStructure.push({
            ...category,
            children: matchedChildren,
          })
        }
      })
      structure = filteredStructure
    }
    return structure
  }

  const addComponent = () => {}
</script>

<NavigationPanel
  title="Add component"
  showBackButton
  onClickBackButton={() => $goto("../slot")}
  wide
>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <ActionGroup compact justified>
      <ActionButton
        fullWidth
        selected={section === "components"}
        on:click={() => (section = "components")}>Components</ActionButton
      >
      <ActionButton
        fullWidth
        selected={section === "blocks"}
        on:click={() => (section = "blocks")}>Blocks</ActionButton
      >
    </ActionGroup>
    <Search
      placeholder="Search"
      value={searchString}
      on:change={e => (searchString = e.detail)}
    />
  </Layout>
  {#each filteredStructure as category}
    <DetailSummary name={category.name} collapsible={false}>
      <div class="component-grid">
        {#each category.children as component}
          <div class="component" on:click={() => addComponent(component)}>
            <Icon name={component.icon} />
            <Body size="XS">{component.name}</Body>
          </div>
        {/each}
      </div>
    </DetailSummary>
  {/each}
</NavigationPanel>

<style>
  .component-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--spacing-s);
  }
  .component {
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: 4px;
    height: 72px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 var(--spacing-s);
    gap: var(--spacing-s);
    padding-top: 4px;
    transition: background 130ms ease-out;
    line-height: 1.2;
  }
  .component:hover {
    cursor: pointer;
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
