<script>
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

  let current_view = "design"
  let codeEditor
  let flattenedPanel = flattenComponents(panelStructure.categories)
  let categories = [
    { name: "Design" },
    { name: "Settings" },
    { name: "Actions" },
  ]
  let selectedCategory = categories[0]

  $: components = $store.components
  $: componentInstance = $store.currentComponentInfo
  $: componentDefinition = $store.components.find(
    c => c.name === componentInstance._component
  )

  $: panelDefinition = flattenedPanel.find(
    //use for getting controls for each component property
    c => c._component === componentInstance._component
  )

  // SCREEN PROPS =============================================
  $: screen_props =
    $store.currentFrontEndType === "page"
      ? getProps($store.currentPreviewItem, ["name", "favicon"])
      : getProps($store.currentPreviewItem, ["name", "description", "route"])

  const onStyleChanged = store.setComponentStyle
  const onPropChanged = store.onPropChanged

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
    {#if current_view === 'design'}
      <DesignView
        {panelDefinition}
        {componentInstance}
        {componentDefinition}
        {onPropChanged} />
    {/if}

  </div>

</div>

<style>
  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  .title > div:nth-child(1) {
    grid-column-start: name;
    color: var(--secondary100);
  }

  .title > div:nth-child(2) {
    grid-column-start: actions;
  }

  .component-props-container {
    margin-top: 10px;
    flex: 1 1 auto;
  }
</style>
