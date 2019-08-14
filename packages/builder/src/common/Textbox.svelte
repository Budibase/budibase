<script>
export let text = "";
export let label = "";
export let width = "medium";
export let size = "small";
export let margin = true;
export let infoText = "";
export let hasError = false;
export let disabled = false;
</script>

<div class:uk-margin={margin}>
    <label class="uk-form-label">{label}</label>
    <div class="uk-form-controls">
        <input class="uk-input uk-form-width-{width} uk-form-{size}"
               class:uk-form-danger={hasError}
               on:change
               bind:value={text} 
               {disabled}>
    </div>
    {#if infoText}
    <div class="info-text">{infoText}</div>
    {/if}
</div>

<style>
.info-text {
    font-size: 0.8em;
    color: var(--slate);
}
</style>

