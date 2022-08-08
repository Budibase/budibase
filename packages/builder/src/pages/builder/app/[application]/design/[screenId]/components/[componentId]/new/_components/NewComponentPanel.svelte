<script>
  import Panel from "components/design/Panel.svelte"
  import { goto } from "@roxi/routify"
  import {
    Layout,
    ActionGroup,
    ActionButton,
    Search,
    Icon,
    Body,
    notifications,
  } from "@budibase/bbui"
  import structure from "./componentStructure.json"
  import { store, selectedComponent } from "builderStore"
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"

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

<div class="container" transition:fly|local={{ x: 260, duration: 300 }}>
  <Panel
    title="Add component"
    showCloseButton
    onClickCloseButton={() => $goto("../")}
    borderLeft
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
      {#if searchString || section === "components"}
        {#if filteredStructure.length}
          {#each filteredStructure as category}
            <Layout noPadding gap="XS">
              <div class="category-label">{category.name}</div>
              {#each category.children as component}
                <div
                  data-cy={`component-${component.name}`}
                  class="component"
                  class:selected={selectedIndex ===
                    orderMap[component.component]}
                  on:click={() => addComponent(component.component)}
                  on:mouseover={() => (selectedIndex = null)}
                >
                  <Icon name={component.icon} />
                  <Body size="XS">{component.name}</Body>
                </div>
              {/each}
            </Layout>
          {/each}
        {:else}
          <Body size="S">
            There aren't any components matching the current filter
          </Body>
        {/if}
      {:else}
        <Body size="S">Blocks are collections of pre-built components</Body>
        <Layout noPadding gap="XS">
          {#each blocks as block}
            <div
              class="component"
              on:click={() => addComponent(block.component)}
            >
              <Icon name={block.icon} />
              <Body size="XS">{block.name}</Body>
            </div>
          {/each}
        </Layout>
      {/if}
    </Layout>
  </Panel>
</div>

<style>
  .container {
    position: fixed;
    right: 0;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
  .category-label {
    color: var(--spectrum-global-color-gray-600);
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    margin-top: var(--spacing-xs);
  }
  .component {
    background: var(--spectrum-global-color-gray-200);
    border-radius: 4px;
    display: flex;
    align-items: center;
    border: 1px solid var(--spectrum-global-color-gray-200);
    transition: background 130ms ease-out, border-color 130ms ease-out;
    flex-direction: row;
    justify-content: flex-start;
    padding: var(--spacing-s) var(--spacing-l);
    gap: var(--spacing-m);
    overflow: hidden;
  }
  .component.selected {
    border-color: var(--spectrum-global-color-blue-400);
  }
  .component:hover {
    background: var(--spectrum-global-color-gray-300);
    cursor: pointer;
  }
  .component :global(.spectrum-Body) {
    line-height: 1.2 !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
