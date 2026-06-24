<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    value?: unknown
    disableClear?: boolean
    timeOnly?: boolean
    children?: Snippet
  }

  let {
    value = $bindable(),
    disableClear = false,
    timeOnly = false,
    children,
  }: Props = $props()
</script>

<div
  data-testid="date-picker"
  data-disable-clear={disableClear}
  data-time-only={timeOnly}
  data-value={value}
>
  {@render children?.()}
</div>
