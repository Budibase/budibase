<script>
import {join} from "lodash/fp";

export let values;
export let label;

const inputChanged = ev => {
    try {
        values = ev.target.value.split("\n");
    } catch(_) {
        values = [];
    }
}

$: valuesText = join("\n")(values);


</script>

<div class="container">
    <div class="label">{label}</div>
    <textarea class="control" value={valuesText} on:change={inputChanged} ></textarea>
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

textarea {
    width:300px;
    height:200px;
}

</style>