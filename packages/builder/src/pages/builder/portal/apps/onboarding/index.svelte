<script>
  import { goto } from "@roxi/routify"
  import NamePanel from "./_components/NamePanel.svelte"
  import DataPanel from "./_components/DataPanel.svelte"
  import DatasourceConfigPanel from "./_components/DatasourceConfigPanel.svelte"
  import ExampleApp from "./_components/ExampleApp.svelte"
  import { FancyButton, notifications, Modal, Body } from "@budibase/bbui"
  import IntegrationIcon from "components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { SplitPage } from "@budibase/frontend-core"
  import { API } from "api"
  import { store, automationStore } from "builderStore"
  import { saveDatasource } from "builderStore/datasource"
  import { integrations } from "stores/backend"
  import { auth, admin, organisation } from "stores/portal"
  import FontAwesomeIcon from "components/common/FontAwesomeIcon.svelte"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import createFromScratchScreen from "builderStore/store/screenTemplates/createFromScratchScreen"
  import { Roles } from "constants/backend"
  import Spinner from "components/common/Spinner.svelte"
  import { helpers } from "@budibase/shared-core"

  let name = "My first app"
  let url = "my-first-app"
  let stage = "name"
  let appId = null

  let plusIntegrations = {}
  let integrationsLoading = true
  let creationLoading = false
  let uploadModal
  let googleComplete = false

  $: getIntegrations()

  const createApp = async useSampleData => {
    creationLoading = true
    // Create form data to create app
    // This is form based and not JSON
    try {
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
      return createdApp
    } catch (e) {
      creationLoading = false
      throw e
    }
  }

  const getIntegrations = async () => {
    try {
      await integrations.init()
      const newPlusIntegrations = {}

      Object.entries($integrations).forEach(([integrationType, schema]) => {
        // google sheets not available in self-host
        if (
          helpers.isGoogleSheets(integrationType) &&
          !$organisation.googleDatasourceConfigured
        ) {
          return
        }
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

  const handleCreateApp = async ({
    datasourceConfig,
    useSampleData,
    isGoogle,
  }) => {
    try {
      const app = await createApp(useSampleData)

      let datasource
      if (datasourceConfig) {
        datasource = await saveDatasource({
          plus: true,
          auth: undefined,
          name: plusIntegrations[stage].friendlyName,
          schema: plusIntegrations[stage].datasource,
          config: datasourceConfig,
          type: stage,
        })
      }

      store.set()

      if (isGoogle) {
        googleComplete = true
        return { datasource, appId: app.appId }
      } else {
        goToApp()
      }
    } catch (e) {
      console.log(e)
      creationLoading = false
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
  {:else if googleComplete}
    <div class="centered">
      <Body
        >Please login to your Google account in the new tab which as opened to
        continue.</Body
      >
    </div>
  {:else if integrationsLoading || creationLoading}
    <div class="centered">
      <Spinner />
    </div>
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
      type={stage}
      onBack={() => (stage = "data")}
      onNext={data => {
        const isGoogle = data.isGoogle
        delete data.isGoogle
        return handleCreateApp({ datasourceConfig: data, isGoogle })
      }}
    />
  {:else}
    <p>There was an problem. Please refresh the page and try again.</p>
  {/if}
  <div slot="right">
    <ExampleApp {name} showData={stage !== "name"} />
  </div>
</SplitPage>

<style>
  .centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

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
