<script>
  import { Badge } from "@budibase/bbui"

  import { _ } from "../../../../../../../../lang/i18n"

  export let value

  $: isError = !value || value.toLowerCase() === "error"
  $: isStoppedError = value?.toLowerCase() === "stopped_error"
  $: isStopped = value?.toLowerCase() === "stopped" || isStoppedError
  $: info = getInfo(isError, isStopped)

  const getInfo = (error, stopped) => {
    if (error) {
      return {
        color: "red",
        message: $_(
          "pages.builder.portal.overview.appId.automation-history._components.StatusRenderer.Error"
        ),
      }
    } else if (stopped) {
      return {
        color: "yellow",
        message: $_(
          "pages.builder.portal.overview.appId.automation-history._components.StatusRenderer.Stopped"
        ),
      }
    } else {
      return {
        color: "green",
        message: $_(
          "pages.builder.portal.overview.appId.automation-history._components.StatusRenderer.Success"
        ),
      }
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
