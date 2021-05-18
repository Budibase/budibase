<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Label,
    Input,
    Toggle,
    Dropzone,
    notifications,
  } from "@budibase/bbui"
  import { organisation } from "stores/portal"
  import { post } from "builderStore/api"
  import analytics from "analytics"
  let analyticsDisabled = analytics.disabled()

  function toggleAnalytics() {
    if (analyticsDisabled) {
      analytics.optIn()
    } else {
      analytics.optOut()
    }
  }

  let loading = false
  let file = $organisation.logoUrl
    ? { url: $organisation.logoUrl, type: "image", name: "Logo" }
    : null

  async function uploadLogo() {
    let data = new FormData()
    data.append("file", file)

    const res = await post("/api/admin/configs/upload/settings/logo", data, {})
    return await res.json()
  }

  async function saveConfig() {
    loading = true
    await toggleAnalytics()
    if (file) {
      await uploadLogo()
      await organisation.init()
    }
    const res = await organisation.save({
      company: $organisation.company,
      platformUrl: $organisation.platformUrl,
    })
    if (res.status === 200) {
      notifications.success("Settings saved.")
    } else {
      notifications.error(res.message)
    }
    loading = false
  }
</script>

<div class="container">
  <Layout noPadding>
    <div class="intro">
      <Heading size="M">General</Heading>
      <Body>
        General is the place where you edit your organisation name, logo. You
        can also configure your platform URL as well as turn on or off
        analytics.
      </Body>
    </div>
    <Divider size="S" />
    <div class="information">
      <Heading size="S">Information</Heading>
      <Body>Here you can update your logo and organization name.</Body>
      <div class="fields">
        <div class="field">
          <Label size="L">Organization name</Label>
          <Input thin bind:value={$organisation.company} />
        </div>
        <div class="field logo">
          <Label size="L">Logo</Label>
          <div class="file">
            <Dropzone
              value={[file]}
              on:change={e => {
                file = e.detail?.[0]
              }}
            />
          </div>
        </div>
      </div>
    </div>
    <Divider size="S" />
    <div class="analytics">
      <Heading size="S">Platform</Heading>
      <Body>Here you can set up general platform settings.</Body>
      <div class="fields">
        <div class="field">
          <Label size="L">Platform URL</Label>
          <Input thin bind:value={$organisation.platformUrl} />
        </div>
      </div>
    </div>
    <Divider size="S" />
    <div class="analytics">
      <Heading size="S">Analytics</Heading>
      <Body>
        If you would like to send analytics that help us make Budibase better,
        please let us know below.
      </Body>
      <div class="fields">
        <div class="field">
          <Label size="L">Send Analytics to Budibase</Label>
          <Toggle text="" value={!analyticsDisabled} />
        </div>
      </div>
    </div>
    <div class="save">
      <Button disabled={loading} on:click={saveConfig} cta>Save</Button>
    </div>
  </Layout>
</div>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
    margin-top: var(--spacing-xl);
  }
  .field {
    display: grid;
    grid-template-columns: 32% 1fr;
    align-items: center;
  }
  .file {
    max-width: 30ch;
  }
  .logo {
    align-items: start;
  }
  .intro {
    display: grid;
  }
  .save {
    margin-left: auto;
  }
</style>
