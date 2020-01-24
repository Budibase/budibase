<script>
import ComponentHierarchyChildren from './ComponentHierarchyChildren.svelte';

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
export let thisLevel = "";

let pathPartsThisLevel;
let componentsThisLevel;
let _components;
let subfolders;

let expandedFolders = [];

const joinPath = join("/");

const normalizedName = name => pipe(name, [
        trimCharsStart("./"),
        trimCharsStart("~/"),
        trimCharsStart("../"),
        trimChars(" ")
    ]);


const isOnThisLevel = (c) =>
    normalizedName(c.name).split("/").length === pathPartsThisLevel
    &&
    (!thisLevel || normalizedName(c.name).startsWith(normalizedName(thisLevel)));

const notOnThisLevel = (c) => !isOnThisLevel(c);

const isInSubfolder = (subfolder, c) =>
    normalizedName(c.name).startsWith(
        trimCharsStart("/")(
            joinPath([thisLevel, subfolder])));

const isOnNextLevel = (c) =>
    normalizedName(c.name).split("/").length === pathPartsThisLevel + 1

const lastPartOfName = (c) =>
    last(c.name ? c.name.split("/") : c._component.split("/"))

const subFolder = (c) => {
    const cname = normalizedName(c.name);
    const folderName = cname.substring(thisLevel.length, cname.length).split("/")[0];

    return ({
        name: folderName,
        isExpanded: includes(folderName)(expandedFolders),
        path: thisLevel + "/" + folderName
    });
}

const subComponents = (subfolder) => pipe(components, [
        filter(c => isInSubfolder(subfolder, c))
    ]);

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



$: {
    pathPartsThisLevel = !thisLevel
                            ? 1
                            : normalizedName(thisLevel).split("/").length + 1;

    _components =
        pipe(components, [
            // filter(isOnThisLevel),
            map(c => ({component: c, title:lastPartOfName(c)})),
            sortBy("title")
        ]);

    // subfolders =
    //     pipe(components, [
    //         filter(notOnThisLevel),
    //         sortBy("name"),
    //         map(subFolder),
    //         uniqWith((f1,f2) => f1.path === f2.path)
    //     ]);
}

</script>

<div class="root">

    <!-- {#each subfolders as folder}
    <div class="hierarchy-item folder"
         on:click|stopPropagation={() => expandFolder(folder)}>
        <span>{@html getIcon(folder.isExpanded ? "chevron-down" : "chevron-right", "16")}</span>
        <span class="title" class:currentfolder={$store.currentFrontEndItem && isInSubfolder(folder.name, $store.currentFrontEndItem)}>{folder.name}</span>
        {#if folder.isExpanded}
        <svelte:self components={subComponents(folder.name)}
                     thisLevel={folder.path} />
        {/if}
    </div>
    {/each} -->

    {#each _components as component}
    <div class="hierarchy-item component"
         class:selected={isComponentSelected($store.currentFrontEndType, $store.currentFrontEndItem, component.component)}
         on:click|stopPropagation={() => store.setCurrentScreen(component.component.name)}>

        <span class="title">{component.title}</span>
    </div>
        {#if component.component.props && component.component.props._children}
            <ComponentHierarchyChildren components={component.component.props._children} onSelect={store.selectComponent}/>
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
