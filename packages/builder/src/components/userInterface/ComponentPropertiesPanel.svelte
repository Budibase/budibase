<script>
  import { store } from "builderStore"
  import panelStructure from "./temporaryPanelStructure.js"
  import CategoryTab from "./CategoryTab.svelte"
  import DesignView from "./DesignView.svelte"
  import SettingsView from "./SettingsView.svelte"

  let flattenedPanel = flattenComponents(panelStructure.categories)
  let categories = [
    { value: "settings", name: "Settings" },
    { value: "design", name: "Design" },
  ]
  let selectedCategory = categories[0]

  $: componentInstance =
    $store.currentView !== "component"
      ? { ...$store.currentPreviewItem, ...$store.currentComponentInfo }
      : $store.currentComponentInfo
  $: componentDefinition = $store.components[componentInstance._component]
  $: componentPropDefinition =
    flattenedPanel.find(
      //use for getting controls for each component property
      (c) => c._component === componentInstance._component
    ) || {}

  $: panelDefinition =
    componentPropDefinition.properties &&
    componentPropDefinition.properties[selectedCategory.value]

  const onStyleChanged = store.setComponentStyle

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
    props.forEach((comp) =>
      walkProps(comp, (c) => {
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

<CategoryTab
  onClick={(category) => (selectedCategory = category)}
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
      onChange={store.setComponentProp}
      onScreenPropChange={store.setPageOrScreenProp}
      screenOrPageInstance={$store.currentView !== 'component' && $store.currentPreviewItem} />
  {/if}
</div>

<style>
  .title > div:nth-child(1) {
    grid-column-start: name;
    color: var(--ink);
  }

  .title > div:nth-child(2) {
    grid-column-start: actions;
  }

  .component-props-container {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px;
  }

  .instance-name {
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--grey-7);
  }
</style>
