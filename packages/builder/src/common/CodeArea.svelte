<script>
  // todo: use https://ace.c9.io
  export let text = ""
  export let label = ""
</script>

<div class="header">{label}</div>
<textarea class="uk-textarea" bind:value={text} />

<style>
  textarea {
    padding: 3px;
    margin-top: 5px;
    margin-bottom: 10px;
    background: var(--lightslate);
    color: var(--white);
    font-family: "Courier New", Courier, monospace;
    width: 95%;
    height: 100px;
    border-radius: 5px;
  }
</style>
