<script>
import {buildStyle} from "./buildStyle";
import cssVars from "./cssVars";

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
export let margin="";
export let hoverBackground="";
export let hoverColor="";
export let onClick;
export let height;
export let width;

export let _bb;

let styleVars;
let style="";
let componentElement;
let componentInitialised=false;

$: {
    style=buildStyle({
        border, background, font, margin,
        padding, display, color, height, width,
        "text-align": textAlign,
        "border-radius":borderRadius,
        cursor: onClick ? "pointer" : "none"
    });

    if(_bb && component && componentElement && !componentInitialised) {
        _bb.hydrateComponent(component, componentElement);
        componentInitialised = true;
    }

    styleVars = {
        hoverBackground:hoverBackground || background, 
        hoverColor:hoverColor || color
    }
}

const clickHandler = () => {
    if(onClick) onClick();
}

</script>

<div class="{containerClass} panel" 
     style={style}
     use:cssVars={styleVars}
     bind:this={componentElement}
     on:click={clickHandler}>
    {component && component._component ? "" : text}
</div>

<style>

.panel:hover {
    background: var(--hoverBackground);
    color: var(--hoverColor);

}

</style>
