<script>
  import { splitName } from "./pagesParsing/splitRootComponentName.js"
  import { store } from "../builderStore"
  import { find, sortBy } from "lodash/fp"
  import { ImageIcon, InputIcon, LayoutIcon } from "../common/Icons/"
  import Select from "../common/Select.svelte"
  import PlusButton from "../common/PlusButton.svelte"

  let componentLibraries = []
  let current_view = "text"
  let selectedComponent = null

  const addRootComponent = (component, allComponents) => {
    const { libName } = splitName(component.name)
    let group = find(r => r.libName === libName)(allComponents)

    if (!group) {
      group = {
        libName,
        components: [],
      }

      allComponents.push(group)
    }

    group.components.push(component)
  }

  const onComponentChosen = store.addChildComponent

  $: {
    const newComponentLibraries = []

    for (let comp of sortBy(["name"])($store.components)) {
      addRootComponent(comp, newComponentLibraries)
    }

    componentLibraries = newComponentLibraries
  }
</script>

<div class="root">
  <Select>
    {#each componentLibraries as componentLibrary}
      <option value={componentLibrary.libName}>
        {componentLibrary.libName}
      </option>
    {/each}
  </Select>
  {#each componentLibraries as componentLibrary}
    <div class="library-container">
      <ul>
        <li>
          <button
            class:selected={current_view === 'text'}
            on:click={() => (current_view = 'text')}>
            <InputIcon />
          </button>
        </li>
        <li>
          <button
            class:selected={current_view === 'layout'}
            on:click={() => (current_view = 'layout')}>
            <LayoutIcon />
          </button>
        </li>
        <li>
          <button
            class:selected={current_view === 'media'}
            on:click={() => (current_view = 'media')}>
            <ImageIcon />
          </button>
        </li>
      </ul>

      {#each $store.builtins.concat(componentLibrary.components) as component}
        <div class="component-container">
          <div
            class="component"
            on:click={() => onComponentChosen(component.name)}>
            <div class="name">{splitName(component.name).componentName}</div>
            {#if component.presets && component.name === selectedComponent}
              <ul class="preset-menu">
                <span>{splitName(component.name).componentName} Presets</span>
                {#each Object.keys(component.presets) as preset}
                  <li on:click|stopPropagation={() => onComponentChosen(component.name, preset)}>
                    {preset}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
          {#if component.presets}
            <PlusButton 
              on:click={() => {
                selectedComponent = selectedComponent ? null : component.name;
              }} 
            >
            <span class="open-presets" class:open={selectedComponent === component.name}>
              ...
            </span>
            </PlusButton>
          {/if}
        </div>
      {/each}

    </div>
  {/each}

</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
  }

  .library-container {
    padding: 0 0 10px 10px;
    flex: 1 1 auto;
    min-height: 0px;
  }

  .component-container {
    display: flex;
    align-items: center;
  }

  .component {
    position: relative;
    padding: 0 15px;
    cursor: pointer;
    border: 1px solid #ebebeb;
    border-radius: 2px;
    margin: 10px 0;
    height: 40px;
    box-sizing: border-box;
    color: #163057;
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 5px;
  }

  .component:hover {
    background-color: var(--lightslate);
  }

  .component > .name {
    color: #163057;
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    opacity: 0.6;
  }

  ul {
    list-style: none;
    display: flex;
    padding: 0;
  }

  .preset-menu {
    flex-direction: column;
    position: absolute;
    top: 25px;
    left: 0;
    right: 0;
    z-index: 1;
    background: #fafafa;
    padding: 10px;
    border-radius: 2px;
    color: rgba(22, 48, 87, 0.6);
  }

  .preset-menu > span {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .preset-menu li {
    font-size: 14px;
    margin-top: 13px;
  }

  .preset-menu li:hover {
    font-weight: bold;
  }

  li {
    margin-right: 20px;
    background: none;
    border-radius: 5px;
  }

  li button {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    border-radius: 5px;
    padding: 12px;
    outline: none;
    cursor: pointer;
  }

  .selected {
    color: var(--button-text);
    background: var(--background-button) !important;
  }
</style>
