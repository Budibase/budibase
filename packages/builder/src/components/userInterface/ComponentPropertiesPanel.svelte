<script>
  import PropsView from "./PropsView.svelte"
  import StateBindingControl from "./StateBindingControl.svelte"
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
  $: componentInstance = $store.currentComponentInfo //contains prop values of currently selected component
  $: componentDefinition = $store.components.find(
    c => c.name === componentInstance._component
  )

  $: panelDefinition = flattenedPanel.find(
    //use for getting controls for each component property
    c => c._component === componentInstance._component
  )

  // OLD PROPS =============================================

  $: screen_props =
    $store.currentFrontEndType === "page"
      ? getProps($store.currentPreviewItem, ["name", "favicon"])
      : getProps($store.currentPreviewItem, ["name", "description", "route"])

  const onPropChanged = store.setComponentProp
  const onStyleChanged = store.setComponentStyle

  //May be able to remove some of the nested components in PropsView, PropsControl and StateBindingControl tree

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
    return keys.map((k, i) => [k, obj[k], obj.props._id + i])
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
  .detail-prop {
    height: 40px;
    margin-bottom: 15px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 70px 1fr;
    grid-gap: 10px;
  }

  .detail-prop label {
    word-wrap: break-word;
    font-size: 13px;
    font-weight: 700;
    color: #163057;
    opacity: 0.6;
    padding-top: 13px;
    margin-bottom: 0;
  }

  input {
    height: 30px;
    padding-left: 8px;
    padding-right: 8px;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    opacity: 0.5;
  }

  input:focus {
    outline: 0;
    background-color: #fff;
    color: #666;
    border-color: #1e87f0;
  }

  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
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

  ul {
    list-style: none;
    display: flex;
    justify-content: space-between;
    padding: 0;
  }

  li {
    background: none;
    border-radius: 3px;
    width: 48px;
    height: 48px;
  }

  li button {
    width: 48px;
    height: 48px;
    background: none;
    border: none;
    border-radius: 3px;
    padding: 7px;
    outline: none;
    cursor: pointer;
    position: relative;
  }

  li:nth-last-child(1) {
    margin-right: 0px;
    background: none;
    border-radius: 3px;
    width: 48px;
    height: 48px;
  }

  .selected {
    color: var(--button-text);
    background: #f9f9f9 !important;
    width: 48px;
    height: 48px;
  }

  .button-indicator {
    position: absolute;
    top: 8px;
    right: 10px;
    color: var(--button-text);
  }
</style>
