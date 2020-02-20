<script>
  import { ArrowDownIcon } from "../common/Icons/"
  import { store } from "../builderStore"
  import { buildStateOrigins } from "../builderStore/buildStateOrigins"
  import { isBinding, getBinding, setBinding } from "../common/binding"

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

  const setBindingFallback = value => bindValueToSource(bindingPath, value, bindingSource)

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
    {#if stateBindings.length}
      <button on:click={() => (isOpen = !isOpen)}>
        <div
          class="icon"
          class:highlighted={bindingPath}
          style={`transform: rotate(${isOpen ? 0 : 90}deg);`}>
          <ArrowDownIcon size={36} />
        </div>
      </button>
    {/if}
  </div>
  {#if isOpen}
    <ul class="options">
      {#each stateBindings as stateBinding}
        <li
          class:bold={stateBinding === bindingPath}
          on:click={() => {
            setBindingPath(stateBinding === bindingPath ? null : stateBinding)
          }}>
          {stateBinding}
        </li>
      {/each}
    </ul>
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
    border-radius: 5px;
    background: rgba(249, 249, 249, 1);

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

  .options {
    width: 172px;
    margin: 0;
    position: absolute;
    top: 35px;
    padding: 10px;
    z-index: 1;
    background: rgba(249, 249, 249, 1);
    min-height: 50px;
    border-radius: 2px;
  }

  li {
    list-style-type: none;
  }

  li:hover {
    cursor: pointer;
    font-weight: bold;
  }

  input {
    margin-right: 5px;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    opacity: 0.5;
    height: 40px;
  }
</style>
