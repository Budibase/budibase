<script>
import {buildStyle} from "./buildStyle";

export let value="";
export let containerClass="";

export let font="";
export let textAlign="";
export let verticalAlign=""
export let color="";

export let _bb;

let style="";


$: {
    style=buildStyle({
        font,  verticalAlign, color, 
        "text-align": textAlign,
        "vertical-align": verticalAlign
    });
}

</script>

<div class={containerClass}
     style={style}>
    {value}
</div>
