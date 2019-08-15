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
    last(c.name.split("/"))

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

const isComponentSelected = (current,c) =>
    current 
    && current.name === c.name

const isFolderSelected = (current, folder) => 
    isInSubfolder(current, folder)



$: {
    pathPartsThisLevel = !thisLevel 
                            ? 1
                            : normalizedName(thisLevel).split("/").length + 1;

    componentsThisLevel = 
        pipe(components, [
            filter(isOnThisLevel),
            map(c => ({component:c, title:lastPartOfName(c)})),
            sortBy("title")
        ]);

    subfolders = 
        pipe(components, [
            filter(notOnThisLevel),
            sortBy("name"),
            map(subFolder),
            uniqWith((f1,f2) => f1.path === f2.path)
        ]);
}

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
    padding: 5px 0px;
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