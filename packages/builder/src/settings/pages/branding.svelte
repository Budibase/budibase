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
  let loginBackgroundFile = null
  let loginBackgroundPreview = null
  let portalBackgroundFile = null
  let portalBackgroundPreview = null

  let config = {}
  let updated = false

  $: onConfigUpdate(config)
  $: initialised = Object.keys(config).length > 0

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
  $: loginBackgroundImage = config.loginBackgroundImageUrl
    ? {
        url: config.loginBackgroundImageUrl,
        type: "image",
        name: "Login background",
      }
    : null
  $: portalBackgroundImage = config.portalBackgroundImageUrl
    ? {
        url: config.portalBackgroundImageUrl,
        type: "image",
        name: "Portal background",
      }
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
  $: previewUrl(loginBackgroundFile).then(response => {
    if (response) {
      loginBackgroundPreview = response.result
    }
  })
  $: previewUrl(portalBackgroundFile).then(response => {
    if (response) {
      portalBackgroundPreview = response.result
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

  async function uploadLoginBackground(file) {
    let response = {}
    try {
      let data = new FormData()
      data.append("file", file)
      response = await API.uploadLoginBackgroundImage(data)
    } catch (error) {
      notifications.error("Error uploading login background")
    }
    return response
  }

  async function uploadPortalBackground(file) {
    let response = {}
    try {
      let data = new FormData()
      data.append("file", file)
      response = await API.uploadPortalBackgroundImage(data)
    } catch (error) {
      notifications.error("Error uploading portal background")
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

    if (loginBackgroundFile) {
      const loginBackgroundResp = await uploadLoginBackground(
        loginBackgroundFile
      )
      if (loginBackgroundResp.url) {
        loginBackgroundFile = null
        loginBackgroundPreview = null
      }
      config.loginBackgroundImageUrl = undefined
    }

    if (portalBackgroundFile) {
      const portalBackgroundResp = await uploadPortalBackground(
        portalBackgroundFile
      )
      if (portalBackgroundResp.url) {
        portalBackgroundFile = null
        portalBackgroundPreview = null
      }
      config.portalBackgroundImageUrl = undefined
    }
  }

  function trimFields() {
    const userStrings = [
      "metaTitle",
      "platformTitle",
      "loginButton",
      "loginHeading",
      "loginBackgroundColor",
      "loginFontFamily",
      "loginFontUrl",
      "loginInputBackgroundColor",
      "loginInputTextColor",
      "loginPrimaryColor",
      "loginTextColor",
      "portalBackgroundColor",
      "portalFontFamily",
      "portalFontUrl",
      "portalCardBackgroundColor",
      "portalCardTextColor",
      "portalPrimaryColor",
      "portalTextColor",
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
      loginBackgroundColor: $organisation.loginBackgroundColor,
      loginBackgroundImageUrl: $organisation.loginBackgroundImageUrl,
      loginFontFamily: $organisation.loginFontFamily,
      loginFontUrl: $organisation.loginFontUrl,
      loginInputBackgroundColor: $organisation.loginInputBackgroundColor,
      loginInputTextColor: $organisation.loginInputTextColor,
      loginPrimaryColor: $organisation.loginPrimaryColor,
      loginTextColor: $organisation.loginTextColor,
      portalBackgroundColor: $organisation.portalBackgroundColor,
      portalBackgroundImageUrl: $organisation.portalBackgroundImageUrl,
      portalFontFamily: $organisation.portalFontFamily,
      portalFontUrl: $organisation.portalFontUrl,
      portalCardBackgroundColor: $organisation.portalCardBackgroundColor,
      portalCardTextColor: $organisation.portalCardTextColor,
      portalPrimaryColor: $organisation.portalPrimaryColor,
      portalTextColor: $organisation.portalTextColor,
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
          disabled={saving}
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
          disabled={saving}
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
          disabled={saving}
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
          disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Background color</Label>
          <Input
            placeholder="#ffffff"
            on:change={e => {
              let clone = { ...config }
              clone.loginBackgroundColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginBackgroundColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Text color</Label>
          <Input
            placeholder="#111111"
            on:change={e => {
              let clone = { ...config }
              clone.loginTextColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginTextColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Input background</Label>
          <Input
            placeholder="#ffffff"
            on:change={e => {
              let clone = { ...config }
              clone.loginInputBackgroundColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginInputBackgroundColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Input text color</Label>
          <Input
            placeholder="#111111"
            on:change={e => {
              let clone = { ...config }
              clone.loginInputTextColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginInputTextColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Primary color</Label>
          <Input
            placeholder="#111111"
            on:change={e => {
              let clone = { ...config }
              clone.loginPrimaryColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginPrimaryColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Font family</Label>
          <Input
            placeholder='e.g. "Avenir Next", sans-serif'
            on:change={e => {
              let clone = { ...config }
              clone.loginFontFamily = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginFontFamily || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Font URL</Label>
          <Input
            placeholder="https://fonts.googleapis.com/..."
            on:change={e => {
              let clone = { ...config }
              clone.loginFontUrl = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginFontUrl || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Background image</Label>
          <File
            title="Upload image"
            handleFileTooLarge={() => {
              notifications.warn("File too large. 20mb limit")
            }}
            extensions={imageExtensions}
            previewUrl={loginBackgroundPreview || loginBackgroundImage?.url}
            on:change={e => {
              let clone = { ...config }
              if (e.detail) {
                loginBackgroundFile = e.detail
                loginBackgroundPreview = null
              } else {
                loginBackgroundFile = null
                clone.loginBackgroundImageUrl = ""
              }
              config = clone
            }}
            value={loginBackgroundFile || loginBackgroundImage}
            disabled={saving}
            allowClear={true}
          />
        </div>
      </div>
    </div>
    <Divider noMargin />
    <Layout gap="XS" noPadding>
      <Heading size="XS">Portal page</Heading>
      <Body size="S">Customise the non-admin app portal</Body>
    </Layout>
    <div class="portal">
      <div class="fields">
        <div class="field">
          <Label size="L">Background color</Label>
          <Input
            placeholder="#ffffff"
            on:change={e => {
              let clone = { ...config }
              clone.portalBackgroundColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.portalBackgroundColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Text color</Label>
          <Input
            placeholder="#111111"
            on:change={e => {
              let clone = { ...config }
              clone.portalTextColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.portalTextColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Accent color</Label>
          <Input
            placeholder="#111111"
            on:change={e => {
              let clone = { ...config }
              clone.portalPrimaryColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.portalPrimaryColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Font family</Label>
          <Input
            placeholder='e.g. "Avenir Next", sans-serif'
            on:change={e => {
              let clone = { ...config }
              clone.portalFontFamily = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.portalFontFamily || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Font URL</Label>
          <Input
            placeholder="https://fonts.googleapis.com/..."
            on:change={e => {
              let clone = { ...config }
              clone.portalFontUrl = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.portalFontUrl || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Card background</Label>
          <Input
            placeholder="#ffffff"
            on:change={e => {
              let clone = { ...config }
              clone.portalCardBackgroundColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.portalCardBackgroundColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Card text color</Label>
          <Input
            placeholder="#111111"
            on:change={e => {
              let clone = { ...config }
              clone.portalCardTextColor = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.portalCardTextColor || ""}
            disabled={saving}
          />
        </div>
        <div class="field">
          <Label size="L">Background image</Label>
          <File
            title="Upload image"
            handleFileTooLarge={() => {
              notifications.warn("File too large. 20mb limit")
            }}
            extensions={imageExtensions}
            previewUrl={portalBackgroundPreview || portalBackgroundImage?.url}
            on:change={e => {
              let clone = { ...config }
              if (e.detail) {
                portalBackgroundFile = e.detail
                portalBackgroundPreview = null
              } else {
                portalBackgroundFile = null
                clone.portalBackgroundImageUrl = ""
              }
              config = clone
            }}
            value={portalBackgroundFile || portalBackgroundImage}
            disabled={saving}
            allowClear={true}
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-m);
  }

  .branding,
  .login,
  .portal {
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
