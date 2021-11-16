<script context="module">
  let SettingsDefinitionCache = {}
</script>

<script>
  import { getContext, setContext } from "svelte"
  import { writable, get } from "svelte/store"
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

  // The enriched component settings
  let enrichedSettings

  // Any prop overrides that need to be applied due to conditional UI
  let conditionalSettings

  // Settings are hashed when inside the builder preview and used as a key,
  // so that components fully remount whenever any settings change
  let hash = 0

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

  // Interactive components can be selected, dragged and highlighted inside
  // the builder preview
  $: interactive =
    $builderStore.inBuilder &&
    ($builderStore.previewType === "layout" || insideScreenslot) &&
    !isBlock
  $: editable = definition.editable
  $: editing = editable && selected && $builderStore.editMode
  $: draggable = !inDragPath && interactive && !isLayout && !isScreen
  $: droppable = interactive && !isLayout && !isScreen

  // Empty components are those which accept children but do not have any.
  // Empty states can be shown for these components, but can be disabled
  // in the component manifest.
  $: empty = interactive && !children.length && definition?.hasChildren
  $: emptyState = empty && definition?.showEmptyState !== false

  // Raw props are all props excluding internal props and children
  $: rawSettings = getRawSettings(instance)
  $: instanceKey = hashString(JSON.stringify(rawSettings))

  // Component settings are those which are intended for this component and
  // which need to be enriched
  $: componentSettings = getComponentSettings(rawSettings, settingsDefinition)
  $: enrichComponentSettings(rawSettings, instanceKey, $context)

  // Nested settings are those which are intended for child components inside
  // blocks and which should not be enriched at this level
  $: nestedSettings = getNestedSettings(rawSettings, settingsDefinition)

  // Evaluate conditional UI settings and store any component setting changes
  // which need to be made
  $: evaluateConditions(enrichedSettings?._conditions)

  // Build up the final settings object to be passed to the component
  $: settings = {
    ...enrichedSettings,
    ...nestedSettings,
    ...conditionalSettings,
  }

  // Render key is used when in the builder preview to fully remount
  // components when settings are changed
  $: renderKey = `${hash}-${emptyState}`

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

  const getComponentDefinition = component => {
    const prefix = "@budibase/standard-components/"
    const type = component?.replace(prefix, "")
    return type ? Manifest[type] : null
  }

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

  const getComponentSettings = (rawSettings, settingsDefinition) => {
    let clone = { ...rawSettings }
    settingsDefinition?.forEach(setting => {
      if (setting.nested) {
        delete clone[setting.key]
      }
    })
    return clone
  }

  const getNestedSettings = (rawSettings, settingsDefinition) => {
    let clone = { ...rawSettings }
    settingsDefinition?.forEach(setting => {
      if (!setting.nested) {
        delete clone[setting.key]
      }
    })
    return clone
  }

  // Enriches any string component props using handlebars
  const enrichComponentSettings = (rawSettings, instanceKey, context) => {
    const instanceSame = instanceKey === lastInstanceKey
    const contextSame = context.key === lastContextKey

    if (instanceSame && contextSame) {
      return
    } else {
      lastInstanceKey = instanceKey
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

    // Update the component props.
    // Most props are deeply compared so that svelte will only trigger reactive
    // statements on props that have actually changed.
    if (!newEnrichedSettings) {
      return
    }
    let propsChanged = false
    if (!enrichedSettings) {
      enrichedSettings = {}
      propsChanged = true
    }
    Object.keys(newEnrichedSettings).forEach(key => {
      if (!propsAreSame(newEnrichedSettings[key], enrichedSettings[key])) {
        propsChanged = true
        enrichedSettings[key] = newEnrichedSettings[key]
      }
    })

    // Update the hash if we're in the builder so we can fully remount this
    // component
    if (get(builderStore).inBuilder && propsChanged) {
      hash = hashString(JSON.stringify(enrichedSettings))
    }
  }

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
</script>

{#key renderKey}
  {#if constructor && settings && (visible || inSelectedPath)}
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
      <svelte:component this={constructor} {...settings}>
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
