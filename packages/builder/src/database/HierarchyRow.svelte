<script>

import {database} from "../builderStore";
import {cloneDeep} from "lodash";
export let level = 0;
export let node;

</script>

<div class="root">
    <div class="title" on:click={() => database.selectExistingNode(node.nodeId)} style="padding-left: {20 + (level * 20)}px">
        {node.name}
    </div>
    {#if node.children}
    {#each node.children as child}
    <svelte:self node={child} 
                 level={level+1}/>
    {/each}
    {/if}
</div>


<style>

.root { 
    display: block;
    font-size: 13pt;
    width: 100%;
    cursor: pointer;
}

.title {
    font: var(--bodytext);
    padding-top: 10px;
    padding-right: 5px;
    padding-bottom: 10px;
    color: var(--secondary100);
}

.title:hover {
    background-color: var(--secondary10);
}

</style>