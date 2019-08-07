<script>
export let text = "";
export let label = "";
export let width = "medium";
export let size = "small";
</script>

<div class="uk-margin">
    <label class="uk-form-label">{label}</label>
    <div class="uk-form-controls">
        <input class="uk-input uk-form-width-{width} uk-form-{size}" bind:value={text} >
    </div>
</div>

