<script>
import EditComponentProps from "./EditComponentProps.svelte";
import ComponentsList from "./ComponentsList.svelte";

let selected="properties";

const isSelected = tab => 
    selected === tab;

const selectTab = tab => 
    selected = tab;


</script>

<div class="root">

    <div class="switcher">

        <button 
            class:selected={selected==="properties"}
            on:click={() => selectTab("properties")}>
            Properties
        </button>

        <button 
            class:selected={selected==="components"}
            on:click={() => selectTab("components")}>
            Components
        </button>

    </div>

    <div class="panel">
        {#if selected==="properties"}
        <EditComponentProps />
        {/if}

        {#if selected==="components"}
        <ComponentsList />
        {/if}
    </div>

</div>


<style>

.root {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.switcher {
    flex: 0 0 auto;
}

.switcher > button {
    display: inline-block;
    background-color: rgba(0,0,0,0);
    border-style: solid;
    border-color: var(--slate);
    margin: 5px;
    padding: 5px;
    cursor: pointer;
}

.switcher > .selected {
    background-color: red;
}

.panel {
    flex: 1 1 auto;
    height: 0px;
    overflow-y: auto;
}

</style>