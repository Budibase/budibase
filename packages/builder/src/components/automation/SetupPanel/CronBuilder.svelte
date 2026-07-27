<script lang="ts">
  import { Select, Input, Label, Layout, notifications } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { flags } from "@/stores/builder"
  import { aiStore } from "@/stores/portal"
  import { API } from "@/api"
  import MagicWand from "../../../../assets/MagicWand.svelte"
  import NextExecutionsTable from "./NextExecutionsTable.svelte"

  import { helpers, REBOOT_CRON } from "@budibase/shared-core"

  interface CronOption {
    label: string
    value: string
  }

  type CronError = string | undefined

  interface Props {
    cronExpression?: string
    timezone?: string
    onchange?: (cronExpression: string) => void
  }

  let {
    cronExpression = $bindable(),
    timezone = "UTC",
    onchange,
  }: Props = $props()

  let error: CronError = $state()
  let aiCronPrompt = $state("")
  let loadingAICronExpression = $state(false)
  let touched = $state(false)

  let aiEnabled = $derived($aiStore.aiEnabled)
  let nextExecutions = $derived.by(() => {
    if (!cronExpression || cronExpression === REBOOT_CRON) {
      return null
    }
    try {
      return helpers.cron.getNextExecutionDates(cronExpression, 4, timezone)
    } catch (err) {
      return null
    }
  })

  const onChange = (value: string | undefined) => {
    if (!value) {
      return
    }
    if (value !== REBOOT_CRON) {
      const validation = helpers.cron.validate(value)
      error = "err" in validation ? validation.err.join(". ") : undefined
    } else {
      error = undefined
    }
    if (value === cronExpression || error) {
      return
    }

    cronExpression = value
    onchange?.(value)
  }

  const updatePreset = (event: CustomEvent<string | undefined>) => {
    aiCronPrompt = ""
    onChange(event.detail)
  }

  const updateCronExpression = (event: CustomEvent<string | undefined>) => {
    aiCronPrompt = ""
    cronExpression = undefined
    onChange(event.detail)
  }

  const CRON_EXPRESSIONS: CronOption[] = [
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

  async function generateAICronExpression() {
    loadingAICronExpression = true
    try {
      const response = await API.generateCronExpression(aiCronPrompt)
      cronExpression = response.message
      onchange?.(response.message)
    } catch (err) {
      notifications.error(
        err instanceof Error ? err.message : "Error generating cron expression"
      )
    } finally {
      loadingAICronExpression = false
    }
  }
</script>

<Layout noPadding gap="S">
  <Select
    on:change={updatePreset}
    value={cronExpression || "Custom"}
    label="Use a Preset (Optional)"
    options={CRON_EXPRESSIONS}
  />
  {#if aiEnabled}
    <div class="cron-ai-generator">
      <Input
        bind:value={aiCronPrompt}
        label="Generate Cron Expression with AI"
        placeholder="Run every hour between 1pm to 4pm everyday of the week"
      />
      {#if aiCronPrompt}
        <button
          type="button"
          class="icon"
          class:pulsing-text={loadingAICronExpression}
          onclick={generateAICronExpression}
        >
          <MagicWand height="17" width="17" />
        </button>
      {/if}
    </div>
  {/if}
  <Input
    label="Cron Expression"
    {error}
    on:change={updateCronExpression}
    value={cronExpression}
    on:blur={() => (touched = true)}
    updateOnChange={false}
  />
  {#if touched && !cronExpression}
    <Label><div class="error">Please specify a CRON expression</div></Label>
  {/if}
  {#if nextExecutions}
    <NextExecutionsTable executions={nextExecutions} />
  {/if}
</Layout>

<style>
  .cron-ai-generator {
    flex: 1;
    position: relative;
  }
  .icon {
    right: 1px;
    bottom: 1px;
    position: absolute;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    border-left: 1px solid var(--spectrum-alias-border-color);
    border-right: none;
    border-top: none;
    border-bottom: none;
    border-top-right-radius: var(--spectrum-alias-border-radius-regular);
    border-bottom-right-radius: var(--spectrum-alias-border-radius-regular);
    width: 31px;
    color: var(--spectrum-alias-text-color);
    background-color: var(--spectrum-global-color-gray-75);
    transition:
      background-color var(--spectrum-global-animation-duration-100, 130ms),
      box-shadow var(--spectrum-global-animation-duration-100, 130ms),
      border-color var(--spectrum-global-animation-duration-100, 130ms);
    height: calc(var(--spectrum-alias-item-height-m) - 2px);
    padding: 0;
  }

  .icon:hover {
    cursor: pointer;
    color: var(--spectrum-alias-text-color-hover);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-alias-border-color-hover);
  }

  .error {
    padding-top: var(--spacing-xs);
    color: var(--spectrum-global-color-red-500);
  }

  .pulsing-text {
    font-size: 24px;
    font-weight: bold;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
  }
</style>
