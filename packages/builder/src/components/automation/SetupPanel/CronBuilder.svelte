<script>
  import { Button, Select, Label, Heading, Input } from "@budibase/bbui"

  export let value

  let presets = false

  const CRON_EXPRESSIONS = [
    {
      label: "Every Minute",
      value: "* * * * *" 
    },
    {
      label: "Every Hour",
      value: "0 * * * *" 
    },
    {
      label: "Every Morning at 8AM",
      value: "0 8 * * *" 
    },
    {
      label: "Every Night at Midnight",
      value: "0 0 * * *" 
    },
    {
      label: "Every Budibase Reboot",
      value: "@reboot" 
    },
  ]
</script>

<div class="block-field">
  <Input bind:value />

  <div class="presets">
    <Button on:click={() => (presets = !presets)}>{presets ? "Hide" : "Show"} Presets</Button>
    {#if presets}
      <Select bind:value secondary extraThin label="Presets" options={CRON_EXPRESSIONS} />
    {/if}
  </div>
</div>

<style>
.presets {
  margin-top: var(--spacing-m);
}
.block-field {
  padding-top: var(--spacing-s);
}
</style>
