<script>

import {store} from "../builderStore";
import {cloneDeep} from "lodash";
import getIcon from "../common/icon";
export let level = 0;
export let node;
export let type;

let navActive = "";
$:icon = type==="index" ? "list" : "file";

store.subscribe(s => {
    if(s.currentNode)
        navActive = (s.activeNav === "database" && node.nodeId === s.currentNode.nodeId 
                    ? "active" : "")
});

</script>

<div class="root">
    <div class="title {navActive}" on:click={() => store.selectExistingNode(node.nodeId)} style="padding-left: {20 + (level * 20)}px">
        {@html getIcon(icon, 12)} <span style="margin-left: 1rem">{node.name}</span>
    </div>
    {#if node.children}
        {#each node.children as child}
        <svelte:self node={child} 
                    level={level+1}
                    type="record"/>
        {/each}
    {/if}
    {#if node.indexes}
        {#each node.indexes as index}
        <svelte:self node={index} 
                    level={level+1}
                    type="index"/>
        {/each}
    {/if}
</div>


<style>

.root { 
    display: block;
    font-size: .9rem;
    width: 100%;
    cursor: pointer;
    color: var(--secondary50);
    font-weight: 500;
}

.title {
    padding-top: .5rem;
    padding-right: .5rem;
}

.title:hover {
    background-color: var(--secondary10);
}

.active {
    background-color: var(--primary10);
}

</style>