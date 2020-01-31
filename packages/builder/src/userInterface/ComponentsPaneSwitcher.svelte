<script>
    import ComponentPanel from "./ComponentPanel.svelte";
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
            <ComponentPanel />
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
    margin-bottom: 25px;
}

.switcher > button {
    display: inline-block;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #999;
    background-color: rgba(0,0,0,0);
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
