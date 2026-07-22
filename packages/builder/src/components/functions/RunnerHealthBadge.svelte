<script lang="ts">
  import { StatusLight } from "@budibase/bbui"
  import { RunnerHealth, runnerHealthDescriptor } from "@/helpers/functionsGate"

  export let health: RunnerHealth

  $: descriptor = runnerHealthDescriptor(health)
</script>

<StatusLight
  size="M"
  positive={descriptor.tone === "positive"}
  neutral={descriptor.tone === "neutral"}
  notice={descriptor.tone === "warning"}
  negative={descriptor.tone === "negative"}
>
  {descriptor.label}
</StatusLight>
