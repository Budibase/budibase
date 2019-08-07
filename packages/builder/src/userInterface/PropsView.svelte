<script>

import {
    keys,
    map,
} from "lodash/fp";
import {
    pipe
} from "../common/core";
import { 
    createPropDefinitionForDerived
} from "./pagesParsing/createProps";
import {
    getExactComponent
} from "./pagesParsing/searchComponents";
import Checkbox from "../common/Checkbox.svelte";
import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";

export let props;
export let allComponents;

let propsDefinition = createPropDefinitionForDerived(allComponents, props._component);

let fields = pipe(propsDefinition,[
    keys,
    map(k => propsDefinition[k])
]);

let component = getExactComponent(allComponents, props._component);

let setProp = (name) => (ev) => 
    props[name] = ev.target.checked !== undefined 
                  ? ev.target.checked
                  : ev.target.value;

</script>

<div class="root">

    <div class="title">{component.name}</div>
    <div class="component-description">{component.description || ""}</div>
    {#each propsDefinition as propDef}
    <form class="uk-form-horizontal prop-row ">
        {#if propDef.type === "bool"}
        <Checkbox label={propDef.name} 
                    checked={props[propDef.name]} 
                    on:change={setProp(propDef.name)} />
        {:else if propDef.type === "options"}
        <Dropdown label={propDef.name}
                    selected={props[propDef.name]} 
                    options={propDef.options}
                    on:change={setProp(propDef.name)}/>
        {:else}
        <Textbox label={propDef.name}
                    bind:text={props[propDef.name]} />
        {/if} 
    </form>
    {/each}
    

</div>


<style>

.root {
    padding: 10px;
    font-size:10pt;
}

.title {
    font: var(--smallheavybodytext);
}

.prop-row {
    padding: 7px 3px;
}

.component-description {
    font: var(--lightbodytext);    
}

</style>