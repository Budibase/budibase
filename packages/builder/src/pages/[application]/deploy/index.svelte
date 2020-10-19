<script>
  import { onMount } from "svelte"
  import { Button, Spacer } from "@budibase/bbui"
  import { store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import api from "builderStore/api"
  import Spinner from "components/common/Spinner.svelte"
  import DeploymentHistory from "components/deploy/DeploymentHistory.svelte"
  import analytics from "analytics"

  let loading = false
  let deployments = []
  let poll

  $: appId = $store.appId

  async function deployApp() {
    loading = true
    const DEPLOY_URL = `/api/deploy`

    try {
      notifier.info("Starting Deployment..")
      const response = await api.post(DEPLOY_URL)
      const json = await response.json()
      if (response.status !== 200) {
        throw new Error()
      }

      notifier.info(`Deployment started. Please wait.`)
      loading = false
      analytics.captureEvent("Deployed App", {
        appId,
      })
    } catch (err) {
      analytics.captureEvent("Deploy App Failed", {
        appId,
      })
      analytics.captureException(err)
      notifier.danger("Deployment unsuccessful. Please try again later.")
      loading = false
    }
  }
</script>

<section>
  <div>
    <h4>It's time to shine!</h4>
    <Button secondary medium on:click={deployApp}>
      Deploy App
      {#if loading}
        <Spacer extraSmall />
        <Spinner size="10" />
      {/if}
    </Button>
  </div>
  <img
    src="/_builder/assets/deploy-rocket.jpg"
    alt="Rocket flying through sky" />
</section>
<DeploymentHistory {appId} />

<style>
  img {
    width: 100%;
    height: 100%;
  }

  h4 {
    color: var(--white);
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 30px;
  }

  section {
    position: relative;
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
  }
</style>
