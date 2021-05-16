<script>
  import { Button, Modal, notifications, Heading } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import DeploymentHistory from "components/deploy/DeploymentHistory.svelte"
  import analytics from "analytics"
  import FeedbackIframe from "components/feedback/FeedbackIframe.svelte"
  import Rocket from "/assets/deploy-rocket.jpg"

  let loading = false
  let deployments = []
  let poll
  let feedbackModal

  $: appId = $store.appId

  async function deployApp() {
    try {
      notifications.info(`Deployment started. Please wait.`)
      const response = await api.post("/api/deploy")
      const json = await response.json()
      if (response.status !== 200) {
        throw new Error()
      }

      if (analytics.requestFeedbackOnDeploy()) {
        feedbackModal.show()
      }
    } catch (err) {
      analytics.captureException(err)
      notifications.error("Deployment unsuccessful. Please try again later.")
    }
  }
</script>

<section>
  <img src={Rocket} alt="Rocket flying through sky" />
  <div>
    <Heading size="M">It's time to shine!</Heading>
    <Button size="XL" cta medium on:click={deployApp}>Publish App</Button>
  </div>
</section>
<Modal bind:this={feedbackModal}>
  <FeedbackIframe on:finished={() => feedbackModal.hide()} />
</Modal>
<DeploymentHistory {appId} />

<style>
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(80%);
  }

  section {
    position: relative;
    min-height: 100%;
  }

  div {
    position: absolute;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    left: 0;
    right: 0;
    top: 20%;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    gap: var(--spacing-xl);
  }
  div :global(h1) {
    color: white;
  }
</style>
