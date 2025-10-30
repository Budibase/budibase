<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    File,
    notifications,
    Button,
    Toggle,
    Input,
    Label,
    TextArea,
  } from "@budibase/bbui"
  import { auth } from "@/stores/portal/auth"
  import { organisation } from "@/stores/portal/organisation"
  import { licensing } from "@/stores/portal/licensing"
  import LockedFeature from "@/pages/builder/_components/LockedFeature.svelte"
  import { routeActions } from "@/settings/pages"

  import { API } from "@/api"
  import { onMount } from "svelte"
  import { sdk } from "@budibase/shared-core"

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

  let mounted = false
  let saving = false

  let logoFile = null
  let logoPreview = null
  let faviconFile = null
  let faviconPreview = null

  let config = {}
  let updated = false

  $: onConfigUpdate(config)
  $: initialised = Object.keys(config).length > 0

  $: brandingEnabled = $licensing.brandingEnabled

  const onConfigUpdate = () => {
    if (!mounted || updated || !initialised) {
      return
    }
    updated = true
  }

  $: logo = config.logoUrl
    ? { url: config.logoUrl, type: "image", name: "Logo" }
    : null

  $: favicon = config.faviconUrl
    ? { url: config.faviconUrl, type: "image", name: "Favicon" }
    : null

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

  async function saveFiles() {
    if (logoFile) {
      const logoResp = await uploadLogo(logoFile)
      if (logoResp.url) {
        logoFile = null
        logoPreview = null
      }
      config.logoUrl = undefined
    }

    if (faviconFile) {
      const faviconResp = await uploadFavicon(faviconFile)
      if (faviconResp.url) {
        faviconFile = null
        faviconPreview = null
      }
      config.faviconUrl = undefined
    }
  }

  function trimFields() {
    const userStrings = [
      "metaTitle",
      "platformTitle",
      "loginButton",
      "loginHeading",
      "metaDescription",
      "metaImageUrl",
    ]

    const trimmed = userStrings.reduce((acc, fieldName) => {
      acc[fieldName] = config[fieldName] ? config[fieldName].trim() : undefined
      return acc
    }, {})

    config = {
      ...config,
      ...trimmed,
    }
  }

  async function saveConfig() {
    saving = true

    await saveFiles()
    trimFields()

    try {
      // Update settings
      await organisation.save(config)
      await init()
      notifications.success("Branding settings updated")
    } catch (e) {
      console.error("Branding updated failed", e)
      notifications.error("Branding updated failed")
    }
    updated = false
    saving = false
  }

  async function init() {
    if (!$organisation.loaded) {
      await organisation.init()
    }
    config = {
      faviconUrl: $organisation.faviconUrl,
      logoUrl: $organisation.logoUrl,
      platformTitle: $organisation.platformTitle,
      emailBrandingEnabled: $organisation.emailBrandingEnabled,
      loginHeading: $organisation.loginHeading,
      loginButton: $organisation.loginButton,
      metaDescription: $organisation.metaDescription,
      metaImageUrl: $organisation.metaImageUrl,
      metaTitle: $organisation.metaTitle,
    }
  }

  onMount(async () => {
    await init()
    mounted = true
  })
</script>

<LockedFeature
  title={"Branding"}
  planType={"Premium"}
  description={"Add and manage branding for your account"}
  enabled={brandingEnabled}
  upgradeButtonClick={async () => {
    licensing.goToUpgradePage()
  }}
  showContentWhenDisabled
>
  {#if sdk.users.isAdmin($auth.user) && mounted}
    <Layout noPadding gap="S">
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
            disabled={!brandingEnabled || saving}
            allowClear={true}
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
                faviconFile = null
                clone.faviconUrl = ""
              }
              config = clone
            }}
            value={faviconFile || favicon}
            disabled={!brandingEnabled || saving}
            allowClear={true}
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
            disabled={!brandingEnabled || saving}
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
            disabled={!brandingEnabled || saving}
          />
        </div>
      </div>

      <Divider noMargin />
      <Layout gap="XS" noPadding>
        <Heading size="XS">Login page</Heading>
        <Body />
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
              disabled={!brandingEnabled || saving}
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
              disabled={!brandingEnabled || saving}
            />
          </div>
        </div>
      </div>
      <Divider noMargin />
      <Layout gap="XS" noPadding>
        <Heading size="XS">Application previews</Heading>
        <Body size="S">Customise the meta tags on your app preview</Body>
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
              disabled={!brandingEnabled || saving}
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
              disabled={!brandingEnabled || saving}
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
              disabled={!brandingEnabled || saving}
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <div use:routeActions class="controls">
          <Button
            on:click={saveConfig}
            cta
            disabled={saving || !updated || !$organisation.loaded}
          >
            Save
          </Button>
        </div>
      </div>
    </Layout>
  {/if}
</LockedFeature>

<style>
  .buttons {
    display: flex;
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
