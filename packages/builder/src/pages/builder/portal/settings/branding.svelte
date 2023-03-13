<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    File,
    notifications,
    Tags,
    Tag,
    Button,
    Toggle,
    Input,
    Label,
  } from "@budibase/bbui"
  import { auth, organisation, licensing, admin } from "stores/portal"
  import { API } from "api"
  import { onMount } from "svelte"

  let loaded = false
  let saving = false
  let logoFile = null
  let faviconFile = null

  let config = {}
  let updated = false
  $: onConfigUpdate(config)

  const onConfigUpdate = config => {
    if (!loaded || updated) {
      return
    }
    updated = true
    console.log("config updated ", config)
  }

  $: logo = config.logoUrl
    ? { url: config.logoUrl, type: "image", name: "Logo" }
    : null

  $: favicon = config.faviconUrl
    ? { url: config.logoUrl, type: "image", name: "Favicon" }
    : null

  async function uploadLogo(file) {
    let response = {}
    try {
      let data = new FormData()
      data.append("file", file)
      response = await API.uploadLogo(data)
    } catch (error) {
      notifications.error("Error uploading logo")
    }
    return response
  }

  // Limit file types
  // PNG, GIF, or ICO?
  async function uploadFavicon(file) {
    let response = {}
    try {
      let data = new FormData()
      data.append("file", file)
      response = await API.uploadFavicon(data)
    } catch (error) {
      notifications.error("Error uploading favicon")
    }
    return response
  }

  async function saveConfig() {
    saving = true

    console.log("Save Config")

    if (logoFile) {
      const logoResp = await uploadLogo(logoFile)
      if (logoResp.url) {
        config = {
          ...config,
          logoUrl: logoResp.url,
        }
      } else {
        //would have to delete
      }
    }

    if (faviconFile) {
      const faviconResp = await uploadFavicon(faviconFile)
      if (faviconResp.url) {
        config = {
          ...config,
          faviconUrl: faviconResp.url,
        }
      }
    }
    console.log("SAVE CONFIG ", config)
    try {
      // Update settings
      await organisation.save(config)
      await organisation.init()
      notifications.success("Branding settings updated")
    } catch (e) {
      console.error("Branding updated failed", e)
      notifications.error("Branding updated failed")
    }

    saving = false
  }

  onMount(async () => {
    await organisation.init()

    const {
      faviconUrl,
      logoUrl,
      platformTitle,
      emailBrandingEnabled,
      appFooterEnabled,
      loginHeading,
      loginButton,
      licenceAgreementEnabled,
      testimonialsEnabled,
    } = $organisation

    config = {
      faviconUrl,
      logoUrl,
      platformTitle,
      emailBrandingEnabled,
      appFooterEnabled,
      loginHeading,
      loginButton,
      licenceAgreementEnabled,
      testimonialsEnabled,
    }

    loaded = true
  })
</script>

{#if $auth.isAdmin && loaded}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <div class="title">
        <Heading size="M">Branding</Heading>
        {#if !$licensing.isBusinessPlan}
          <Tags>
            <Tag icon="LockClosed">Business</Tag>
          </Tags>
        {/if}
      </div>
      <Body>Remove all Budibase branding and use your own.</Body>
    </Layout>
    <Divider />
    <div class="branding fields">
      <div class="field">
        <Label size="L">Logo</Label>
        <File
          title="Upload image"
          on:change={e => {
            console.log("Updated Logo")
            let clone = { ...config }
            if (e.detail) {
              logoFile = e.detail
            } else {
              clone.logoUrl = ""
            }
            config = clone
          }}
          value={logo}
        />
      </div>

      <div class="field">
        <Label size="L">Favicon</Label>
        <File
          title="Upload image"
          on:change={e => {
            console.log("Updated Favicon")
            let clone = { ...config }
            if (e.detail) {
              faviconFile = e.detail
            } else {
              clone.faviconUrl = ""
            }
            config = clone
          }}
          value={favicon}
        />
      </div>
      <div class="field">
        <Label size="L">Title</Label>
        <Input
          on:change={e => {
            let clone = { ...config }
            clone.platformTitle = e.detail ? e.detail : ""
            config = clone
          }}
          value={config.platformTitle || "Budibase"}
        />
      </div>
      <div>
        <Toggle
          text={"Remove Buidbase brand from emails"}
          on:change={e => {
            let clone = { ...config }
            clone.emailBrandingEnabled = !e.detail
            config = clone
          }}
          value={!config.emailBrandingEnabled}
        />
        <Toggle
          text={"Remove Budibase footer from apps"}
          on:change={e => {
            let clone = { ...config }
            clone.appFooterEnabled = !e.detail
            config = clone
          }}
          value={!config.appFooterEnabled}
        />
      </div>
    </div>

    <!-- Should this be displayed? -->
    {#if !$admin.cloud}
      <Divider />
      <Layout gap="XS" noPadding>
        <Heading size="S">Login page (Self host)</Heading>
        <Body>You can only customise your login page in self host</Body>
      </Layout>
      <div class="login">
        <div class="fields">
          <div class="field">
            <Label size="L">Header</Label>
            <Input
              on:change={e => {
                let clone = { ...config }
                clone.loginHeading = e.detail ? e.detail : ""
                config = clone
              }}
              value={config.loginHeading || "Log in to Budibase"}
            />
          </div>

          <div class="field">
            <Label size="L">Button</Label>
            <Input
              on:change={e => {
                let clone = { ...config }
                clone.loginButton = e.detail ? e.detail : ""
                config = clone
              }}
              value={config.loginButton || "Log in to Budibase"}
            />
          </div>
          <div>
            <Toggle
              text={"Remove customer testimonials"}
              on:change={e => {
                let clone = { ...config }
                clone.testimonialsEnabled = !e.detail
                config = clone
              }}
              value={!config.testimonialsEnabled}
            />
            <Toggle
              text={"Remove licence agreement"}
              on:change={e => {
                let clone = { ...config }
                clone.licenceAgreementEnabled = !e.detail
                config = clone
              }}
              value={!config.licenceAgreementEnabled}
            />
          </div>
        </div>
      </div>
    {/if}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">Application previews</Heading>
      <Body>Customise the meta tags on your app preview</Body>
    </Layout>
    <div class="app-previews">
      <div class="fields">
        <div class="field">
          <!-- <Label size="L">Header</Label>
            <Input
              on:change={e => {
                let clone = { ...config }
                clone.loginHeading = e.detail ? e.detail : ""
                config = clone
              }}
              value={config.loginHeading || "Log in to Budibase"}
            /> -->
        </div>
      </div>
    </div>
    <div>
      <Button on:click={saveConfig} cta disabled={saving || !updated}>
        Save
      </Button>
    </div>
  </Layout>
{/if}

<style>
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }

  .branding,
  .login {
    width: 60%;
  }
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
