<script>
  import { Icon, notifications } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "builderStore"
  import WebhookDisplay from "./WebhookDisplay.svelte"
  import { ModalContent } from "@budibase/bbui"
  import { onMount, onDestroy } from "svelte"
  import { _ } from "../../../../lang/i18n"

  const POLL_RATE_MS = 2500

  let interval
  let finished = false
  let schemaURL
  let propCount = 0

  $: automation = $selectedAutomation

  onMount(async () => {
    if (!automation?.definition?.trigger?.inputs.schemaUrl) {
      // save the automation initially
      try {
        await automationStore.actions.save(automation)
      } catch (error) {
        notifications.error(
          $_("components.automation.Shared.CreateWebhookModal.Error_saving")
        )
      }
    }
    interval = setInterval(async () => {
      try {
        await automationStore.actions.fetch()
        const outputs =
          automation?.definition?.trigger.schema.outputs?.properties
        // always one prop for the "body"
        if (Object.keys(outputs).length > 1) {
          propCount = Object.keys(outputs).length - 1
          finished = true
        }
      } catch (error) {
        notifications.error(
          $_("components.automation.Shared.CreateWebhookModal.Error_getting")
        )
      }
    }, POLL_RATE_MS)
    schemaURL = automation?.definition?.trigger?.inputs.schemaUrl
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<ModalContent
  title={$_("components.automation.Shared.CreateWebhookModal.Webhook_Setup")}
  confirmText={$_("components.automation.Shared.CreateWebhookModal.Finished")}
  showConfirmButton={finished}
  cancelText={$_("components.automation.Shared.CreateWebhookModal.Skip")}
>
  <p>
    {$_("components.automation.Shared.CreateWebhookModal.receiving_data")}
    <code>POST</code>
    {$_("components.automation.Shared.CreateWebhookModal.request")}
  </p>
  <WebhookDisplay value={schemaURL} />
  {#if finished}
    <p class="finished-text">
      {$_("components.automation.Shared.CreateWebhookModal.Request_received")}
      {propCount}
      {$_(
        "components.automation.Shared.CreateWebhookModal.vindable_value"
      )}{propCount > 1 ? "s" : ""}.
    </p>
  {/if}
  <a
    slot="footer"
    target="_blank"
    href="https://docs.budibase.com/docs/trigger"
  >
    <Icon name="InfoOutline" />
    <span
      >{$_(
        "components.automation.Shared.CreateWebhookModal.Learn_webhooks"
      )}</span
    >
  </a>
</ModalContent>

<style>
  a {
    color: var(--ink);
    font-size: 14px;
    vertical-align: middle;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  a span {
    text-decoration: underline;
    margin-left: var(--spectrum-alias-item-padding-s);
  }
  p {
    margin: 0;
    text-align: justify;
  }
  .finished-text {
    font-weight: 600;
    text-align: center;
    color: var(--blue);
  }
  code {
    padding: 1px 4px 1px 4px;
    font-size: 14px;
    color: var(--grey-7);
    background-color: var(--grey-4);
    border-radius: 2px;
  }
</style>
