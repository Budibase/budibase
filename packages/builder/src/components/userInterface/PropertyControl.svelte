<script>
  import { Button, Icon, Drawer } from "@budibase/bbui"
  import Input from "./PropertyPanelControls/Input.svelte"
  import { store, backendUiStore, currentAsset } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/replaceBindings"
  import BindingDropdown from "components/userInterface/BindingDropdown.svelte"

  export let label = ""
  export let bindable = true
  export let componentInstance = {}
  export let control = null
  export let key = ""
  export let value
  export let props = {}
  export let onChange = () => {}

  let temporaryBindableValue = value
  let bindableProperties = []
  let anchor
  let showDrawer = false

  function handleClose() {
    handleChange(key, temporaryBindableValue)
  }

  function getBindableProperties() {
    // Get all bindableProperties
    bindableProperties = fetchBindableProperties({
      componentInstanceId: $store.selectedComponentId,
      components: $store.components,
      screen: $currentAsset,
      tables: $backendUiStore.tables,
      queries: $backendUiStore.queries,
    })
  }

  function replaceBindings(textWithBindings) {
    getBindableProperties()
    textWithBindings = readableToRuntimeBinding(
      bindableProperties,
      textWithBindings
    )
    onChange(key, textWithBindings)
  }

  function handleChange(key, v) {
    let innerVal = v
    if (typeof v === "object") {
      if ("detail" in v) {
        innerVal = v.detail
      } else if ("target" in v) {
        innerVal = props.valueKey ? v.target[props.valueKey] : v.target.value
      }
    }
    if (typeof innerVal === "string") {
      replaceBindings(innerVal)
    } else {
      onChange(key, innerVal)
    }
  }

  const safeValue = () => {
    getBindableProperties()

    let temp = runtimeToReadableBinding(bindableProperties, value)

    return value == null && props.initialValue !== undefined
      ? props.initialValue
      : temp
  }

  // Incase the component has a different value key name
  const handlevalueKey = value =>
    props.valueKey ? { [props.valueKey]: safeValue() } : { value: safeValue() }
</script>

<div class="property-control" bind:this={anchor}>
  <div class="label">{label}</div>
  <div data-cy={`${key}-prop-control`} class="control">
    <svelte:component
      this={control}
      {componentInstance}
      {...handlevalueKey(value)}
      on:change={val => handleChange(key, val)}
      onChange={val => handleChange(key, val)}
      {...props}
      name={key} />
  </div>
  {#if bindable && !key.startsWith('_') && control === Input}
    <div
      class="icon"
      data-cy={`${key}-binding-button`}
      on:click={() => showDrawer = true}>
      <Icon name="edit" />
    </div>
  {/if}
</div>
{#if showDrawer}
  <Drawer
    title="Binding"
    onClose={() => {
      handleClose()
      showDrawer = false
    }}>
    <div slot="buttons">
      <Button
        blue
        thin
        on:click={() => {
          notifier.success('Query parameters saved.')
          handleSelected(value)
        }}>
        Save
      </Button>
    </div>
    <div class="drawer-contents" slot="body">
      <BindingDropdown
        {...handlevalueKey(value)}
        close={() => showDrawer = false}
        on:update={e => (temporaryBindableValue = e.detail)}
        {bindableProperties} />
    </div>
  </Drawer>
{/if}

<style>
  .property-control {
    position: relative;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .label {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    flex: 0 0 80px;
    text-align: left;
    color: var(--ink);
    margin-right: auto;
    text-transform: capitalize;
  }

  .control {
    flex: 1;
    display: flex;
    padding-left: 2px;
    overflow: hidden;
  }

  .icon {
    right: 2px;
    top: 2px;
    bottom: 2px;
    position: absolute;
    align-items: center;
    display: flex;
    box-sizing: border-box;
    padding-left: var(--spacing-xs);
    border-left: 1px solid var(--grey-4);
    background-color: var(--grey-2);
    border-top-right-radius: var(--border-radius-m);
    border-bottom-right-radius: var(--border-radius-m);
    color: var(--grey-7);
    font-size: 16px;
  }
  .icon:hover {
    color: var(--ink);
    cursor: pointer;
  }
  .drawer-contents {
    height: 40vh;
    overflow-y: auto;
  }
</style>
