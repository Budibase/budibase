<script>

import getIcon from "../common/icon";
import {store} from "../builderStore";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import Actions from "./Actions.svelte";
import Triggers from "./Triggers.svelte";
import {getNewAction, getNewTrigger} from "../common/core";

let editingAction = null;
let editingActionIsNew = true;
let editingTrigger = null;
let editingTriggerIsNew = true;

let getDefaultOptionsHtml = defaultOptions => 
    pipe(defaultOptions, [
        keys,
        map(k => `<span style="color:var(--slate)">${k}: </span>${JSON.parse(typeOptions[k])}`),
        join("<br>")
    ]);

let onActionEdit = (action) => {
    editingAction = action;
    editingActionIsNew = false;
}

let newAction = () => {
    editingAction = getNewAction();
    editingActionIsNew = true;
}

let onActionDelete = (action) => {
    store.deleteAction(action);
}

let deleteTrigger = () => {}

let editTrigger = (trigger) => {
    editingTrigger = trigger;
    editingTriggerIsNew = false;
}

let newTrigger = () => {
    editingTrigger = getNewTrigger();
    editingTriggerIsNew = true;
}

let onActionSave = action => {
    store.saveAction(
            action, 
            editingActionIsNew, 
            editingAction);

    editingAction = null;
}

let onActionCancel = () => {
    editingAction = null;
}

let onTriggerSave = trigger => {
    store.saveTrigger(
            trigger, 
            editingTriggerIsNew, 
            editingTrigger);

    editingTrigger = null;
}

let onTriggerCancel = () => {
    editingTrigger = null;
}

let onTriggerEdit = (trigger) => {
    editingTrigger = trigger;
    editingTriggerIsNew = false;
}


let onTriggerDelete = (trigger) => {
    store.deleteTrigger(trigger);
}

</script>

<div class="root">

<ButtonGroup>
    <Button color="secondary" 
            grouped
            on:click={newAction}>Create New Action</Button>
    <Button color="secondary" 
            grouped
            on:click={newTrigger}>Create New Trigger</Button>
</ButtonGroup>

<Actions {editingActionIsNew} {editingAction} 
         {onActionEdit} {onActionDelete} {onActionSave}
         {onActionCancel} />

<Triggers {editingTriggerIsNew} {editingTrigger} 
         {onTriggerEdit} {onTriggerDelete} {onTriggerSave}
         {onTriggerCancel} />

</div>

<style>

.root {
    padding: 10px;
}


</style>