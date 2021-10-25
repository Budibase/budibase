<script>
  export let value
</script>

<div>{typeof value === "object" ? JSON.stringify(value) : value}</div>

<style>
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 150px;
  }
</style>
