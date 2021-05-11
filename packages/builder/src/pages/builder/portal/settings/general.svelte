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

  $: company = $organisation?.company
  $: logoUrl = $organisation.logoUrl

  async function saveConfig() {
    loading = true
    await toggleAnalytics()
    const res = await organisation.save({ ...$organisation, company })
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
          <Input thin bind:value={company} />
        </div>
        <!-- <div class="field">
          <Label>Logo</Label>
          <div class="file">
            <Dropzone />
          </div>
        </div> -->
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
  .intro {
    display: grid;
  }
  .save {
    margin-left: auto;
  }
</style>
