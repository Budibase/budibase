<script>
export let containerClass = "";
export let formControls = [];

export let _app;

let htmlElements = {};
let labels = {};

$ : {
    let cIndex = 0;
    for(let c of formControls) {
        labels[cIndex] = c.label;
        cIndex++;
    }

    if(_app && htmlElements) {
        for(let el in htmlElements) {
            _app.initialiseComponent(
                formControls[el].control,
                htmlElements[el]
            );
        }
    }
}

</script>

<div class="form-root {containerClass}">
    {#each formControls as child, index}
    <div class="label">{labels[index]}</div>
    <div class="control"
        bind:this={htmlElements[index]}>
    </div>
    {/each}
</div>

<style>
.form-root {
    display: grid;
    grid-template-columns: [label] auto [control] 1fr; /* [overflow] auto;*/
}

.label {
    grid-column-start: label;
    padding: 5px 10px;
    vertical-align: middle;
}
.control {
    grid-column-start: control;
    padding: 5px 10px;
}
.overflow {
    grid-column-start: overflow;
}
.full-width {
    width: 100%;
}
</style>