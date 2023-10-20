<script>
  import { goto } from "@roxi/routify"
  import NamePanel from "./_components/NamePanel.svelte"
  import ExampleApp from "./_components/ExampleApp.svelte"
  import { notifications } from "@budibase/bbui"
  import { SplitPage } from "@budibase/frontend-core"
  import { API } from "api"
  import { store, automationStore } from "builderStore"
  import { auth, admin } from "stores/portal"

  let name = "My first app"
  let url = "my-first-app"
  let appId = null

  let loading = false

  const createApp = async () => {
    loading = true

    // Create form data to create app
    // This is form based and not JSON
    let data = new FormData()
    data.append("name", name.trim())
    data.append("url", url.trim())
    data.append("useTemplate", false)

    const createdApp = await API.createApp(data)

    // Select Correct Application/DB in prep for creating user
    const pkg = await API.fetchAppPackage(createdApp.instance._id)
    await store.actions.initialise(pkg)
    await automationStore.actions.fetch()
    // Update checklist - in case first app
    await admin.init()

    // Create user
    await auth.setInitInfo({})

    appId = createdApp.instance._id
    return createdApp
  }

  const goToApp = () => {
    $goto(`/builder/app/${appId}`)
    notifications.success(`App created successfully`)
  }

  const handleCreateApp = async () => {
    try {
      await createApp()

      goToApp()
    } catch (e) {
      loading = false
      notifications.error("There was a problem creating your app")
    }
  }
</script>

<div class="full-width">
  <SplitPage>
    <NamePanel bind:name bind:url disabled={loading} onNext={handleCreateApp} />
    <div slot="right">
      <ExampleApp {name} />
    </div>
  </SplitPage>
</div>

<style>
  .full-width {
    width: 100%;
  }
</style>
