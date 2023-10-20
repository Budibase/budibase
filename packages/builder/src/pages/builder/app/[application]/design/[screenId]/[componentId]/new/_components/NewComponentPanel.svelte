<script>
  import Panel from "components/design/Panel.svelte"
  import { goto } from "@roxi/routify"
  import { Layout, Search, Icon, Body, notifications } from "@budibase/bbui"
  import structure from "./componentStructure.json"
  import { store, selectedComponent, selectedScreen } from "builderStore"
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"
  import { findComponentPath } from "builderStore/componentUtils"

  let searchString
  let searchRef
  let selectedIndex
  let componentList = []

  $: allowedComponents = getAllowedComponents(
    $store.components,
    $selectedScreen,
    $selectedComponent
  )
  $: enrichedStructure = enrichStructure(
    structure,
    $store.components,
    $store.customComponents
  )
  $: filteredStructure = filterStructure(
    enrichedStructure,
    allowedComponents,
    searchString
  )
  $: orderMap = createComponentOrderMap(componentList)

  const getAllowedComponents = (allComponents, screen, component) => {
    // Default to using the root screen container if no component specified
    if (!component) {
      component = screen.props
    }
    const path = findComponentPath(screen?.props, component?._id)
    if (!path?.length) {
      return []
    }

    // Get initial set of allowed components
    let allowedComponents = []
    const definition = store.actions.components.getDefinition(
      component?._component
    )
    if (definition.legalDirectChildren?.length) {
      allowedComponents = definition.legalDirectChildren.map(x => {
        return `@budibase/standard-components/${x}`
      })
    } else {
      allowedComponents = Object.keys(allComponents)
    }

    // Build up list of illegal children from ancestors
    let illegalChildren = definition.illegalChildren || []
    path.forEach(ancestor => {
      if (ancestor._component === `@budibase/standard-components/sidepanel`) {
        illegalChildren = []
      }
      const def = store.actions.components.getDefinition(ancestor._component)
      const blacklist = def?.illegalChildren?.map(x => {
        return `@budibase/standard-components/${x}`
      })
      illegalChildren = [...illegalChildren, ...(blacklist || [])]
    })
    illegalChildren = [...new Set(illegalChildren)]

    // Filter out illegal children from allowed components
    allowedComponents = allowedComponents.filter(x => {
      return !illegalChildren.includes(x)
    })

    return allowedComponents
  }

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
  const enrichStructure = (structure, definitions, customComponents) => {
    let enrichedStructure = []

    // Add custom components category
    if (customComponents?.length) {
      enrichedStructure.push({
        name: "Plugins",
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

    // Swap blocks and plugins
    let tmp = enrichedStructure[1]
    enrichedStructure[1] = enrichedStructure[0]
    enrichedStructure[0] = tmp

    return enrichedStructure
  }

  const filterStructure = (structure, allowedComponents, search) => {
    selectedIndex = search ? 0 : null
    componentList = []
    if (!structure?.length) {
      return []
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
        return allowedComponents.includes(child.component)
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
    } catch (error) {
      notifications.error(error || "Error creating component")
    }
  }

  const handleKeyDown = e => {
    if (e.key === "Tab" || e.key === "ArrowDown" || e.key === "ArrowUp") {
      // Cycle selected components on tab press
      if (selectedIndex == null) {
        selectedIndex = 0
      } else {
        const direction = e.key === "ArrowUp" ? -1 : 1
        selectedIndex = (selectedIndex + direction) % componentList.length
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

  const onDragStart = component => {
    store.actions.dnd.start(component)
  }

  const onDragEnd = () => {
    store.actions.dnd.stop()
  }
</script>

<div class="container" transition:fly|local={{ x: 260, duration: 300 }}>
  <Panel
    title="Add component"
    showCloseButton
    onClickCloseButton={() => $goto("../")}
    borderLeft
    wide
  >
    <Layout paddingX="L" paddingY="XL" gap="S">
      <Search
        placeholder="Search"
        value={searchString}
        on:change={e => (searchString = e.detail)}
        bind:inputRef={searchRef}
      />
      {#if filteredStructure.length}
        {#each filteredStructure as category}
          <Layout noPadding gap="XS">
            <div class="category-label">{category.name}</div>
            {#each category.children as component}
              <div
                draggable="true"
                on:dragstart={() => onDragStart(component.component)}
                on:dragend={onDragEnd}
                class="component"
                class:selected={selectedIndex === orderMap[component.component]}
                on:click={() => addComponent(component.component)}
                on:mouseover={() => (selectedIndex = null)}
                on:focus
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
    </Layout>
  </Panel>
</div>

<style>
  .container {
    position: fixed;
    right: 0;
    z-index: 1;
    height: calc(100% - 60px);
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
