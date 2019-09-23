<script>
import {buildStyle} from "./buildStyle";

export let value="";
export let containerClass="";

export let background="";
export let border="";
export let font="";
export let display="";
export let textAlign="";
export let color="";
export let padding="";

export let _app;

let style="";


$: {
    style=buildStyle({
        border, background, font, 
        padding, display, color,
        "text-align": textAlign
    });
}

</script>

<div class={containerClass}
     style={style}>
    {value}
</div>
