<script>

import ComponentsHierarchy from "./ComponentsHierarchy.svelte";
import PagesList from "./PagesList.svelte"
import { store } from "../builderStore";
import getIcon from "../common/icon";

</script>

<div class="root">
    
    <div class="ui-nav">

        <div class="components-list-container">
            <h5>
                {@html getIcon("sidebar","18")}
                <span class="nav-title-inner">COMPONENTS</span>
            </h5>
            <ComponentsHierarchy components={$store.allComponents}/>
        </div>

        <div class="pages-list-container">
            <h5>
                {@html getIcon("grid","18")}
                <span class="nav-title-inner">PAGES</span>
            </h5>
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
    height: 100%;
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
    padding-top: 20px;
}



h5 {
    font-size: 10pt;
    padding-left: 10px;
}

.nav-title-inner {
    margin-left:5px;
    vertical-align: bottom;
}
</style>