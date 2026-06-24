<script lang="ts">
  export let disableClear = false
  export let timeOnly = false
</script>

<div
  data-testid="date-picker"
  data-disable-clear={disableClear}
  data-time-only={timeOnly}
>
  <slot />
</div>
