<script lang="ts">
  import { API } from "@/api"
  import { initialise } from "@/stores/builder"
  import {
    Body,
    Dropzone,
    Input,
    Layout,
    ModalContent,
    notifications,
    Toggle,
  } from "@budibase/bbui"
  import type { ImportToUpdateWorkspaceRequest } from "@budibase/types"

  export let app: {
    _id: string
    name: string
  }

  let encrypted: boolean = false
  let password: string
  let file: File
  $: disabled = (encrypted && !password) || !file

  async function updateApp() {
    try {
      const body: ImportToUpdateWorkspaceRequest = {}
      if (encrypted) {
        body.encryptionPassword = password.trim()
      }
      const appId = app._id
      await API.updateAppFromExport(appId, body, file)
      const pkg = await API.fetchAppPackage(appId)
      await initialise(pkg)

      notifications.success("Workspace updated successfully")
    } catch (err: any) {
      notifications.error(`Failed to update workspace - ${err.message || err}`)
    }
  }
</script>

<ModalContent
  title={`Update ${app.name}`}
  confirmText="Update"
  onConfirm={updateApp}
  bind:disabled
>
  <Body size="S">
    Updating a workspace using an export bundle will replace all tables,
    datasources, queries, screens and automations. It is recommended to perform
    a backup before running this operation.
  </Body>
  <Layout noPadding gap="XS">
    <Dropzone
      gallery={false}
      label={"Workspace export"}
      on:change={e => {
        file = e.detail?.[0]
        encrypted = file?.name?.endsWith(".enc.tar.gz")
      }}
    />
    <Toggle text="Encrypted" bind:value={encrypted} />
    {#if encrypted}
      <Input
        type="password"
        label="Password"
        placeholder="Type here..."
        bind:value={password}
      />
    {/if}
  </Layout>
</ModalContent>
