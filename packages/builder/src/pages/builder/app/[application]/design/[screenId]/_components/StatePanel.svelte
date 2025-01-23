<script lang="ts">
  import { onMount } from "svelte"
  import { Select, Link } from "@budibase/bbui"
  import type { Component } from "@budibase/types"
  import { getAllStateVariables } from "@/dataBinding"
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
  } from "@budibase/string-templates"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  type ComponentUsingState = {
    id: string
    name: string
    settings: string[]
  }

  const keyOptions = getAllStateVariables()

  let selectedKey: string | undefined = undefined
  let componentsUsingState: ComponentUsingState[] = []
  let componentsUpdatingState: ComponentUsingState[] = []
  let editorValue: string = ""
  let editorError: string | null = null

  onMount(() => {
    previewStore.requestComponentContext()
  })

  $: $selectedScreen, selectedKey && searchComponents(selectedKey)
  $: {
    const previewContext = $previewStore.selectedComponentContext || {}
    if (selectedKey && previewContext.state) {
      // It's unlikely value will ever be populated immediately as preview never has state values on load
      editorValue = previewContext.state[selectedKey] ?? null
      editorError = null
    } else {
      editorValue = ""
      editorError = null
    }
  }

  const findComponentsUpdatingState = (
    component: Component,
    stateKey: string
  ): ComponentUsingState[] => {
    let foundComponents: ComponentUsingState[] = []

    const eventHandlerProps = ["onClick", "onChange"]

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
    componentsUsingState = findComponentsUsingState(
      $selectedScreen.props,
      stateKey
    )
    componentsUpdatingState = findComponentsUpdatingState(
      $selectedScreen.props,
      stateKey
    )
  }

  const handleStateKeySelect = (key: CustomEvent) => {
    if (!key.detail) {
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
      throw new Error("No state key selected")
    }

    if (!e.detail) {
      return
    }

    const stateUpdate = { [selectedKey]: e.detail }
    editorError = null

    previewStore.updateState(stateUpdate)
    previewStore.setSelectedComponentContext({
      ...$previewStore.selectedComponentContext,
      state: stateUpdate,
    })
    previewStore.requestComponentContext()
  }
</script>

<div class="state-panel">
  <div class="section">
    <Select
      label="State variables"
      bind:value={selectedKey}
      placeholder="Type here..."
      options={keyOptions}
      on:change={handleStateKeySelect}
    />
  </div>
  <div class="section">
    <DrawerBindableInput
      value={editorValue}
      title={`Set value for "${selectedKey}"`}
      placeholder="Enter a value"
      label="Set temporary value for design preview"
      on:change={handleStateInspectorChange}
    />
    {#if editorError}
      <div class="error">{editorError}</div>
    {/if}
  </div>

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
        {/each}git
      </div>
    </div>
  {/if}
  <div style="opacity: 0.5; ">
    <Link
      href="https://docs.budibase.com/docs/app-state"
      target="_blank"
      size={"S"}
      secondary
    >
      Learn more about State within Budibase.
    </Link>
  </div>
</div>

<style>
  .state-panel {
    background-color: var(--spectrum-alias-background-color-primary);
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
  .text {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--spectrum-global-dimension-font-size-50);
  }
  .error {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    );
    font-size: var(--spectrum-global-dimension-font-size-75);
    margin-top: var(--spectrum-global-dimension-size-75);
  }

  .updates-colour {
    color: #8488fd;
  }
  .controlled-by-colour {
    color: #e87400;
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
</style>
