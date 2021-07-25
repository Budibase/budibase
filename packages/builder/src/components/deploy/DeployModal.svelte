<script>
  import { onMount, onDestroy } from "svelte"
  import { Button, Modal, notifications, ModalContent } from "@budibase/bbui"
  import api from "builderStore/api"
  import analytics from "analytics"

  const DeploymentStatus = {
    SUCCESS: "SUCCESS",
    PENDING: "PENDING",
    FAILURE: "FAILURE",
  }

  const POLL_INTERVAL = 10000

  let feedbackModal
  let deployments = []
  let poll
  let publishModal

  async function deployApp() {
    try {
      const response = await api.post("/api/deploy")
      if (response.status !== 200) {
        throw new Error(`status ${response.status}`)
      } else {
        notifications.success(`Application published successfully`)
      }
    } catch (err) {
      analytics.captureException(err)
      notifications.error(`Error publishing app: ${err}`)
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
<Modal bind:this={feedbackModal}>
  <ModalContent
    title="Enjoying Budibase?"
    size="L"
    showConfirmButton={false}
    showCancelButton={false}
  />
</Modal>
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
