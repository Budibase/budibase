<script>

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { onMount } from 'svelte';

export let value;
export let label;
export let width = "medium";
export let size = "small";

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

<div class="uk-margin">
    <label class="uk-form-label">{label}</label>
    <div class="uk-form-controls">
        <input class="uk-input uk-form-width-{width} uk-form-{size}" bind:this={input} >
    </div>
</div>

