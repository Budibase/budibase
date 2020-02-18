<script>
  import PropsView from "./PropsView.svelte"
  import { store } from "../builderStore"
  import Textbox from "../common/Textbox.svelte"
  import Button from "../common/Button.svelte"
  import { LayoutIcon, PaintIcon, TerminalIcon } from "../common/Icons/"

  import { cloneDeep, join, split, last } from "lodash/fp"
  import { assign } from "lodash"

  $: component = $store.currentPreviewItem
  $: componentInfo = $store.currentComponentInfo
  $: components = $store.components

  const updateComponent = doChange => doChange(cloneDeep(component))

  const onPropsChanged = newProps => {
    updateComponent(newComponent => assign(newComponent.props, newProps))
  }
</script>

<div class="root">

  <ul>
    <li>
      <button>
        <PaintIcon />
      </button>
    </li>
    <li>
      <button>
        <LayoutIcon />
      </button>
    </li>
    <li>
      <button>
        <TerminalIcon />
      </button>
    </li>
  </ul>

  <div class="component-props-container">
    <PropsView {componentInfo} {onPropsChanged} />
  </div>
</div>

<style>
  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .title > div:nth-child(1) {
    grid-column-start: name;
    color: var(--secondary100);
  }

  .title > div:nth-child(2) {
    grid-column-start: actions;
  }

  .component-props-container {
    flex: 1 1 auto;
    overflow-y: auto;
  }

  ul {
    list-style: none;
    display: flex;
    padding: 0;
  }

  li {
    margin-right: 20px;
    background: none;
    border-radius: 5px;
    width: 45px;
    height: 45px;
  }

  li button {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    border-radius: 5px;
    padding: 12px;
  }
</style>
