<script context="module">
  // Cache the definition of settings for each component type
  let SettingsDefinitionCache = {}
  let SettingsDefinitionMapCache = {}

  // Cache the settings of each component ID.
  // This speeds up remounting as well as repeaters.
  let InstanceSettingsCache = {}
</script>

<script>
  import { getContext, setContext, onMount } from "svelte"
  import { writable, get } from "svelte/store"
  import {
    enrichProps,
    propsAreSame,
    getSettingsDefinition,
  } from "utils/componentProps"
  import {
    builderStore,
    devToolsStore,
    componentStore,
    appStore,
    dndComponentPath,
    dndIsDragging,
  } from "stores"
  import { Helpers } from "@budibase/bbui"
  import { getActiveConditions, reduceConditionActions } from "utils/conditions"
  import EmptyPlaceholder from "components/app/EmptyPlaceholder.svelte"
  import ScreenPlaceholder from "components/app/ScreenPlaceholder.svelte"
  import ComponentErrorState from "components/error-states/ComponentErrorState.svelte"
  import { BudibasePrefix } from "../stores/components.js"
  import {
    decodeJSBinding,
    findHBSBlocks,
    isJSBinding,
  } from "@budibase/string-templates"
  import {
    getActionContextKey,
    getActionDependentContextKeys,
  } from "../utils/buttonActions.js"
  import { gridLayout } from "utils/grid"

  export let instance = {}
  export let parent = null
  export let isLayout = false
  export let isRoot = false
  export let isBlock = false

  // Get parent contexts
  const context = getContext("context")
  const insideScreenslot = !!getContext("screenslot")
  const component = getContext("component")

  // Create component context
  const store = writable({})
  setContext("component", store)

  // Ref to the svelte component
  let ref

  // Initial settings are passed in on first render of the component.
  // When the first instance of cachedSettings are set, this object is set to
  // reference cachedSettings, so that mutations to cachedSettings also affect
  // initialSettings, but it does not get caught by svelte invalidation - which
  // would happen if we spread cachedSettings directly to the component.
  let initialSettings

  // Dynamic settings contain bindings and need enriched
  let dynamicSettings

  // Static settings do not contain any bindings and can be passed on down
  let staticSettings

  // The enriched component settings
  let enrichedSettings

  // Any setting overrides that need to be applied due to conditional UI
  let conditionalSettings

  // Resultant cached settings which will be passed to the component instance.
  // These are a combination of the enriched, nested and conditional settings.
  let cachedSettings

  // Conditional UI expressions, enriched and ready to evaluate
  let conditions

  // Latest timestamp that we started a props update.
  // Due to enrichment now being async, we need to avoid overwriting newer
  // settings with old ones, depending on how long enrichment takes.
  let latestUpdateTime

  // Keep track of stringified representations of context and instance
  // to avoid enriching bindings as much as possible
  let lastInstanceKey

  // Visibility flag used by conditional UI
  let visible = true

  // Component information derived during initialisation
  let constructor
  let definition
  let settingsDefinition
  let settingsDefinitionMap
  let missingRequiredSettings = false

  // Temporary styles which can be added in the app preview for things like
  // DND. We clear these whenever a new instance is received.
  let ephemeralStyles

  // Single string of all HBS blocks, used to check if we use a certain binding
  // or not
  let bindingString = ""

  // List of context keys which we use inside bindings
  let knownContextKeyMap = {}

  // Cleanup function to stop observing context changes when unmounting
  let unobserve

  // Set up initial state for each new component instance
  $: initialise(instance)

  // Extract component instance info
  $: children = instance._children || []
  $: id = instance._id
  $: name = isRoot ? "Screen" : instance._instanceName
  $: icon = definition?.icon

  // Determine if the component is selected or is part of the critical path
  // leading to the selected component
  $: selected =
    $builderStore.inBuilder && $builderStore.selectedComponentId === id
  $: inSelectedPath = $componentStore.selectedComponentPath?.includes(id)
  $: inDragPath = inSelectedPath && $builderStore.editMode
  $: inDndPath = $dndComponentPath?.includes(id)

  // Derive definition properties which can all be optional, so need to be
  // coerced to booleans
  $: hasChildren = !!definition?.hasChildren
  $: showEmptyState = definition?.showEmptyState !== false
  $: hasMissingRequiredSettings = missingRequiredSettings?.length > 0
  $: editable = !!definition?.editable && !hasMissingRequiredSettings
  $: requiredAncestors = definition?.requiredAncestors || []
  $: missingRequiredAncestors = requiredAncestors.filter(
    ancestor => !$component.ancestors.includes(`${BudibasePrefix}${ancestor}`)
  )
  $: hasMissingRequiredAncestors = missingRequiredAncestors?.length > 0
  $: errorState = hasMissingRequiredSettings || hasMissingRequiredAncestors

  // Interactive components can be selected, dragged and highlighted inside
  // the builder preview
  $: builderInteractive =
    $builderStore.inBuilder && insideScreenslot && !isBlock && !instance.static
  $: devToolsInteractive = $devToolsStore.allowSelection && !isBlock
  $: interactive = builderInteractive || devToolsInteractive
  $: editing = editable && selected && $builderStore.editMode
  $: draggable =
    !inDragPath &&
    interactive &&
    !isLayout &&
    !isRoot &&
    !isBlock &&
    definition?.draggable !== false
  $: droppable = interactive
  $: builderHidden =
    $builderStore.inBuilder && $builderStore.hiddenComponentIds?.includes(id)

  // Empty components are those which accept children but do not have any.
  // Empty states can be shown for these components, but can be disabled
  // in the component manifest.
  $: empty =
    !isBlock &&
    ((interactive && !children.length && hasChildren) ||
      hasMissingRequiredSettings)
  $: emptyState = empty && showEmptyState

  // Evaluate conditional UI settings and store any component setting changes
  // which need to be made
  $: evaluateConditions(conditions)

  // Determine and apply settings to the component
  $: applySettings(staticSettings, enrichedSettings, conditionalSettings)

  // Determine custom css.
  // Broken out as a separate variable to minimize reactivity updates.
  $: customCSS = cachedSettings?._css

  // Scroll the selected element into view
  $: selected && scrollIntoView()

  // Themes
  $: currentTheme = $context?.device?.theme
  $: darkMode = !currentTheme?.includes("light")

  // Apply ephemeral styles (such as when resizing grid components)
  $: normalStyles = {
    ...instance._styles?.normal,
    ...ephemeralStyles,
  }

  // Metadata to pass into grid action to apply CSS
  const checkGrid = x =>
    x?._component?.endsWith("/container") && x?.layout === "grid"
  $: insideGrid = checkGrid(parent)
  $: isGrid = checkGrid(instance)
  $: gridMetadata = {
    insideGrid,
    ignoresLayout: definition?.ignoresLayout === true,
    id,
    interactive,
    styles: normalStyles,
    draggable,
    definition,
    errored: errorState,
  }

  // When dragging and dropping, pad components to allow dropping between
  // nested layers. Only reset this when dragging stops.
  let pad = false
  $: pad = pad || (!isGrid && interactive && hasChildren && inDndPath)
  $: $dndIsDragging, (pad = false)

  // Update component context
  $: store.set({
    id,
    children: children.length,
    styles: {
      ...instance._styles,
      normal: normalStyles,
      custom: customCSS,
      id,
      empty: emptyState,
      selected,
      interactive,
      isRoot,
      draggable,
      editable,
      isBlock,
    },
    empty: emptyState,
    selected,
    isRoot,
    inSelectedPath,
    name,
    editing,
    type: instance._component,
    errorState,
    parent: id,
    ancestors: [...($component?.ancestors ?? []), instance._component],
    path: [...($component?.path ?? []), id],
    darkMode,
  })

  const initialise = (instance, force = false) => {
    if (instance == null) {
      return
    }

    // Ensure we're processing a new instance
    const stringifiedInstance = JSON.stringify(instance)
    const instanceKey = Helpers.hashString(stringifiedInstance)
    if (instanceKey === lastInstanceKey && !force) {
      return
    } else {
      lastInstanceKey = instanceKey
    }

    // Reset ephemeral state
    ephemeralStyles = null

    // Pull definition and constructor
    const component = instance._component
    constructor = componentStore.actions.getComponentConstructor(component)
    definition = componentStore.actions.getComponentDefinition(component)
    if (!definition) {
      return
    }

    const cacheId = `${definition.name}${
      definition?.deprecated === true ? "_deprecated" : ""
    }`
    // Get the settings definition for this component, and cache it
    if (SettingsDefinitionCache[cacheId]) {
      settingsDefinition = SettingsDefinitionCache[cacheId]
      settingsDefinitionMap = SettingsDefinitionMapCache[cacheId]
    } else {
      settingsDefinition = getSettingsDefinition(definition)
      settingsDefinitionMap = getSettingsDefinitionMap(settingsDefinition)
      SettingsDefinitionCache[cacheId] = settingsDefinition
      SettingsDefinitionMapCache[cacheId] = settingsDefinitionMap
    }

    // Parse the instance settings, and cache them
    let instanceSettings
    if (InstanceSettingsCache[instanceKey]) {
      instanceSettings = InstanceSettingsCache[instanceKey]
    } else {
      instanceSettings = getInstanceSettings(instance, settingsDefinition)
      InstanceSettingsCache[instanceKey] = instanceSettings
    }

    // Update the settings types
    staticSettings = instanceSettings.staticSettings
    dynamicSettings = instanceSettings.dynamicSettings

    // Check if we have any missing required settings
    missingRequiredSettings = settingsDefinition.filter(setting => {
      let empty = instance[setting.key] == null || instance[setting.key] === ""
      let missing = setting.required && empty

      // Check if this setting depends on another, as it may not be required
      if (setting.dependsOn) {
        const dependsOnKey = setting.dependsOn.setting || setting.dependsOn
        const dependsOnValue = setting.dependsOn.value
        const realDependentValue = instance[dependsOnKey]

        const sectionDependsOnKey =
          setting.sectionDependsOn?.setting || setting.sectionDependsOn
        const sectionDependsOnValue = setting.sectionDependsOn?.value
        const sectionRealDependentValue = instance[sectionDependsOnKey]

        if (dependsOnValue == null && realDependentValue == null) {
          return false
        }
        if (dependsOnValue != null && dependsOnValue !== realDependentValue) {
          return false
        }

        if (
          sectionDependsOnValue != null &&
          sectionDependsOnValue !== sectionRealDependentValue
        ) {
          return false
        }
      }

      return missing
    })

    // When considering bindings we can ignore children, so we remove that
    // before storing the reference stringified version
    const noChildren = JSON.stringify({ ...instance, _children: null })
    const bindings = findHBSBlocks(noChildren).map(binding => {
      let sanitizedBinding = binding.replace(/\\"/g, '"')
      if (isJSBinding(sanitizedBinding)) {
        return decodeJSBinding(sanitizedBinding)
      } else {
        return sanitizedBinding
      }
    })

    // The known context key map is built up at runtime, as changes to keys are
    // encountered. We manually seed this to the required action keys as these
    // are not encountered at runtime and so need computed in advance.
    knownContextKeyMap = generateActionKeyMap(instance, settingsDefinition)
    bindingString = bindings.join(" ")

    // Run any migrations
    runMigrations(instance, settingsDefinition)

    // Force an initial enrichment of the new settings
    enrichComponentSettings(get(context), settingsDefinitionMap)

    // Start observing changes in context now that we are initialised
    if (!unobserve) {
      unobserve = context.actions.observeChanges(handleContextChange)
    }
  }

  // Extracts a map of all context keys which are required by action settings
  // to provide the functions to evaluate at runtime. This needs done manually
  // as the action definitions themselves do not specify bindings for action
  // keys, meaning we cannot do this while doing the other normal bindings.
  const generateActionKeyMap = (instance, settingsDefinition) => {
    let map = {}
    settingsDefinition.forEach(setting => {
      if (setting.type === "event") {
        instance[setting.key]?.forEach(action => {
          // We depend on the actual action key
          const actionKey = getActionContextKey(action)
          if (actionKey) {
            map[actionKey] = true
          }

          // We also depend on any manually declared context keys
          getActionDependentContextKeys(action)?.forEach(key => {
            map[key] = true
          })
        })
      }
    })
    return map
  }

  const runMigrations = (instance, settingsDefinition) => {
    settingsDefinition.forEach(setting => {
      // Migrate "table" settings to ensure they have a type and resource ID
      if (setting.type === "table") {
        const val = instance[setting.key]
        if (val) {
          if (!val.type) {
            val.type = "table"
          }
          if (!val.resourceId) {
            if (val.type === "viewV2") {
              val.resourceId = val.id
            } else {
              val.resourceId = val.tableId
            }
          }
        }
      }
    })
  }

  const getSettingsDefinitionMap = settingsDefinition => {
    let map = {}
    settingsDefinition?.forEach(setting => {
      map[setting.key] = setting
    })
    return map
  }

  const getInstanceSettings = (instance, settingsDefinition) => {
    // Get raw settings
    let settings = {}
    Object.entries(instance)
      .filter(([name]) => !name.startsWith("_"))
      .forEach(([key, value]) => {
        settings[key] = value
      })
    let newStaticSettings = { ...settings }
    let newDynamicSettings = { ...settings }

    // Attach some internal properties which we assume always need enriched
    newDynamicSettings["_conditions"] = instance._conditions
    newDynamicSettings["_css"] = instance._styles?.custom

    // Derive static, dynamic and nested settings if the instance changed
    settingsDefinition?.forEach(setting => {
      if (setting.nested) {
        delete newDynamicSettings[setting.key]
      } else {
        const value = settings[setting.key]
        if (value == null) {
          delete newDynamicSettings[setting.key]
        } else if (typeof value === "string" && value.includes("{{")) {
          // Strings can be trivially checked
          delete newStaticSettings[setting.key]
        } else if (setting.type === "event") {
          // Always treat button actions as dynamic
          delete newStaticSettings[setting.key]
        } else if (typeof value === "object") {
          // Stringify and check objects
          const stringified = JSON.stringify(value)
          if (stringified.includes("{{")) {
            delete newStaticSettings[setting.key]
          } else {
            delete newDynamicSettings[setting.key]
          }
        } else {
          // For other types, we can safely assume they are static
          delete newDynamicSettings[setting.key]
        }
      }
    })

    return {
      staticSettings: newStaticSettings,
      dynamicSettings: newDynamicSettings,
    }
  }

  // Generates the array of conditional UI expressions, accounting for both
  // nested and non-nested settings, extracting a mixture of values from both
  // the un-enriched and enriched settings
  const generateConditions = () => {
    if (!enrichedSettings?._conditions) {
      conditions = []
      return
    }
    conditions = enrichedSettings._conditions.map(condition => {
      const raw = instance._conditions?.find(x => x.id === condition.id)
      if (settingsDefinitionMap[condition.setting]?.nested && raw) {
        return { ...condition, settingValue: raw.settingValue }
      } else {
        return condition
      }
    })
  }

  // Enriches any string component props using handlebars
  const enrichComponentSettings = (context, settingsDefinitionMap) => {
    // Record the timestamp so we can reference it after enrichment
    latestUpdateTime = Date.now()
    const enrichmentTime = latestUpdateTime

    // Enrich settings with context
    const newEnrichedSettings = enrichProps(
      dynamicSettings,
      context,
      settingsDefinitionMap
    )

    // Abandon this update if a newer update has started
    if (enrichmentTime !== latestUpdateTime) {
      return
    }

    // Store new enriched settings
    enrichedSettings = newEnrichedSettings

    // Once settings have been enriched, re-evaluate conditions
    generateConditions()
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
  const applySettings = (
    staticSettings,
    enrichedSettings,
    conditionalSettings
  ) => {
    const allSettings = {
      ...staticSettings,
      ...enrichedSettings,
      ...conditionalSettings,
    }
    if (!cachedSettings) {
      cachedSettings = { ...allSettings }
      initialSettings = cachedSettings
    } else {
      // We need to compare all keys from both the current and previous settings, as
      // keys may have disappeared in the current set which would otherwise be ignored
      // if we only checked the current set keys
      const keys = new Set(Object.keys(allSettings))
      Object.keys(cachedSettings).forEach(key => keys.add(key))
      keys.forEach(key => {
        const same = propsAreSame(allSettings[key], cachedSettings[key])
        if (!same) {
          // Updated cachedSettings (which is assigned by reference to
          // initialSettings) so that if we remount the component then the
          // initial props are up to date. By setting it this way rather than
          // setting it on initialSettings directly, we avoid a double render.
          cachedSettings[key] = allSettings[key]

          // Don't update components for internal properties
          if (key.startsWith("_")) {
            return
          }

          if (ref?.$$set) {
            // Programmatically set the prop to avoid svelte reactive statements
            // firing inside components. This circumvents the problems caused by
            // spreading a props object.
            ref.$$set({ [key]: allSettings[key] })
          } else {
            // Sometimes enrichment can occur multiple times before the
            // component has mounted and been assigned a ref.
            // In these cases, for some reason we need to update the
            // initial settings object, even though it is equivalent by
            // reference to cached settings. This solves the problem of multiple
            // initial enrichments, while also not causing wasted renders for
            // any components not affected by this issue.
            initialSettings[key] = allSettings[key]
          }
        }
      })
    }
  }

  const scrollIntoView = async () => {
    const className = insideGrid ? id : `${id}-dom`
    const node = document.getElementsByClassName(className)[0]
    if (!node) {
      return
    }
    // Don't scroll into view if we selected this component because we were
    // starting dragging on it
    if (
      get(dndIsDragging) ||
      (insideGrid && node.classList.contains("dragging"))
    ) {
      return
    }
    node.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "start",
    })
  }

  const handleContextChange = key => {
    // Check if we already know if this key is used
    let used = knownContextKeyMap[key]

    // If we don't know, check and cache
    if (used == null) {
      const searchString = key === "snippets" ? key : `[${key}]`
      used = bindingString.indexOf(searchString) !== -1
      knownContextKeyMap[key] = used
    }

    // Enrich settings if we use this key
    if (used) {
      enrichComponentSettings($context, settingsDefinitionMap)
    }
  }

  const getDataContext = () => {
    const normalContext = get(context)
    const additionalContext = ref?.getAdditionalDataContext?.()
    return {
      ...normalContext,
      ...additionalContext,
    }
  }

  onMount(() => {
    // Register this component instance for external access
    if ($appStore.isDevApp) {
      if (!componentStore.actions.isComponentRegistered(id)) {
        componentStore.actions.registerInstance(id, {
          component: instance._component,
          getSettings: () => cachedSettings,
          getRawSettings: () => ({ ...staticSettings, ...dynamicSettings }),
          getDataContext,
          reload: () => initialise(instance, true),
          setEphemeralStyles: styles => (ephemeralStyles = styles),
          state: store,
        })
      }
    }
    return () => {
      // Unregister component
      if (componentStore.actions.isComponentRegistered(id)) {
        componentStore.actions.unregisterInstance(id)
      }

      // Stop observing context changes
      unobserve?.()
    }
  })
