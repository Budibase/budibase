<script>
  import PropsView from "./PropsView.svelte"
  import StateBindingControl from "./StateBindingControl.svelte"
  import { store } from "../builderStore"
  import IconButton from "../common/IconButton.svelte"
  import {
    LayoutIcon,
    PaintIcon,
    TerminalIcon,
    CircleIndicator,
    EventsIcon,
  } from "../common/Icons/"
  import CodeEditor from "./CodeEditor.svelte"
  import LayoutEditor from "./LayoutEditor.svelte"
  import EventsEditor from "./EventsEditor"

  let current_view = "props"
  let codeEditor

  $: component = $store.currentComponentInfo
  $: originalName = component.name
  $: name =
    $store.currentView === "detail"
      ? $store.currentPreviewItem.name
      : component._component
  $: description = component.description
  $: components = $store.components
  $: screen_props =
    $store.currentFrontEndType === "page"
      ? getProps($store.currentPreviewItem, ["name", "favicon"])
      : getProps($store.currentPreviewItem, ["name", "description", "route"])
  $: console.log(screen_props)
  const onPropChanged = store.setComponentProp
  const onStyleChanged = store.setComponentStyle

  function getProps(obj, keys) {
    return keys.map((k, i) => [k, obj[k], obj.props._id + i])
  }
</script>

<div class="root">
  <ul>
    <li>
      <button
        class:selected={current_view === 'props'}
        on:click={() => (current_view = 'props')}>
        <PaintIcon />
      </button>
    </li>
    <li>
      <button
        class:selected={current_view === 'layout'}
        on:click={() => (current_view = 'layout')}>
        <LayoutIcon />
      </button>
    </li>
    {#if !component._component.startsWith('##')}
      <li>
        <button
          class:selected={current_view === 'code'}
          on:click={() => codeEditor && codeEditor.show()}>
          {#if component._code && component._code.trim().length > 0}
            <div class="button-indicator">
              <CircleIndicator />
            </div>
          {/if}
          <TerminalIcon />
        </button>
      </li>
      <li>
        <button
          class:selected={current_view === 'events'}
          on:click={() => (current_view = 'events')}>
          <EventsIcon />
        </button>
      </li>
    {/if}
  </ul>
  <div class="component-props-container">

    {#if current_view === 'props'}
      {#if $store.currentView === 'detail'}
        {#each screen_props as [k, v, id] (id)}
          <div class="detail-prop" for={k}>
            <label>{k}:</label>
            <input
              id={k}
              value={v}
              on:input={({ target }) => store.setMetadataProp(k, target.value)} />
          </div>
        {/each}
        <PropsView {component} {components} {onPropChanged} />
      {:else}
        <PropsView {component} {components} {onPropChanged} />
      {/if}
    {:else if current_view === 'layout'}
      <LayoutEditor {onStyleChanged} {component} />
    {:else if current_view === 'events'}
      <EventsEditor {component} {components} {onPropChanged} />
    {/if}

    <CodeEditor
      bind:this={codeEditor}
      code={component._code}
      onCodeChanged={store.setComponentCode} />

  </div>

</div>

<style>
  .detail-prop {
    height: 40px;
    margin-bottom: 15px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 70px 1fr;
    grid-gap: 10px;
  }

  .detail-prop label {
    word-wrap: break-word;
    font-size: 12px;
    font-weight: 700;
    color: #163057;
    opacity: 0.6;
    padding-top: 12px;
    margin-bottom: 0;
  }

  input {
    height: 30px;
    padding-left: 8px;
    padding-right: 8px;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    opacity: 0.5;
  }

  input:focus {
    outline: 0;
    background-color: #fff;
    color: #666;
    border-color: #1e87f0;
  }

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
    margin-top: 10px;
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
    width: 48px;
    height: 48px;
  }

  li button {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
    position: relative;
  }

  .selected {
    color: var(--button-text);
    background: var(--background-button) !important;
  }

  .button-indicator {
    position: absolute;
    top: 8px;
    right: 10px;
    color: var(--button-text);
  }
</style>
