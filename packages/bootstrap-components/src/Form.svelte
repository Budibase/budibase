<script>
export let containerClass = "";
export let formControls = [];

export let _bb;

let htmlElements = {};
let labelElements = {};
let labels = {};
let isInitialised = false;

$ : {

    if(_bb && htmlElements && !isInitialised) {

        let cIndex = 0;
        for(let c of formControls) {
            labels[cIndex] = c.label;
            cIndex++;
        }

        for(let el in htmlElements) {
            if(formControls[el].control.controlPosition === "Before Label") {
                _bb.insertComponent(
                    _bb.props.formControls[el].control,
                    htmlElements[el],
                    labelElements[el]);
            } else {
                _bb.appendComponent(
                    _bb.props.formControls[el].control,
                    htmlElements[el]);
            }
        }
        isInitialised = true;
    }
}

</script>

<form>
    {#each formControls as child, index}
    <div class="form-group" bind:this={htmlElements[index]}>
        <label bind:this={labelElements[index]}>{labels[index]}</label>
    </div>
    {/each}
</form>

