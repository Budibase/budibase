<script>
  import { automationStore } from "@/stores/builder"
  import { ModalContent } from "@budibase/bbui"
  import { onMount } from "svelte"
  import WebhookDisplay from "../automation/Shared/WebhookDisplay.svelte"
  import { TriggerStepID } from "@/constants/backend/automations"

  let webhookUrls = []

  $: automations = $automationStore.automations

  onMount(() => {
    webhookUrls = automations.map(automation => {
      const trigger = automation.definition.trigger
      if (trigger?.stepId === TriggerStepID.WEBHOOK && trigger.inputs) {
        return {
          type: "Automation",
          name: automation.name,
          url: trigger.inputs.triggerUrl,
        }
      }
    })
  })
</script>

<ModalContent
  title="Webhook Endpoints"
  confirmText="OK"
  showCancelButton={false}
>
  <p>See below the list of deployed webhook URLs.</p>
  {#each webhookUrls as webhookUrl}
    <div>
      <h5>{webhookUrl.type} - {webhookUrl.name}</h5>
      <WebhookDisplay value={webhookUrl.url} production={true} />
    </div>
  {/each}
  {#if webhookUrls.length === 0}
    <h5>No webhooks found.</h5>
  {/if}
  <a
    slot="footer"
    target="_blank"
    href="https://docs.budibase.com/docs/trigger"
  >
    <i class="ri-information-line" />
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
  }

  i {
    font-size: 20px;
    margin-right: var(--spacing-m);
    text-decoration: none;
  }

  p {
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
    text-align: justify;
  }

  h5 {
    margin-top: 0;
    padding-top: 0;
  }
</style>
