<script>
export let text = "";
export let label = "";
</script>

<div class="container">
    <div class="label">{label}</div>
    <input class="control uk-input" bind:value={text} >
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