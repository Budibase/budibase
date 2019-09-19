<script>

import Textbox from "../common/Textbox.svelte";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import {cloneDeep, filter, keys,
map, isUndefined} from "lodash/fp";
import ErrorsBox from "../common/ErrorsBox.svelte";
import {validateActions, pipe} from "../common/core";
import getIcon from "../common/icon";

export let action;
export let onFinished = (action) => {};
export let allActions;
export let isNew = true;

let optKey = "";
let optValue = "";

let clonedAction = cloneDeep(action); 
let initialOptions = pipe(action.initialOptions, [
    keys,
    map(k => ({key:k, value:action.initialOptions[k]}))
]);
let errors = [];

const addNewOption = () => {

    if(optKey && optValue && isUndefined(clonedAction.initialOptions[optKey])) {
        clonedAction.initialOptions[optKey] = optValue;
        initialOptions = [...initialOptions, {
            key:optKey, value: optValue
        }];
        optKey = "";
        optValue = "";
    }
}

const removeOption = (opt) => {
    if(opt) {
        delete clonedAction.initialOptions[opt.key]
        initialOptions = pipe(initialOptions, [
            filter(o => o.key !== opt.key)
        ]);
    }
}

const save = () => {

    const newActionsList = [
        ...pipe(allActions ,[filter(a => a !== action)]),
        clonedAction]

    errors = pipe(newActionsList ,[
        validateActions,
        map(e => e.error)
    ]);

    if(errors.length === 0)
        onFinished(clonedAction);
}

const cancel = () => {
    onFinished();
}

</script>

<div class="root">

    <ErrorsBox {errors} />

    <form class="uk-form-horizontal">

        <Textbox label="Name" bind:text={clonedAction.name} />
        <Textbox label="Behaviour Source" bind:text={clonedAction.behaviourSource} />
        <Textbox label="Behaviour" bind:text={clonedAction.behaviourName} />

    </form>

    <div class=" uk-form-stacked" style="margin-bottom: 20px">
        <label class="uk-form-label">Default Options</label>
        <div class="uk-grid-small" uk-grid>
            <input class="uk-input uk-width-1-4" placeholder="key" bind:value={optKey} >        
            <input class="uk-input uk-width-1-4" placeholder="value" bind:value={optValue} >        
            <Button color="primary-outline uk-width-1-4" on:click={addNewOption}>Add</Button>
        </div>
        <div style="margin-top: 10px">
            {#each initialOptions as option}
            <span class="option-container">{option.key} : {option.value} <span style="font-size:10pt; cursor: pointer" on:click={() => removeOption(option)}>{@html getIcon("trash-2")}</span></span>
            {/each}
        </div>
    </div>

    <ButtonGroup>
        <Button color="primary" grouped on:click={save}>Save</Button>
        <Button color="tertiary" grouped on:click={cancel}>Cancel</Button>
    </ButtonGroup>

    
</div>


<style>

.root {
    padding: 10px;
}

.option-container {
    border-style: dotted;
    border-width: 1px;
    border-color: var(--primary75);
    padding: 3px;
    margin-right: 5px;
}

</style>