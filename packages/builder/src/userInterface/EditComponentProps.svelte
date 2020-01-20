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

    store.saveScreen(component);

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
    doChange(newComponent);
    component = newComponent;
    componentInfo = getScreenInfo(components, newComponent);
}

const onPropsChanged = newProps => {
    updateComponent(newComponent => 
        assign(newComponent.props, newProps));
    
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

const hideDialog = () => {
    UIkit.modal(modalElement).hide();
}

const showDialog = () => {
    UIkit.modal(modalElement).show();
}

</script>

<div class="root">

    <div class="title">
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
    </div>

    <div class="component-props-container">

       
        <PropsView onValidate={onPropsValidate}
                {componentInfo}
                {onPropsChanged} />
        

    </div>

</div>


<div bind:this={modalElement} uk-modal>
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

</div>

<style>

.root {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px 0 0 0;
    border-color: var(--slate);
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
</style>