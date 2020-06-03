<script>
  import { setContext, onMount } from "svelte"
  import PropsView from "./PropsView.svelte"
  import { store } from "builderStore"
  import IconButton from "components/common/IconButton.svelte"
  import {
    LayoutIcon,
    PaintIcon,
    TerminalIcon,
    CircleIndicator,
    EventsIcon,
  } from "components/common/Icons/"
  import CodeEditor from "./CodeEditor.svelte"
  import LayoutEditor from "./LayoutEditor.svelte"
  import EventsEditor from "./EventsEditor"

  import panelStructure from "./temporaryPanelStructure.js"
  import CategoryTab from "./CategoryTab.svelte"
  import DesignView from "./DesignView.svelte"
  import SettingsView from "./SettingsView.svelte"

  let current_view = "design"
  let codeEditor
  let flattenedPanel = flattenComponents(panelStructure.categories)
  let categories = [
    { value: "design", name: "Design" },
    { value: "settings", name: "Settings" },
    { value: "events", name: "Events" },
  ]
  let selectedCategory = categories[0]

  $: components = $store.components
  $: componentInstance = $store.currentComponentInfo
  $: componentDefinition = $store.components[componentInstance._component]
  $: componentPropDefinition =
    flattenedPanel.find(
      //use for getting controls for each component property
      c => c._component === componentInstance._component
    ) || {}

  $: panelDefinition = componentPropDefinition.properties
    ? componentPropDefinition.properties[selectedCategory.value]
    : {}

  // SCREEN PROPS =============================================
  $: screen_props =
    $store.currentFrontEndType === "page"
      ? getProps($store.currentPreviewItem, ["name", "favicon"])
      : getProps($store.currentPreviewItem, ["name", "description", "route"])

  const onStyleChanged = store.setComponentStyle
  const onPropChanged = store.setComponentProp

  function walkProps(component, action) {
    action(component)
    if (component.children) {
      for (let child of component.children) {
        walkProps(child, action)
      }
    }
  }

  function flattenComponents(props) {
    const components = []
    props.forEach(comp =>
      walkProps(comp, c => {
        if ("_component" in c) {
          components.push(c)
        }
      })
    )
    return components
  }

  function getProps(obj, keys) {
    return keys.map((key, i) => [key, obj[key], obj.props._id + i])
  }
</script>

<div class="root">

  <CategoryTab
    onClick={category => (selectedCategory = category)}
    {categories}
    {selectedCategory} />

  <div class="component-props-container">
    {#if selectedCategory.value === 'design'}
      <DesignView {panelDefinition} {componentInstance} {onStyleChanged} />
    {:else if selectedCategory.value === 'settings'}
      <SettingsView
        {componentInstance}
        {componentDefinition}
        {panelDefinition}
        onChange={onPropChanged} />
    {:else if selectedCategory.value === 'events'}
      <EventsEditor component={componentInstance} />
    {/if}

  </div>

</div>

<style>
  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
    /* Merge Check */
    overflow-x: hidden;
    overflow-y: hidden;
    padding: 20px;
    box-sizing: border-box;
    /* Merge Check */
  }

  .title > div:nth-child(1) {
    grid-column-start: name;
    color: var(--ink);
  }

  .title > div:nth-child(2) {
    grid-column-start: actions;
  }

  .component-props-container {
    margin-top: 20px;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }
</style>
