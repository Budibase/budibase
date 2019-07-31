<script>

import getIcon from "../common/icon";
import {store} from "../builderStore";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import ActionView from "./ActionView.svelte";
import Modal from "../common/Modal.svelte";
import {chain} from "../common/core";
import {keys, map, join} from "lodash/fp";

export let editingActionIsNew = false;
export let editingAction = null;
export let onActionEdit = (action) => {};
export let onActionDelete = (action) => {};
export let onActionSave = (action) => {};
export let onActionCancel = () => {};

$: isEditing = (editingAction !== null); 

let getDefaultOptionsHtml = defaultOptions => 
    chain(defaultOptions, [
        keys,
        map(k => `<span style="color:var(--slate)">${k}: </span>${JSON.stringify(defaultOptions[k])}`),
        join("<br>")
    ]);


let actionEditingFinished = (action) => {
    
    if(action) {
        onActionSave(action)
    } else {
        onActionCancel();
    }
}

</script>

<h3>Actions</h3>

{#if $store.actions}
<table class="fields-table uk-table uk-table-small">
    <thead>
        <tr>
            <th>Description</th>
            <th>Behaviour Source</th>
            <th>Behaviour Name</th>
            <th>Default Options</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each $store.actions as action}
        <tr>
            <td >{action.name}</td>
            <td >{action.behaviourSource}</td>
            <td >{action.behaviourName}</td>
            <td >{@html getDefaultOptionsHtml(action.initialOptions)}</td>
            <td class="edit-button">
                <span on:click={() => onActionEdit(action)}>{@html getIcon("edit")}</span>
                <span on:click={() => onActionDelete(action)}>{@html getIcon("trash")}</span>
            </td>
        </tr>
        {/each}
    </tbody>
</table>
{:else}
(no actions added)
{/if}


<Modal bind:isOpen={isEditing}>
    {#if isEditing}
    <ActionView action={editingAction}
                allActions={$store.actions}
                onFinished={actionEditingFinished}
                isNew={editingActionIsNew}/>
    {/if}    
</Modal>


<style>

.edit-button {
    cursor:pointer;
    color: var(--white);
}

tr:hover .edit-button  {
    color: var(--secondary75);
}


</style>