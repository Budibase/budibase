<script>
  import { Heading, Body, Layout, Button, Modal, Icon } from "@budibase/bbui"
  import AutomationPanel from "components/automation/AutomationPanel/AutomationPanel.svelte"
  import CreateAutomationModal from "components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"
  import TestPanel from "components/automation/AutomationBuilder/TestPanel.svelte"
  import { onDestroy, onMount } from "svelte"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import {
    builderStore,
    automationStore,
    selectedAutomation,
  } from "stores/builder"
  import { createLocalStorageStore } from "@budibase/frontend-core"
  import { fly } from "svelte/transition"

  $: automationId = $selectedAutomation?.data?._id
  $: builderStore.selectResource(automationId)

  const surveyDismissed = createLocalStorageStore("automation-survey", false)
  const stopSyncing = syncURLToState({
    urlParam: "automationId",
    stateKey: "selectedAutomationId",
    validate: id => $automationStore.automations.some(x => x._id === id),
    fallbackUrl: "./index",
    store: automationStore,
    update: automationStore.actions.select,
    routify,
  })

  let modal
  let webhookModal
  let mounted = false

  onMount(() => {
    $automationStore.showTestPanel = false
    mounted = true
  })

  onDestroy(stopSyncing)
</script>

<!-- routify:options index=3 -->
<div class="root">
  <AutomationPanel {modal} {webhookModal} />
  <div class="content drawer-container">
    {#if $automationStore.automations?.length}
      <slot />
    {:else}
      <div class="centered">
        <div class="main">
          <Layout gap="S" justifyItems="center">
            <svg
              width="60px"
              height="60px"
              class="spectrum-Icon"
              focusable="false"
            >
              <use xlink:href="#spectrum-icon-18-WorkflowAdd" />
            </svg>
            <Heading size="M">You have no automations</Heading>
            <Body size="M">Let's fix that. Call the bots!</Body>
            <Button on:click={() => modal.show()} size="M" cta>
              Create automation
            </Button>
          </Layout>
        </div>
      </div>
    {/if}
  </div>

  {#if $automationStore.showTestPanel}
    <div class="setup">
      <TestPanel automation={$selectedAutomation.data} />
    </div>
  {/if}
  <Modal bind:this={modal}>
    <CreateAutomationModal {webhookModal} />
  </Modal>
  <Modal bind:this={webhookModal} width="30%">
    <CreateWebhookModal />
  </Modal>
</div>

{#if !$surveyDismissed && mounted}
  <div
    class="survey"
    in:fly={{ x: 600, duration: 260, delay: 1000 }}
    out:fly={{ x: 600, duration: 260 }}
  >
    <div class="survey__body">
      <div class="survey__title">We value your feedback!</div>
      <div class="survey__text">
        <a
          href="https://t.maze.co/310149185"
          target="_blank"
          rel="noopener noreferrer"
          on:click={() => surveyDismissed.set(true)}
        >
          Complete our survey on Automations</a
        >
        and receive a $20 thank-you gift.
        <a
          href="https://drive.google.com/file/d/12-qk_2F9g5PdbM6wuKoz2KkIyLI-feMX/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms apply.
        </a>
      </div>
    </div>
    <Icon
      name="Close"
      hoverable
      color="var(--spectrum-global-color-static-gray-300)"
      hoverColor="var(--spectrum-global-color-static-gray-100)"
      on:click={() => surveyDismissed.set(true)}
    />
  </div>
{/if}

<style>
  .root {
    flex: 1 1 auto;
    height: 0;
    display: grid;
    grid-auto-flow: column dense;
    grid-template-columns: 260px minmax(510px, 1fr) fit-content(500px);
    overflow: hidden;
  }
  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    overflow: auto;
  }
  .centered {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .main {
    width: 300px;
  }
  .setup {
    padding-top: 9px;
    border-left: var(--border-light);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    background-color: var(--background);
    grid-column: 3;
    overflow: auto;
  }

  /* Survey */
  .survey {
    position: absolute;
    bottom: 32px;
    right: 32px;
    background: var(--spectrum-semantic-positive-color-background);
    display: flex;
    flex-direction: row;
    padding: var(--spacing-l) var(--spacing-xl);
    border-radius: 4px;
    gap: var(--spacing-xl);
  }
  .survey * {
    color: var(--spectrum-global-color-static-gray-300);
    white-space: nowrap;
  }
  .survey a {
    text-decoration: underline;
    transition: color 130ms ease-out;
  }
  .survey a:hover {
    color: var(--spectrum-global-color-static-gray-100);
    cursor: pointer;
  }
  .survey__body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .survey__title {
    font-weight: 600;
    font-size: 15px;
  }
</style>
