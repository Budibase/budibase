<script>
import {
    isRootComponent
} from "./pagesParsing/searchComponents"
import { splitName } from "./pagesParsing/splitRootComponentName.js"
import { store } from "../builderStore";
import {
    groupBy, keys, find, sortBy
} from "lodash/fp";
import { pipe } from "../common/core";
import { ImageIcon, InputIcon, LayoutIcon } from '../common/Icons/';

let componentLibraries=[];

const addRootComponent = (c, all) => {
    const { libName } = splitName(c.name);
    let group = find(r => r.libName === libName)(all);

    if(!group) {
        group = {
            libName,
            components: [],
            generators: []
        };

        all.push(group);
    }

    group.components.push(c)

};

const onComponentChosen = store.addChildComponent;

store.subscribe(s => {

    const newComponentLibraries = [];

    for(let comp of sortBy(["name"])(s.components)) {
        addRootComponent(
            comp,
            newComponentLibraries);
    }

    componentLibraries = newComponentLibraries;
});

let current_view = 'text';

</script>

<div class="root">
    {#each componentLibraries as lib}
    <div class="library-header">
        {lib.libName}
    </div>

    <div class="library-container">
        <ul>
            <li>
            <button class:selected={current_view === 'text'} on:click={() => current_view = 'text'}>
                <InputIcon />
            </button>
            </li>
            <li>
                <button class:selected={current_view === 'layout'} on:click={() => current_view = 'layout'}>
                    <LayoutIcon />
                </button>
            </li>
            <li>
                <button class:selected={current_view === 'media'} on:click={() => current_view = 'media'}>
                    <ImageIcon />
                </button>
            </li>
        </ul>

        {#each lib.components.filter(_ => true) as component}

        <div class="component"
            on:click={() =>  onComponentChosen(component.name)}>
            <div class="name">
                {splitName(component.name).componentName}
            </div>
            <!-- <div class="description">
                {component.description}
            </div> -->
        </div>

        {/each}

    </div>

    {/each}

</div>


<style>

.root {
    display: flex;
    flex-direction: column;
}

.library-header {
    font-size: 1.1em;
    border-color: var(--primary25);
    border-width: 1px 0px;
    border-style: solid;
    background-color: var(--primary10);
    padding: 5px 0;
    flex: 0 0 auto;
}

.library-container {
    padding: 0 0 10px 10px;
    flex: 1 1 auto;
    min-height: 0px;
}

.inner-header {
    font-size: 0.9em;
    font-weight: bold;
    margin-top: 7px;
    margin-bottom: 3px;
}

.component {
    padding: 0 15px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 2px;
    margin: 10px 0;
    height: 40px;
    box-sizing: border-box;
    color: #163057;
    display: flex;
    align-items: center;
}

.component:hover {
    background-color: var(--lightslate);
}

.component > .name {
    color: #163057;
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    opacity: 0.6;
}

.component > .description {
    font-size: 0.8em;
    color: var(--secondary75);
    display: inline-block;
    margin-left: 10px;
}

ul {
    list-style: none;
    display: flex;
    padding: 0;
}

li {
    margin-right: 20px;
    background: none;
    border-radius: 5px;
    width: 48px;
    height: 48px;
}

li button {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    border-radius: 5px;
    padding: 12px;
    outline: none;
    cursor: pointer;
}

.selected {
    color: var(--button-text);
    background: var(--background-button)!important;
}

</style>
