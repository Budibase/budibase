<script>

import ButtonGroup from "../common/ButtonGroup.svelte";
import Button from "../common/Button.svelte";
import {database} from "../builderStore";
import {generateFullPermissions, getNewAccessLevel} from "../common/core";
import getIcon from "../common/icon";
import AccessLevelView from "./AccessLevelView.svelte";
import Modal from "../common/Modal.svelte";

let editingLevel = null;
let editingLevelIsNew = false;
$: isEditing = (editingLevel !== null); 

let allPermissions = [];
database.subscribe(db => {
    allPermissions = generateFullPermissions(db.hierarchy, db.actions);
})

let onLevelEdit = (level) => {
    editingLevel = level;
    editingLevelIsNew = false;
};

let onLevelCancel = () => {
    editingAction = null;
};

let onLevelDelete = (level) => {
    database.deleteLevel(level);
};


let createNewLevel = () => {
    editingLevelIsNew = true;
    editingLevel = getNewAccessLevel();
}

let onEditingFinished = (level) => {
    if(level) {
        database.saveLevel(level, editingLevelIsNew, editingLevel);
    }
    editingLevel = null;
}

const getPermissionsString = perms => {
    return `${perms.length} / ${allPermissions.length}`;
}

</script>

<div class="root">

<ButtonGroup>
    <Button grouped color="secondary" on:click={createNewLevel}>Create New Access Level</Button>
</ButtonGroup>

{#if $database.accessLevels}
<table class="fields-table uk-table uk-table-small">
    <thead>
        <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each $database.accessLevels as level}
        <tr>
            <td >{level.name}</td>
            <td >{getPermissionsString(level.permissions)}</td>
            <td class="edit-button">
                <span on:click={() => onLevelEdit(level)}>{@html getIcon("edit")}</span>
                <span on:click={() => onLevelDelete(level)}>{@html getIcon("trash")}</span>
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
    <AccessLevelView level={editingLevel}
                     allPermissions={allPermissions}
                     onFinished={onEditingFinished}
                     isNew={editingLevelIsNew}
                     allLevels={$database.accessLevels}
                     hierarchy={$database.hierarchy}
                     actions={$database.actions} />
    {/if}    
</Modal>


</div>

<style>

.root {
    padding:10px;
}

.edit-button {
    cursor:pointer;
    color: var(--white);
}

tr:hover .edit-button  {
    color: var(--secondary75);
}


</style>