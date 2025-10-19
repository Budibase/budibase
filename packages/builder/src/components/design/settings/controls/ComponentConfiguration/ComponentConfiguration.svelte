<script>
  import DraggableList from "../DraggableList.svelte"
  import ComponentSetting from "./ComponentSetting.svelte"
  import { createEventDispatcher } from "svelte"
  import { Helpers } from "@budibase/bbui"
  import { componentStore } from "@/stores/builder"
  import { getEventContextBindings } from "@/dataBinding"
  import { cloneDeep, isEqual } from "lodash/fp"

  export let componentInstance
  export let componentBindings
  export let bindings
  export let value
  export let key
  export let nested
  export let max
  export let component // The component type to configure (e.g., "dataprovider", "plugin/my-plugin")

  const dispatch = createEventDispatcher()

  let cachedValue

  $: if (!isEqual(value, cachedValue)) {
    cachedValue = cloneDeep(value)
  }
  $: componentList = sanitizeValue(cachedValue) || []
  $: componentCount = componentList.length
  $: eventContextBindings = getEventContextBindings({
    componentInstance,
    settingKey: key,
  })
  $: allBindings = [...bindings, ...eventContextBindings]
  $: itemProps = {
    componentBindings: componentBindings || [],
    bindings: allBindings,
    removeComponent,
    nested,
    showInstanceName: true,
  }
  $: canAddComponents = max == null || componentList.length < max
  $: resolvedComponentType = resolveComponentType(component)
  $: componentDefinition = resolvedComponentType
    ? componentStore.getDefinition(resolvedComponentType)
    : null
  $: componentFriendlyName =
    componentDefinition?.friendlyName ||
    componentDefinition?.name ||
    "component"

  // Dispatch sanitized value if it differs from input to ensure proper instances
  $: {
    const sanitized = sanitizeValue(cachedValue)
    if (sanitized && cachedValue && !isEqual(sanitized, cachedValue)) {
      dispatch("change", sanitized)
    }
  }

  const sanitizeValue = val => {
    if (!Array.isArray(val)) {
      return null
    }
    return val
      ?.map(comp => {
        return comp._component ? comp : buildPseudoInstance(comp)
      })
      .filter(comp => comp != null)
  }

  const resolveComponentType = componentType => {
    if (!componentType) return null

    // If it's already a full component reference, use it
    if (componentType.startsWith("@") || componentType.startsWith("plugin/")) {
      return componentType
    }

    // Otherwise, assume it's a standard component
    return `@budibase/standard-components/${componentType}`
  }

  const processItemUpdate = e => {
    const updatedComponent = e.detail
    const newComponentList = [...componentList]
    const componentIdx = newComponentList.findIndex(c => {
      return c._id === updatedComponent?._id
    })
    if (componentIdx === -1) {
      newComponentList.push(updatedComponent)
    } else {
      newComponentList[componentIdx] = updatedComponent
    }
    cachedValue = cloneDeep(newComponentList)
    dispatch("change", newComponentList)
  }

  const listUpdated = e => {
    cachedValue = cloneDeep(e.detail)
    dispatch("change", [...e.detail])
  }

  const buildPseudoInstance = cfg => {
    const componentType = resolvedComponentType
    if (!componentType) {
      console.warn(
        "No component type resolved for componentConfiguration, component prop:",
        component
      )
      return null
    }

    const definition = componentStore.getDefinition(componentType)
    if (!definition) {
      console.warn(
        `Component definition not found for ${componentType}, creating basic instance`
      )
      // Create a basic instance for plugin components that might not be loaded yet
      return {
        _id: Helpers.uuid(),
        _component: componentType,
        _instanceName: cfg._instanceName || Helpers.uuid(),
        ...cfg,
      }
    }

    try {
      const instance = componentStore.createInstance(componentType, {
        _instanceName: cfg._instanceName || Helpers.uuid(),
        ...cfg,
      })
      if (!instance || !instance._id) {
        console.warn(`Failed to create valid instance of ${componentType}`)
        return null
      }
      return instance
    } catch (error) {
      console.error(`Error creating instance of ${componentType}:`, error)
      return null
    }
  }

  const addComponent = () => {
    const newComponent = buildPseudoInstance({
      _instanceName: `${componentFriendlyName} ${componentCount + 1}`,
    })
    if (newComponent) {
      const newList = [...componentList, newComponent]
      cachedValue = cloneDeep(newList)
      dispatch("change", newList)
    }
  }

  const removeComponent = id => {
    const newList = componentList.filter(component => component._id !== id)
    cachedValue = cloneDeep(newList)
    dispatch("change", newList)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="component-configuration">
  {#if !componentDefinition}
    <div class="missing-component-message">
      Missing Component {componentFriendlyName}
    </div>
  {:else}
    {#if componentCount}
      <DraggableList
        on:change={listUpdated}
        on:itemChange={processItemUpdate}
        items={componentList}
        listItemKey={"_id"}
        listType={ComponentSetting}
        listTypeProps={itemProps}
        draggable={componentCount > 1}
      />
    {/if}
    <div
      class="list-footer"
      class:disabled={!canAddComponents}
      on:click={addComponent}
      class:empty={!componentCount}
    >
      <div class="add-component">
        Add {componentFriendlyName}
      </div>
    </div>
  {/if}
</div>

<style>
  .component-configuration :global(.spectrum-ActionButton) {
    width: 100%;
  }

  .component-configuration :global(.list-wrap > li:last-child),
  .component-configuration :global(.list-wrap) {
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
    border-bottom: 0px;
  }

  .list-footer {
    width: 100%;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    transition: background-color ease-in-out 130ms;
    display: flex;
    justify-content: center;
    border: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
    cursor: pointer;
  }
  .list-footer.empty {
    border-radius: 4px;
  }
  .list-footer.disabled {
    color: var(--spectrum-global-color-gray-500);
    pointer-events: none;
  }
  .list-footer:hover {
    background-color: var(
      --spectrum-table-row-background-color-hover,
      var(--spectrum-alias-highlight-hover)
    );
  }

  .add-component {
    margin: var(--spacing-s);
  }

  .missing-component-message {
    color: var(--spectrum-global-color-gray-700);
    padding: var(--spacing-m);
    text-align: center;
  }
</style>
