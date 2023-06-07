<script>
  import { Icon, notifications } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "builderStore"
  import WebhookDisplay from "./WebhookDisplay.svelte"
  import { ModalContent } from "@budibase/bbui"
  import { onMount, onDestroy } from "svelte"

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
        notifications.error("Error saving automation")
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
        notifications.error("Error getting automations list")
      }
    }, POLL_RATE_MS)
    schemaURL = automation?.definition?.trigger?.inputs.schemaUrl
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<ModalContent
  title="Webhook Setup"
  confirmText="Finished"
  showConfirmButton={finished}
  cancelText="Skip"
>
  <p>
    Webhooks are for receiving data. To make them easier please use the URL
    shown below and send a
    <code>POST</code>
    request to it from your other application. If you're unable to do this now then
    you can skip this step, however we will not be able to configure bindings for
    your later actions!
  </p>
  <WebhookDisplay value={schemaURL} />
  {#if finished}
    <p class="finished-text">
      Request received! We found
      {propCount}
      bindable value{propCount > 1 ? "s" : ""}.
    </p>
  {/if}
  <a
    slot="footer"
    target="_blank"
    href="https://docs.budibase.com/docs/trigger"
  >
    <Icon name="InfoOutline" />
    <span>Learn about webhooks</span>
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
