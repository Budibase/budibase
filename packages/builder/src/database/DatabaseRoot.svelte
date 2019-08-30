<script>

import HierarchyRow from "./HierarchyRow.svelte";
import RecordView from "./RecordView.svelte";
import IndexView from "./IndexView.svelte";
import ActionsHeader from "./ActionsHeader.svelte";
import {store} from "../builderStore";
import getIcon from "../common/icon";
import DropdownButton from "../common/DropdownButton.svelte";
import {hierarchy as hierarchyFunctions} from "../../../core/src";

const hierarchyWidth = "200px";

const defaultNewIndexActions =  [{
    label:"New Root Index", 
    onclick: store.newRootIndex
}];

const defaultNewRecordActions = [{
    label:"New Root Record", 
    onclick: store.newRootRecord
}];

let newIndexActions = defaultNewIndexActions;
let newRecordActions = defaultNewRecordActions;

store.subscribe(db => {
    if(!db.currentNode || hierarchyFunctions.isIndex(db.currentNode)) {
        newRecordActions = defaultNewRecordActions;
        newIndexActions = defaultNewIndexActions;
    } else {
        newRecordActions = [
            ...defaultNewRecordActions,
            {label: `New Child Record of ${db.currentNode.name}`, 
            onclick: store.newChildRecord}
        ];

        newIndexActions = [
            ...defaultNewIndexActions,
            {label: `New Index on ${db.currentNode.name}`, 
            onclick: store.newChildIndex}
        ];
    }
});


</script>

<div class="root">
    <div class="actions-header">
        {#if $store.currentNode}
        <ActionsHeader left={hierarchyWidth}/>
        {/if}
    </div>
    <div class="node-view">
        {#if !$store.currentNode}
        <h1 style="margin-left: 100px">:)</h1>
        {:else if $store.currentNode.type === "record"}
        <RecordView />
        {:else}
        <IndexView />
        {/if}
    </div>
</div>


<style>
.root {
    height: 100%;
    position: relative;
}

.actions-header {
    flex: 0 1 auto;
}

.node-view {
    overflow-y: auto;
    flex: 1 1 auto;
}

</style>