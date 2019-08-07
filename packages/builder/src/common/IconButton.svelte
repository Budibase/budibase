<script>
import getIcon from "./icon";

export let size = 18;
export let icon = "";
export let style = "";
export let color = "";
export let hoverColor = "";

$: borderClass = grouped 
                 ? ""
                 : "border-normal";

</script>

<button style="{style} color:{color}"
        on:click>
    {@html getIcon(icon, size)}
</button>


<style>

button {
    border-style: none;
    background-color: rgba(0,0,0,0);
    cursor: pointer;
}

</style>