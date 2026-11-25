<script lang="ts">
  import dayjs, { type Dayjs } from "dayjs"
  import { createEventDispatcher } from "svelte"

  export let value: (Dayjs | null)[] = []

  const dispatch = createEventDispatcher<{
    change: [Dayjs, Dayjs]
  }>()

  const setDateRange = () => {
    dispatch("change", [
      dayjs("2026-01-01T00:00:00.000Z"),
      dayjs("2026-01-31T23:59:59.999Z"),
    ])
  }
</script>

<button type="button" data-value-count={value.length} on:click={setDateRange}
  >Set date range</button
>
