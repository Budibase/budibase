<script>
  import { Button } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import api from "builderStore/api"

  async function deployApp() {
    const DEPLOY_URL = `/deploy`

    try {
      notifier.info("Starting Deployment..")
      const response = await api.post(DEPLOY_URL)
      const json = await response.json()
      if (response.status !== 200) {
        throw new Error
      }

      notifier.success("Deployment Complete. View your app at blah URL")
    } catch (err) {
      notifier.danger("Deployment unsuccessful. Please try again later.")
    }
  }
</script>

<section>
  <div>
    <h4>It's time to shine!</h4>
    <Button secondary medium on:click={deployApp}>
      Deploy App
    </Button>
  </div>
  <img src="/_builder/assets/deploy-rocket.jpg" />
</section>

<style>
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
