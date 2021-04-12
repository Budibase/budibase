<script>
  export let value
</script>

<div>{value}</div>
<slot />

<style>
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 150px;
  }
</style>
