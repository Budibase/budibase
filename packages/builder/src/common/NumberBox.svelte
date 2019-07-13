<script>

export let value;
export let label;

const inputChanged = ev => {
    try {
        value = Number(ev.target.value);
    } catch(_) {
        value = null;
    }
}

let numberText = value === null || value === undefined
                 ? "" : value.toString();


</script>

<div class="container">
    <div class="label">{label}</div>
    <input class="control" type="text" value={value} on:change={inputChanged} >
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