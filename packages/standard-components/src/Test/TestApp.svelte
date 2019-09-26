<script>
import createApp from "./createApp";
import { props } from "./props";

let _app;

const _appPromise = createApp();
_appPromise.then(a => _app = a);

const testProps = props.nav;

let currentComponent;

$: {
    if(_app && currentComponent) {
        _app.initialiseComponent(testProps, currentComponent);
    }
}



</script>

{#await _appPromise}
loading
{:then _app}

<div id="current_component" bind:this={currentComponent}>
</div>

{/await}


<style>
#current_component {
    height: 100%;
    width: 100%;
}
</style>

