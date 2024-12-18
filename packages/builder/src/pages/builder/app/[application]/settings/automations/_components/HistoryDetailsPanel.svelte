<script>
  import {
    Layout,
    Body,
    Button,
    InlineAlert,
    Heading,
    Icon,
  } from "@budibase/bbui"
  import StatusRenderer from "./StatusRenderer.svelte"
  import DateTimeRenderer from "@/components/common/renderers/DateTimeRenderer.svelte"
  import TestDisplay from "@/components/automation/AutomationBuilder/TestDisplay.svelte"
  import { goto } from "@roxi/routify"
  import { automationStore } from "@/stores/builder"

  export let history
  export let appId
  export let close
  const STOPPED_ERROR = "stopped_error"

  $: exists = $automationStore.automations?.find(
    auto => auto._id === history?.automationId
  )
</script>

{#if history}
  <Layout noPadding>
    <div class="controls">
      <StatusRenderer value={history.status} />
      <Icon hoverable name="Close" on:click={close} />
    </div>
    <Layout noPadding gap="XS">
      <Heading>{history.automationName}</Heading>
      <DateTimeRenderer value={history.createdAt} />
    </Layout>
    {#if history.status === STOPPED_ERROR}
      <div class="cron-error">
        <InlineAlert
          type="error"
          header="CRON automation disabled"
          message="Fix the error and re-publish your app to re-activate."
        />
      </div>
    {/if}
    {#if exists}
      <div>
        <Button
          secondary
          on:click={() => {
            $goto(`/builder/app/${appId}/automation/${history.automationId}`)
          }}
        >
          Edit automation
        </Button>
      </div>
    {/if}
    {#key history}
      <div class="history">
        <TestDisplay testResults={history} />
      </div>
    {/key}
  </Layout>
{:else}
  <Body>No details found</Body>
{/if}

<style>
  .history :global(.block) {
    min-width: unset;
  }
  .history :global(> .container) {
    max-width: 320px;
    width: 320px;
    padding: 0px;
  }
  .controls {
    display: flex;
    gap: var(--spacing-s);
    justify-content: space-between;
    align-items: center;
  }
  .cron-error {
    display: flex;
    width: 100%;
    justify-content: center;
  }
</style>
