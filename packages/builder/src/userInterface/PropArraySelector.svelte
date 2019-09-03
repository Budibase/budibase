<script>
import IconButton from "../common/IconButton.svelte";
import {
    createArrayElementProps
} from "./pagesParsing/createProps";
import PropControl from "./PropControl.svelte";
import {
    some,
    cloneDeep,
} from "lodash/fp";
import { validateProps } from "./pagesParsing/validateProps";

export let parentProps;
export let propDef;
export let onValueChanged;
export let onValidate = () => {};
export let onEditComponentProp = () => {};

let value = [];
let elementDefinitionArray;
let label = "";
let elementErrors = {};

$: {
    const elArray = [];
    for(let elProp in propDef.elementDefinition) {
        if(elProp === "_component") continue;
        elArray.push({
            ...propDef.elementDefinition[elProp],
            ____name: elProp
        });
    }
    elementDefinitionArray = elArray;
    label = propDef.____name;
    value = parentProps[propDef.____name];
}

const addElement = () => {
    const newElement = createArrayElementProps(
        propDef.____name, 
        propDef.elementDefinition).props;

    value = [...value, newElement];
    onValueChanged(value);
}

const validate = (index, elementProps) => {
    elementErrors[index] = validateProps(
        propDef.elementDefinition, elementProps, [], true);
    onValidate(elementErrors[index]);
    return elementErrors[index].length === 0;
}

const setProp = (index) => (name, propValue) => {
    const newValue = cloneDeep(value);
    const newProps = cloneDeep(newValue[index]);
    newProps[name] = propValue;
    newValue[index] = newProps;
    value = newValue;

    if(validate(index, newProps))
        onValueChanged(newValue);
    
}

let fieldHasError = index => propName => 
    some(e => e.propName === propName)(elementErrors[index]);

const onEditComponent = (index, propName) => () => {
    onEditComponentProp(index, propName);
}

</script>

<div class="root">
    <div>
        {label}
    </div>

    <div class="item-container">
        {#each value as item, index}
    
        <div class="item-inner-container">
            {#each elementDefinitionArray as propDef}
            <PropControl setProp={setProp(index)}
                        fieldHasError={fieldHasError(index)}
                        {propDef}
                        props={item}
                        {index}
                        onEditComponent={onEditComponent(index, propDef.____name)}
                        disabled={false} />
            {/each}
        </div>
    
        {/each}

        <div class="addelement-container"
                    on:click={addElement}>
            <IconButton icon="plus" 
                            size="12"/>
        </div>
    </div>
</div>


<style>

.addelement-container {
    cursor: pointer;
    padding: 3px 0px;
    text-align: center;
}

.addelement-container:hover {
    background-color: var(--primary25);
}


.item-container {
    padding-left: 3px;
    background: var(--secondary10);
}

</style>