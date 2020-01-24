<script>
import ComponentsHierarchyChildren from './ComponentsHierarchyChildren.svelte';

import {
    last,
    sortBy,
    filter,
    map,
    uniqWith,
    isEqual,
    trimCharsStart,
    trimChars,
    join,
    includes
} from "lodash/fp";

import { pipe } from "../common/core";
import getIcon from "../common/icon";
import { store } from "../builderStore";

export let components = []

const joinPath = join("/");

const normalizedName = name => pipe(name, [
        trimCharsStart("./"),
        trimCharsStart("~/"),
        trimCharsStart("../"),
        trimChars(" ")
    ]);

const lastPartOfName = (c) =>
    last(c.name ? c.name.split("/") : c._component.split("/"))

const expandFolder = folder => {
    const expandedFolder = {...folder};
    if(expandedFolder.isExpanded) {
        expandedFolder.isExpanded = false;
        expandedFolders = filter(f => f.name !== folder.name)(expandedFolders);
    } else {
        expandedFolder.isExpanded = true;
        expandedFolders.push(folder.name);
    }
    const newFolders = [...subfolders];
    newFolders.splice(
        newFolders.indexOf(folder),
        1,
        expandedFolder);
    subfolders = newFolders;

}

const isComponentSelected = (type, current,c) =>
    type==="screen"
    && current
    && current.name === c.name

const isFolderSelected = (current, folder) =>
    isInSubfolder(current, folder)



$:  _components =
        pipe(components, [
            map(c => ({component: c, title:lastPartOfName(c)})),
            sortBy("title")
        ]);

function select_component(screen, component) {
    store.setCurrentScreen(screen);
    store.selectComponent(component);
}

</script>

<div class="root">


    {#each _components as component}
    <div class="hierarchy-item component"
         class:selected={isComponentSelected($store.currentFrontEndType, $store.currentFrontEndItem, component.component)}
         on:click|stopPropagation={() => store.setCurrentScreen(component.component.name)}>

        <span class="title">{component.title}</span>
    </div>
        {#if component.component.props && component.component.props._children}
            <ComponentsHierarchyChildren components={component.component.props._children}
                                         onSelect={child => select_component(component.component.name, child)} />
        {/if}
    {/each}

</div>

<style>

.root {
    font-weight: 500;
    font-size: 0.9rem;
    color: #828fa5;
}

.hierarchy-item {
    cursor: pointer;
    padding: 11px 7px;

    margin: 5px 0;
    border-radius: 5px;
}

.hierarchy-item:hover {
    /* color: var(--secondary); */
    background: #fafafa;
}



.currentfolder {
    color: var(--secondary100);
}

.selected {
    color: var(--button-text);
    background: var(--background-button)!important;
}

.title {
    margin-left: 10px;
}


</style>
