<script>

import { searchAllComponents } from "./pagesParsing/searchComponents";
import { store } from "../builderStore";

export let onComponentChosen = () => {};

let allComponents = [];
let phrase = "";

store.subscribe(s => {
    allComponents = s.allComponents;
});

$: filteredComponents = 
    !phrase 
    ? [] 
    : searchAllComponents(allComponents, phrase);

</script>

<div class="root">

    <form class="uk-search uk-search-large">
        <span uk-search-icon></span>
        <input class="uk-search-input" 
               type="search" 
               placeholder="Based on component..." 
               bind:value={phrase}>
    </form>

    <div>
        {#each filteredComponents as component}
        <div class="component" on:click={() => onComponentChosen(component)}>
            <div class="title">{component.name}</div>
            <div class="description">{component.description}</div>
        </div>
        {/each}
    </div>

</div>

<style>

.component {
    padding:5px;
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: var(--lightslate);
    cursor: pointer;
}

.component:hover {
    background-color: var(--primary10);
}

.component > .title {
    font-size: 13pt;
    color: var(--secondary100);
}

.component > .description {
    font-size: 10pt;
    color: var(--primary75);
    font-style: italic;
}

</style>