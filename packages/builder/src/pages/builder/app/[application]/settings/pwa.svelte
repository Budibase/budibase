<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Input,
    ColorPicker,
    Button,
    Label,
    File,
    notifications,
    Select,
    Tags,
    Tag,
  } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"

  import { API } from "@/api"

  const imageExtensions = [".png"]

  let pwaConfig = $appStore.pwa || {
    name: "",
    short_name: "",
    description: "",
    icons: [],
    screenshots: [],
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    display: "standalone",
  }

  let saving = false
  let iconFile = null
  let iconPreview = null
  let screenshotFile = null
  let screenshotPreview = null

  const displayOptions = [
    { label: "Standalone", value: "standalone" },
    { label: "Fullscreen", value: "fullscreen" },
    { label: "Minimal UI", value: "minimal-ui" },
  ]

  // Get existing icon if available
  $: icon =
    pwaConfig.icons && pwaConfig.icons.length > 0
      ? { url: pwaConfig.icons[0].src, type: "image", name: "PWA Icon" }
      : null

  // Get existing screenshots
  $: screenshot =
    pwaConfig.screenshots && pwaConfig.screenshots.length > 0
      ? {
          url: pwaConfig.screenshots[0].src,
          type: "image",
          name: "PWA Screenshot",
        }
      : null

  $: pwaEnabled = true

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

  $: previewUrl(iconFile).then(response => {
    if (response) {
      iconPreview = response.result
    }
  })

  $: previewUrl(screenshotFile).then(response => {
    if (response) {
      screenshotPreview = response.result
    }
  })

  async function uploadFile(file) {
    let response = {}
    try {
      let data = new FormData()
      data.append("file", file)
      response = await API.uploadBuilderAttachment(data)
    } catch (error) {
      notifications.error("Error uploading file")
    }
    return response
  }

  async function saveFiles() {
    if (iconFile) {
      const iconResp = await uploadFile(iconFile)
      if (iconResp[0]?.key) {
        const iconKey = iconResp[0].key

        pwaConfig = {
          ...pwaConfig,
          icons: [
            {
              src: iconKey,
              sizes: "192x192",
              type: "image/png",
            },
          ],
        }
      }
    }

    if (screenshotFile) {
      const screenshotResp = await uploadFile(screenshotFile)
      if (screenshotResp[0]?.key) {
        const screenshotKey = screenshotResp[0].key

        pwaConfig = {
          ...pwaConfig,
          screenshots: [
            {
              src: screenshotKey,
              sizes: "1280x720",
              type: "image/png",
            },
          ],
        }
      }
    }
  }

  function ensureHexFormat(color) {
    if (!color) return "#FFFFFF"

    if (color.startsWith("#")) return color

    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, "0")
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, "0")
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, "0")
      return `#${r}${g}${b}`.toUpperCase()
    }

    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/)
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, "0")
      const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, "0")
      const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, "0")
      return `#${r}${g}${b}`.toUpperCase()
    }

    return "#FFFFFF"
  }

  function getCssVariableValue(cssVar) {
    try {
      if (cssVar && cssVar.startsWith("#")) {
        return cssVar
      }

      const varMatch = cssVar.match(/var\((.*?)\)/)
      if (!varMatch) {
        return ensureHexFormat(cssVar)
      }

      const varName = varMatch[1]
      const computedValue = ensureHexFormat(
        getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim()
      )

      if (computedValue) {
        return computedValue
      }

      return "#FFFFFF"
    } catch (error) {
      console.error("Error converting CSS variable:", error)
      return "#FFFFFF"
    }
  }

  const handleSubmit = async () => {
    try {
      saving = true

      await saveFiles()

      const bgColor = getCssVariableValue(pwaConfig.background_color)
      const themeColor = getCssVariableValue(pwaConfig.theme_color)

      const pwaConfigToSave = {
        ...pwaConfig,
        background_color: bgColor,
        theme_color: themeColor,
      }

      await API.saveAppMetadata($appStore.appId, { pwa: pwaConfigToSave })

      appStore.update(state => ({
        ...state,
        pwa: pwaConfigToSave,
      }))

      notifications.success("PWA settings saved successfully")
    } catch (error) {
      notifications.error("Error saving PWA settings")
    } finally {
      saving = false
    }
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="title-section">
      <Heading>Progressive Web App</Heading>
      {#if !pwaEnabled}
        <Tags>
          <Tag icon="LockClosed">Enterprise</Tag>
        </Tags>
      {/if}
    </div>
    <Body>
      Transform your app into an installable, app-like experience with a
      Progressive Web App (PWA). Developers can configure app details and
      visuals to create a branded, professional experience for their users.
    </Body>
  </Layout>
  <Divider />

  <div class="form" class:disabled={!pwaEnabled}>
    <div class="fields">
      <div class="section">
        <Heading size="S">App details</Heading>

        <Body size="S">
          Define the identity of your app, including its name, description, and
          how it will appear to users when installed.
        </Body>
      </div>

      <div class="field">
        <Label size="L">App name</Label>
        <div>
          <Input
            bind:value={pwaConfig.name}
            placeholder="Full name of your app"
            disabled={!pwaEnabled}
          />
        </div>
      </div>

      <div class="field">
        <Label size="L">Short name</Label>
        <div>
          <Input
            bind:value={pwaConfig.short_name}
            placeholder="Short name for app icon"
            disabled={!pwaEnabled}
          />
        </div>
      </div>

      <div class="field">
        <Label size="L">Description</Label>
        <div>
          <Input
            bind:value={pwaConfig.description}
            placeholder="Describe your app"
            disabled={!pwaEnabled}
          />
        </div>
      </div>
      <Divider />
      <div class="section">
        <Heading size="S">Appearance</Heading>
        <Body size="S">
          Make your app visually appealing with a custom icon and theme. These
          settings control how your app appears on splash screens and device
          interfaces.
        </Body>
      </div>

      <div class="field">
        <Label size="L">App icon</Label>
        <div>
          <File
            title="Upload icon"
            handleFileTooLarge={() => {
              notifications.warn("File too large. 20mb limit")
            }}
            extensions={imageExtensions}
            previewUrl={iconPreview || icon?.url}
            on:change={e => {
              if (e.detail) {
                iconFile = e.detail
                iconPreview = null
              } else {
                iconFile = null
                iconPreview = null
                pwaConfig = {
                  ...pwaConfig,
                  icons: [],
                }
              }
            }}
            value={iconFile || icon}
            disabled={!pwaEnabled}
            allowClear={true}
          />
        </div>
      </div>

      <div class="field">
        <Label size="L">Screenshot</Label>
        <div>
          <File
            title="Upload screenshots"
            handleFileTooLarge={() => {
              notifications.warn("File too large. 20mb limit")
            }}
            extensions={imageExtensions}
            previewUrl={screenshotPreview || screenshot?.url}
            on:change={e => {
              if (e.detail) {
                screenshotFile = e.detail
                screenshotPreview = null
              } else {
                screenshotFile = null
                screenshotPreview = null
                pwaConfig = {
                  ...pwaConfig,
                  screenshots: [],
                }
              }
            }}
            value={screenshotFile || screenshot}
            disabled={!pwaEnabled}
            allowClear={true}
          />
          <div class="optional-text">(Optional)</div>
        </div>
      </div>

      <div class="field">
        <Label size="L">Background colour</Label>
        <div>
          <ColorPicker
            value={pwaConfig.background_color}
            on:change={e => {
              pwaConfig.background_color = e.detail
            }}
            disabled={!pwaEnabled}
          />
        </div>
      </div>

      <div class="field">
        <Label size="L">Theme colour</Label>
        <div>
          <ColorPicker
            value={pwaConfig.theme_color}
            on:change={e => (pwaConfig.theme_color = e.detail)}
            disabled={!pwaEnabled}
          />
        </div>
      </div>
      <Divider />

      <div class="section">
        <Heading size="S">Manifest settings</Heading>
        <Body size="S">
          The manifest settings control how your app behaves once installed.
          These settings define how it appears on the user's device. Configuring
          these fields ensures your app is treated as a native-like application.
        </Body>
      </div>

      <div class="field">
        <Label size="L">Display mode</Label>
        <div>
          <Select
            bind:value={pwaConfig.display}
            options={displayOptions}
            disabled={!pwaEnabled}
          />
        </div>
      </div>

      <div class="actions">
        <Button cta on:click={handleSubmit} disabled={!pwaEnabled}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  </div>
</Layout>

<style>
  .form {
    max-width: 100%;
    position: relative;
  }

  .disabled {
    pointer-events: none;
  }

  .fields {
    display: grid;
    grid-gap: var(--spacing-l);
    opacity: var(--form-opacity, 1);
  }

  .disabled .fields {
    --form-opacity: 0.2;
  }

  .field {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .field > div {
    max-width: 300px;
  }

  .section {
    margin-top: var(--spacing-xl);
  }

  .title-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }

  .optional-text {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    margin-top: 4px;
  }

  .actions {
    display: flex;
    margin-top: var(--spacing-xl);
  }
</style>
