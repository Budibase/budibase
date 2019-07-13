<script>

export let checked=false;
export let label="";

</script>

<input class="uk-checkbox" type="checkbox" bind:checked on:change />{label}

<style>

input {
    margin-right:7px;
}

</style>