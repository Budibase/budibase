<script>
import IconButton from "../common/IconButton.svelte";
import StateBindingControl from "./StateBindingControl.svelte";
import {
    find, map, keys, reduce
} from "lodash/fp";
import { pipe } from "../common/core";
import { EVENT_TYPE_MEMBER_NAME, allHandlers } from "../common/eventHandlers";

export let event;
export let onChanged;
export let onRemoved;

const events = allHandlers();

let eventType;
let parameters = [];

$: {
    if(event) {
        eventType = event[EVENT_TYPE_MEMBER_NAME];
        parameters = pipe(event.parameters, [
            keys,
            map(k => ({name:k, value:event.parameters[k]}))
        ]);
    } else {
        eventType = "";
        parameters = [];
    }
}

const eventChanged = (type, parameters) => {
    const paramsAsObject = reduce(
        (obj, p) => {
            obj[p.name] = p.value;
            return obj;
        }
        , {}
    )(parameters)

    const ev = {};
    ev[EVENT_TYPE_MEMBER_NAME]=type;
    ev.parameters = paramsAsObject;

    onChanged(ev);
}

const eventTypeChanged = (ev) => {
    const eType = find(e => e.name === ev.target.value)(events);
    const emptyParameters = map(p => ({name:p, value:""}))(eType.parameters);
    eventChanged(eType.name, emptyParameters);
}

const onParameterChanged = index => val => {
    const newparameters = [...parameters];
    newparameters[index].value = val;
    eventChanged(eventType, newparameters);
}

</script>

<div class="type-selector-container">
    <select class="type-selector uk-select uk-form-small " value={eventType} on:change={eventTypeChanged}>
        {#each events as ev}
        <option value={ev.name}>{ev.name}</option>
        {/each}
    </select>

    <IconButton icon="trash" 
                size="12" 
                on:click={onRemoved}/>

</div>

{#if parameters}
{#each parameters as p, index}

<div>
    {p.name}   
</div>
<StateBindingControl  onChanged={onParameterChanged(index)}
                      value={p.value} />

{/each}
{/if}

<style>

.type-selector-container {
    display: flex;
}

.type-selector {
    border-color: var(--primary50);
    border-radius: 2px;
    width: 50px;
    flex: 1 0 auto;
}

</style>