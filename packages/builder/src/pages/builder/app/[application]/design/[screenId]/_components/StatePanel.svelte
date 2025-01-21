<script lang="ts">
  import { Divider, Select, Heading } from "@budibase/bbui"
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
  let editorError: string | null = null

  onMount(() => {
    if (selectedKey) {
      searchComponents(selectedKey)
    }
    previewStore.requestComponentContext()
  })

  $: {
    const previewContext = $previewStore.selectedComponentContext || {}

    if (selectedKey && previewContext.state) {
      // It's unlikely value will ever be populated immediately as state is never populated automatically in preview
      const value = previewContext.state[selectedKey] ?? null
      editorValue = JSON.stringify(value, null, 2)
      editorError = null
    } else {
      editorValue = ""
      editorError = null
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

    try {
      const value = JSON.parse(e.detail)
      const stateUpdate = { [selectedKey]: value }
      editorError = null

      previewStore.updateState(stateUpdate)
      previewStore.updateState(stateUpdate)

      previewStore.updateState(stateUpdate)

      previewStore.setSelectedComponentContext({
        ...$previewStore.selectedComponentContext,
        state: stateUpdate,
      })
      previewStore.requestComponentContext()
    } catch (err) {
      editorError = "Invalid JSON value"
    }
  }
</script>

<div class="state-panel">
  <Heading size="S">State</Heading>
  <div>Showing state variables for this screen</div>
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
    {#if editorError}
      <div class="error">{editorError}</div>
    {/if}
  </div>
  <Divider />

  {#if componentsUsingState.length > 0}
    <div class="section">
      <span class="text">Updates:</span>
      {#each componentsUsingState as component, i}
        {#if i > 0}{", "}{/if}
        <button
          class="component-link"
          on:click={() => onClickComponentLink(component)}
        >
          {component.name}
        </button>
      {/each}
    </div>
  {/if}
  {#if componentsUpdatingState.length > 0}
    <div class="section">
      <span class="text">Controlled by:</span>
      {#each componentsUpdatingState as component, i}
        {#if i > 0}{", "}{/if}
        <button
          class="component-link"
          on:click={() => onClickComponentLink(component)}
        >
          {component.name}
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
  .error {
    color: var(
      --spectrum-semantic-negative-color-default,
      var(--spectrum-global-color-red-500)
    );
    font-size: var(--spectrum-global-dimension-font-size-75);
    margin-top: var(--spectrum-global-dimension-size-75);
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
</style>
