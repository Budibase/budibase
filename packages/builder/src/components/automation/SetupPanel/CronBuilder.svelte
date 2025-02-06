<script>
  import {
    Select,
    InlineAlert,
    Input,
    Label,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import { onMount, createEventDispatcher } from "svelte"
  import { flags } from "@/stores/builder"
  import { licensing } from "@/stores/portal"
  import { API } from "@/api"
  import MagicWand from "../../../../assets/MagicWand.svelte"

  import { helpers, REBOOT_CRON } from "@budibase/shared-core"

  const dispatch = createEventDispatcher()

  export let cronExpression

  let error
  let nextExecutions

  // AI prompt
  let aiCronPrompt = ""
  let loadingAICronExpression = false

  $: aiEnabled =
    $licensing.customAIConfigsEnabled || $licensing.budibaseAIEnabled
  $: {
    if (cronExpression) {
      try {
        nextExecutions = helpers.cron
          .getNextExecutionDates(cronExpression)
          .join("\n")
      } catch (err) {
        nextExecutions = null
      }
    }
  }

  const onChange = e => {
    if (e.detail !== REBOOT_CRON) {
      error = helpers.cron.validate(e.detail).err
    }
    if (e.detail === cronExpression || error) {
      return
    }

    cronExpression = e.detail
    dispatch("change", e.detail)
  }

  const updatePreset = e => {
    aiCronPrompt = ""
    onChange(e)
  }

  const updateCronExpression = e => {
    aiCronPrompt = ""
    cronExpression = null
    nextExecutions = null
    onChange(e)
  }

  let touched = false

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

  async function generateAICronExpression() {
    loadingAICronExpression = true
    try {
      const response = await API.generateCronExpression(aiCronPrompt)
      cronExpression = response.message
      dispatch("change", response.message)
    } catch (err) {
      notifications.error(err.message)
    } finally {
      loadingAICronExpression = false
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<Layout noPadding gap="S">
  <Select
    on:change={updatePreset}
    value={cronExpression || "Custom"}
    secondary
    extraThin
    label="Use a Preset (Optional)"
    options={CRON_EXPRESSIONS}
  />
  {#if aiEnabled}
    <div class="cron-ai-generator">
      <Input
        bind:value={aiCronPrompt}
        label="Generate Cron Expression with AI"
        size="S"
        placeholder="Run every hour between 1pm to 4pm everyday of the week"
      />
      {#if aiCronPrompt}
        <div
          class="icon"
          class:pulsing-text={loadingAICronExpression}
          on:click={generateAICronExpression}
        >
          <MagicWand height="17" width="17" />
        </div>
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
    <InlineAlert
      type="info"
      header="Next Executions"
      message={nextExecutions}
    />
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
    border-top-right-radius: var(--spectrum-alias-border-radius-regular);
    border-bottom-right-radius: var(--spectrum-alias-border-radius-regular);
    width: 31px;
    color: var(--spectrum-alias-text-color);
    background-color: var(--spectrum-global-color-gray-75);
    transition: background-color
        var(--spectrum-global-animation-duration-100, 130ms),
      box-shadow var(--spectrum-global-animation-duration-100, 130ms),
      border-color var(--spectrum-global-animation-duration-100, 130ms);
    height: calc(var(--spectrum-alias-item-height-m) - 2px);
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
