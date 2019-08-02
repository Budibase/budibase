<script>

import Textbox from "../common/Textbox.svelte";
import CodeArea from "../common/CodeArea.svelte";
import Button from "../common/Button.svelte";
import Dropdown from "../common/Dropdown.svelte";
import {store} from "../builderStore";
import {filter, some, map} from "lodash/fp";
import {hierarchy as hierarchyFunctions, common} from "../../../core/src";

const pipe = common.$;

let index;
let indexableRecords = [];

store.subscribe($store => {
    index = $store.currentNode;
    indexableRecords = pipe($store.hierarchy,[
        hierarchyFunctions.getFlattenedHierarchy,
        filter(hierarchyFunctions.isDecendant(index.parent())),
        filter(hierarchyFunctions.isRecord),
        map(n => ({
            node:n,
            isallowed: some(id => n.nodeId === id)(index.allowedRecordNodeIds)
        }))
    ]);
});

const toggleAllowedRecord = record => {
    if(record.isallowed) {
        index.allowedRecordNodeIds = filter(id => id !== record.node.nodeId)
                                           (index.allowedRecordNodeIds);
    } else {
        index.allowedRecordNodeIds.push(record.node.nodeId);
    }
};

</script>

<div class="root">
    <Textbox bind:text={index.name} label="Name"/>
    
    <div class="allowed-records">
        <div>Records to Index</div>
        {#each indexableRecords as rec}
        <input type="checkbox" checked={rec.isallowed} on:change={() => toggleAllowedRecord(rec)}/>
        <span>{rec.node.name}</span>
        {/each}
    </div>


    <Dropdown label="Index Type" bind:selected={index.indexType} options={["ancestor", "reference"]} />

    <CodeArea bind:text={index.map} label="Map (javascript)"/>
    <CodeArea bind:text={index.filter} label="Filter (javascript expression)"/>
    <CodeArea bind:text={index.getShardName} label="Shard Name (javascript expression)"/>

    
</div>

<style>

.root {
    height: 100%;
    padding: 15px;
}

.allowed-records {
    margin: 20px 0px;
}

.allowed-records > span {
    margin-right:30px;
}

</style>