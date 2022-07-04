<script>
  import { onMount, onDestroy } from "svelte"
  import Spinner from "components/common/Spinner.svelte"
  import { slide } from "svelte/transition"
  import { Heading, Button, Modal, ModalContent } from "@budibase/bbui"
  import { API } from "api"
  import { notifications } from "@budibase/bbui"
  import CreateWebhookDeploymentModal from "./CreateWebhookDeploymentModal.svelte"
  import { store } from "builderStore"
  import {
    checkIncomingDeploymentStatus,
    DeploymentStatus,
  } from "components/deploy/utils"

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
      hourCycle: "h12",
    },
  }
  const POLL_INTERVAL = 5000

  export let appId

  let modal
  let errorReasonModal
  let errorReason
  let poll
  let deployments = []
  let urlComponent = $store.url || `/${appId}`
  let deploymentUrl = `${urlComponent}`

  const formatDate = (date, format) =>
    Intl.DateTimeFormat("en-GB", DATE_OPTIONS[format]).format(date)

  async function fetchDeployments() {
    try {
      const newDeployments = await API.getAppDeployments()
      if (deployments.length > 0) {
        const pendingDeployments = checkIncomingDeploymentStatus(
          deployments,
          newDeployments
        )
        if (pendingDeployments.length) {
          showErrorReasonModal(pendingDeployments[0].err)
        }
      }
      deployments = newDeployments
    } catch (err) {
      clearInterval(poll)
      notifications.error("Error fetching deployment overview")
    }
  }

  function showErrorReasonModal(err) {
    if (!err) return
    errorReason = err
    errorReasonModal.show()
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
      <Heading>Deployment History</Heading>
      <div class="deploy-div">
        {#if deployments.some(deployment => deployment.status === DeploymentStatus.SUCCESS)}
          <a target="_blank" href={deploymentUrl}> View Your Deployed App → </a>
          <Button primary on:click={() => modal.show()}>View webhooks</Button>
        {/if}
      </div>
    </header>
    <div class="deployment-list">
      {#each deployments as deployment}
        <article class="deployment">
          <div class="deployment-info">
            <span class="deploy-date">
              {formatDate(deployment.updatedAt, "fullDate")}
            </span>
            <span class="deploy-time">
              {formatDate(deployment.updatedAt, "timeOnly")}
            </span>
          </div>
          <div class="deployment-right">
            {#if deployment.status.toLowerCase() === "pending"}
              <Spinner size="10" />
            {/if}
            <div
              on:click={() => showErrorReasonModal(deployment.err)}
              class={`deployment-status ${deployment.status}`}
            >
              <span>
                {deployment.status}
                {#if deployment.status === DeploymentStatus.FAILURE}
                  <i class="ri-information-line" />
                {/if}
              </span>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </section>
{/if}
<Modal bind:this={modal} width="30%">
  <CreateWebhookDeploymentModal />
</Modal>
<Modal bind:this={errorReasonModal} width="30%">
  <ModalContent
    title="Deployment Error"
    confirmText="OK"
    showCancelButton={false}
  >
    {errorReason}
  </ModalContent>
</Modal>

<style>
  section {
    padding: var(--spacing-xl) 0;
  }

  .deployment-list {
    height: 40vh;
    overflow-y: auto;
  }

  header {
    padding-left: var(--spacing-l);
    padding-bottom: var(--spacing-xl);
    padding-right: var(--spacing-l);
    border-bottom: var(--border-light);
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
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--border-light);
  }
  .deployment:last-child {
    border-bottom: none;
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
    font-weight: 600;
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
    font-weight: 600;
    text-transform: lowercase;
    width: 80px;
    text-align: center;
  }
  .deployment-status:first-letter {
    text-transform: uppercase;
  }

  a {
    color: var(--blue);
    font-weight: 600;
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
    cursor: pointer;
  }

  i {
    position: relative;
    top: 2px;
  }
</style>
