<script>
import {buildStyle} from "./buildStyle";

export let component="";
export let text="";
export let containerClass="";
export let background="";
export let border="";
export let borderRadius="";
export let font="";
export let display="";
export let textAlign="";
export let color="";
export let padding="";

export let _app;

let style="";
let componentElement;

$: {
    style=buildStyle({
        border, background, font, 
        padding, display, color,
        "text-align": textAlign,
        "border-radius":borderRadius
    });

    if(_app && component) {
        _app.initialiseComponent(component, componentElement);
    }
}

</script>

<div class={containerClass}
     style={style}
     this:bind={componentElement}>
    {text}
</div>
