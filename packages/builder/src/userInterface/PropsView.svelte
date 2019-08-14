<script>

import {
    keys,
    map,
    some,
    includes,
    cloneDeep,
    isEqual
} from "lodash/fp";
import { pipe } from "../common/core";
import { getComponentInfo } from "./pagesParsing/createProps";
import { getExactComponent } from "./pagesParsing/searchComponents";
import Checkbox from "../common/Checkbox.svelte";
import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import { validateProps } from "./pagesParsing/validateProps";

export let allComponents;
export let shouldValidate = true;
export let onValidate = () => {};
export let showTitle = true;
export let componentInfo;
export let component;
export let onPropsChanged = () => {};

let errors = [];
let fields = [];
let props = {};
let propsDefinitionArray = [];

$: {
    if(componentInfo || component)
    {
        if(!componentInfo || (component && 
                              component.name !== componentInfo.component.name)) {
            componentInfo = getComponentInfo(allComponents, component.name);
        }

        props = cloneDeep(componentInfo.fullProps);

        propsDefinitionArray = pipe(componentInfo.propsDefinition, [
                keys,
                map(k => ({...componentInfo.propsDefinition[k], ____name:k}))
            ]);

        fields = pipe(componentInfo.propsDefinition,[
            keys,
            map(k => componentInfo.propsDefinition[k])
        ]);
    }
}

const isPropInherited = name => 
    includes(name)(componentInfo.inheritedProps);

let setProp = (name) => (ev, targetValue="value") => {
    const newProps = cloneDeep(props);
    newProps[name] = ev.target[targetValue];
    

    const finalProps = {_component:props._component};

    for(let p of componentInfo.unsetProps) {
        if(!isEqual(newProps[p])(componentInfo.rootDefaultProps[p])) {
            finalProps[p] = newProps[p];
        }
    }

    props = newProps;
    if(validate(finalProps))
        onPropsChanged(finalProps);
    
}
                  
const validate = (finalProps) => {
    errors = validateProps(componentInfo.propsDefinition, finalProps, [], false);
    onValidate(errors);
    return errors.length === 0;
}

const fieldHasError = (propName) => 
    some(e => e.propName === propName)(errors);

</script>

<div class="root">

    {#if showTitle=true}
    <div class="title">{componentInfo.component.name}</div>
    <div class="component-description">{componentInfo.component.description || ""}</div>
    {/if}
    {#each propsDefinitionArray as propDef}
    <form class="uk-form-stacked prop-row ">
        {#if propDef.type === "bool"}
        <Checkbox label={propDef.____name} 
                  checked={props[propDef.____name]} 
                  on:change={setProp(propDef.____name, "checked")}
                  hasError={fieldHasError(propDef.____name)} />
        {:else if propDef.type === "options"}
        <Dropdown label={propDef.____name}
                  selected={props[propDef.____name]} 
                  options={propDef.options}
                  on:change={setProp(propDef.____name)}
                  hasError={fieldHasError(propDef.____name)}/>
        {:else}
        <Textbox label={propDef.____name}
                 text={props[propDef.____name]}
                 on:change={setProp(propDef.____name)}
                 margin={false}
                 hasError={fieldHasError(propDef.____name)}
                 disabled={isPropInherited(propDef.____name)} />
        {/if} 
    </form>
    {/each}
    

</div>


<style>

.root {
    font-size:10pt;
}

.title {
    font-size: 1.2em;
    font-weight: bold;
}

.prop-row {
    padding: 7px 3px;
}

.component-description {
    font-size: 0.9em;
    color: var(--slate);
    margin-bottom: 10px;
}

</style>