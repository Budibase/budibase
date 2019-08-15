<script>

import ComponentSearch from "./ComponentSearch.svelte";
import { store } from "../builderStore";
import PropsView from "./PropsView.svelte";
import Textbox from "../common/Textbox.svelte";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import { pipe } from "../common/core";
import UIkit from "uikit";
import {
    getNewComponentInfo
} from "./pagesParsing/createProps";
import { isRootComponent } from "./pagesParsing/searchComponents";

import { 
    cloneDeep, 
    join,
    split,
    map,
    keys,
    isUndefined
} from "lodash/fp";
import { assign } from "lodash";

let component;
let modalElement;
let errors = {};
let componentInfo;

let name = "";
let description = "";
let tagsString = "";
let propsValidationErrors = [];
let inheritedProps;
let nameInvalid = "";
let propsDefinition;

const onBasedOnChosen = (allComponents) => (c) => {
    componentInfo = getNewComponentInfo(allComponents, c.name);
    tagsString = join(", ")(componentInfo.component.tags);
    inheritedProps = componentInfo.inheritedProps;
    propsDefinition = componentInfo.propsDefinition;
    component = componentInfo.component;
}

const createComponent = () => {

    if(!validate()) return;

    component.name = name;
    component.description = description;
    component.tags = pipe(tagsString, [
        split(","),
        map(s => s.trim())
    ]);

    store.saveDerivedComponent(component);
    close();
}

const close = () => {
    component = null;
    componentInfo = null;
    UIkit.modal(modalElement).hide();
}

const onPropsValidate = result => {
    propsValidationErrors = result;
}

const onPropsChanged = props => {
    assign(component.props, props);
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

</script>

<div bind:this={modalElement} id="new-component-modal" uk-modal>
    <div class="uk-modal-dialog">

        <div class="uk-modal-header">
            <h1>New Component</h1>
        </div>

        <div class="uk-modal-body">
            <form class="uk-form-horizontal">
                {#if componentInfo}
                
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
                <p class="uk-heading-line props-header"><span>Properties</span></p>
                <PropsView allComponents={$store.allComponents}
                           onValidate={onPropsValidate}
                           showTitle={false}
                           {componentInfo}
                           {onPropsChanged} />
                
                
                {:else}
                

                <ComponentSearch allComponents={$store.allComponents}
                                 onComponentChosen={onBasedOnChosen($store.allComponents)} />

                
                {/if}
            </form>
        </div>
        {#if component}
        <div class="uk-modal-footer">
            <ButtonGroup>
                <Button grouped 
                        on:click={close} 
                        color="secondary" >Cancel</Button>
                <Button grouped 
                        on:click={createComponent}>Create Component</Button>
            </ButtonGroup>

        </div>
        {/if}
    </div>
</div>

<style>
h1 {
    font-size:1.2em;
}

.props-header {
    font-style: italic;    
}

</style>