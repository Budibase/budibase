<script>
  import { Button, Select, Input, Label } from "@budibase/bbui"
  import { onMount, createEventDispatcher } from "svelte"
  import { flags } from "stores/backend"
  import { _ } from "../../../../lang/i18n"

  const dispatch = createEventDispatcher()

  export let value

  const onChange = e => {
    if (e.detail === value) {
      return
    }
    value = e.detail
    dispatch("change", e.detail)
  }

  let touched = false
  let presets = false

  const CRON_EXPRESSIONS = [
    {
      label: $_("components.automation.SetupPanel.CronBuilder.Every_Minute"),
      value: "* * * * *",
    },
    {
      label: $_("components.automation.SetupPanel.CronBuilder.Every_Hour"),
      value: "0 * * * *",
    },
    {
      label: $_("components.automation.SetupPanel.CronBuilder.Every_Morning"),
      value: "0 8 * * *",
    },
    {
      label: $_("components.automation.SetupPanel.CronBuilder.Every_Night"),
      value: "0 0 * * *",
    },
  ]

  onMount(() => {
    if (!$flags.cloud) {
      CRON_EXPRESSIONS.push({
        label: $_("components.automation.SetupPanel.CronBuilder.Every_Reboot"),
        value: "@reboot",
      })
    }
  })
</script>

<div class="block-field">
  <Input
    on:change={onChange}
    {value}
    on:blur={() => (touched = true)}
    updateOnChange={false}
  />
  {#if touched && !value}
    <Label
      ><div class="error">
        {$_("components.automation.SetupPanel.CronBuilder.expression")}
      </div></Label
    >
  {/if}
  <div class="presets">
    <Button on:click={() => (presets = !presets)}
      >{presets ? "Hide" : "Show"}
      {$_("components.automation.SetupPanel.CronBuilder.Presets")}</Button
    >
    {#if presets}
      <Select
        on:change={onChange}
        {value}
        secondary
        extraThin
        label={$_("components.automation.SetupPanel.CronBuilder.Presets")}
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
