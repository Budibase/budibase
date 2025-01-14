<script lang="ts">
  import { ActionButton, Modal, ModalContent, Combobox } from "@budibase/bbui"
  import { getAllStateVariables } from "@/dataBinding"
  import { appStore, selectedComponent, componentStore } from "@/stores/builder"
  import {
    decodeJSBinding,
    findHBSBlocks,
    isJSBinding,
  } from "@budibase/string-templates"

  let modal: Modal
  let selectedKey = ""
  let stateValue = ""
  let componentsUsingState: Array<{ id: string; name: string }> = []
  const keyOptions = getAllStateVariables()

  function findComponentsUsingState(
    component: any,
    stateKey: string
  ): Array<{ id: string; name: string }> {
    let componentsUsingState: Array<{ id: string; name: string }> = []

    const { _children, ...componentWithoutChildren } = component
    const componentStr = JSON.stringify(componentWithoutChildren)

    const bindings = findHBSBlocks(componentStr).map(binding => {
      let sanitizedBinding = binding.replace(/\\"/g, '"')
      if (isJSBinding(sanitizedBinding)) {
        return decodeJSBinding(sanitizedBinding)
      } else {
        return sanitizedBinding
      }
    })
    const bindingString = bindings.join(" ")

    if (bindingString.includes(stateKey)) {
      componentsUsingState.push({
        id: component._id,
        name: component._instanceName || "Unnamed Component",
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
    const localStorageKey = `${$appStore.appId}.state`
    const state = JSON.parse(localStorage.getItem(localStorageKey) || "{}")
    stateValue = state[selectedKey]

    if ($selectedComponent) {
      componentsUsingState = findComponentsUsingState(
        $selectedComponent,
        selectedKey
      )
    }
  }
</script>

<ActionButton on:click={modal.show}>State</ActionButton>

<Modal bind:this={modal}>
  <ModalContent title="State" showConfirmButton={false} cancelText="Close">
    <Combobox options={keyOptions} on:change={handleKeySelect} />
    <div class="state-value helper">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <pre>{@html JSON.stringify(stateValue, null, 2)}</pre>
    </div>
    {#if componentsUsingState.length > 0}
      <div class="components-list">
        <h4>Components using this state:</h4>
        {#each componentsUsingState as component}
          <button
            class="component-link"
            on:click={() => componentStore.select(component.id)}
          >
            {component.name}
          </button>
        {/each}
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .state-value {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
    background-color: var(--spectrum-global-color-gray-50);
  }
  .state-value pre {
    padding: 0;
    margin: 0;
    font-size: 12px;
    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .state-value.helper pre {
    color: var(--spectrum-global-color-blue-700);
  }
  .state-value pre :global(span) {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  .state-value :global(p) {
    padding: 0;
    margin: 0;
  }
  .state-value.helper :global(code) {
    font-size: 12px;
  }
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
