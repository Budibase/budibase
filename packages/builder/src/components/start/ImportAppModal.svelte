<script>
  import {
    ModalContent,
    Toggle,
    Input,
    Layout,
    Dropzone,
    notifications,
    Body,
  } from "@budibase/bbui"
  import { API } from "@/api"
  import { initialise } from "@/stores/builder"

  export let app

  $: disabled = (encrypted && !password) || !file
  let encrypted = false,
    password
  let file

  async function updateApp() {
    try {
      let data = new FormData()
      data.append("appExport", file)
      if (encrypted) {
        data.append("encryptionPassword", password.trim())
      }
      const appId = app.devId
      await API.updateAppFromExport(appId, data)
      const pkg = await API.fetchAppPackage(appId)
      await initialise(pkg)

      notifications.success("App updated successfully")
    } catch (err) {
      notifications.error(`Failed to update app - ${err.message || err}`)
    }
  }
</script>

<ModalContent
  title={`Update ${app.name}`}
  confirmText="Update"
  onConfirm={updateApp}
  bind:disabled
>
  <Body size="S"
    >Updating an app using an app export will replace all tables, datasources,
    queries, screens and automations. It is recommended to perform a backup
    before running this operation.</Body
  >
  <Layout noPadding gap="XS">
    <Dropzone
      gallery={false}
      label="App export"
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
