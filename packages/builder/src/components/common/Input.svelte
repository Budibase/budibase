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
    font-weight: 500;
    color: var(--ink);
    line-height: 1.3;
    padding: 12px;
    width: 164px;
    float: right;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;
    border: 1px solid var(--grey-dark);
    height: 32px;
  }
</style>
