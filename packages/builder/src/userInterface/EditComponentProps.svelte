<script>

import PropsView from "./PropsView.svelte";
import { store } from "../builderStore";
import { isRootComponent } from "./pagesParsing/searchComponents";
import IconButton from "../common/IconButton.svelte";
import Textbox from "../common/Textbox.svelte";
import UIkit from "uikit";
import { pipe } from "../common/core";
import {
    getScreenInfo
} from "./pagesParsing/createProps";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import { LayoutIcon, PaintIcon, TerminalIcon } from '../common/Icons/';

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
let componentInfo;
let modalElement
let propsValidationErrors = [];
let originalName="";
let components;
let ignoreStore = false;

$: shortName = last(name.split("/"));

store.subscribe(s => {
    if(ignoreStore) return;
    component = s.currentFrontEndItem;
    if(!component) return;
    originalName = component.name;
    name = component.name;
    description = component.description;
    tagsString = join(", ")(component.tags);
    componentInfo = s.currentComponentInfo;
    components = s.components;
});

const updateComponent = doChange => {
    const newComponent = cloneDeep(component);
    doChange(newComponent);
    component = newComponent;
    componentInfo = getScreenInfo(components, newComponent);
}

const onPropsChanged = newProps => {
    updateComponent(newComponent =>
        assign(newComponent.props, newProps));
}

</script>

<div class="root">

    <ul>
        <li><button><PaintIcon /></button></li>
        <li><button><LayoutIcon /></button></li>
        <li><button><TerminalIcon /></button></li>
    </ul>

    <div class="component-props-container">


        <PropsView
                {componentInfo}
                {onPropsChanged} />


    </div>

</div>

<style>

.root {
    height: 100%;
    display: flex;
    flex-direction: column;

}

.title {
    padding: 1rem;
    display: grid;
    grid-template-columns: [name] 1fr [actions] auto;
    color: var(--secondary100);
    font-size: .9rem;
    font-weight: bold;
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

.selected {
    background: lightblue;
}

</style>
