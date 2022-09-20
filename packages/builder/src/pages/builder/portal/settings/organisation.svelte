<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Label,
    Input,
    Dropzone,
    notifications,
    Toggle,
  } from "@budibase/bbui"
  import { auth, organisation, admin } from "stores/portal"
  import { API } from "api"
  import { writable } from "svelte/store"
  import { redirect } from "@roxi/routify"

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin) {
      $redirect("../../portal")
    }
  }

  const values = writable({
    company: $organisation.company,
    platformUrl: $organisation.platformUrl,
    analyticsEnabled: $organisation.analyticsEnabled,
    logo: $organisation.logoUrl
      ? { url: $organisation.logoUrl, type: "image", name: "Logo" }
      : null,
  })
  let loading = false

  async function uploadLogo(file) {
    try {
      let data = new FormData()
      data.append("file", file)
      await API.uploadLogo(data)
    } catch (error) {
      notifications.error("Error uploading logo")
    }
  }

  async function saveConfig() {
    loading = true

    try {
      // Upload logo if required
      if ($values.logo && !$values.logo.url) {
        await uploadLogo($values.logo)
        await organisation.init()
      }

      const config = {
        company: $values.company ?? "",
        platformUrl: $values.platformUrl ?? "",
        analyticsEnabled: $values.analyticsEnabled,
      }

      // Remove logo if required
      if (!$values.logo) {
        config.logoUrl = ""
      }

      // Update settings
      await organisation.save(config)
    } catch (error) {
      notifications.error("Error saving org config")
    }
    loading = false
  }
</script>

{#if $auth.isAdmin}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Organisation</Heading>
      <Body>
        Organisation settings is where you can edit your organisation name and
        logo. You can also configure your platform URL and enable or disable
        analytics.
      </Body>
    </Layout>
    <Divider size="S" />
    <Layout gap="XS" noPadding>
      <Heading size="S">Information</Heading>
      <Body size="S">Here you can update your logo and organization name.</Body>
    </Layout>
    <div class="fields">
      <div class="field">
        <Label size="L">Org. name</Label>
        <Input thin bind:value={$values.company} />
      </div>
      <div class="field logo">
        <Label size="L">Logo</Label>
        <div class="file">
          <Dropzone
            value={[$values.logo]}
            on:change={e => {
              if (!e.detail || e.detail.length === 0) {
                $values.logo = null
              } else {
                $values.logo = e.detail[0]
              }
            }}
          />
        </div>
      </div>
    </div>
    {#if !$admin.cloud}
      <Divider size="S" />
      <Layout gap="XS" noPadding>
        <Heading size="S">Platform</Heading>
        <Body size="S">Here you can set up general platform settings.</Body>
      </Layout>
      <div class="fields">
        <div class="field">
          <Label
            size="L"
            tooltip={"Update the Platform URL to match your Budibase web URL. This keeps email templates and authentication configs up to date."}
          >
            Platform URL
          </Label>
          <Input thin bind:value={$values.platformUrl} />
        </div>
      </div>
    {/if}
    {#if !$admin.cloud}
      <Divider size="S" />
      <Layout gap="XS" noPadding>
        <Heading size="S">Analytics</Heading>
        <Body size="S">Choose whether to opt-in or opt-out of analytics.</Body>
      </Layout>
      <div class="fields">
        <div class="field">
          <Label size="L">Analytics</Label>
          <Toggle text="" bind:value={$values.analyticsEnabled} />
        </div>
      </div>
    {/if}
    <div>
      <Button disabled={loading} on:click={saveConfig} cta>Save</Button>
    </div>
  </Layout>
{/if}

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }

  .field {
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .file {
    max-width: 30ch;
  }

  .logo {
    align-items: start;
  }
</style>
