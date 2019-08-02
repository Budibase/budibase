<script>

import ComponentsHierarchy from "./ComponentsHierarchy.svelte";
import PagesList from "./PagesList.svelte"
import { store } from "../builderStore";

</script>

<div class="root">
    
    <div class="ui-nav">

        <div class="components-list-container">
            <h3>Components</h3>
            <ComponentsHierarchy components={$store.allComponents}/>
        </div>

        <div class="pages-list-container">
            <h3>Pages</h3>
            <PagesList />
        </div>

    </div>

    <div class="component-preview">
        {#if $store.currentFrontEndItem}
        <div class="component-container">
            <h1>{$store.currentFrontEndItem.name}</h1>
        </div>
        {/if} 
    </div>

</div>

<style>

.root {
    display: grid;
    grid-template-columns: [uiNav] 300px [preview] auto;
    height: 100%;
    width: 100%;
}

.ui-nav {
    grid-column-start: uiNav;
    background-color: var(--primary10);
    display: grid;
    grid-template-rows: [components] 1fr [pages] auto;
}

.component-preview {
    display: grid;
    grid-template-rows: [top] 1fr [middle] auto [bottom] 1fr;
    grid-template-columns: [left] 1fr [middle] auto [right] 1fr;
    grid-column-start: preview;
}

.component-container {
    grid-row-start: middle;
    grid-column-start: middle;
}

.pages-list-container { 
    grid-row-start: pages;
}

.components-list-container {
    grid-row-start: components;
}

h3 {
    padding: 10px;
}

</style>