<script>
  import { Icon, Body } from "@budibase/bbui"
  export let value

  $: isError = value === "Error"
</script>

<div class="cell">
  <Icon
    color={isError
      ? "var(--spectrum-semantic-negative-color-background)"
      : "var(--green)"}
    name={isError ? "Alert" : "CheckmarkCircle"}
  />
  <Body>{value}</Body>
</div>

<style>
  .cell {
    color: var(--spectrum-semantic-negative-color-background);
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
  }
</style>
