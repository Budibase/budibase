<script lang="ts">
  import { onMount } from "svelte"
  import { Select } from "@budibase/bbui"
  import type { Component, EventHandler } from "@budibase/types"
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

  let selectedKey: string | undefined = undefined
  let componentsUsingState: ComponentUsingState[] = []
  let componentsUpdatingState: ComponentUsingState[] = []
  let editorValue: string = ""

  $: selectStateKey(selectedKey)
  $: keyOptions = getAllStateVariables($selectedScreen)
  $: bindings = getBindableProperties(
    $selectedScreen,
    $componentStore.selectedComponentId
  )

  // Auto-select first valid state key
  $: {
    if (keyOptions.length && !keyOptions.includes(selectedKey)) {
      selectedKey = keyOptions[0]
    } else if (!keyOptions.length) {
      selectedKey = undefined
    }
  }

  const selectStateKey = (key: string | undefined) => {
    if (key) {
      searchComponents(key)
      editorValue = $previewStore.selectedComponentContext?.state?.[key] ?? ""
    } else {
      editorValue = ""
      componentsUsingState = []
      componentsUpdatingState = []
    }
  }

  const searchComponents = (stateKey: string) => {
    if (!$selectedScreen?.props) {
      return
    }
    componentsUsingState = findComponentsUsingState(
      $selectedScreen.props,
      stateKey
    )
    componentsUpdatingState = findComponentsUpdatingState(
      $selectedScreen.props,
      stateKey
    )

    // Check screen load actions which are outside the component hierarchy
    if (eventUpdatesState($selectedScreen.onLoad, stateKey)) {
      componentsUpdatingState.push({
        id: $selectedScreen._id!,
        name: "Screen - On load",
        settings: ["onLoad"],
      })
    }
  }

  const eventUpdatesState = (
    handlers: EventHandler[] | undefined,
    stateKey: string
  ) => {
    return handlers?.some(handler => {
      return (
        handler["##eventHandlerType"] === "Update State" &&
        handler.parameters?.key === stateKey
      )
    })
  }

  const findComponentsUpdatingState = (
    component: Component,
    stateKey: string,
    foundComponents: ComponentUsingState[] = []
  ): ComponentUsingState[] => {
    // Check all settings of this component
    componentStore
      .getComponentSettings(component._component)
      .filter(s => s.type === "event" || s.type === "buttonConfiguration")
      .forEach(setting => {
        if (setting.type === "event") {
          if (eventUpdatesState(component[setting.key], stateKey)) {
            let label = setting.label || setting.key
            foundComponents.push({
              id: component._id!,
              name: `${component._instanceName} - ${label}`,
              settings: [setting.key],
            })
          }
        } else if (setting.type === "buttonConfiguration") {
          const buttons = component[setting.key]
          if (Array.isArray(buttons)) {
            buttons.forEach(button => {
              if (eventUpdatesState(button.onClick, stateKey)) {
                let label = setting.label || setting.key
                foundComponents.push({
                  id: component._id!,
                  name: `${component._instanceName} - ${label}`,
                  settings: [setting.key],
                })
              }
            })
          }
        }
      })

    // Check children
    component._children?.forEach(child => {
      findComponentsUpdatingState(child, stateKey, foundComponents)
    })
    return foundComponents
  }

  const findComponentsUsingState = (
    component: Component,
    stateKey: string,
    componentsUsingState: ComponentUsingState[] = []
  ): ComponentUsingState[] => {
    const settings = componentStore.getComponentSettings(component._component)

    // Check all settings of this component
    const settingsWithState = getSettingsUsingState(component, stateKey)
    settingsWithState.forEach(setting => {
      // Get readable label for this setting
      let label = settings.find(s => s.key === setting)?.label || setting
      if (setting === "_conditions") {
        label = "Conditions"
      } else if (setting === "_styles") {
        label = "Styles"
      }
      componentsUsingState.push({
        id: component._id!,
        name: `${component._instanceName} - ${label}`,
        settings: [setting],
      })
    })

    // Check children
    component._children?.forEach(child => {
      findComponentsUsingState(child, stateKey, componentsUsingState)
    })
    return componentsUsingState
  }

  const getSettingsUsingState = (
    component: Component,
    stateKey: string
  ): string[] => {
    return Object.entries(component)
      .filter(([key]) => key !== "_children")
      .filter(([_, value]) => hasStateBinding(JSON.stringify(value), stateKey))
      .map(([key]) => key)
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

  const onClickComponentLink = (component: ComponentUsingState) => {
    componentStore.select(component.id)
    builderStore.highlightSetting(component.settings[0])
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
    label="State variable"
    bind:value={selectedKey}
    placeholder={keyOptions.length > 0 ? false : "No state variables found"}
    options={keyOptions}
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
