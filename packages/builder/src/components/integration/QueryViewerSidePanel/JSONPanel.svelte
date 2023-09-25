<script>
  export let schema

  $: string = JSON.stringify(schema || {}, null, 2)
</script>

<textarea class="json" disabled value={string} />

<style>
  .json {
    width: 100%;
    height: 100%;
    background-color: var(--background-alt);
    color: var(--ink);
    padding: 12px;
    box-sizing: border-box;
    resize: none;
  }
</style>
