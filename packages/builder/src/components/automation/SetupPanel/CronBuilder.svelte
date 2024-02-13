<script>
  import { Button, Select, Input, Label } from "@budibase/bbui"
  import { onMount, createEventDispatcher } from "svelte"
  import { flags } from "stores/backend"
  import { helpers, REBOOT_CRON } from "@budibase/shared-core"

  const dispatch = createEventDispatcher()

  export let value
  let error

  $: {
    const exists = CRON_EXPRESSIONS.some(cron => cron.value === value)
    const customIndex = CRON_EXPRESSIONS.findIndex(
      cron => cron.label === "Custom"
    )

    if (!exists && customIndex === -1) {
      CRON_EXPRESSIONS[0] = { label: "Custom", value: value }
    } else if (exists && customIndex !== -1) {
      CRON_EXPRESSIONS.splice(customIndex, 1)
    }
  }

  const onChange = e => {
    if (value !== REBOOT_CRON) {
      error = helpers.cron.validate(e.detail).err
    }
    if (e.detail === value || error) {
      return
    }

    value = e.detail
    dispatch("change", e.detail)
  }

  let touched = false
  let presets = false

  const CRON_EXPRESSIONS = [
    {
      label: "Every Minute",
      value: "* * * * *",
    },
    {
      label: "Every Hour",
      value: "0 * * * *",
    },
    {
      label: "Every Morning at 8AM",
      value: "0 8 * * *",
    },
    {
      label: "Every Night at Midnight",
      value: "0 0 * * *",
    },
  ]

  onMount(() => {
    if (!$flags.cloud) {
      CRON_EXPRESSIONS.push({
        label: "Every Budibase Reboot",
        value: REBOOT_CRON,
      })
    }
  })
</script>

<div class="block-field">
  <Input
    {error}
    on:change={onChange}
    {value}
    on:blur={() => (touched = true)}
    updateOnChange={false}
  />
  {#if touched && !value}
    <Label><div class="error">Please specify a CRON expression</div></Label>
  {/if}
  <div class="presets">
    <Button on:click={() => (presets = !presets)}
      >{presets ? "Hide" : "Show"} Presets</Button
    >
    {#if presets}
      <Select
        on:change={onChange}
        value={value || "Custom"}
        secondary
        extraThin
        label="Presets"
        options={CRON_EXPRESSIONS}
      />
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
  .error {
    padding-top: var(--spacing-xs);
    color: var(--spectrum-global-color-red-500);
  }
</style>
