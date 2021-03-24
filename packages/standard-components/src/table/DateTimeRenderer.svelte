<script>
  import dayjs from "dayjs"

  export let value
</script>

{dayjs(value).format('MMMM D YYYY, HH:mm')}
