<script>
import {
    last
} from "lodash/fp";
import IconButton from "../common/IconButton.svelte";
import ComponentSearch from "./ComponentSearch.svelte";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import UIkit from "uikit";
import {
    getComponentInfo
} from "./pagesParsing/createProps";
import { store } from "../builderStore";

const emptyProps = () => ({_component:""})

export let props = emptyProps();
export let onValueChanged = () => {};
export let onComponentChosen = () => {};
export let onEdit = () => {};
export let disabled = false;

const CHOOSE_COMPONENT = "choose_component";
const CLEAR_COMPONENT = "clear_component";

let allComponents;
let modalElement;
let modalAction;

store.subscribe(s => {
    allComponents = s.allComponents;
});

$: componentSelected = props._component.length > 0;
$: shortName = last(props._component.split("/"));

const chooseComponent = () => {
    modalAction = CHOOSE_COMPONENT;
    showDialog();
}

const clearComponent = () => {
    modalAction = CLEAR_COMPONENT;
    showDialog();
}

const componentChosen = (component) => {
    const componentInfo = getComponentInfo(allComponents, component.name);
    props = componentInfo.fullProps;
    onValueChanged(props);
    onComponentChosen();
    hideDialog();
}

const hideDialog = () => {
    UIkit.modal(modalElement).hide();
}

const showDialog = () => {
    UIkit.modal(modalElement).show();
}

const confirmClearComponent = () => {
    props = emptyProps();
    onValueChanged(emptyProps());
    hideDialog();
}

</script>


<div class="root uk-form-controls">
    <div class:selectedname={componentSelected}>
        {componentSelected ?  shortName : "(none)"}
    </div>
    <div>
        {#if !disabled && componentSelected}
        <IconButton icon="edit" 
                    on:click={onEdit}/>

        <IconButton icon="trash" 
                    on:click={clearComponent} />
        {:else if !disabled && !componentSelected}
        <IconButton icon="plus" 
                    on:click={chooseComponent} />
        {/if}
        
    </div>
</div>

<div bind:this={modalElement} uk-modal>
    <div class="uk-modal-dialog">

        {#if modalAction === CHOOSE_COMPONENT}
        <div class="uk-modal-body">
            <ComponentSearch onComponentChosen={componentChosen} />
        </div>
        {:else if modalAction === CLEAR_COMPONENT}
        <div class="uk-modal-body">
            Clear this component ?
        </div>
        <div class="uk-modal-footer">
            <ButtonGroup>
                <Button grouped 
                        on:click={hideDialog} 
                        color="secondary" >Cancel</Button>
                <Button grouped 
                        on:click={confirmClearComponent}>OK</Button>
            </ButtonGroup>
        </div>
        {/if}

    </div>

</div>

<style>

.root {
    display: grid;
    grid-template-columns: [name] 1fr [actions] auto;
}

.root > div:nth-child(1) {
    grid-column-start: name;
    color: var(--secondary50);
}

.root > div:nth-child(2) {
    grid-column-start: actions;
}

.selectedname {
    font-weight: bold;
    color: var(--secondary);
}

</style>