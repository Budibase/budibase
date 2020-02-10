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
    bindingPath = binding.path
    bindingFallbackValue = binding.fallback

    console.log({
      bindingFallbackValue,
      bindingPath,
      value,
    });

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
          style={`font-weight: ${stateBinding === bindingPath ? 'bold' : 'initial'}`}
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

    width: 30px;
    height: 30px;
    padding-bottom: 10px;

    display: flex;
    justify-content: center;
    align-items: center;

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
    transition: 0.2s all;
  }

  li:hover {
    cursor: pointer;
    font-weight: 600;
  }

  input {
    margin-right: 5px;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    opacity: 0.5;
    height: 40px;
    /* display: block;
    font-size: 14px;
    font-family: sans-serif;
    font-weight: 500;
    color: #163057;
    line-height: 1.3;
    padding: 1em 2.6em 0.9em 1.4em;
    /* width: 100%; */
    /* max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;
    border: 1px solid #ccc;
    height: 50px; */
  }
</style>
