<script>

import { store } from "../builderStore";
import HierarchyRow from "./HierarchyRow.svelte";
import DropdownButton from "../common/DropdownButton.svelte";
import {hierarchy as hierarchyFunctions} from "../../../core/src";
import NavItem from "./NavItem.svelte";

const defaultNewChildActions =  [
    {
        label:"New Root Index", 
        onclick: store.newRootIndex
    }, 
    {
        label:"New Root Record", 
        onclick: store.newRootRecord
    }
];

let newChildActions = defaultNewChildActions;

const setActiveNav = (name) => () => {
    store.setActiveNav(name);
}


store.subscribe(db => {
    if(!db.currentNode || hierarchyFunctions.isIndex(db.currentNode)) {
        newChildActions = defaultNewChildActions;
    } else {
        newChildActions = [
            {label:"New Root Record", 
            onclick: store.newRootRecord},
            {label: `New Child Record of ${db.currentNode.name}`, 
            onclick: store.newChildRecord},
            {label:"New Root Index", 
            onclick: store.newRootIndex},
            {label: `New Index on ${db.currentNode.name}`, 
            onclick: store.newChildIndex}
        ];
    }
});

</script>

<div class="root">
    <div class="items-root">
        <div class="hierarchy">
            <div class="hierarchy-title-row">
                <div class="hierarchy-title">Database</div>
                <DropdownButton iconName="plus" actions={newChildActions} />
            </div>

            {#each $store.hierarchy.children as record}
            <HierarchyRow node={record}
                        type="record" />
            {/each}

            {#each $store.hierarchy.indexes as index}
            <HierarchyRow node={index}
                        type="index" />
            {/each}

        </div>

        <NavItem name="actions" label="Actions and Triggers"/>
        <NavItem name="access levels" label="User Levels"/>
        <div class="space-filler"></div>
    </div>
</div>

<style>

.root {
    height: 100%;
    background-color: var(--primary10);
}

.items-root {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 10px;
}


.hierarchy {
    flex: 1 1 auto;
}


.hierarchy-title-row {
    padding: 15px 7px;
    font-size: 12pt;
    display: flex;
    font-weight: bold;
}

.hierarchy-title {
    flex: auto 1 1;
}



.space-filler {
    flex: 1 1 auto;
}


</style>