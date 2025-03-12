<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Input,
    TextArea,
    ColorPicker,
    Button,
    Label,
    File,
    notifications,
    Select,
  } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"
  import { API } from "@/api"

  // Only allow PNG files for better PWA compatibility
  const imageExtensions = [".png"]

  let pwaConfig = $appStore.pwa || {
    name: "",
    short_name: "",
    description: "",
    icons: [],
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    display: "standalone",
    start_url: "",
    scope: "",
  }

  let saving = false
  let iconFile = null
  let iconPreview = null

  // Display mode options
  const displayOptions = [
    { label: "Standalone", value: "standalone" },
    { label: "Fullscreen", value: "fullscreen" },
    { label: "Minimal UI", value: "minimal-ui" },
    { label: "Browser", value: "browser" },
  ]

  // Get existing icon if available
  $: icon =
    pwaConfig.icons && pwaConfig.icons.length > 0
      ? { url: pwaConfig.icons[0].src, type: "image", name: "PWA Icon" }
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

  $: previewUrl(iconFile).then(response => {
    if (response) {
      iconPreview = response.result
    }
  })

  async function uploadIcon(file) {
    let response = {}
    try {
      let data = new FormData()
      data.append("file", file)
      response = await API.uploadBuilderAttachment(data)
    } catch (error) {
      notifications.error("Error uploading icon")
      console.error("Error uploading icon:", error)
    }
    return response
  }

  async function saveFiles() {
    if (iconFile) {
      const iconResp = await uploadIcon(iconFile)
      if (iconResp[0]?.url) {
        // Get the full absolute URL
        let iconUrl = iconResp[0].url
        // Ensure the URL is absolute
        if (iconUrl.startsWith("/")) {
          iconUrl = window.location.origin + iconUrl
        }

        // Update the PWA config with the new icon URL
        pwaConfig = {
          ...pwaConfig,
          icons: [
            {
              src: iconUrl,
              sizes: "192x192",
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
    if (!cssVar || !cssVar.startsWith("var(--")) {
      return ensureHexFormat(cssVar)
    }

    const spectrumColors = {
      "var(--spectrum-global-color-gray-50)": "#FFFFFF",
      "var(--spectrum-global-color-gray-75)": "#FAFAFA",
      "var(--spectrum-global-color-gray-100)": "#F5F5F5",
      "var(--spectrum-global-color-gray-200)": "#EAEAEA",
      "var(--spectrum-global-color-gray-300)": "#E1E1E1",
      "var(--spectrum-global-color-gray-400)": "#CACACA",
      "var(--spectrum-global-color-gray-500)": "#B3B3B3",
      "var(--spectrum-global-color-gray-600)": "#8E8E8E",
      "var(--spectrum-global-color-gray-700)": "#6E6E6E",
      "var(--spectrum-global-color-gray-800)": "#4B4B4B",
      "var(--spectrum-global-color-gray-900)": "#2C2C2C",
      "var(--spectrum-global-color-blue-400)": "#2680EB",
      "var(--spectrum-global-color-blue-500)": "#1473E6",
      "var(--spectrum-global-color-blue-600)": "#0D66D0",
      "var(--spectrum-global-color-blue-700)": "#095ABA",
      "var(--spectrum-global-color-red-400)": "#E34850",
      "var(--spectrum-global-color-red-500)": "#D7373F",
      "var(--spectrum-global-color-red-600)": "#C9252D",
      "var(--spectrum-global-color-red-700)": "#BB121A",
      "var(--spectrum-global-color-green-400)": "#2D9D78",
      "var(--spectrum-global-color-green-500)": "#268E6C",
      "var(--spectrum-global-color-green-600)": "#12805C",
      "var(--spectrum-global-color-green-700)": "#107154",
      "var(--spectrum-global-color-orange-400)": "#E68619",
      "var(--spectrum-global-color-orange-500)": "#DA7B11",
      "var(--spectrum-global-color-orange-600)": "#CB6F10",
      "var(--spectrum-global-color-orange-700)": "#BD640D",
      "var(--spectrum-global-color-yellow-400)": "#DFBF00",
      "var(--spectrum-global-color-yellow-500)": "#D2B200",
      "var(--spectrum-global-color-yellow-600)": "#C4A600",
      "var(--spectrum-global-color-yellow-700)": "#B79900",
      "var(--spectrum-global-color-seafoam-400)": "#1B959A",
      "var(--spectrum-global-color-seafoam-500)": "#16878C",
      "var(--spectrum-global-color-seafoam-600)": "#0F797D",
      "var(--spectrum-global-color-seafoam-700)": "#096C6F",
      "var(--spectrum-global-color-indigo-400)": "#6767EC",
      "var(--spectrum-global-color-indigo-500)": "#5C5CE0",
      "var(--spectrum-global-color-indigo-600)": "#5151D3",
      "var(--spectrum-global-color-indigo-700)": "#4646C6",
      "var(--spectrum-global-color-magenta-400)": "#D83790",
      "var(--spectrum-global-color-magenta-500)": "#CE2783",
      "var(--spectrum-global-color-magenta-600)": "#BC1C74",
      "var(--spectrum-global-color-magenta-700)": "#AE0E66",
      "var(--spectrum-global-color-static-white)": "#FFFFFF",
      "var(--spectrum-global-color-static-black)": "#000000",
    }

    try {
      if (spectrumColors[cssVar]) {
        return spectrumColors[cssVar]
      }

      const varName = cssVar.match(/var\((.*?)\)/)[1]
      const computedValue = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim()

      if (computedValue) {
        return ensureHexFormat(computedValue)
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
      console.error("Error saving PWA settings:", error)
    } finally {
      saving = false
    }
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Progressive Web App</Heading>
    <Body>
      Transform your app into an installable, app-like experience with a
      Progressive Web App (PWA). Developers can configure app details, visuals,
      and notifications to create a branded, professional experience for their
      users.
    </Body>
  </Layout>
  <Divider />

  <div class="form">
    <div class="fields">
      <!-- App details section -->
      <div class="section">
        <Heading size="S">App details</Heading>
        <Body size="S">
          Define the identity of your app, including its name, description, and
          how it will appear to users when installed.
        </Body>
      </div>

      <div class="field">
        <Label size="L">App name</Label>
        <Input
          bind:value={pwaConfig.name}
          placeholder="Full name of your app"
        />
      </div>

      <div class="field">
        <Label size="L">Short name</Label>
        <Input
          bind:value={pwaConfig.short_name}
          placeholder="Short name for app icon"
        />
      </div>

      <div class="field">
        <Label size="L">Description</Label>
        <Input
          bind:value={pwaConfig.description}
          placeholder="Describe your app"
        />
      </div>
      <Divider />
      <!-- Appearance section -->
      <div class="section">
        <Heading size="S">Appearance</Heading>
        <Body size="S">
          Make your app visually appealing with a custom icon and theme. These
          settings control how your app appears on splash screens and device
          interfaces.
        </Body>
      </div>

      <div class="field">
        <Label size="L">App Icon</Label>
        <div class="icon-upload">
          <File
            title="Upload 192x192 PNG"
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
            disabled={saving}
            allowClear={true}
          />
          <div class="icon-help">
            <p>Use a 192x192 PNG image</p>
          </div>
        </div>
      </div>

      <div class="field">
        <Label size="L">Background</Label>
        <ColorPicker
          value={pwaConfig.background_color}
          on:change={e => (pwaConfig.background_color = e.detail)}
        />
      </div>

      <div class="field">
        <Label size="L">Theme</Label>
        <ColorPicker
          value={pwaConfig.theme_color}
          on:change={e => (pwaConfig.theme_color = e.detail)}
        />
      </div>
      <Divider />

      <!-- Manifest settings section -->
      <div class="section">
        <Heading size="S">Manifest settings</Heading>
        <Body size="S">
          The manifest settings control how your app behaves once installed.
          These settings define the app's entry point, navigation boundaries,
          and how it appears on the user's device. Configuring these fields
          ensures your app is treated as a native-like application.
        </Body>
      </div>

      <div class="field">
        <Label size="L">Start URL</Label>
        <Input bind:value={pwaConfig.start_url} placeholder="/" />
      </div>

      <div class="field">
        <Label size="L">Display mode</Label>
        <Select bind:value={pwaConfig.display} options={displayOptions} />
      </div>

      <div class="field">
        <Label size="L">Scope</Label>
        <Input bind:value={pwaConfig.scope} placeholder="/" />
      </div>

      <div class="actions">
        <Button cta on:click={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  </div>
</Layout>

<style>
  .form {
    max-width: 600px;
  }

  .fields {
    display: grid;
    grid-gap: var(--spacing-l);
  }

  .field {
    display: grid;
    grid-template-columns: 80px 220px;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .section {
    margin-top: var(--spacing-xl);
  }

  .icon-upload {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .icon-help {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  .icon-help p {
    margin: 0;
  }

  .actions {
    display: flex;
    margin-top: var(--spacing-xl);
  }
</style>
