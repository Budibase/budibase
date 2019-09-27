<script>
import createApp from "./createApp";
import { props } from "./props";

let _bb;

const _appPromise = createApp();
_appPromise.then(a => _bb = a);

const testProps = props.table;

let currentComponent;

$: {
    if(_bb && currentComponent) {
        _bb.initialiseComponent(testProps, currentComponent);
    }
}



</script>

{#await _appPromise}
loading
{:then _bb}

<div id="current_component" bind:this={currentComponent}>
</div>

{/await}


<style>
#current_component {
    height: 100%;
    width: 100%;
}
</style>

