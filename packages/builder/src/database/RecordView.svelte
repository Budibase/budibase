<script>

import Textbox from "../common/Textbox.svelte";
import Button from "../common/Button.svelte";
import getIcon from "../common/icon";
import FieldView from "./FieldView.svelte";
import Modal from "../common/Modal.svelte";
import {map, join, filter, some, 
    find, keys, isDate} from "lodash/fp";
import { database } from "../builderStore";
import {common, hierarchy as h} from "../../../core/src";
import {templateApi, chain, validate} from "../common/core";

let record;
let getIndexAllowedRecords;
let editingField = false;
let fieldToEdit;
let isNewField = false;
let newField;
let editField;
let deleteField;
let onFinishedFieldEdit;
let editIndex;

database.subscribe($database => {
    record = $database.currentNode;
    const flattened = h.getFlattenedHierarchy($database.hierarchy);
    getIndexAllowedRecords = index => 
        chain(index.allowedRecordNodeIds, [
            filter(id => some(n => n.nodeId === id)(flattened)),
            map(id => find(n => n.nodeId === id)
                          (flattened).name),
            join(", ")
        ]);

    newField = () => {
        isNewField = true;
        fieldToEdit = templateApi($database.hierarchy).getNewField("string");
        editingField = true;
    }

    onFinishedFieldEdit = (field) => {
        if(field) {
            database.saveField(field);
        }
        editingField = false;
    }

    editField = (field) => {
        isNewField = false;
        fieldToEdit = field;
        editingField = true;
    }

    deleteField = (field) => {
        database.deleteField(field);
    }

    editIndex = index => {
        database.selectExistingNode(index.nodeId);
    }

})

let getTypeOptionsValueText = value => {
    if(value === Number.MAX_SAFE_INTEGER
       || value === Number.MIN_SAFE_INTEGER
       || new Date(value).getTime() === new Date(8640000000000000).getTime()
       || new Date(value).getTime() === new Date(-8640000000000000).getTime()) return "(any)";
    
    if(value === null) return "(not set)";
    return value;
}

let getTypeOptions = typeOptions => 
    chain(typeOptions, [
        keys,
        map(k => `<span style="color:var(--slate)">${k}: </span>${getTypeOptionsValueText(typeOptions[k])}`),
        join("<br>")
    ]);


</script>

<div class="root">

    <Textbox label="Name" bind:text={record.name} />
    <div>{record.nodeKey()}</div>
    {#if !record.isSingle}
    <Textbox label="Collection Name" bind:text={record.collectionName} />
    <Textbox label="Shard Factor" bind:text={record.allidsShardFactor} />
    {/if}

    <h4>
        Fields <span class="add-field-button" on:click={newField}>{@html getIcon("plus")}</span>
    </h4>

    {#if record.fields.length > 0}
    <table class="fields-table uk-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Options</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {#each record.fields as field}
            <tr>
                <td >
                    <div>{field.label}</div>
                    <div style="font-size: 0.7em; color: var(--slate)">{field.name}</div>
                </td>
                <td >{field.type}</td>
                <td >{@html getTypeOptions(field.typeOptions)}</td>
                <td>
                    <span class="edit-button" on:click={() => editField(field)}>{@html getIcon("edit")}</span>
                    <span class="edit-button" on:click={() => deleteField(field)}>{@html getIcon("trash")}</span>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
    {:else}
    (no fields added)
    {/if}

    {#if editingField}
    <Modal bind:isOpen={editingField}>
        <FieldView field={fieldToEdit} 
                   onFinished={onFinishedFieldEdit}
                   allFields={record.fields} 
                   database={$database}/>
    </Modal>
    {/if}

    <h4>
        Indexes 
    </h4>

    {#each record.indexes as index}
    <div class="index-container">
        <div class="index-name">
            {index.name}
            <span style="margin-left: 7px" on:click={() => editIndex(index)}>{@html getIcon("edit")}</span>
        </div>
        <div class="index-field-row">
            <span class="index-label">records indexed: </span> 
            <span>{getIndexAllowedRecords(index)}</span>
            <span class="index-label" style="margin-left: 15px">type:</span> 
            <span>{index.indexType}</span>
        </div>
        <div class="index-field-row">
            <span class="index-label">map:</span>
            <code class="index-mapfilter">{index.map}</code>
        </div>
        {#if index.filter}
        <div class="index-field-row">
            <span class="index-label">filter:</span>
            <code class="index-mapfilter">{index.filter}</code>
        </div>
        {/if}
    </div>
    {:else}
    (no indexes added)
    {/each}

</div>


<style>

.root {
    height: 100%;
    padding: 15px;
}

.fields-table {
    margin:10px;
    border-collapse:collapse;
}

.add-field-button {
    margin-left:15px;
    cursor:pointer;
}

.edit-button {
    cursor:pointer;
    color: var(--white);
}

.edit-button:hover {
    color: var(--secondary75);
}

th {
    text-align: left;
}

td {
    padding: 5px 30px 5px 0px;
    margin:0;
    
}

thead > tr {
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: var(--secondary75);
    margin-bottom: 20px;
}

tbody > tr {
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: var(--primary10);
}

tbody > tr:hover {
    background-color: var(--primary10);
}

tbody > tr:hover .edit-button {
    color: var(--secondary75);
}

.index-container {
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: var(--secondary25);
    padding: 10px;
    margin-bottom: 5px;
}

.index-label {
    color: var(--slate);
}

.index-name {
    font-weight: bold;
    color: var(--primary100);
}

.index-container code {
    margin: 0;
    display: inline;
    background-color: var(--primary10);
    color: var(--secondary100);
    padding:3px;
}

.index-field-row {
    margin-top: 7px;
}

</style>