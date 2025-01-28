<script lang="ts">
  import { onMount } from "svelte"
  import { Select, Link } from "@budibase/bbui"
  import type { Component } from "@budibase/types"
  import { getAllStateVariables, getBindableProperties } from "@/dataBinding"
  import {
    componentStore,
    selectedScreen,
    builderStore,
    previewStore,
  } from "@/stores/builder"
  import {
    decodeJSBinding,
    findHBSBlocks,
    isJSBinding,
    processStringSync,
  } from "@budibase/string-templates"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  interface ComponentUsingState {
    id: string
    name: string
    settings: string[]
  }

  $: keyOptions = getAllStateVariables($selectedScreen)
  $: bindings = getBindableProperties(
    $selectedScreen,
    $componentStore.selectedComponentId
  )

  let selectedKey: string | undefined = undefined
  let componentsUsingState: ComponentUsingState[] = []
  let componentsUpdatingState: ComponentUsingState[] = []
  let editorValue: string = ""
  let previousScreenId: string | undefined = undefined

  $: {
    const screenChanged =
      $selectedScreen && $selectedScreen._id !== previousScreenId
    const previewContext = $previewStore.selectedComponentContext || {}

    if (screenChanged) {
      selectedKey = keyOptions[0]
      componentsUsingState = []
      componentsUpdatingState = []
      editorValue = ""
      previousScreenId = $selectedScreen._id
    }

    if (keyOptions.length > 0 && !keyOptions.includes(selectedKey)) {
      selectedKey = keyOptions[0]
    }

    if (selectedKey) {
      searchComponents(selectedKey)
      editorValue = previewContext.state?.[selectedKey] ?? ""
    }
  }

  const findComponentsUpdatingState = (
    component: Component,
    stateKey: string
  ): ComponentUsingState[] => {
    let foundComponents: ComponentUsingState[] = []

    const eventHandlerProps = [
      "onClick",
      "onChange",
      "onRowClick",
      "onChange",
      "buttonOnClick",
    ]

    eventHandlerProps.forEach(eventType => {
      const handlers = component[eventType]
      if (Array.isArray(handlers)) {
        handlers.forEach(handler => {
          if (
            handler["##eventHandlerType"] === "Update State" &&
            handler.parameters?.key === stateKey
          ) {
            foundComponents.push({
              id: component._id!,
              name: component._instanceName,
              settings: [eventType],
            })
          }
        })
      }
    })

    if (component._children) {
      for (let child of component._children) {
        foundComponents = [
          ...foundComponents,
          ...findComponentsUpdatingState(child, stateKey),
        ]
      }
    }
    return foundComponents
  }

  const hasStateBinding = (value: string, stateKey: string): boolean => {
    const bindings = findHBSBlocks(value).map(binding => {
      const sanitizedBinding = binding.replace(/\\"/g, '"')
      return isJSBinding(sanitizedBinding)
        ? decodeJSBinding(sanitizedBinding)
        : sanitizedBinding
    })
    return bindings.join(" ").includes(stateKey)
  }

  const getSettingsWithState = (component: any, stateKey: string): string[] => {
    const settingsWithState: string[] = []
    for (const [setting, value] of Object.entries(component)) {
      if (typeof value === "string" && hasStateBinding(value, stateKey)) {
        settingsWithState.push(setting)
      }
    }
    return settingsWithState
  }

  const checkConditions = (conditions: any[], stateKey: string): boolean => {
    return conditions.some(condition =>
      [condition.referenceValue, condition.newValue].some(
        value => typeof value === "string" && hasStateBinding(value, stateKey)
      )
    )
  }

  const checkStyles = (styles: any, stateKey: string): boolean => {
    return (
      typeof styles?.custom === "string" &&
      hasStateBinding(styles.custom, stateKey)
    )
  }

  const findComponentsUsingState = (
    component: any,
    stateKey: string
  ): ComponentUsingState[] => {
    let componentsUsingState: ComponentUsingState[] = []
    const { _children, _styles, _conditions, ...componentSettings } = component

    const settingsWithState = getSettingsWithState(componentSettings, stateKey)
    settingsWithState.forEach(setting => {
      componentsUsingState.push({
        id: component._id,
        name: `${component._instanceName} (${setting})`,
        settings: [setting],
      })
    })

    if (_conditions?.length > 0 && checkConditions(_conditions, stateKey)) {
      componentsUsingState.push({
        id: component._id,
        name: `${component._instanceName} (conditions)`,
        settings: ["_conditions"],
      })
    }

    if (_styles && checkStyles(_styles, stateKey)) {
      componentsUsingState.push({
        id: component._id,
        name: `${component._instanceName} (styles)`,
        settings: ["_styles"],
      })
    }

    if (_children) {
      for (let child of _children) {
        componentsUsingState = [
          ...componentsUsingState,
          ...findComponentsUsingState(child, stateKey),
        ]
      }
    }

    return componentsUsingState
  }

  const searchComponents = (stateKey: string | undefined) => {
    if (!stateKey || !$selectedScreen?.props) {
      return
    }

    const componentStateUpdates = findComponentsUpdatingState(
      $selectedScreen.props,
      stateKey
    )

    componentsUsingState = findComponentsUsingState(
      $selectedScreen.props,
      stateKey
    )

    const screenStateUpdates =
      $selectedScreen?.onLoad
        ?.filter(
          (handler: any) =>
            handler["##eventHandlerType"] === "Update State" &&
            handler.parameters?.key === stateKey
        )
        .map(() => ({
          id: $selectedScreen._id,
          name: "Screen onLoad",
          settings: ["onLoad"],
        })) || []

    componentsUpdatingState = [...componentStateUpdates, ...screenStateUpdates]
  }

  const handleStateKeySelect = (key: CustomEvent) => {
    if (!key.detail && keyOptions.length > 0) {
      throw new Error("No state key selected")
    }
    searchComponents(key.detail)
  }

  const onClickComponentLink = (component: ComponentUsingState) => {
    componentStore.select(component.id)
    component.settings.forEach(setting => {
      builderStore.highlightSetting(setting)
    })
  }

  const handleStateInspectorChange = (e: CustomEvent) => {
    if (!selectedKey || !$previewStore.selectedComponentContext) {
      return
    }

    const stateUpdate = {
      [selectedKey]: processStringSync(
        e.detail,
        $previewStore.selectedComponentContext
      ),
    }
    previewStore.updateState(stateUpdate)
    editorValue = e.detail
  }

  onMount(() => {
    previewStore.requestComponentContext()
  })
</script>

<div class="state-panel">
  <div class="link">
    <Link
      href="https://docs.budibase.com/docs/app-state"
      target="_blank"
      secondary
    >
      Learn how to use State within Budibase.
    </Link>
  </div>
  <div class="section">
    <Select
      label="State variables"
      bind:value={selectedKey}
      placeholder={keyOptions.length > 0 ? false : "No state variables found"}
      options={keyOptions}
      on:change={handleStateKeySelect}
    />
  </div>
  {#if selectedKey && keyOptions.length > 0}
    <div class="section">
      <DrawerBindableInput
        value={editorValue}
        title={`Set value for "${selectedKey}"`}
        placeholder="Enter a value"
        label="Set temporary value for design preview"
        on:change={e => handleStateInspectorChange(e)}
        {bindings}
      />
    </div>
  {/if}
  {#if componentsUsingState.length > 0}
    <div class="section">
      <span class="text">Updates:</span>
      <div class="updates-section">
        {#each componentsUsingState as component}
          <button
            class="component-link updates-colour"
            on:click={() => onClickComponentLink(component)}
          >
            {component.name}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  {#if componentsUpdatingState.length > 0}
    <div class="section">
      <span class="text">Controlled by:</span>
      <div class="updates-section">
        {#each componentsUpdatingState as component}
          <button
            class="component-link controlled-by-colour"
            on:click={() => onClickComponentLink(component)}
          >
            {component.name}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .state-panel {
    background-color: var(--spectrum-alias-background-color-primary);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .text {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--spectrum-global-dimension-font-size-50);
  }

  .updates-colour {
    color: var(--spectrum-global-color-blue-700);
  }
  .controlled-by-colour {
    color: var(--spectrum-global-color-orange-700);
  }
  .component-link {
    display: inline-block;
    border: none;
    background: none;
    text-decoration: underline;
    cursor: pointer;
    font-size: var(--spectrum-global-dimension-font-size-50);
    padding: 0;
    white-space: nowrap;
  }
  .component-link:hover {
    text-decoration: underline;
  }

  .updates-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .link {
    color: var(--spectrum-global-color-gray-600);
    margin-top: var(--spacing-m);
  }

  .link:hover {
    color: var(--spectrum-global-color-gray-700);
  }
</style>
