<script>
  import dayjs from "dayjs"

  export let value
</script>

{new dayjs(value).format("MMM D, YYYY HH:mm")}
