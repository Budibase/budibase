<script>

import getIcon from "./icon";
export let iconName;
export let actions = []; // [ {label: "Action Name", onclick: () => {...} } ]
let isDroppedDown = false;

</script>


<div class="root" on:click={() => isDroppedDown = !isDroppedDown}>
    {@html getIcon(iconName)}
    
    <div class="dropdown-background" on:click|stopPropagation={() => isDroppedDown = false} style="display: {isDroppedDown ? 'block' : 'none'}"></div>

    <div class="dropdown-content" style="display: {isDroppedDown ? 'inline-block' : 'none'}">
        {#each actions as action}
        <div class="action-row" on:click={action.onclick}>
            {action.label}
        </div>
        {/each}
    </div>
    
</div>


<style>

.dropdown-background {
    position: fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
}

.root {
    cursor: pointer;
    z-index: 1;
}

.dropdown-content {
    position: absolute;
    background-color: var(--white);
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    font-weight: normal;
    border-style: solid;
    border-width: 1px;
    border-color: var(--secondary10);
}

.dropdown-content:not(:focus) {
    display: none;
}

.action-row {
    padding: 7px 10px;
    cursor:pointer;
}

.action-row:hover {
    background-color: var(--primary100);
    color:var(--white);
}

</style>