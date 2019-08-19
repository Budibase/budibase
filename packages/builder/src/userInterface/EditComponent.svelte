<script>

import PropsView from "./PropsView.svelte";
import { store } from "../builderStore";
import { isRootComponent } from "./pagesParsing/searchComponents";
import IconButton from "../common/IconButton.svelte";
import Textbox from "../common/Textbox.svelte";
import UIkit from "uikit";
import { pipe } from "../common/core";
import {
    getComponentInfo
} from "./pagesParsing/createProps";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import ComponentInstanceEditor from "./ComponentInstanceEditor.svelte";

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
let componentDetailsExpanded = false;
let componentInfo;
let modalElement
let propsValidationErrors = [];
let editingComponentInstance;
let editingComponentInstancePropName="";
let allComponents;

$: shortName = last(name.split("/"));

store.subscribe(s => {
    component = s.currentFrontEndItem;
    if(!component) return;
    name = component.name;
    description = component.description;
    tagsString = join(", ")(component.tags);
    componentInfo = s.currentComponentInfo;
    componentDetailsExpanded = s.currentComponentIsNew;
    allComponents = s.allComponents;
});

const save = () => {

    if(!validate()) return;

    component.name = name;
    component.description = description;
    component.tags = pipe(tagsString, [
        split(","),
        map(s => s.trim())
    ]);

    store.saveDerivedComponent(component);
}

const deleteComponent = () => {
    showDialog();
}

const confirmDeleteComponent = () => {
    store.deleteDerivedComponent(component.name);
    hideDialog();
}

const onPropsValidate = result => {
    propsValidationErrors = result;
}

const updateComponent = doChange => {
    const newComponent = cloneDeep(component);
    doChange(newComponent);
    component = newComponent;
    componentInfo = getComponentInfo(allComponents, newComponent);
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

const onEditComponentProp = (propName) => {
    editingComponentInstance = component.props[propName];
    editingComponentInstancePropName = propName;
}

const componentInstanceCancelEdit = () => {
    editingComponentInstance = null;
    editingComponentInstancePropName = "";
}

const componentInstancePropsChanged = (instanceProps) => {
    updateComponent(newComponent => 
        newComponent.props[editingComponentInstancePropName] = instanceProps);
}

</script>

<div class="root">

    <div class="title">
        <div>{shortName}</div>
        <div>
            <IconButton icon="save" 
                        on:click={save} 
                        color="var(--primary100)"
                        hoverColor="red"/>
            <IconButton icon="trash" 
                        on:click={deleteComponent} 
                        color="var(--primary100)"
                        hoverColor="red"/>
        </div>
    </div>

    {#if editingComponentInstance}
    <ComponentInstanceEditor onGoBack={componentInstanceCancelEdit}
                             propertyName={editingComponentInstancePropName}
                             instanceProps={editingComponentInstance}
                             onPropsChanged={componentInstancePropsChanged}/>
    {:else}
    <div>

        <div class="section-header padding" on:click={() => componentDetailsExpanded = !componentDetailsExpanded}>
            <span style="margin-right: 7px">Component Details</span>
            <IconButton icon={componentDetailsExpanded ? "chevron-down" : "chevron-right"}/>
        </div>

        {#if componentDetailsExpanded}
        <div class="padding">
            <Textbox label="Name" 
                    infoText="use forward slash to store in subfolders"
                    bind:text={name}
                    hasError={!!nameInvalid}/>
            <div class="info-text"></div>
            <Textbox label="Description"
                        bind:text={description}/>
            <Textbox label="Tags" 
                        infoText="comma separated"
                        bind:text={tagsString}/>
            
        </div>
        {/if}

        <div class="section-header padding">
            <span>Properties</span>
        </div>

       
        <PropsView onValidate={onPropsValidate}
                {componentInfo}
                {onPropsChanged}
                {onEditComponentProp}/>
        

    </div>
    {/if}

</div>


<div bind:this={modalElement} uk-modal>
    <div class="uk-modal-dialog">

        <div class="uk-modal-header">
            Delete {component.name} ? 
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
    border-style: solid;
    border-color: var(--lightslate);
    border-width: 0px 0px 0px 1px;
}

.padding {
    padding: 0px 5px 0px 10px;
}

.title {
    background-color: white;
    padding: 3px;
    display: grid;
    grid-template-columns: [name] 1fr [actions] auto;
}

.title > div:nth-child(1) {
    grid-column-start: name;
    color: var(--secondary100);
}

.title > div:nth-child(2) {
    grid-column-start: actions;
}

.section-header {
    font-style: italic;    
    color: var(--slate);
    border-style: solid;
    border-color: var(--lightslate);
    border-width: 0px 0px 1px 0px;
}

.section-header {
    vertical-align: middle;
    margin-top: 20px;
}

</style>