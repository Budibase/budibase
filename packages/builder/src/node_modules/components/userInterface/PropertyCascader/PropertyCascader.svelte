<script>
  import { ArrowDownIcon } from "../../common/Icons/"
  import { store } from "../../builderStore"
  import { buildStateOrigins } from "../../builderStore/buildStateOrigins"
  import { isBinding, getBinding, setBinding } from "../../common/binding"
  import StateBindingOptions from "./StateBindingOptions.svelte"

  export let onChanged = () => {}
  export let value = ""

  let isOpen = false
  let stateBindings = []

  let bindingPath = ""
  let bindingFallbackValue = ""
  let bindingSource = "store"
  let bindingValue = ""

  const bindValueToSource = (path, fallback, source) => {
    if (!path) {
      onChanged(fallback)
      return
    }
    const binding = setBinding({ path, fallback, source })
    onChanged(binding)
  }

  const setBindingPath = value =>
    bindValueToSource(value, bindingFallbackValue, bindingSource)

  const setBindingFallback = value =>
    bindValueToSource(bindingPath, value, bindingSource)

  const setBindingSource = source =>
    bindValueToSource(bindingPath, bindingFallbackValue, source)

  $: {
    const binding = getBinding(value)
    if (bindingPath !== binding.path) isOpen = false
    bindingPath = binding.path
    bindingValue = typeof value === "object" ? "" : value
    bindingFallbackValue = binding.fallback || bindingValue

    const currentScreen = $store.screens.find(
      ({ name }) => name === $store.currentPreviewItem.name
    )
    stateBindings = currentScreen
      ? Object.keys(buildStateOrigins(currentScreen))
      : []
  }
</script>

<div class="cascader">
  <div class="input-box">
    <input
      class:bold={!bindingFallbackValue && bindingPath}
      class="uk-input uk-form-small"
      value={bindingFallbackValue || bindingPath}
      on:change={e => {
        setBindingFallback(e.target.value)
        onChanged(e.target.value)
      }} />
    <button on:click={() => (isOpen = !isOpen)}>
      <div
        class="icon"
        class:highlighted={bindingPath}
        style={`transform: rotate(${isOpen ? 0 : 90}deg);`}>
        <ArrowDownIcon size={36} />
      </div>
    </button>
  </div>
  {#if isOpen}
    <StateBindingOptions
      onSelect={option => {
        onChanged(option)
        isOpen = false
      }} />
  {/if}
</div>

<style>
  .bold {
    font-weight: bold;
  }

  .highlighted {
    color: rgba(0, 85, 255, 0.8);
  }

  button {
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 3px;
    font-size: 1.6rem;
    font-weight: 700;
    color: rgba(22, 48, 87, 1);
  }

  .cascader {
    position: relative;
    width: 100%;
  }

  .input-box {
    display: flex;
    align-items: center;
  }

  input {
    margin-right: 5px;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    opacity: 0.5;
    height: 40px;
  }

  .icon {
    width: 24px;
  }
</style>
