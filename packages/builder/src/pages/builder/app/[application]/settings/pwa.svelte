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

  const IMAGE_EXTENSIONS = [".png"]
  const DISPLAY_OPTIONS = [
    { label: "Standalone", value: "standalone" },
    { label: "Fullscreen", value: "fullscreen" },
    { label: "Minimal UI", value: "minimal-ui" },
  ]

  let saving = false
  let iconFile
  let iconPreview
  let screenshotFiles = []
  let screenshotPreviews = []
  let pwaEnabled = true

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

  $: icon = pwaConfig.icons?.[0]?.src
    ? { url: pwaConfig.icons[0].src, type: "image", name: "PWA Icon" }
    : null

  $: screenshots =
    pwaConfig.screenshots?.length > 0
      ? pwaConfig.screenshots.map(screenshot => ({
          url: screenshot.src,
          type: "image",
          name: "PWA Screenshot",
        }))
      : []

  const previewUrl = file => {
    if (!file) return Promise.resolve(null)

    return new Promise(resolve => {
      const reader = new FileReader()
      try {
        reader.onload = e => resolve({ result: e.target.result })
        reader.readAsDataURL(file)
      } catch (error) {
        console.error(error)
        resolve(null)
      }
    })
  }

  $: previewUrl(iconFile).then(response => {
    if (response) iconPreview = response.result
  })

  async function handleMultipleScreenshots(files) {
    screenshotFiles = files
    screenshotPreviews = new Array(files.length).fill(null)

    for (let i = 0; i < files.length; i++) {
      const preview = await previewUrl(files[i])
      if (preview) {
        screenshotPreviews[i] = preview.result
        screenshotPreviews = [...screenshotPreviews]
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
      if (cssVar?.startsWith("#")) return cssVar

      const varMatch = cssVar?.match(/var\((.*?)\)/)
      if (!varMatch) return ensureHexFormat(cssVar)

      const varName = varMatch[1]
      return ensureHexFormat(
        getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim()
      )
    } catch (error) {
      console.error("Error converting CSS variable:", error)
      return "#FFFFFF"
    }
  }

  async function uploadFile(file) {
    try {
      const data = new FormData()
      data.append("file", file)
      return await API.uploadBuilderAttachment(data)
    } catch (error) {
      notifications.error("Error uploading file")
      return {}
    }
  }

  async function saveFiles() {
    if (iconFile) {
      const iconResp = await uploadFile(iconFile)
      if (iconResp[0]?.key) {
        pwaConfig.icons = [
          {
            src: iconResp[0].key,
            sizes: "192x192",
            type: "image/png",
          },
        ]
      }
    }

    if (screenshotFiles.length > 0) {
      const uploadedScreenshots = []

      for (const file of screenshotFiles) {
        const screenshotResp = await uploadFile(file)
        if (screenshotResp[0]?.key) {
          uploadedScreenshots.push({
            src: screenshotResp[0].key,
            sizes: "1280x720",
            type: "image/png",
          })
        }
      }
      pwaConfig.screenshots = uploadedScreenshots
    }
  }

  const handleSubmit = async () => {
    try {
      saving = true
      await saveFiles()

      const pwaConfigToSave = {
        ...pwaConfig,
        background_color: getCssVariableValue(pwaConfig.background_color),
        theme_color: getCssVariableValue(pwaConfig.theme_color),
      }

      await API.saveAppMetadata($appStore.appId, { pwa: pwaConfigToSave })
      appStore.update(state => ({ ...state, pwa: pwaConfigToSave }))

      // Clear file upload state after successful save
      screenshotFiles = []
      screenshotPreviews = []
      iconFile = null
      iconPreview = null

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
      <!-- App Details Section -->
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

      <!-- Appearance Section -->
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
            handleFileTooLarge={() =>
              notifications.warn("File too large. 20mb limit")}
            extensions={IMAGE_EXTENSIONS}
            previewUrl={iconPreview || icon?.url}
            on:change={e => {
              if (e.detail) {
                iconFile = e.detail
                iconPreview = null
              } else {
                iconFile = null
                iconPreview = null
                pwaConfig.icons = []
              }
            }}
            value={iconFile || icon}
            disabled={!pwaEnabled}
            allowClear={true}
          />
        </div>
      </div>

      <div class="field">
        <Label size="L">Screenshots</Label>
        <div>
          <File
            title="Upload screenshots"
            handleFileTooLarge={() =>
              notifications.warn("File too large. 20mb limit")}
            extensions={IMAGE_EXTENSIONS}
            multiple
            value={screenshotFiles.length ? screenshotFiles : screenshots}
            previewUrl={screenshotFiles.length
              ? screenshotPreviews
              : screenshots.map(s => s.url)}
            on:multipleFiles={e => handleMultipleScreenshots(e.detail)}
            disabled={!pwaEnabled}
          />
          <div class="optional-text">(Optional)</div>
        </div>
      </div>

      <div class="field">
        <Label size="L">Background colour</Label>
        <div>
          <ColorPicker
            value={pwaConfig.background_color}
            on:change={e => (pwaConfig.background_color = e.detail)}
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

      <!-- Manifest Settings Section -->
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
            options={DISPLAY_OPTIONS}
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

  .optional-text {
    font-size: 0.8em;
    color: var(--spectrum-global-color-gray-700);
    margin-top: var(--spacing-xs);
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

  .actions {
    display: flex;
    margin-top: var(--spacing-xl);
  }
</style>
