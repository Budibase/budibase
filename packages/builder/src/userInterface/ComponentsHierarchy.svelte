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
import { store } from "../builderStore";
import { ArrowDownIcon } from '../common/Icons/'

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

const isComponentSelected = (current, comp) =>
    current &&
    current.component &&
    comp.component &&
    current.component.name === comp.component.name

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

const isScreenSelected = component =>
    component.component &&
    $store.currentFrontEndItem &&
    component.component.name === $store.currentFrontEndItem.name;

</script>

<div class="root">


    {#each _components as component}
    <div class="hierarchy-item component"
         class:selected={isComponentSelected($store.currentComponentInfo, component)}
         on:click|stopPropagation={() => store.setCurrentScreen(component.component.name)}>

        <span class="icon" style="transform: rotate({isScreenSelected(component) ? 0 : -90}deg);">
            {#if component.component.props && component.component.props._children}
                <ArrowDownIcon />
            {/if}
        </span>

        <span class="title">{component.title}</span>
    </div>
        {#if isScreenSelected(component) && component.component.props && component.component.props._children}
            <ComponentsHierarchyChildren components={component.component.props._children}
                                         currentComponent={$store.currentComponentInfo}
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
    display: flex;
    align-items: center;
}

.hierarchy-item:hover {
    /* color: var(--secondary); */
    background: #fafafa;
}

.selected {
    color: var(--button-text);
    background: var(--background-button)!important;
}

.title {
    margin-left: 10px;
}

.icon {
    display: inline-block;
    transition: 0.2s;
    width: 24px;
    height: 24px;
}
</style>