</script>

{#if constructor && initialSettings && (visible || inSelectedPath) && !builderHidden}
  <!-- The ID is used as a class because getElementsByClassName is O(1) -->
  <!-- and the performance matters for the selection indicators -->
  <div
    class={`component ${id}`}
    class:draggable
    class:droppable
    class:empty
    class:interactive
    class:editing
    class:pad
    class:parent={hasChildren}
    class:block={isBlock}
    class:error={errorState}
    class:root={isRoot}
    data-id={id}
    data-name={name}
    data-icon={icon}
    data-parent={$component.id}
    use:gridLayout={gridMetadata}
  >
    {#if errorState}
      <ComponentErrorState
        {missingRequiredSettings}
        {missingRequiredAncestors}
      />
    {:else}
      <svelte:component this={constructor} bind:this={ref} {...initialSettings}>
        {#if children.length}
          {#each children as child (child._id)}
            <svelte:self instance={child} parent={instance} />
          {/each}
        {:else if emptyState}
          {#if isRoot}
            <ScreenPlaceholder />
          {:else}
            <EmptyPlaceholder />
          {/if}
        {:else if isBlock}
          <slot />
        {/if}
      </svelte:component>
    {/if}
  </div>
{/if}

<style>
  .component {
    display: contents;
  }
  .component.pad :global(> *) {
    padding: var(--spacing-m) !important;
    gap: var(--spacing-m) !important;
    border: 2px dashed var(--spectrum-global-color-gray-400) !important;
    border-radius: 4px !important;
    transition: padding 260ms ease-out, border 260ms ease-out;
  }
  .interactive {
    cursor: default !important;
  }
</style>
