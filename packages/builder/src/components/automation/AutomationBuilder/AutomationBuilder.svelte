<script>
  import { afterUpdate } from "svelte"
  import { automationStore, backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import Flowchart from "./flowchart/FlowChart.svelte"

  $: automation = $automationStore.selectedAutomation?.automation
  $: automationLive = automation?.live
  $: instanceId = $backendUiStore.selectedDatabase._id

  function onSelect(block) {
    automationStore.update(state => {
      state.selectedBlock = block
      return state
    })
  }

  function setAutomationLive(live) {
    automation.live = live
    automationStore.actions.save({ instanceId, automation })
    if (live) {
      notifier.info(`Automation ${automation.name} enabled.`)
    } else {
      notifier.danger(`Automation ${automation.name} disabled.`)
    }
  }
</script>

<section>
  <Flowchart {automation} {onSelect} />
</section>
<footer>
  {#if automation}
    <button
      class:highlighted={automationLive}
      class:hoverable={automationLive}
      class="stop-button hoverable">
      <i class="ri-stop-fill" on:click={() => setAutomationLive(false)} />
    </button>
    <button
      class:highlighted={!automationLive}
      class:hoverable={!automationLive}
      class="play-button hoverable"
      data-cy="activate-automation"
      on:click={() => setAutomationLive(true)}>
      <i class="ri-play-fill" />
    </button>
  {/if}
</footer>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
    height: 100%;
    position: relative;
  }

  footer {
    position: absolute;
    bottom: var(--spacing-xl);
    right: 30px;
    display: flex;
    align-items: flex-end;
  }

  footer > button {
    border-radius: 100%;
    color: var(--white);
    width: 76px;
    height: 76px;
    border: none;
    background: #adaec4;
    font-size: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  footer > button:first-child {
    margin-right: var(--spacing-m);
  }

  .play-button.highlighted {
    background: var(--purple);
  }

  .stop-button.highlighted {
    background: var(--red);
  }
</style>
