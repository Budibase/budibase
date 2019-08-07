<script>
// todo: use https://ace.c9.io
export let text = "";
export let label = "";
</script>

<div>{label}</div>
<textarea class="uk-textarea" bind:value={text}></textarea>

<style>

textarea {
    padding:3px;
    background: var(--darkslate);
    color: var(--white);
    font-family: 'Courier New', Courier, monospace;
    width:95%;
    height:100px;
}

</style>