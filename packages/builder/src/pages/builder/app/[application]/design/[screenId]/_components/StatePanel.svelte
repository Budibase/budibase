<script lang="ts">
  import { onMount } from "svelte"
  import { Select } from "@budibase/bbui"
  import type { Component } from "@budibase/types"
  import { getAllStateVariables, getBindableProperties } from "@/dataBinding"
  import {
    componentStore,
    selectedScreen,
    builderStore,
    previewStore,
    findComponentsBySettingsType,
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
    const hasScreenChanged =
      $selectedScreen && $selectedScreen._id !== previousScreenId
    const previewContext = $previewStore.selectedComponentContext || {}

    if (hasScreenChanged) {
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

    let eventHandlers: string[] = []
    if ($selectedScreen) {
      let componentSettings = findComponentsBySettingsType(
        $selectedScreen,
        "event",
        $componentStore.components
      )

      // Get an array of all event handlers within this component
      eventHandlers = [
        ...new Set(componentSettings.map(handler => handler.setting.key)),
      ]
    }

    const isStateUpdateHandler = (handler: any) =>
      handler["##eventHandlerType"] === "Update State" &&
      handler.parameters?.key === stateKey

    const checkEventHandlers = (
      handlers: any[],
      componentId: string,
      instanceName: string,
      setting: string
    ) => {
      if (!Array.isArray(handlers)) return

      handlers.forEach(handler => {
        if (isStateUpdateHandler(handler)) {
          foundComponents.push({
            id: componentId,
            name: instanceName + " - " + setting,
            settings: [setting],
          })
        }
      })
    }

    eventHandlers.forEach(eventType => {
      checkEventHandlers(
        component[eventType],
        component._id!,
        component._instanceName,
        eventType
      )
    })

    Object.entries(component)
      .filter(([key]) => key !== "_children")
      .forEach(([propName, propValue]) => {
        if (Array.isArray(propValue)) {
          propValue.forEach(item => {
            eventHandlers.forEach(eventType => {
              checkEventHandlers(
                item[eventType],
                component._id!,
                component._instanceName,
                propName
              )
            })
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

  const getSettingsWithState = (
    component: Component,
    stateKey: string
  ): string[] => {
    return Object.entries(component)
      .filter(([key]) => key !== "_children")
      .filter(([_, value]) => hasStateBinding(JSON.stringify(value), stateKey))
      .map(([key]) => key)
  }
  const findComponentsUsingState = (
    component: Component,
    stateKey: string
  ): ComponentUsingState[] => {
    let componentsUsingState: ComponentUsingState[] = []
    const { _children } = component

    const settingsWithState = getSettingsWithState(component, stateKey)
    settingsWithState.forEach(setting => {
      const label =
        componentStore
          .getDefinition(component._component)
          ?.settings?.find(t => t.key === setting)?.label || setting

      // These have no label so have to set manually
      if (setting === "_conditions") {
        setting = "Conditions"
      } else if (setting === "_styles") {
        setting = "Styles"
      }

      componentsUsingState.push({
        id: component._id!,
        name: `${component._instanceName} - ${label}`,
        settings: [setting],
      })
    })

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
          id: $selectedScreen._id!,
          name: "Screen - onLoad",
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
  <Select
    label="State variables"
    bind:value={selectedKey}
    placeholder={keyOptions.length > 0 ? false : "No state variables found"}
    options={keyOptions}
    on:change={handleStateKeySelect}
  />
  {#if selectedKey && keyOptions.length > 0}
    <DrawerBindableInput
      value={editorValue}
      title={`Set value for "${selectedKey}"`}
      placeholder="Enter a value"
      label="Set temporary value for design preview"
      on:change={e => handleStateInspectorChange(e)}
      {bindings}
    />
  {/if}
  {#if componentsUsingState.length > 0}
    <div class="section">
      <span class="text">Updates</span>
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
      <span class="text">Controlled by</span>
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
    gap: var(--spacing-s);
    margin-top: var(--spacing-s);
  }
  .text {
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
  }

  .updates-colour {
    color: var(--bb-indigo-light);
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
    padding: 0;
    white-space: nowrap;
    font-size: 12px;
  }
  .component-link:hover {
    text-decoration: underline;
  }

  .updates-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-s);
  }
</style>
