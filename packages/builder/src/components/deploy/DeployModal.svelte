<script>
  import { onMount, onDestroy } from "svelte"
  import { Button, Modal, notifications, ModalContent } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import analytics from "analytics"
  import FeedbackIframe from "components/feedback/FeedbackIframe.svelte"

  const DeploymentStatus = {
    SUCCESS: "SUCCESS",
    PENDING: "PENDING",
    FAILURE: "FAILURE",
  }

  const POLL_INTERVAL = 1000

  let loading = false
  let feedbackModal
  let deployments = []
  let poll
  let publishModal

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

  async function fetchDeployments() {
    try {
      const response = await api.get(`/api/deployments`)
      const json = await response.json()

      if (deployments.length > 0) {
        checkIncomingDeploymentStatus(deployments, json)
      }

      deployments = json
    } catch (err) {
      console.error(err)
      clearInterval(poll)
      notifications.error(
        "Error fetching deployment history. Please try again."
      )
    }
  }

  // Required to check any updated deployment statuses between polls
  function checkIncomingDeploymentStatus(current, incoming) {
    for (let incomingDeployment of incoming) {
      if (
        incomingDeployment.status === DeploymentStatus.FAILURE ||
        incomingDeployment.status === DeploymentStatus.SUCCESS
      ) {
        const currentDeployment = current.find(
          deployment => deployment._id === incomingDeployment._id
        )

        // We have just been notified of an ongoing deployments status change
        if (
          !currentDeployment ||
          currentDeployment.status === DeploymentStatus.PENDING
        ) {
          if (incomingDeployment.status === DeploymentStatus.FAILURE) {
            notifications.error(incomingDeployment.err)
          } else {
            notifications.send(
              "Published to Production.",
              "success",
              "CheckmarkCircle"
            )
          }
        }
      }
    }
  }

  onMount(() => {
    fetchDeployments()
    poll = setInterval(fetchDeployments, POLL_INTERVAL)
  })

  onDestroy(() => clearInterval(poll))
</script>

<Button secondary on:click={publishModal.show}>Publish</Button>
<Modal bind:this={publishModal}>
  <ModalContent
    title="Publish to Production"
    confirmText="Publish"
    onConfirm={deployApp}
  >
    <span
      >The changes you have made will be published to the production version of
      the application.</span
    >
  </ModalContent>
</Modal>
