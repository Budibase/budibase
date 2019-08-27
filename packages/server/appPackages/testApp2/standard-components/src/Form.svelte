<script>

export let containerClass = "";
export let formControls = [];

</script>

<div class="form-root {containerClass}">
    {#each formControls as formControl}
    <formControl />
    {:else}
    <slot/>
    {/each}
</div>

<style>
.form-root {
    display: grid;
    grid-template-columns: [label] auto [control] auto; /* [overflow] auto;*/
}
</style>