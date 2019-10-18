<script>
import {
    isString
} from "lodash/fp";
import IconButton from "../common/IconButton.svelte";
import {
    isBinding, getBinding, setBinding
} from "../common/binding";

export let value="";
export let onChanged= () => {};
export let type="";
export let options=[];

let isBound=false;
let bindingPath="";
let bindingFallbackValue="";
let bindingSource="store";
let isExpanded = false;
let forceIsBound = false;
let canOnlyBind = false;

$: {
    canOnlyBind = type === "state";
    if(!forceIsBound && canOnlyBind)
        forceIsBound = true;

    isBound= forceIsBound || isBinding(value);

    if(isBound) {
        const binding = getBinding(value);
        bindingPath= binding.path;
        bindingFallbackValue= binding.fallback;
        bindingSource = binding.source || "store";
    } else {
        bindingPath="";
        bindingFallbackValue="";
        bindingSource="store";
    }
}

const clearBinding = () => {
    forceIsBound = false;
    onChanged("");
}

const bind = (path, fallback, source) => {
    if(!path) {
        clearBinding("");
        return;
    }
    const binding = setBinding({path, fallback, source});
    onChanged(binding);
}

const setBindingPath = ev => {
    forceIsBound = canOnlyBind;
    bind(ev.target.value, bindingFallbackValue, bindingSource)
}

const setBindingFallback = ev => {
    bind(bindingPath, ev.target.value, bindingSource);
}

const setBindingSource = ev => {
    bind(bindingPath, bindingFallbackValue, ev.target.value);
}

const makeBinding = () => {
    forceIsBound=true;
    isExpanded=true;
}

</script>

{#if isBound}
<div>
    <div class="bound-header">
        <div>{isExpanded ? "" : bindingPath}</div>
        <IconButton icon={isExpanded ? "chevron-up" : "chevron-down"} 
                    size="12"
                    on:click={() => isExpanded=!isExpanded}/>
        {#if !canOnlyBind}
        <IconButton icon="trash" 
                    size="12"
                    on:click={clearBinding}/>
        {/if}
    </div>
    {#if isExpanded}
    <div>
        <div class="binding-prop-label">Binding Path</div>
        <input class="uk-input uk-form-small"
               value={bindingPath}
               on:change={setBindingPath} >
        <div class="binding-prop-label">Fallback Value</div>
        <input class="uk-input uk-form-small"
               value={bindingFallbackValue}
               on:change={setBindingFallback} >
        <div class="binding-prop-label">Binding Source</div>
        <select class="uk-select uk-form-small" 
            value={bindingSource} 
            on:change={setBindingSource}>

            <option>store</option>
            <option>context</option>

        </select>
    </div>
    {/if}

</div>
{:else}
<div class="unbound-container">

    {#if type === "bool"}

    <div>
        <IconButton icon={value == true ? "check-square" : "square"}
                    size="19"
                    on:click={() => onChanged(!value)}/>
    </div>

    {:else if type === "options"}

    <select class="uk-select uk-form-small" 
            value={value} 
            on:change={ev => onChanged(ev.target.value)}>
        {#each options as option}
        <option value={option}>{option}</option>
        {/each}
    </select>

    {:else}

    <input class="uk-input uk-form-small"
            on:change={ev => onChanged(ev.target.value)}
            bind:value={value}
            style="flex: 1 0 auto;" > 


    {/if}
    <IconButton icon="link" 
                size="12"
                on:click={makeBinding} />
</div>
{/if}


<style>

.unbound-container {
    display:flex;
    margin: .5rem 0rem .5rem 0rem;
}

.unbound-container > *:nth-child(1) {
    width:auto;
    flex: 1 0 auto;
    font-size: 0.8rem;
    color: var(--secondary100);
    border-radius: .2rem;
}

.bound-header {
    display: flex;
}

.bound-header > div:nth-child(1) {
    flex: 1 0 auto;
    width: 30px;
    color: var(--secondary50);
    padding-left: 5px;
}

.binding-prop-label {
    color: var(--secondary50);
}


</style>