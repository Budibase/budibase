<script>
  import { store, backendUiStore, automationStore } from "builderStore"
  import WebhookDisplay from "./WebhookDisplay.svelte"
  import { ModalContent } from "@budibase/bbui"
  import { onMount, onDestroy } from "svelte"
  import { cloneDeep } from "lodash/fp"
  import analytics from "analytics"

  const POLL_RATE_MS = 2500
  const DEFAULT_SCHEMA_OUTPUT = "Any input allowed"
  let name
  let interval
  let valid = false
  let schemaURL
  let schema = DEFAULT_SCHEMA_OUTPUT

  $: instanceId = $backendUiStore.selectedDatabase._id
  $: appId = $store.appId
  $: automation = $automationStore.selectedAutomation?.automation

  onMount(async () => {
    // save the automation initially
    await automationStore.actions.save({
      instanceId,
      automation,
    })
    interval = setInterval(async () => {
      await automationStore.actions.fetch()
      const outputs = automation?.definition?.trigger.schema.outputs?.properties
      if (Object.keys(outputs).length !== 0) {
        schema = cloneDeep(outputs)
        // clear out the "description" properties
        for (let key of Object.keys(schema)) {
          delete schema[key].description
        }
        schema = JSON.stringify(schema, null, 2)
        //schema = schema.replace(/(?:\r\n|\r|\n)/g, "<br />")
        //console.log(schema)
        valid = true
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
  cancelText="Skip"
  disabled={!valid}>
  <p class="webhook-exp">
    To configure a webhook we need to create a schema for your webhook to
    validate against. Use the URL shown below and send a
    <b>POST</b>
    request to it with a JSON body in the format that your webhook should use!
  </p>
  <WebhookDisplay value={schemaURL} />
  <h5>Schema</h5>
  <code> {schema} </code>
  <div slot="footer">
    <a target="_blank" href="https://docs.budibase.com/automate/steps/triggers">
      <i class="ri-information-line" />
      <span>Learn about webhooks</span>
    </a>
  </div>
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
    padding-top: 0;
    text-align: justify;
  }
  h5 {
    margin: 0;
  }
  code {
    padding: 8px;
    font-size: 14px;
    color: var(--grey-5);
    background-color: var(--grey-4);
    border-radius: 6px;
    display: block;
    white-space: pre-wrap;
  }
</style>
