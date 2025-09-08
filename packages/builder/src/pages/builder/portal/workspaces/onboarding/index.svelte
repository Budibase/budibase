<script lang="ts">
  import { goto } from "@roxi/routify"
  import NamePanel from "./_components/NamePanel.svelte"
  import ExampleApp from "./_components/ExampleApp.svelte"
  import { notifications } from "@budibase/bbui"
  import { SplitPage } from "@budibase/frontend-core"
  import { API } from "@/api"
  import { auth, admin } from "@/stores/portal"

  let workspaceName: string = "My first workspace"
  let workspaceUrl: string = "my-first-workspace"

  let appName: string = "My first App"
  let appUrl: string = "my-first-app"
  let appId: string | null = null

  let loading = false

  const createApp = async () => {
    loading = true

    // Create form data to create app
    // This is form based and not JSON
    let data = new FormData()
    data.append("name", appName)
    data.append("url", appUrl)
    data.append("useTemplate", "false")
    data.append("isOnboarding", "true")

    const createdApp = await API.createApp(data)

    // Update checklist - in case first app
    await admin.init()

    // Create user
    await auth.setInitInfo({})

    appId = createdApp.instance._id
    return createdApp
  }

  const goToApp = () => {
    $goto(`/builder/workspace/${appId}`)
    notifications.success(`App created successfully`)
  }

  const handleCreateApp = async () => {
    try {
      await createApp()

      goToApp()
    } catch (e: any) {
      loading = false
      notifications.error(e.message || "There was a problem creating your app")
    }
  }
</script>

<div class="full-width">
  <SplitPage>
    <NamePanel
      bind:name={workspaceName}
      bind:url={workspaceUrl}
      disabled={loading}
      onNext={handleCreateApp}
    />
    <div slot="right">
      <ExampleApp />
    </div>
  </SplitPage>
</div>

<style>
  .full-width {
    width: 100%;
  }
</style>
