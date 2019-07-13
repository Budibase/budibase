<script>
import {createEventDispatcher} from "svelte";

export let selected;
export let label;
export let options;
export let valueMember;
export let textMember;
export let multiple=false;

const dispatch =createEventDispatcher();


</script>

<div class="container">
    <div class="label">{label}</div>

    {#if multiple}
    
    <select class="control uk-select" multiple bind:value={selected} on:change>
        {#each options as option}
        <option value={!valueMember ? option : valueMember(option)}>{!textMember ? option : textMember(option)}</option>
        {/each}
    </select>

    {:else}

    <select class="control uk-select" bind:value={selected} on:change>
        {#each options as option}
        <option value={!valueMember ? option : valueMember(option)}>{!textMember ? option : textMember(option)}</option>
        {/each}
    </select>
    {/if}

</div>

<style>

.container {
    display: grid;
    grid-template-columns: [label] 100px [control] auto;
    margin: 20px 0px;
}
.label {
    grid-column-start: label;
    align-self: center;
}
.control {
    grid-column-start: control;
    align-self: center;
    margin: 0;
}

select {
    width:300px;
}

</style>