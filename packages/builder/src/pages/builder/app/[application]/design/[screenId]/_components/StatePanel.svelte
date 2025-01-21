<script lang="ts">
  import { ActionButton, Popover, Divider, Icon, Select } from "@budibase/bbui"
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
  import { onMount } from "svelte"
  import CodeMirrorEditor from "@/components/common/CodeMirrorEditor.svelte"
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

  onMount(() => {
    if (selectedKey) {
      searchComponents(selectedKey)
    }
    previewStore.requestComponentContext()
  })

  $: {
    let previewContext = $previewStore.selectedComponentContext || {}

    if (selectedKey && previewContext.state) {
      // It's unlikely value will ever be populated immediately as state is never populated automatically in preview
      const value = previewContext.state[selectedKey] ?? null
      editorValue = JSON.stringify(value, null, 2)
    } else {
      editorValue = ""
    }
  }
  function findComponentsUpdatingState(
    component: any,
    stateKey: string
  ): ComponentUsingState[] {
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
              id: component._id,
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

  function findComponentsUsingState(
    component: any,
    stateKey: string
  ): ComponentUsingState[] {
    let componentsUsingState: ComponentUsingState[] = []

    const { _children, ...componentSettings } = component
    let settingsWithState: string[] = []

    for (const [setting, value] of Object.entries(componentSettings)) {
      if (typeof value === "string") {
        const bindings = findHBSBlocks(value).map(binding => {
          let sanitizedBinding = binding.replace(/\\"/g, '"')
          if (isJSBinding(sanitizedBinding)) {
            return decodeJSBinding(sanitizedBinding)
          } else {
            return sanitizedBinding
          }
        })
        const bindingString = bindings.join(" ")

        if (bindingString.includes(stateKey)) {
          settingsWithState.push(setting)
        }
      }
    }

    if (settingsWithState.length > 0) {
      componentsUsingState.push({
        id: component._id,
        name: component._instanceName,
        settings: settingsWithState,
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

  function searchComponents(stateKey: string) {
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

  function handleStateKeySelect(event: CustomEvent) {
    selectedKey = event.detail
    if (!selectedKey) {
      throw new Error("No state key selected")
    }
    searchComponents(selectedKey)
  }

  function onClickComponentLink(component: ComponentUsingState) {
    componentStore.select(component.id)
    component.settings.forEach(setting => {
      builderStore.highlightSetting(setting)
    })
  }

  function handleStateInspectorChange(e: CustomEvent) {
    if (!selectedKey || !$previewStore.selectedComponentContext) {
      throw new Error("No state key selected")
    }

    if (!e.detail) {
      return
    }

    const value = JSON.parse(e.detail)
    const stateUpdate = { [selectedKey]: value }

    previewStore.updateState(stateUpdate)

    previewStore.setSelectedComponentContext({
      ...$previewStore.selectedComponentContext,
      state: stateUpdate,
    })

    previewStore.requestComponentContext()
  }
</script>

<div class="state-panel">
  <div>State</div>
  <div>
    Showing state variables for {$selectedScreen?.routing?.route.split("/")[1]}:
  </div>
  <div class="section">
    <Select
      value={selectedKey}
      placeholder="Type here..."
      options={keyOptions}
      on:change={handleStateKeySelect}
    />
  </div>
  <Divider />
  <div class="section">
    <CodeMirrorEditor
      height={200}
      value={editorValue}
      resize="vertical"
      label="State Inspector"
      on:change={handleStateInspectorChange}
    />
  </div>
  <Divider />

  {#if componentsUsingState.length > 0}
    <div class="section">
      <span class="text">Updates:</span>
      {#each componentsUsingState as component, i}
        <button
          class="component-link"
          on:click={() => onClickComponentLink(component)}
        >
          {component.name}{i < componentsUsingState.length - 1 ? ", " : ""}
        </button>
      {/each}
    </div>
  {/if}
  {#if componentsUpdatingState.length > 0}
    <div class="section">
      <span class="text">Updated by:</span>
      {#each componentsUpdatingState as component, i}
        <button
          class="component-link"
          on:click={() =>
            onClickComponentLink({
              id: component.id,
              name: component.name,
              settings: component.settings,
            })}
        >
          {component.name}{i < componentsUpdatingState.length - 1 ? ", " : ""}
        </button>
      {/each}
    </div>
  {/if}
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
    gap: var(--spacing-s);
  }
  .text {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }
  .component-link {
    display: inline;
    border: none;
    background: none;
    text-decoration: underline;
    color: var(--spectrum-global-color-white);
    cursor: pointer;
    font-size: var(--spectrum-global-dimension-font-size-75);
    padding: 0;
  }
  .component-link:hover {
    text-decoration: underline;
  }

  .split-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
