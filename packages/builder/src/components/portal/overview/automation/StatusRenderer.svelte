<script>
  import { Icon } from "@budibase/bbui"
  export let value

  $: isError = !value || value.toLowerCase() === "error"
  $: isStoppedError = value?.toLowerCase() === "stopped_error"
  $: isStopped = value?.toLowerCase() === "stopped" || isStoppedError
  $: status = getStatus(isError, isStopped)

  function getStatus(error, stopped) {
    if (error) {
      return { color: "var(--red)", message: "Error", icon: "Alert" }
    } else if (stopped) {
      return { color: "var(--yellow)", message: "Stopped", icon: "StopCircle" }
    } else {
      return {
        color: "var(--green)",
        message: "Success",
        icon: "CheckmarkCircle",
      }
    }
  }
</script>

<div class="cell">
  <Icon color={status.color} name={status.icon} />
  <div style={`color: ${status.color};`}>
    {status.message}
  </div>
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
