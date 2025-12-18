<script>
  export let data
  export let maxRowsToDisplay = 5

  let string
  $: {
    string = JSON.stringify(data || {}, null, 2)
    if (Array.isArray(data) && data.length > maxRowsToDisplay) {
      string = JSON.stringify(data.slice(0, maxRowsToDisplay) || {}, null, 2)

      // Display '...' at the end of the array
      string = string.replace(
        /(}\n])/,
        `},\n  ...${data.length - maxRowsToDisplay} further items\n]`
      )
    }
  }
</script>

<textarea class="json" disabled value={string} />

<style>
  .json {
    width: 100%;
    height: 100%;
    color: var(--ink);
    padding: 12px;
    box-sizing: border-box;
    resize: none;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
  }
</style>
