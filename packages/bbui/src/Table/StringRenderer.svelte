<script>
  export let value
  export let schema
</script>

<div class:capitalise={schema?.capitalise}>
  {typeof value === "object" ? JSON.stringify(value) : value}
</div>

<style>
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: var(--max-cell-width);
    width: 0;
    flex: 1 1 auto;
  }
  div.capitalise {
    text-transform: capitalize;
  }
</style>
