<script>
  import { Button, Select, Input } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { _ as t } from "svelte-i18n"

  const dispatch = createEventDispatcher()

  export let value
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }

  let presets = false

  const CRON_EXPRESSIONS = [
    {
      label: $t("every-minute"),
      value: "* * * * *",
    },
    {
      label: $t("every-hour"),
      value: "0 * * * *",
    },
    {
      label: $t("every-morning-at-8am"),
      value: "0 8 * * *",
    },
    {
      label: $t("every-night-at-midnight"),
      value: "0 0 * * *",
    },
    {
      label: $t("every-reboot"),
      value: "@reboot",
    },
  ]
</script>

<div class="block-field">
  <Input on:change={onChange} {value} />

  <div class="presets">
    <Button on:click={() => (presets = !presets)}
      >{presets ? "Hide" : "Show"} {$t("presets")}</Button
    >
    {#if presets}
      <Select
        on:change={onChange}
        {value}
        secondary
        extraThin
        label={$t("presets")}
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
</style>
