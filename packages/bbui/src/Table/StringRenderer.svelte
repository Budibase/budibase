<script>
  export let value
  export let secondary
</script>

<div class={secondary ? "secondary" : ""}>
  {typeof value === "object" ? JSON.stringify(value) : value}
</div>

<style>
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 150px;
  }
  .secondary {
    font-style: italic;
    color: var(--grey-5);
  }
</style>
