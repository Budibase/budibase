<script>
  import { JavaScriptIcon } from "../common/Icons"
  // todo: use https://ace.c9.io
  export let text = ""
  export let label = ""
  export let javascript = false
</script>

<div class="header">
  {#if javascript}
    <JavaScriptIcon />
  {/if}
  <span>{label}</span>
</div>
<textarea class="uk-textarea" bind:value={text} />

<style>
  textarea {
    padding: 3px;
    margin-top: 5px;
    margin-bottom: 10px;
    background: var(--lightslate);
    font-family: "Courier New", Courier, monospace;
    width: 95%;
    height: 100px;
    border-radius: 5px;
  }

  span {
    margin-left: 5px;
  }

  .header {
    display: flex;
    align-items: center;
  }
</style>
