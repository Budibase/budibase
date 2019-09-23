<script>

import { store } from "../builderStore";
import HierarchyRow from "./HierarchyRow.svelte";
import DropdownButton from "../common/DropdownButton.svelte";
import {hierarchy as hierarchyFunctions} from "../../../core/src";
import NavItem from "./NavItem.svelte";
import getIcon from "../common/icon";


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
            <div class="components-list-container">
                <div class="nav-group-header">
                    <div>{@html getIcon("database","18")}</div>
                    <div class="hierarchy-title">Database</div>
                    <DropdownButton iconName="plus" actions={newChildActions} />
                </div>
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

        <NavItem name="actions" label="Actions & Triggers"/>
        <NavItem name="access levels" label="User Levels"/>
        <div class="space-filler"></div>
    </div>
</div>

<style>

.root {
    height: 100%;
    background-color: var(--secondary5);
}

.items-root {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 1rem;
}



.nav-items-container {
    padding: 2rem 1rem 0rem 1rem;
}

.nav-group-header {
    display:grid;
    grid-template-columns: [icon] auto [title] 1fr [button] auto;
    padding: 2rem 1rem 0rem 1rem;
    font-size: .9rem;
    font-weight: bold;
}

.nav-group-header>div:nth-child(1) {
    padding: 0rem .7rem 0rem 0rem;
    vertical-align: bottom;
    grid-column-start: icon;
    margin-right: 5px;
}

.nav-group-header>span:nth-child(2) {
    margin-left:5px;
    vertical-align: bottom;
    grid-column-start: title;
    margin-top:auto;
}

.nav-group-header>div:nth-child(3) {
    vertical-align: bottom;
    grid-column-start: button;
    cursor: pointer;
    color: var(--primary75);
}

.nav-group-header>div:nth-child(3):hover {
    color: var(--primary75);   
}


.hierarchy-title-row {
    padding: 2rem 1rem 0rem 1rem;
    font-size: 1rem;
    font-weight: bold;
}

.hierarchy-title {
    flex: auto 1 1;
}



.space-filler {
    flex: 1 1 auto;
}


</style>