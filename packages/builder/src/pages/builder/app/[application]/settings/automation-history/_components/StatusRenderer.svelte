<script>
  import { Badge } from "@budibase/bbui"

  export let value

  $: isError = !value || value.toLowerCase() === "error"
  $: isStoppedError = value?.toLowerCase() === "stopped_error"
  $: isStopped = value?.toLowerCase() === "stopped"
  $: info = getInfo(isError, isStopped, isStoppedError)

  function getInfo(error, stopped, stoppedError) {
    if (stoppedError) {
      return { color: "red", message: "Stopped - Error" }
    } else if (error) {
      return { color: "red", message: "Error" }
    } else if (stopped) {
      return { color: "yellow", message: "Stopped" }
    } else {
      return { color: "green", message: "Success" }
    }
  }
</script>

<Badge
  green={info.color === "green"}
  red={info.color === "red"}
  yellow={info.color === "yellow"}
>
  {info.message}
</Badge>
