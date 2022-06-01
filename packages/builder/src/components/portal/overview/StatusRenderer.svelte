<script>
  import { Icon } from "@budibase/bbui"
  export let value

  $: isError = !value || value.toLowerCase() === "error"
  $: color = isError
    ? "var(--spectrum-semantic-negative-color-background)"
    : "var(--green)"
</script>

<div class="cell">
  <Icon {color} name={isError ? "Alert" : "CheckmarkCircle"} />
  <div class:green={!isError} class:red={isError}>
    {isError ? "Error" : "Success"}
  </div>
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }

  .green {
    color: var(--green);
  }

  .red {
    color: var(--spectrum-semantic-negative-color-background);
  }
</style>
