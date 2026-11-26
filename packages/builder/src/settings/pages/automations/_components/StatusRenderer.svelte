<script lang="ts">
  import { Badge } from "@budibase/bbui"
  import { getAutomationStatusInfo } from "./statusUtils"

  interface Props {
    value?: string | null
  }

  let { value }: Props = $props()
  const info = $derived(getAutomationStatusInfo(value))
</script>

<Badge
  green={info.color === "green"}
  red={info.color === "red"}
  yellow={info.color === "yellow"}
>
  {info.message}
</Badge>
