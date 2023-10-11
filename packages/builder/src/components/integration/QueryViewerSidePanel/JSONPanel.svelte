<script>
  export let data

  $: string = JSON.stringify(data || {}, null, 2)
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
