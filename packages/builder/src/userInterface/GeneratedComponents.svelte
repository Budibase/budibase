<script>
import { store } from "../builderStore";
import { splitName } from "./pagesParsing/splitRootComponentName";
import {
    getIndexNodes, getRecordNodes, getIndexSchema, pipe
} from "../common/core";
import {
    map, some, filter
} from "lodash/fp";
import Button from "../common/Button.svelte";
import { componentDependencies } from "./pagesParsing/findDependencies";
import { rename } from "./pagesParsing/renameComponent";
import { getExactComponent } from "./pagesParsing/searchComponents";
export let generator;
export let onConfirmGenerate;

let libName;
let componentName;
let libs;
let existingComponents;
let _generator;
let components;
let generateParameter;
let allGeneratedComponents;
let selectedComponents = [];

store.subscribe(s => {
    libs = s.generatorLibraries;
    generateParameter = {
        indexes: getIndexNodes(s.hierarchy),
        records: getRecordNodes(s.hierarchy),
        helpers: {
            indexSchema: getIndexSchema(s.hierarchy)
        }
    }
    existingComponents = s.allComponents;
});

const componentExists = name => 
    getExactComponent(existingComponents, name);

const componentsWithDependencies = () => {
    
    const cmp = map(c => {
        const dependants = componentDependencies(
            {}, [...selectedComponents, ...existingComponents], c);
        const exists = componentExists(c.name);
        return {
            dependants: dependants.dependantComponents, 
            component:c,
            error: exists ? "a component by this name already exists" : ""
        };
    })(allGeneratedComponents); 
    components = cmp;
} 

$ : {
    if(generator && generator !== _generator) {
        _generator = generator;

        const sp = splitName(generator.name);
        libName = sp.libName;
        componentName = sp.componentName;

        allGeneratedComponents = libs[libName][componentName](generateParameter);
        selectedComponents = 
            filter(c => !componentExists(c.name))(allGeneratedComponents);
        componentsWithDependencies();
    }
}


const onSelectedChanged = component => ev => {
    const newselectedComponents = filter(c => c.name !== component.component.name)(
            selectedComponents);
    if(ev.target.checked) {
        newselectedComponents.push(component.component);   
    }

    selectedComponents = newselectedComponents;
    componentsWithDependencies();
}

const onNameChanged = component => ev => {
    const newname = ev.target.value;
    const oldname = component.component.name;
    const result = rename({}, allGeneratedComponents, oldname, newname);
    component.error = result.error || "";
    allGeneratedComponents = [...result.allComponents];
    selectedComponents = map(s => {
        if(s.name === oldname) s.name = newname;
        return s;
    })(selectedComponents);
    componentsWithDependencies();
}

const isComponentSelected = component => 
    some(c => c.name === component.component.name)(selectedComponents);

</script>

{#each components as c}

<div class="component">

    <div class="uk-inline">
        <input type="checkbox" 
               disabled={c.dependants.length > 0} 
               class="uk-checkbox" 
               checked={isComponentSelected(c)}
               on:change={onSelectedChanged(c)}>
        <input type="text" 
               value={c.component.name} 
               on:change={onNameChanged(c)}
               class="uk-input title {c.error ? 'uk-form-danger' : ''}">
        {#if isComponentSelected(c)}
        <span class="error">{c.error}</span>
        {/if}
    </div>

    <div class="description">
        {c.component.description}
    </div>

</div>

{/each}

<div class="button-container">
    <Button on:click={() => onConfirmGenerate(selectedComponents)}>Add Components</Button>
</div>




<style>

.component {
    padding: 5px 0;
}

.component .title {
    width: 300px
}

.component > .description {
    font-size: 0.8em;
    color: var(--secondary75);
}

.button-container {
    text-align: right;
    margin-top: 20px;
}

.error {
    font-size: 10pt;
    color: red;
}

</style>
