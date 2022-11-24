<script>
  import dayjs from "dayjs"

  export let value

  $: parsedValue = !value ? "" : dayjs(value).format("D/M/YYYY")
</script>

<div>
  {parsedValue}
</div>

<style>
  div {
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
