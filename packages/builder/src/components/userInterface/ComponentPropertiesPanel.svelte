<script>
  import { setContext, onMount } from "svelte"

  import { store } from "builderStore"
  import IconButton from "components/common/IconButton.svelte"
  import {
    LayoutIcon,
    PaintIcon,
    TerminalIcon,
    CircleIndicator,
    EventsIcon,
  } from "components/common/Icons/"
  import EventsEditor from "./EventsEditor"
  import panelStructure from "./temporaryPanelStructure.js"
  import CategoryTab from "./CategoryTab.svelte"
  import DesignView from "./DesignView.svelte"
  import SettingsView from "./SettingsView.svelte"

  let current_view = "design"
  let codeEditor
  let flattenedPanel = flattenComponents(panelStructure.categories)
  let categories = [
    { value: "settings", name: "Settings" },
    { value: "design", name: "Design" },
    { value: "events", name: "Events" },
  ]
  let selectedCategory = categories[0]

  $: components = $store.components
  $: componentInstance =
    $store.currentView !== "component"
      ? { ...$store.currentPreviewItem, ...$store.currentComponentInfo }
      : $store.currentComponentInfo
  $: componentDefinition = $store.components[componentInstance._component]
  $: componentPropDefinition =
    flattenedPanel.find(
      //use for getting controls for each component property
      c => c._component === componentInstance._component
    ) || {}

  let panelDefinition = {}

  $: panelDefinition =
    componentPropDefinition.properties &&
    componentPropDefinition.properties[selectedCategory.value]

  const onStyleChanged = store.setComponentStyle

  function onPropChanged(key, value) {
    if ($store.currentView !== "component") {
      store.setPageOrScreenProp(key, value)
      return
    }
    store.setComponentProp(key, value)
  }

  $: isComponentOrScreen =
    $store.currentView === "component" ||
    $store.currentFrontEndType === "screen"
  $: isNotScreenslot = componentInstance._component !== "##builtin/screenslot"

  $: displayName =
    isComponentOrScreen && componentInstance._instanceName && isNotScreenslot

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

  {#if displayName}
    <div class="instance-name">{componentInstance._instanceName}</div>
  {/if}

  <div class="component-props-container">
    {#if selectedCategory.value === 'design'}
      <DesignView {panelDefinition} {componentInstance} {onStyleChanged} />
    {:else if selectedCategory.value === 'settings'}
      <SettingsView
        {componentInstance}
        {componentDefinition}
        {panelDefinition}
        displayNameField={displayName}
        onChange={onPropChanged}
        screenOrPageInstance={$store.currentView !== 'component' && $store.currentPreviewItem} />
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
    padding: 20px;
    box-sizing: border-box;
  }

  .title > div:nth-child(1) {
    grid-column-start: name;
    color: var(--ink);
  }

  .title > div:nth-child(2) {
    grid-column-start: actions;
  }

  .component-props-container {
    margin-top: 16px;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  .instance-name {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--grey-7);
  }
</style>
