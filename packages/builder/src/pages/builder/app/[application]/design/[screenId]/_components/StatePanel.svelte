<script lang="ts">
  import { onDestroy } from "svelte"
  import { ActionButton, Modal, ModalContent, Combobox } from "@budibase/bbui"
  import { getAllStateVariables } from "@/dataBinding"
  import {
    componentStore,
    selectedScreen,
    builderStore,
  } from "@/stores/builder"
  import {
    decodeJSBinding,
    findHBSBlocks,
    isJSBinding,
  } from "@budibase/string-templates"

  let modal: Modal
  let selectedKey: string | null = null
  let componentsUsingState: Array<{
    id: string
    name: string
    settings: string[]
  }> = []
  const keyOptions = getAllStateVariables()

  function findComponentsUsingState(
    component: any,
    stateKey: string
  ): Array<{ id: string; name: string; settings: string[] }> {
    let componentsUsingState: Array<{
      id: string
      name: string
      settings: string[]
    }> = []

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

  function handleKeySelect(event: CustomEvent) {
    selectedKey = event.detail
    if (!selectedKey) {
      throw new Error("No state key selected")
    }
    if ($selectedScreen?.props) {
      componentsUsingState = findComponentsUsingState(
        $selectedScreen.props,
        selectedKey
      )
    }
  }

  function onClickComponentLink(component: {
    id: string
    name: string
    settings: string[]
  }) {
    componentStore.select(component.id)

    // Delay highlighting until after component selection and re-render (i know this is disgusting)
    setTimeout(() => {
      component.settings.forEach(setting => {
        builderStore.highlightSetting(setting)
      })
    }, 100)
  }

  onDestroy(() => {
    builderStore.highlightSetting(undefined)
  })
</script>

<ActionButton on:click={modal.show}>State</ActionButton>

<Modal bind:this={modal}>
  <ModalContent title="State" showConfirmButton={false} cancelText="Close">
    <Combobox
      value={selectedKey}
      options={keyOptions}
      on:change={handleKeySelect}
    />
    {#if componentsUsingState.length > 0}
      <div class="components-list">
        <h4>Components using this state:</h4>
        {#each componentsUsingState as component}
          <button
            class="component-link"
            on:click={() => onClickComponentLink(component)}
          >
            {component.name} ({component.settings.join(", ")})
          </button>
        {/each}
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .components-list {
    margin-top: var(--spacing-m);
    padding: var(--spacing-m);
    background-color: var(--spectrum-global-color-gray-50);
  }
  .components-list h4 {
    margin: 0 0 var(--spacing-s) 0;
    font-size: 14px;
  }
  .component-link {
    display: block;
    width: 100%;
    text-align: left;
    padding: var(--spacing-xs) var(--spacing-s);
    margin: 2px 0;
    border: none;
    background: none;
    color: var(--spectrum-global-color-blue-700);
    cursor: pointer;
    font-size: 12px;
  }
  .component-link:hover {
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: 4px;
  }
</style>
