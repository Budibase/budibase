<script>

import { 
    last, 
    sortBy, 
    filter, 
    map,
    uniqWith,
    isEqual,
    trimCharsStart,
    trimChars,
    join
} from "lodash/fp";

import { pipe } from "../common/core";
import getIcon from "../common/icon";
import { store } from "../builderStore";

export let components = []
export let thisLevel = "";

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
    last(c.name.split("/"))

const subFolder = (c) => {
    const cname = normalizedName(c.name);
    const folderName = cname.substring(thisLevel.length, cname.length).split("/")[0];

    return ({
        name: folderName,
        isExpanded: false,
        path: thisLevel + "/" + folderName
    });
}

let pathPartsThisLevel = !thisLevel 
                        ? 1
                        : normalizedName(thisLevel).split("/").length + 1;

let componentsThisLevel = 
    pipe(components, [
        filter(isOnThisLevel),
        map(c => ({component:c, title:lastPartOfName(c)})),
        sortBy("title")
    ]);

let subfolders = 
    pipe(components, [
        filter(notOnThisLevel),
        sortBy("name"),
        map(subFolder),
        uniqWith((f1,f2) => f1.path === f2.path)
    ]);

const subComponents = (subfolder) => pipe(components, [
        filter(c => isInSubfolder(subfolder, c))
    ]);

const expandFolder = folder => {
    const expandedFolder = {...folder};
    expandedFolder.isExpanded = !expandedFolder.isExpanded;
    const newFolders = [...subfolders];
    newFolders.splice(
        newFolders.indexOf(folder),
        1,
        expandedFolder);
    subfolders = newFolders;
}

const isComponentSelected = (current,c) =>
    current 
    && current.name === c.name

const isFolderSelected = (current, folder) => 
    isInSubfolder(current, folder)

</script>

<div class="root" style={`padding-left: calc(10px * ${pathPartsThisLevel})`}>
 
    {#each subfolders as folder}
    <div class="hierarchy-item folder"
         on:click|stopPropagation={() => expandFolder(folder)}>
        <span>{@html getIcon(folder.isExpanded ? "chevron-down" : "chevron-right", "16")}</span>
        <span class="title" class:currentfolder={$store.currentFrontEndItem && isInSubfolder(folder.name, $store.currentFrontEndItem)}>{folder.name}</span>
        {#if folder.isExpanded}
        <svelte:self components={subComponents(folder.name)} 
                     thisLevel={folder.path} />
        {/if}
    </div>
    {/each}

    {#each componentsThisLevel as component}
    <div class="hierarchy-item component" class:selected={isComponentSelected($store.currentFrontEndItem, component.component)}
         on:click|stopPropagation={() => store.setCurrentComponent(component.component)}>
        <span>{@html getIcon("circle", "7")}</span>
        <span class="title">{component.title}</span>
    </div>
    {/each}

</div>

<style>

.root {
    color: var(--secondary50);
}

.hierarchy-item {
    cursor: pointer;
}

.hierarchy-item:hover {
    color: var(--secondary75);
}

.component {
    margin-left: 5px;
}

.currentfolder {
    color: var(--secondary100);
}

.selected {
    color: var(--primary100);
}

.title {
    margin-left: 10px;
}


</style>