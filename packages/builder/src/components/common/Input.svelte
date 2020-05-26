<script>
  export let value = ""
  export let width = ""

  let style = { width }
</script>

<input type="text" style={`width: ${width};`} on:change bind:value />

<style>
  input {
    display: block;
    font-size: 14px;
    font-family: sans-serif;
    font-weight: 500;
    color: #163057;
    line-height: 1.3;
    padding: 1em 2.6em 0.9em 1.4em;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;
    border: 1px solid #ccc;
    height: 35px;
  }
</style>
