<script>

import Textbox from "../common/Textbox.svelte";
import Button from "../common/Button.svelte";
import getIcon from "../common/icon";
import FieldView from "./FieldView.svelte";
import Modal from "../common/Modal.svelte";
import {map, join, filter, some, 
    find, keys, isDate} from "lodash/fp";
import { store } from "../builderStore";
import {common, hierarchy as h} from "../../../core/src";
import {templateApi, pipe, validate} from "../common/core";

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

store.subscribe($store => {
    record = $store.currentNode;
    const flattened = h.getFlattenedHierarchy($store.hierarchy);
    getIndexAllowedRecords = index => 
        pipe(index.allowedRecordNodeIds, [
            filter(id => some(n => n.nodeId === id)(flattened)),
            map(id => find(n => n.nodeId === id)
                          (flattened).name),
            join(", ")
        ]);

    newField = () => {
        isNewField = true;
        fieldToEdit = templateApi($store.hierarchy).getNewField("string");
        editingField = true;
    }


    onFinishedFieldEdit = (field) => {
        if(field) {
            store.saveField(field);
        }
        editingField = false;
    }

    editField = (field) => {
        isNewField = false;
        fieldToEdit = field;
        editingField = true;
    }

    deleteField = (field) => {
        store.deleteField(field);
    }

    editIndex = index => {
        store.selectExistingNode(index.nodeId);
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
    pipe(typeOptions, [
        keys,
        map(k => `<span style="color:var(--slate)">${k}: </span>${getTypeOptionsValueText(typeOptions[k])}`),
        join("<br>")
    ]);

const nameChanged = ev => {
    const pluralName = n => `${n}s`;
    if(record.collectionName === "") {
        record.collectionName = pluralName(ev.target.value);
    }
}

</script>

<div class="root">

    <form class="uk-form-horizontal">
        <h3 class="settings-title">
        Settings 
        </h3>
    
        <Textbox label="Name:" bind:text={record.name} on:change={nameChanged}/>
        {#if !record.isSingle}
        <Textbox label="Collection Name:" bind:text={record.collectionName} />
        <Textbox label="Shard Factor:" bind:text={record.allidsShardFactor} />
        {/if}
        <div class="recordkey">{record.nodeKey()}</div>

    </form>
    <h3 class="title">
        Fields <span class="add-field-button" on:click={newField}>{@html getIcon("plus")}</span>
    </h3>

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
                    <div class="field-label">{field.label}</div>
                    <div style="font-size: 0.8em; color: var(--slate)">{field.name}</div>
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
    <Modal bind:isOpen={editingField} onClosed={() => onFinishedFieldEdit(false) }>
        <FieldView field={fieldToEdit} 
                   onFinished={onFinishedFieldEdit}
                   allFields={record.fields} 
                   store={$store}/>
    </Modal>
    {/if}

    <h3 class="title">
        Indexes 
    </h3>

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
    <div class="no-indexes">
        No indexes added.
    </div>
    {/each}

</div>


<style>

.root {
    height: 100%;
    padding: 2rem;
}

.settings-title {
    font-weight: 700;
}

.title {
    margin: 3rem 0rem 0rem 0rem;
    font-weight: 700;
}

.recordkey {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary100);
}

.fields-table {
    margin: 1rem 1rem 0rem 0rem;
    border-collapse:collapse;
}

.add-field-button {
    cursor:pointer;
}

.edit-button {
    cursor:pointer;
    color: var(--secondary25);
}

.edit-button:hover {
    cursor:pointer;
    color: var(--secondary75);
}

th {
    text-align: left;    
}

td {
    padding: 1rem 5rem 1rem 0rem;
    margin:0;
    font-size: 14px;
    font-weight: 500;

}

.field-label {
      font-size: 14px;
      font-weight: 500;
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
    margin: 1rem 0rem 0rem 0rem;
}

.no-indexes {
    margin: 1rem 0rem 0rem 0rem;
    font-family: var(--fontnormal);
    font-size: 14px;
}
</style>