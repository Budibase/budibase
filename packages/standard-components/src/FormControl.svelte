<script>

export let containerClass = "";
export let labelContainerClass = "";
export let controlContainerClass = "";
export let label = "";
export let control;
export let overflowControl;
export let fullWidth = false;

</script>

<div class="label {labelContainerClass}">{label}</div>
<div class="control {controlContainerClass}" class:full-width={fullWidth}>
    {#if control}
    <control />
    {:else}
    <slot />
    {/if}
    
</div>
<!--div class="overflow">
    {#if overflowControl}
    <overflowControl />
    {:else}
    <slot name="overflow" />
    {/if}
</div>-->

<style>

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