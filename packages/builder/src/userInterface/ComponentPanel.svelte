<script>

import PropsView from "./PropsView.svelte";
import { store } from "../builderStore";
import { isRootComponent } from "./pagesParsing/searchComponents";
import IconButton from "../common/IconButton.svelte";
import Textbox from "../common/Textbox.svelte";
// import UIkit from "uikit";
import { pipe } from "../common/core";
import {
    getScreenInfo
} from "./pagesParsing/createProps";
// import Button from "../common/Button.svelte";
// import ButtonGroup from "../common/ButtonGroup.svelte";
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
let componentInfo;
let modalElement
let propsValidationErrors = [];
let originalName="";
let components;
let ignoreStore = false;

$: shortName = last(name.split("/"));

store.subscribe(s => {
    if(ignoreStore) return;
    component = s.currentComponentInfo.component;
    if(!component) return;
    originalName = component.name;
    name = component.name;
    description = component.description;
    tagsString = join(", ")(component.tags);
    componentInfo = s.currentComponentInfo;
    components = s.components;
});

const save = () => {

    ignoreStore = true;
    if(!validate()) {
        ignoreStore = false;
        return;
    }

    component.name = originalName || name;
    component.description = description;
    component.tags = pipe(tagsString, [
        split(","),
        map(s => s.trim())
    ]);

    store.saveComponent(component);

    ignoreStore = false;
    // now do the rename
    if(name !== originalName) {
        store.renameScreen(originalName, name);
    }
}

const deleteComponent = () => {
    showDialog();
}

const confirmDeleteComponent = () => {
    store.deleteScreen(component.name);
    hideDialog();
}

const onPropsValidate = result => {
    propsValidationErrors = result;
}

const updateComponent = doChange => {
    const newComponent = cloneDeep(component);

    component = doChange(newComponent);
    console.log(component, $store.screens[0].props._children[1])
    componentInfo = getScreenInfo(components, newComponent);
}

const onPropsChanged = newProps => {
    updateComponent(newComponent =>
        assign(newComponent, newProps))
    save();

}

const validate = () => {
    const fieldInvalid = (field, err) =>
        errors[field] = err;
    const fieldValid = field =>
        errors[field] && delete errors[field];

    if(!name) nameInvalid = "component name i not supplied";
    else nameInvalid = "";

    return (!nameInvalid && propsValidationErrors.length === 0);
}

// const hideDialog = () => {
//     UIkit.modal(modalElement).hide();
// }

// const showDialog = () => {
//     UIkit.modal(modalElement).show();
// }

let current_view = 'props';



</script>

<div class="root">

    <!-- <div class="title">
        <div>{shortName}</div>
        <div>
            <IconButton icon="save"
                        on:click={save}
                        color="var(--secondary100)"
                        hoverColor="var(--primary100)"/>
            <IconButton icon="trash"
                        on:click={deleteComponent}
                        color="var(--secondary100)"
                        hoverColor="var(--primary100)"/>
        </div>
    </div> -->

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

    <div class="component-props-container">

      {#if current_view === 'props'}
        <PropsView onValidate={onPropsValidate}
                  {componentInfo}
                  {onPropsChanged} />
      {:else if current_view === 'layout'}
        <LayoutEditor />
      {:else}
        <CodeEditor />
      {/if}

    </div>

</div>


<!-- <div bind:this={modalElement} uk-modal>
    <div class="uk-modal-dialog">

        <div class="uk-modal-header">
            Delete {name} ?
        </div>

        <div class="uk-modal-body">
            Are you sure you want to delete this component ?
        </div>

        <div class="uk-modal-footer">
            <ButtonGroup>
                <Button grouped
                        on:click={confirmDeleteComponent}>
                        OK
                </Button>
                <Button grouped
                        on:click={hideDialog}
                        color="secondary" >
                        Cancel
                </Button>
            </ButtonGroup>
        </div>

    </div>

</div> -->

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
