<script>
  import dayjs from "dayjs"

  export let value
</script>

<div>{dayjs(value).format('MMMM D YYYY, HH:mm')}</div>

<style>
  div {
    width: 200px;
  }
</style>
