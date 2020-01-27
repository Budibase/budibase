<script>

import PropsView from "./PropsView.svelte";
import { store } from "../builderStore";
import { isRootComponent } from "./pagesParsing/searchComponents";
import IconButton from "../common/IconButton.svelte";
import Textbox from "../common/Textbox.svelte";
import { pipe } from "../common/core";
import {
    getScreenInfo
} from "./pagesParsing/createProps";
import { LayoutIcon, PaintIcon, TerminalIcon } from '../common/Icons/';
import CodeEditor from './CodeEditor.svelte';
import LayoutEditor from './LayoutEditor.svelte';

import {
    cloneDeep,
    join,
    split,
    map,
    keys,
    isUndefined,
    last
} from "lodash/fp";
import { assign } from "lodash";

let component;
let name = "";
let description = "";
let tagsString = "";
let nameInvalid = "";
let componentInfo = {};
let modalElement
let propsValidationErrors = [];
let originalName="";
let components;
let ignoreStore = false;

// $: shortName = last(name.split("/"));

store.subscribe(s => {
    if(ignoreStore) return;
    component = s.currentComponentInfo;
    if(!component) return;
    originalName = component.name;
    name = component.name;
    description = component.description;
    tagsString = join(", ")(component.tags);
    componentInfo = s.currentComponentInfo;
    components = s.components;
});

const onPropsChanged = store.setComponentProp;

let current_view = 'props';
</script>

<div class="root">
    <ul>
        <li>
          <button class:selected={current_view === 'props'} on:click={() => current_view = 'props'}>
            <PaintIcon />
          </button>
        </li>
        <li>
          <button class:selected={current_view === 'layout'} on:click={() => current_view = 'layout'}>
            <LayoutIcon />
          </button>
        </li>
        <li>
          <button class:selected={current_view === 'code'} on:click={() => current_view = 'code'}>
            <TerminalIcon />
          </button>
        </li>
    </ul>

    {#if !componentInfo.component}
        <div class="component-props-container">

        {#if current_view === 'props'}
            <PropsView {componentInfo} {components} {onPropsChanged} />
        {:else if current_view === 'layout'}
            <LayoutEditor />
        {:else}
            <CodeEditor />
        {/if}

        </div>
    {:else}
        <h1> This is a screen, this will be dealt with later</h1>
    {/if}

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
    padding: 12px;
    outline: none;
    cursor: pointer;
}

.selected {
    color: var(--button-text);
    background: var(--background-button)!important;
}

</style>
