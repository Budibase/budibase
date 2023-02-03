<script>
  import { goto } from "@roxi/routify"
  import NamePanel from "./_components/NamePanel.svelte"
  import DataPanel from "./_components/DataPanel.svelte"
  import DatasourceConfigPanel from "./_components/DatasourceConfigPanel.svelte"
  import ExampleApp from "./_components/ExampleApp.svelte"
  import { FancyButton, notifications, Modal } from "@budibase/bbui"
  import IntegrationIcon from "components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { SplitPage } from "@budibase/frontend-core"
  import { API } from "api"
  import { store, automationStore } from "builderStore"
  import { saveDatasource } from "builderStore/datasource"
  import { integrations } from "stores/backend"
  import { auth, admin } from "stores/portal"
  import FontAwesomeIcon from "components/common/FontAwesomeIcon.svelte"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import createFromScratchScreen from "builderStore/store/screenTemplates/createFromScratchScreen"
  import { Roles } from "constants/backend"

  let name = "My first app"
  let url = "my-first-app"
  let stage = "name"
  let appId = null

  let plusIntegrations = {}
  let integrationsLoading = true
  $: getIntegrations()

  let uploadModal

  const createApp = async useSampleData => {
    // Create form data to create app
    // This is form based and not JSON
    let data = new FormData()
    data.append("name", name.trim())
    data.append("url", url.trim())
    data.append("useTemplate", false)

    if (useSampleData) {
      data.append("sampleData", true)
    }

    const createdApp = await API.createApp(data)

    // Select Correct Application/DB in prep for creating user
    const pkg = await API.fetchAppPackage(createdApp.instance._id)
    await store.actions.initialise(pkg)
    await automationStore.actions.fetch()
    // Update checklist - in case first app
    await admin.init()

    // Create user
    await auth.setInitInfo({})

    let defaultScreenTemplate = createFromScratchScreen.create()
    defaultScreenTemplate.routing.route = "/home"
    defaultScreenTemplate.routing.roldId = Roles.BASIC
    await store.actions.screens.save(defaultScreenTemplate)

    appId = createdApp.instance._id
  }

  const getIntegrations = async () => {
    try {
      await integrations.init()
      const newPlusIntegrations = {}

      Object.entries($integrations).forEach(([integrationType, schema]) => {
        if (schema?.plus) {
          newPlusIntegrations[integrationType] = schema
        }
      })

      plusIntegrations = newPlusIntegrations
    } catch (e) {
      notifications.error("There was a problem communicating with the server.")
    } finally {
      integrationsLoading = false
    }
  }

  const goToApp = () => {
    $goto(`/builder/app/${appId}`)
    notifications.success(`App created successfully`)
  }

  const handleCreateApp = async ({ datasourceConfig, useSampleData }) => {
    try {
      await createApp(useSampleData)

      if (datasourceConfig) {
        await saveDatasource({
          plus: true,
          auth: undefined,
          name: plusIntegrations[stage].friendlyName,
          schema: plusIntegrations[stage].datasource,
          config: datasourceConfig,
          type: stage,
        })
      }

      goToApp()
    } catch (e) {
      console.log(e)
      notifications.error("There was a problem creating your app")
    }
  }
</script>

<Modal bind:this={uploadModal}>
  <CreateTableModal
    name="Your Data"
    beforeSave={createApp}
    afterSave={goToApp}
  />
</Modal>

<SplitPage>
  {#if stage === "name"}
    <NamePanel bind:name bind:url onNext={() => (stage = "data")} />
  {:else if integrationsLoading}
    <p>loading...</p>
  {:else if stage === "data"}
    <DataPanel onBack={() => (stage = "name")}>
      <div class="dataButton">
        <FancyButton on:click={() => handleCreateApp({ useSampleData: true })}>
          <div class="dataButtonContent">
            <div class="dataButtonIcon">
              <img
                alt="Budibase Logo"
                class="budibaseLogo"
                src={"https://i.imgur.com/Xhdt1YP.png"}
              />
            </div>
            Budibase Sample data
          </div>
        </FancyButton>
      </div>
      <div class="dataButton">
        <FancyButton on:click={uploadModal.show}>
          <div class="dataButtonContent">
            <div class="dataButtonIcon">
              <FontAwesomeIcon name="fa-solid fa-file-arrow-up" />
            </div>
            Upload data (CSV or JSON)
          </div>
        </FancyButton>
      </div>
      {#each Object.entries(plusIntegrations) as [integrationType, schema]}
        <div class="dataButton">
          <FancyButton on:click={() => (stage = integrationType)}>
            <div class="dataButtonContent">
              <div class="dataButtonIcon">
                <IntegrationIcon {integrationType} {schema} />
              </div>
              {schema.friendlyName}
            </div>
          </FancyButton>
        </div>
      {/each}
    </DataPanel>
  {:else if stage in plusIntegrations}
    <DatasourceConfigPanel
      title={plusIntegrations[stage].friendlyName}
      fields={plusIntegrations[stage].datasource}
      onBack={() => (stage = "data")}
      onNext={data => handleCreateApp({ datasourceConfig: data })}
    />
  {:else}
    <p>There was an problem. Please refresh the page and try again.</p>
  {/if}
  <div slot="right">
    <ExampleApp {name} showData={stage !== "name"} />
  </div>
</SplitPage>

<style>
  .dataButton {
    margin-bottom: 12px;
  }

  .dataButtonContent {
    display: flex;
    align-items: center;
  }

  .budibaseLogo {
    height: 20px;
  }

  .dataButtonIcon {
    width: 22px;
    display: flex;
    justify-content: center;
    margin-right: 16px;
  }

  .dataButtonContent :global(svg) {
    font-size: 18px;
    color: white;
  }
</style>
