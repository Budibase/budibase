<script>
  import { ArrowDownIcon } from "../common/Icons/";
  import { store } from "../builderStore";
  import { isBinding, getBinding, setBinding } from "../common/binding";

  export let onChanged = () => {};
  export let value = "";

  let isOpen = false;
  let stateBindings = [];

  let bindingPath = "";
  let bindingFallbackValue = "";
  let bindingSource = "store";

  const clearBinding = () => onChanged("");

  const bind = (path, fallback, source) => {
    if (!path) {
      clearBinding("");
      return;
    }
    const binding = setBinding({ path, fallback, source });
    onChanged(binding);
  };

  const setBindingPath = value =>
    bind(value, bindingFallbackValue, bindingSource);

  const setBindingFallback = value => bind(bindingPath, value, bindingSource);

  const setBindingSource = value =>
    bind(bindingPath, bindingFallbackValue, value);

  $: {
    const binding = getBinding(value);
    bindingPath = binding.path;
    bindingFallbackValue = binding.fallback
      ? binding.fallback
      : typeof value === "object"
      ? ""
      : value;

    const currentScreen = $store.screens.find(
      ({ name }) => name === $store.currentFrontEndItem.name
    );
    stateBindings = currentScreen ? currentScreen.stateOrigins : [];
  }
</script>

<div class="cascader">
  <div class="input-box">
    <input
      class="uk-input uk-form-small"
      value={bindingFallbackValue}
      on:change={e => {
        setBindingFallback(e.target.value);
        onChanged(e.target.value);
      }} />
    <button on:click={() => (isOpen = !isOpen)}>
      <span
        class="icon"
        style={`
        transform: rotate(${isOpen ? 0 : 90}deg);
        color: ${bindingPath ? 'rgba(0, 85, 255, 0.8)' : 'inherit'}
      `}>
        <ArrowDownIcon size={36} />
      </span>
    </button>
  </div>
  {#if isOpen}
    <ul class="options">
      {#each Object.keys(stateBindings) as stateBinding}
        <li
          style={stateBinding === bindingPath && 'font-weight: bold;'}
          on:click={() => {
            setBindingPath(stateBinding === bindingPath ? null : stateBinding);
          }}>
          {stateBinding}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
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
    transition: 0.2s all;
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
