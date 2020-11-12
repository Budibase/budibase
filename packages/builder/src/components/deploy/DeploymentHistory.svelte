<script>
  import { onMount, onDestroy } from "svelte"
  import Spinner from "components/common/Spinner.svelte"
  import { slide } from "svelte/transition"
  import { Heading, Body, Button, Modal } from "@budibase/bbui"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import CreateWebhookDeploymentModal from "./CreateWebhookDeploymentModal.svelte"

  const DeploymentStatus = {
    SUCCESS: "SUCCESS",
    PENDING: "PENDING",
    FAILURE: "FAILURE",
  }

  const DATE_OPTIONS = {
    fullDate: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    timeOnly: {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
  }
  const POLL_INTERVAL = 5000

  export let appId

  let modal
  let poll
  let deployments = []
  let deploymentUrl = `https://${appId}.app.budi.live/${appId}`

  const formatDate = (date, format) =>
    Intl.DateTimeFormat("en-GB", DATE_OPTIONS[format]).format(date)

  async function fetchDeployments() {
    try {
      const response = await api.get(`/api/deployments`)
      deployments = await response.json()
    } catch (err) {
      console.error(err)
      clearInterval(poll)
      notifier.danger("Error fetching deployment history. Please try again.")
    }
  }

  onMount(() => {
    fetchDeployments()
    poll = setInterval(fetchDeployments, POLL_INTERVAL)
  })

  onDestroy(() => clearInterval(poll))
</script>

{#if deployments.length > 0}
  <section class="deployment-history" in:slide>
    <header>
      <h4>Deployment History</h4>
      <div class="deploy-div">
        {#if deployments.some(deployment => deployment.status === DeploymentStatus.SUCCESS)}
          <a target="_blank" href={`https://${appId}.app.budi.live/${appId}`}>
            View Your Deployed App →
          </a>
          <Button primary on:click={() => modal.show()}>View webhooks</Button>
        {/if}
      </div>
    </header>
    <div class="deployment-list">
      {#each deployments as deployment}
        <article class="deployment">
          <div class="deployment-info">
            <span class="deploy-date">
              {formatDate(deployment.updatedAt, 'fullDate')}
            </span>
            <span class="deploy-time">
              {formatDate(deployment.updatedAt, 'timeOnly')}
            </span>
          </div>
          <div class="deployment-right">
            {#if deployment.status.toLowerCase() === 'pending'}
              <Spinner size="10" />
            {/if}
            <div class={`deployment-status ${deployment.status}`}>
              {deployment.status}
            </div>
            {#if deployment.status === DeploymentStatus.FAILURE}
              <span>{deployment.err}</span>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </section>
{/if}
<Modal bind:this={modal} width="30%">
  <CreateWebhookDeploymentModal />
</Modal>

<style>
  .deployment:nth-child(odd) {
    background: var(--grey-1);
  }

  .deployment-list {
    height: 40vh;
    overflow-y: scroll;
  }

  h4 {
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-s);
  }

  header {
    margin-left: var(--spacing-l);
    margin-bottom: var(--spacing-xl);
    margin-right: var(--spacing-l);
  }

  .deploy-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .deployment-history {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: var(--background);
  }

  .deployment {
    padding: var(--spacing-l);
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .deployment-info {
    display: flex;
    flex-direction: column;
    margin-right: var(--spacing-s);
  }

  .deploy-date {
    font-size: var(--font-size-m);
  }

  .deploy-time {
    color: var(--grey-7);
    font-weight: 500;
    font-size: var(--font-size-s);
  }

  .deployment-right {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
  }

  .deployment-status {
    font-size: var(--font-size-s);
    padding: var(--spacing-s);
    border-radius: var(--border-radius-s);
    font-weight: 500;
    text-transform: lowercase;
    width: 80px;
    text-align: center;
  }
  .deployment-status:first-letter {
    text-transform: uppercase;
  }

  a {
    color: var(--blue);
    font-weight: 500;
    font-size: var(--font-size-s);
  }

  .SUCCESS {
    color: var(--green);
    background: var(--green-light);
  }

  .PENDING {
    color: var(--yellow);
    background: var(--yellow-light);
  }

  .FAILURE {
    color: var(--red);
    background: var(--red-light);
  }
</style>
