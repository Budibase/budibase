<script>
  import Panel from "components/design/Panel.svelte"
  import { goto } from "@roxi/routify"
  import {
    Layout,
    ActionGroup,
    ActionButton,
    Search,
    DetailSummary,
    Icon,
    Body,
    Divider,
    notifications,
  } from "@budibase/bbui"
  import structure from "./componentStructure.json"
  import { store, selectedComponent } from "builderStore"
  import { onMount } from "svelte"

  let section = "components"
  let searchString
  let searchRef
  let selectedIndex
  let componentList = []

  $: currentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: enrichedStructure = enrichStructure(structure, $store.components)
  $: filteredStructure = filterStructure(
    enrichedStructure,
    section,
    currentDefinition,
    searchString
  )
  $: blocks = enrichedStructure.find(x => x.name === "Blocks").children
  $: orderMap = createComponentOrderMap(componentList)

  // Creates a simple lookup map from an array, so we can find the selected
  // component much faster
  const createComponentOrderMap = list => {
    let map = {}
    list.forEach((component, idx) => {
      map[component] = idx
    })
    return map
  }

  // Parses the structure in the manifest and returns an enriched structure with
  // explicit categories
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

  const filterStructure = (structure, section, currentDefinition, search) => {
    selectedIndex = search ? 0 : null
    componentList = []
    if (!structure?.length) {
      return []
    }

    // Remove blocks if there is no search string
    if (!search) {
      structure = structure.filter(category => category.name !== "Blocks")
    }

    // Return only items which match the search string
    let filteredStructure = []
    structure.forEach(category => {
      let matchedChildren = category.children.filter(child => {
        const name = child.name.toLowerCase()

        // Check if the component matches the search string
        if (search && !name.includes(search.toLowerCase())) {
          return false
        }

        // Check if the component is allowed as a child
        return !currentDefinition?.illegalChildren?.includes(name)
      })
      if (matchedChildren.length) {
        filteredStructure.push({
          ...category,
          children: matchedChildren,
        })

        // Create a flat list of all components so that we can reference them by
        // order later
        componentList = componentList.concat(
          matchedChildren.map(x => x.component)
        )
      }
    })
    structure = filteredStructure
    return structure
  }

  const addComponent = async component => {
    try {
      await store.actions.components.create(component)
      $goto("../")
    } catch (error) {
      notifications.error("Error creating component")
    }
  }

  const handleKeyDown = e => {
    if (e.key === "Tab") {
      // Cycle selected components on tab press
      if (selectedIndex == null) {
        selectedIndex = 0
      } else {
        selectedIndex = (selectedIndex + 1) % componentList.length
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    } else if (e.key === "Enter") {
      // Add selected component on enter press
      if (componentList[selectedIndex]) {
        addComponent(componentList[selectedIndex])
      }
    }
  }

  onMount(() => {
    searchRef.focus()
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })
</script>

<Panel
  title="Add component"
  showBackButton
  onClickBackButton={() => $goto("../slot")}
  borderRight
>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Search
      placeholder="Search"
      value={searchString}
      on:change={e => (searchString = e.detail)}
      bind:inputRef={searchRef}
    />
    {#if !searchString}
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
    {/if}
  </Layout>
  <div>
    <Divider noMargin noGrid />
  </div>
  {#if searchString || section === "components"}
    {#each filteredStructure as category}
      <DetailSummary name={category.name} collapsible={false}>
        <div class="component-grid">
          {#each category.children as component}
            <div
              class="component"
              class:selected={selectedIndex === orderMap[component.component]}
              on:click={() => addComponent(component.component)}
              on:mouseover={() => (selectedIndex = null)}
            >
              <Icon name={component.icon} />
              <Body size="XS">{component.name}</Body>
            </div>
          {/each}
        </div>
      </DetailSummary>
    {/each}
  {:else}
    <Layout paddingX="L" paddingY="XL" gap="S">
      <Body size="S">Blocks are collections of pre-built components</Body>
      <Layout noPadding gap="XS">
        {#each blocks as block}
          <div
            class="component block"
            on:click={() => addComponent(block.component)}
          >
            <Icon name={block.icon} />
            <Body size="XS">{block.name}</Body>
          </div>
        {/each}
      </Layout>
    </Layout>
  {/if}
</Panel>

<style>
  .component-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
    border: 1px solid var(--spectrum-global-color-gray-200);
    transition: border-color 130ms ease-out;
  }
  .component.selected,
  .component:hover {
    border-color: var(--spectrum-global-color-blue-400);
  }
  .component:hover {
    cursor: pointer;
  }
  .component :global(.spectrum-Body) {
    line-height: 1.2 !important;
  }

  .block {
    flex-direction: row;
    justify-content: flex-start;
    height: 48px;
    padding: 0 var(--spacing-l);
    gap: var(--spacing-m);
  }
</style>
