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
let editingComponentArrayIndex;
let editingComponentArrayPropName;
let editingComponentInstanceTitle;
let originalName="";
let allComponents;
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
    componentDetailsExpanded = s.currentComponentIsNew;
    allComponents = s.allComponents;
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

    store.saveDerivedComponent(component);

    ignoreStore = false;
    // now do the rename
    if(name !== originalName) {
        store.renameDerivedComponent(originalName, name);
    }
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

const onEditComponentProp = (propName, arrayIndex, arrayPropName) => {

    editingComponentInstance = isUndefined(arrayIndex) 
                               ? component.props[propName]
                               : component.props[propName][arrayIndex][arrayPropName];
    editingComponentInstancePropName = propName;
    editingComponentInstanceTitle = isUndefined(arrayIndex)
                                       ? propName
                                       : `${propName}[${arrayIndex}].${arrayPropName}`;
                                
    editingComponentArrayIndex = arrayIndex;
    editingComponentArrayPropName = arrayPropName;
}

const componentInstanceCancelEdit = () => {
    editingComponentInstance = null;
    editingComponentInstancePropName = "";
}

const componentInstancePropsChanged = (instanceProps) => {
    updateComponent(newComponent => {
        if(isUndefined(editingComponentArrayIndex)) {
            newComponent.props[editingComponentInstancePropName] = instanceProps;
        } else {
            newComponent.props[editingComponentInstancePropName]
                              [editingComponentArrayIndex]
                              [editingComponentArrayPropName] = instanceProps;
        }
    });
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

    {#if editingComponentInstance}
    <div class="component-props-container">
        <ComponentInstanceEditor onGoBack={componentInstanceCancelEdit}
                                title={editingComponentInstanceTitle}
                                instanceProps={editingComponentInstance}
                                onPropsChanged={componentInstancePropsChanged}/>
    </div>
    {:else}
    <div class="component-props-container">

        <div class="section-header padding" on:click={() => componentDetailsExpanded = !componentDetailsExpanded}>
            <span style="margin-right: 7px">Component Details</span>
            <IconButton icon={componentDetailsExpanded ? "chevron-down" : "chevron-right"}/>
        </div>

        {#if componentDetailsExpanded}
        <div class="padding">
            <div class="info-text">
                <Textbox label="Name" 
                        infoText="use forward slash to store in subfolders"
                        text={name}
                        on:change={ev => name = ev.target.value}
                        hasError={!!nameInvalid}/>
                <Textbox label="Description"
                         on:change={ev => description = ev.target.value}
                         text={description}/>
                <Textbox label="Tags" 
                         infoText="comma separated"
                         on:change={ev => tagsString = ev.target.value}
                         text={tagsString}/>
            </div>    
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
}

.padding {
    padding: 1rem 1rem 0rem 1rem;
}

.info-text {
    color: var(--secondary100);
    font-size: .8rem !important;
    font-weight: bold;
}

.title {
    padding: 2rem 1rem 1rem 1rem;
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

.section-header {
    display: grid;
    grid-template-columns: [name] 1fr [actions] auto;
    color: var(--secondary50);
    font-size: .9rem;
    font-weight: bold;
    vertical-align: middle;
}

.component-props-container {
    flex: 1 1 auto;
    overflow-y: auto;
}
</style>