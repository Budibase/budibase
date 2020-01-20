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
    padding: 2rem 1.5rem 2rem 1.5rem;
}

.switcher {
    display: flex;
    justify-content: space-between;
}

.switcher > button {
    display: inline-block;
    border: none;
    margin: 5px;
    padding: 5px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #999;
}

.switcher > .selected {
    color: #333;
}

.panel {
    flex: 1 1 auto;
    height: 0px;
    overflow-y: auto;
}

</style>
