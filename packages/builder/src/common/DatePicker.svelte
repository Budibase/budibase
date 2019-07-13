<script>

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { onMount } from 'svelte';

export let value;
export let label;
let input;
let fpInstance;

$: if (fpInstance) fpInstance.setDate(value);

onMount(() => {
    fpInstance =  flatpickr(input, {});

    fpInstance.config.onChange.push(selectedDates => {
        if(selectedDates.length > 0)
            value = new Date(selectedDates[0]);
    });

    return fpInstance;
})







</script>


 <div class="container" >
    <div class="label">{label}</div>
    <input class="control" bind:this={input} />
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

input {
    width:300px;
}


</style>