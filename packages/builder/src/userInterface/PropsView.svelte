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
import Checkbox from "../common/Checkbox";
import Textbox from "../common/Textbox";

export let props;
export let allComponents;

let propsDefinition = createPropDefinitionForDerived(allComponents, props._component);

let fields = pipe(propsDefinition,[
    keys,
    map(k => propsDefinition[k])
]);

let component = getExactComponent(allComponents, props._component);

</script>

<div class="root">

    <div>{props.name}</div>
    {#each propsDefinition as propDef}
        {#if propDef.type === "bool"}
            <Checkbox label={propDef.name} />
        {:else if true}
            <!-- else if content here -->
        {:else}
            <!-- else content here -->
        {/if} 
    {/each}
    

</div>


<style>

.root {
    padding: 10px;
}

</style>