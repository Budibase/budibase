<script>
  import dayjs from "dayjs"

  export let value

  // adding the 0- will turn a string like 00:00:00 into a valid ISO
  // date, but will make actual ISO dates invalid
  $: time = new Date(`0-${value}`)
  $: isTime = !isNaN(time)
</script>

<div>
  {dayjs(isTime ? time : value).format(
    isTime ? "HH:mm:ss" : "MMMM D YYYY, HH:mm"
  )}
</div>

<style>
  div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
