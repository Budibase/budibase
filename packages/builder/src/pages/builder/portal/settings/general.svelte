<script>
  import { object, string } from "yup"
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
  import { api } from "builderStore/api"
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

  let company
  let logoUrl
  let file

  async function uploadLogo() {
    let data = new FormData()
    data.append("files", file)

    const res = await api.post("/api/admin/configs/upload/settings/logo")
  }

  async function saveConfig() {
    loading = true
    await toggleAnalytics()
    console.log("company", company)
    const res = await organisation.save({
      company: company || $organisation?.config?.company,
      // logoUrl,
      // platformUrl,
    })
    if (res.status === 200) {
      notifications.success("General settings saved.")
    } else {
      notifications.danger("Error when saving settings.")
    }
    loading = false
  }
</script>

<div class="container">
  <Layout noPadding>
    <div class="intro">
      <Heading size="M">General</Heading>
      <Body>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic vero, aut
        culpa provident sunt ratione! Voluptas doloremque, dicta nisi velit
        perspiciatis, ratione vel blanditiis totam, nam voluptate repellat
        aperiam fuga!
      </Body>
    </div>
    <Divider size="S" />
    <div class="information">
      <Heading size="S">Information</Heading>
      <Body>Here you can update your logo and organization name.</Body>
      <div class="fields">
        <div class="field">
          <Label size="L">Organization name</Label>
          <Input
            thin
            value={$organisation?.config?.company}
            on:change={e => (company = e.detail)}
          />
        </div>
        <div class="field logo">
          <Label size="L">Logo</Label>
          <div class="file">
            <Dropzone
              label="Select Image"
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
          <Input
            thin
            value={$organisation?.config?.platformUrl ||
              "http://localhost:10000"}
            on:change={e => (company = e.detail)}
          />
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
