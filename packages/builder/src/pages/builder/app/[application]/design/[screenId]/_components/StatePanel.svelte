<script lang="ts">
  import { onMount } from "svelte"
  import { Select } from "@budibase/bbui"
  import type {
    Component,
    ComponentCondition,
    ComponentSetting,
    EventHandler,
    Screen,
  } from "@budibase/types"
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
    setting: string
  }

  let selectedKey: string | undefined = undefined
  let componentsUsingState: ComponentUsingState[] = []
  let componentsUpdatingState: ComponentUsingState[] = []
  let editorValue: string = ""

  $: selectStateKey($selectedScreen, selectedKey)
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

  const selectStateKey = (
    screen: Screen | undefined,
    key: string | undefined
  ) => {
    if (screen && key) {
      searchComponents(screen, key)
      editorValue = $previewStore.selectedComponentContext?.state?.[key] ?? ""
    } else {
      editorValue = ""
      componentsUsingState = []
      componentsUpdatingState = []
    }
  }

  const searchComponents = (screen: Screen, stateKey: string) => {
    const { props, onLoad, _id } = screen
    componentsUsingState = findComponentsUsingState(props, stateKey)
    componentsUpdatingState = findComponentsUpdatingState(props, stateKey)

    // Check screen load actions which are outside the component hierarchy
    if (eventUpdatesState(onLoad, stateKey)) {
      componentsUpdatingState.push({
        id: _id!,
        name: "Screen - On load",
        setting: "onLoad",
      })
    }
  }

  // Checks if an event setting updates a certain state key
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

  // Checks if a setting for the given component updates a certain state key
  const settingUpdatesState = (
    component: Record<string, any>,
    setting: ComponentSetting,
    stateKey: string
  ) => {
    if (setting.type === "event") {
      return eventUpdatesState(component[setting.key], stateKey)
    } else if (setting.type === "buttonConfiguration") {
      const buttons = component[setting.key]
      if (Array.isArray(buttons)) {
        for (let button of buttons) {
          if (eventUpdatesState(button.onClick, stateKey)) {
            return true
          }
        }
      }
    }
    return false
  }

  // Checks if a condition updates a certain state key
  const conditionUpdatesState = (
    condition: ComponentCondition,
    settings: ComponentSetting[],
    stateKey: string
  ) => {
    const setting = settings.find(s => s.key === condition.setting)
    if (!setting) {
      return false
    }
    const component = { [setting.key]: condition.settingValue }
    return settingUpdatesState(component, setting, stateKey)
  }

  const findComponentsUpdatingState = (
    component: Component,
    stateKey: string,
    foundComponents: ComponentUsingState[] = []
  ): ComponentUsingState[] => {
    const { _children, _conditions, _component, _instanceName, _id } = component
    const settings = componentStore
      .getComponentSettings(_component)
      .filter(s => s.type === "event" || s.type === "buttonConfiguration")

    // Check all settings of this component
    settings.forEach(setting => {
      if (settingUpdatesState(component, setting, stateKey)) {
        const label = setting.label || setting.key
        foundComponents.push({
          id: _id!,
          name: `${_instanceName} - ${label}`,
          setting: setting.key,
        })
      }
    })

    // Check if conditions update these settings to update this state key
    if (_conditions?.some(c => conditionUpdatesState(c, settings, stateKey))) {
      foundComponents.push({
        id: _id!,
        name: `${_instanceName} - Conditions`,
        setting: "_conditions",
      })
    }

    // Check children
    _children?.forEach(child => {
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
        setting,
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
    builderStore.highlightSetting(component.setting)
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
    transition: filter 130ms ease-out;
  }
  .component-link:hover {
    text-decoration: underline;
    filter: brightness(1.2);
  }
  .updates-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-s);
  }
</style>
