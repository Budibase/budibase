<script>
  import { JavaScriptIcon } from "../common/Icons"
  // todo: use https://ace.c9.io
  export let text = ""
</script>

<textarea class="uk-textarea" bind:value={text} />

<style>
  textarea {
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 10px;
    background: var(--grey-7);
    color: var(--white);
    font-family: "Courier New", Courier, monospace;
    height: 200px;
    border-radius: 5px;
  }
</style>
