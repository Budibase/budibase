<script context="module">
  let SettingsDefinitionCache = {}
</script>

<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import * as AppComponents from "components/app"
  import Router from "./Router.svelte"
  import { enrichProps, propsAreSame } from "utils/componentProps"
  import { builderStore } from "stores"
  import { hashString } from "utils/helpers"
  import Manifest from "manifest.json"
  import { getActiveConditions, reduceConditionActions } from "utils/conditions"
  import Placeholder from "components/app/Placeholder.svelte"

  export let instance = {}
  export let isLayout = false
  export let isScreen = false
  export let isBlock = false

  // Component settings are the un-enriched settings for this component that
  // need to be enriched at this level.
  // Nested settings are the un-enriched block settings that are to be passed on
  // and enriched at a deeper level.
  let componentSettings
  let nestedSettings

  // The enriched component settings
  let enrichedSettings

  // Any setting overrides that need to be applied due to conditional UI
  let conditionalSettings

  // Resultant cached settings which will be passed to the component instance.
  // These are a combination of the enriched, nested and conditional settings.
  let cachedSettings

  // Latest timestamp that we started a props update.
  // Due to enrichment now being async, we need to avoid overwriting newer
  // settings with old ones, depending on how long enrichment takes.
  let latestUpdateTime

  // Keep track of stringified representations of context and instance
  // to avoid enriching bindings as much as possible
  let lastContextKey
  let lastInstanceKey

  // Visibility flag used by conditional UI
  let visible = true

  // Get contexts
  const context = getContext("context")
  const insideScreenslot = !!getContext("screenslot")

  // Create component context
  const componentStore = writable({})
  setContext("component", componentStore)

  // Extract component instance info
  $: constructor = getComponentConstructor(instance._component)
  $: definition = getComponentDefinition(instance._component)
  $: settingsDefinition = getSettingsDefinition(definition)
  $: children = instance._children || []
  $: id = instance._id
  $: name = instance._instanceName

  // Determine if the component is selected or is part of the critical path
  // leading to the selected component
  $: selected =
    $builderStore.inBuilder && $builderStore.selectedComponentId === id
  $: inSelectedPath = $builderStore.selectedComponentPath?.includes(id)
  $: inDragPath = inSelectedPath && $builderStore.editMode

  // Derive definition properties which can all be optional, so need to be
  // coerced to booleans
  $: editable = !!definition?.editable
  $: hasChildren = !!definition?.hasChildren
  $: showEmptyState = definition?.showEmptyState !== false

  // Interactive components can be selected, dragged and highlighted inside
  // the builder preview
  $: interactive =
    $builderStore.inBuilder &&
    ($builderStore.previewType === "layout" || insideScreenslot) &&
    !isBlock
  $: editing = editable && selected && $builderStore.editMode
  $: draggable = !inDragPath && interactive && !isLayout && !isScreen
  $: droppable = interactive && !isLayout && !isScreen

  // Empty components are those which accept children but do not have any.
  // Empty states can be shown for these components, but can be disabled
  // in the component manifest.
  $: empty = interactive && !children.length && hasChildren
  $: emptyState = empty && showEmptyState

  // Raw settings are all settings excluding internal props and children
  $: rawSettings = getRawSettings(instance)
  $: instanceKey = hashString(JSON.stringify(rawSettings))

  // Update and enrich component settings
  $: updateSettings(rawSettings, instanceKey, settingsDefinition, $context)

  // Evaluate conditional UI settings and store any component setting changes
  // which need to be made
  $: evaluateConditions(enrichedSettings?._conditions)

  // Build up the final settings object to be passed to the component
  $: cacheSettings(enrichedSettings, nestedSettings, conditionalSettings)

  // Render key is used to determine when components need to fully remount
  $: renderKey = getRenderKey(id, editing)

  // Update component context
  $: componentStore.set({
    id,
    children: children.length,
    styles: {
      ...instance._styles,
      id,
      empty: emptyState,
      interactive,
      draggable,
      editable,
    },
    empty: emptyState,
    selected,
    name,
    editing,
  })

  // Extracts all settings from the component instance
  const getRawSettings = instance => {
    let validSettings = {}
    Object.entries(instance)
      .filter(([name]) => name === "_conditions" || !name.startsWith("_"))
      .forEach(([key, value]) => {
        validSettings[key] = value
      })
    return validSettings
  }

  // Gets the component constructor for the specified component
  const getComponentConstructor = component => {
    const split = component?.split("/")
    const name = split?.[split.length - 1]
    if (name === "screenslot" && $builderStore.previewType !== "layout") {
      return Router
    }
    return AppComponents[name]
  }

  // Gets this component's definition from the manifest
  const getComponentDefinition = component => {
    const prefix = "@budibase/standard-components/"
    const type = component?.replace(prefix, "")
    return type ? Manifest[type] : null
  }

  // Gets the definition of this component's settings from the manifest
  const getSettingsDefinition = definition => {
    if (!definition) {
      return []
    }
    if (SettingsDefinitionCache[definition.name]) {
      return SettingsDefinitionCache[definition.name]
    }
    let settings = []
    definition.settings?.forEach(setting => {
      if (setting.section) {
        settings = settings.concat(setting.settings || [])
      } else {
        settings.push(setting)
      }
    })
    SettingsDefinitionCache[definition] = settings
    return settings
  }

  // Updates and enriches component settings when raw settings change
  const updateSettings = (settings, key, settingsDefinition, context) => {
    const instanceChanged = key !== lastInstanceKey

    // Derive component and nested settings if the instance changed
    if (instanceChanged) {
      splitRawSettings(settings, settingsDefinition)
    }

    // Enrich component settings
    enrichComponentSettings(componentSettings, context, instanceChanged)

    // Update instance key
    if (instanceChanged) {
      lastInstanceKey = key
    }
  }

  // Splits the raw settings into those destined for the component itself
  // and nexted settings for child components inside blocks
  const splitRawSettings = (rawSettings, settingsDefinition) => {
    let newComponentSettings = { ...rawSettings }
    let newNestedSettings = { ...rawSettings }
    settingsDefinition?.forEach(setting => {
      if (setting.nested) {
        delete newComponentSettings[setting.key]
      } else {
        delete newNestedSettings[setting.key]
      }
    })
    componentSettings = newComponentSettings
    nestedSettings = newNestedSettings
  }

  // Enriches any string component props using handlebars
  const enrichComponentSettings = (rawSettings, context, instanceChanged) => {
    const contextChanged = context.key !== lastContextKey

    // Skip enrichment if the context and instance are unchanged
    if (!contextChanged) {
      if (!instanceChanged) {
        return
      }
    } else {
      lastContextKey = context.key
    }

    // Record the timestamp so we can reference it after enrichment
    latestUpdateTime = Date.now()
    const enrichmentTime = latestUpdateTime

    // Enrich settings with context
    const newEnrichedSettings = enrichProps(rawSettings, context)

    // Abandon this update if a newer update has started
    if (enrichmentTime !== latestUpdateTime) {
      return
    }

    enrichedSettings = newEnrichedSettings
  }

  // Evaluates the list of conditional UI conditions and determines any setting
  // or visibility changes required
  const evaluateConditions = conditions => {
    if (!conditions?.length) {
      return
    }

    // Default visible to false if there is a show condition
    let nextVisible = !conditions.find(condition => condition.action === "show")

    // Execute conditions and determine settings and visibility changes
    const activeConditions = getActiveConditions(conditions)
    const result = reduceConditionActions(activeConditions)
    if (result.visible != null) {
      nextVisible = result.visible
    }

    // Update state from condition results
    conditionalSettings = result.settingUpdates
    visible = nextVisible
  }

  // Combines and caches all settings which will be passed to the component
  // instance. Settings are aggressively memoized to avoid triggering svelte
  // reactive statements as much as possible.
  const cacheSettings = (enriched, nested, conditional) => {
    const allSettings = { ...enriched, ...nested, ...conditional }
    if (!cachedSettings) {
      cachedSettings = allSettings
    } else {
      Object.keys(allSettings).forEach(key => {
        if (!propsAreSame(allSettings[key], cachedSettings[key])) {
          cachedSettings[key] = allSettings[key]
        }
      })
    }
  }

  // Generates a key used to determine when components need to fully remount.
  // Currently only toggling editing requires remounting.
  const getRenderKey = (id, editing) => {
    return hashString(`${id}-${editing}`)
  }
</script>

{#key renderKey}
  {#if constructor && cachedSettings && (visible || inSelectedPath)}
    <!-- The ID is used as a class because getElementsByClassName is O(1) -->
    <!-- and the performance matters for the selection indicators -->
    <div
      class={`component ${id}`}
      class:draggable
      class:droppable
      class:empty
      class:interactive
      class:editing
      class:block={isBlock}
      data-id={id}
      data-name={name}
    >
      <svelte:component this={constructor} {...cachedSettings}>
        {#if children.length}
          {#each children as child (child._id)}
            <svelte:self instance={child} />
          {/each}
        {:else if emptyState}
          <Placeholder />
        {:else if isBlock}
          <slot />
        {/if}
      </svelte:component>
    </div>
  {/if}
{/key}

<style>
  .component {
    display: contents;
  }
  .interactive :global(*:hover) {
    cursor: pointer;
  }
  .draggable :global(*:hover) {
    cursor: grab;
  }
  .editing :global(*:hover) {
    cursor: auto;
  }
</style>
