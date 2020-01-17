<script>

export let condition;
export let thenComponent;
export let elseComponent;

export let _bb;

let element;
let currentEvalResult=null;
let currentComponent;
let state;

_bb.store.subscribe(s => {
    state = s;
})

$: {
    if(_bb && element && state) {
        let result;
        try {
            let $store = state;
            let $context = _bb.context;
            result = !!(Function(`"use strict";return (function($store, $context) { return (${condition}); });`)()($store, $context));
        } catch(e) {
            console.log("If condition eval error: " + e.message)
        }
        if(result !== currentEvalResult) {
            currentEvalResult = result;
            if(currentComponent) {
                currentComponent.$destroy();
            }

            if(result) {
                currentComponent = _bb.hydrateChildren(
                    _bb.props.thenComponent,element);
            } else if(elseComponent && elseComponent._component) {
                currentComponent = _bb.hydrateChildren(
                    _bb.props.elseComponent,element);
            }
            
        }
    }
}


</script>

<div bind:this={element}></div>
