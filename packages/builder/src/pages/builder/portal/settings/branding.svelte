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
    TextArea,
  } from "@budibase/bbui"
  import { auth, organisation, licensing, admin } from "stores/portal"
  import { API } from "api"
  import { onMount } from "svelte"

  const imageExtensions = [
    ".png",
    ".tiff",
    ".gif",
    ".raw",
    ".jpg",
    ".jpeg",
    ".svg",
    ".bmp",
    ".jfif",
  ]

  const faviconExtensions = [".png", ".ico", ".gif"]

  let loaded = false
  let saving = false

  let logoFile = null
  let logoPreview = null

  let faviconFile = null
  let faviconPreview = null

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
    ? { url: config.faviconUrl, type: "image", name: "Favicon" }
    : null

  //If type of file do this IN the picker
  //If string use the string
  //If object?.url us that
  const previewUrl = async localFile => {
    if (!localFile) {
      return Promise.resolve(null)
    }

    return new Promise(resolve => {
      let reader = new FileReader()
      try {
        reader.onload = e => {
          resolve({
            result: e.target.result,
          })
        }
        reader.readAsDataURL(localFile)
      } catch (error) {
        console.error(error)
        resolve(null)
      }
    })
  }

  $: previewUrl(logoFile).then(response => {
    if (response) {
      logoPreview = response.result
    }
  })

  $: previewUrl(faviconFile).then(response => {
    if (response) {
      faviconPreview = response.result
    }
  })

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
    console.log("SAVING CONFIG ")
    if (logoFile) {
      const logoResp = await uploadLogo(logoFile)
      if (logoResp.url) {
        config = {
          ...config,
          logoUrl: logoResp.url,
        }
        logoFile = null
        logoPreview = null
      }
    }

    if (faviconFile) {
      const faviconResp = await uploadFavicon(faviconFile)
      if (faviconResp.url) {
        config = {
          ...config,
          faviconUrl: faviconResp.url,
        }
        faviconFile = null
        faviconPreview = null
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

    config = {
      faviconUrl: $organisation.faviconUrl,
      logoUrl: $organisation.logoUrl,
      platformTitle: $organisation.platformTitle,
      emailBrandingEnabled: $organisation.emailBrandingEnabled,
      appFooterEnabled: $organisation.appFooterEnabled,
      loginHeading: $organisation.loginHeading,
      loginButton: $organisation.loginButton,
      licenseAgreementEnabled: $organisation.licenseAgreementEnabled,
      testimonialsEnabled: $organisation.testimonialsEnabled,
      metaDescription: $organisation.metaDescription,
      metaImageUrl: $organisation.metaImageUrl,
      metaTitle: $organisation.metaTitle,
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
          handleFileTooLarge={() => {
            notifications.warn("File too large. 20mb limit")
          }}
          extensions={imageExtensions}
          previewUrl={logoPreview || logo?.url}
          on:change={e => {
            console.log("Updated Logo")
            let clone = { ...config }
            if (e.detail) {
              logoFile = e.detail
              logoPreview = null
            } else {
              logoFile = null
              clone.logoUrl = ""
            }
            config = clone
          }}
          value={logoFile || logo}
        />
      </div>

      <div class="field">
        <Label size="L">Favicon</Label>
        <File
          title="Upload image"
          handleFileTooLarge={() => {
            notifications.warn("File too large. 20mb limit")
          }}
          extensions={faviconExtensions}
          previewUrl={faviconPreview || favicon?.url}
          on:change={e => {
            let clone = { ...config }
            if (e.detail) {
              faviconFile = e.detail
              faviconPreview = null
            } else {
              clone.faviconUrl = ""
            }
            config = clone
          }}
          value={faviconFile || favicon}
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
          value={config.platformTitle || ""}
        />
      </div>
      <div>
        <Toggle
          text={"Remove Budibase brand from emails"}
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
              value={config.loginHeading || ""}
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
              value={config.loginButton || ""}
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
              text={"Remove license agreement"}
              on:change={e => {
                let clone = { ...config }
                clone.licenseAgreementEnabled = !e.detail
                config = clone
              }}
              value={!config.licenseAgreementEnabled}
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
          <Label size="L">Image URL</Label>
          <Input
            on:change={e => {
              let clone = { ...config }
              clone.metaImageUrl = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.metaImageUrl}
          />
        </div>
        <div class="field">
          <Label size="L">Title</Label>
          <Input
            on:change={e => {
              let clone = { ...config }
              clone.metaTitle = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.metaTitle}
          />
        </div>
        <div class="field">
          <Label size="L">Description</Label>
          <TextArea
            on:change={e => {
              let clone = { ...config }
              clone.metaDescription = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.metaDescription}
          />
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
    width: 70%;
    max-width: 70%;
  }
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 80px auto;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
