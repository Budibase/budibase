<script lang="ts">
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

  const DISPLAY_OPTIONS = [
    { label: "Standalone", value: "standalone" },
    { label: "Fullscreen", value: "fullscreen" },
    { label: "Minimal UI", value: "minimal-ui" },
  ]

  let saving = false
  let screenshotFiles: any[] = []
  let screenshotPreviews: string[] = []
  let pwaEnabled = true
  let pwaBuilderIcons: any = null

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

  function ensureHexFormat(color: string) {
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

  function getCssVariableValue(cssVar: string) {
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

  async function uploadFile(file: any) {
    try {
      const data = new FormData()
      data.append("file", file)
      return await API.uploadBuilderAttachment(data)
    } catch (error) {
      notifications.error("Error uploading file")
      return {}
    }
  }

  async function handlePWABuilderFolder(files: any) {
    try {
      const filesArray = Array.from(files)
      const iconsJsonFile = filesArray.find(
        (file: any) =>
          file.name === "icons.json" ||
          file.webkitRelativePath?.endsWith("/icons.json")
      )

      if (!iconsJsonFile) {
        notifications.error(
          "No icons.json found. Please upload a PWA Builder folder."
        )
        return
      }
      const iconsJsonFileContent = await iconsJsonFile.text()
      const iconsData = JSON.parse(iconsJsonFileContent)

      if (!iconsData.icons || !Array.isArray(iconsData.icons)) {
        notifications.error("Invalid icons.json format")
        return
      }

      const imageFiles = filesArray.filter((file: any) =>
        file.name.endsWith(".png")
      )

      const fileMap: Record<string, any> = {}
      imageFiles.forEach((file: any) => {
        if (file.webkitRelativePath) {
          const path = file.webkitRelativePath.split("/").slice(1).join("/")
          fileMap[path] = file
        } else {
          fileMap[file.name] = file
        }
      })

      const iconsToUpload: Array<{
        file: any
        sizes: string
        type: string
      }> = []

      for (const icon of iconsData.icons) {
        const file = fileMap[icon.src]
        if (file) {
          iconsToUpload.push({
            file,
            sizes: icon.sizes,
            type: icon.type || "image/png",
          })
        }
      }

      if (iconsToUpload.length === 0) {
        notifications.error("No matching icon files found")
        return
      }

      // Upload all icon files
      const uploadPromises = iconsToUpload.map(item => uploadFile(item.file))
      const uploadResults = await Promise.all(uploadPromises)

      // Create manifest entries
      pwaConfig.icons = uploadResults
        .map((result, index) => {
          if (!result || !result[0] || !result[0].key) {
            return null
          }
          return {
            src: result[0].key,
            sizes: iconsToUpload[index].sizes,
            type: iconsToUpload[index].type,
            platform: iconsToUpload[index].platform,
          }
        })
        .filter(Boolean)

      notifications.success(
        `Processed ${pwaConfig.icons.length} icons from PWA Builder`
      )
      pwaBuilderIcons = { name: "PWA Builder Icons", type: "folder" }
    } catch (error: any) {
      console.error("Error processing PWA Builder folder:", error)
      notifications.error(
        "Failed to process PWA Builder folder: " +
          (error.message || "Unknown error")
      )
    }
  }

  async function handleMultipleScreenshots(files: any) {
    try {
      screenshotFiles = Array.from(files)

      // Upload screenshots
      const uploadPromises = screenshotFiles.map(file => uploadFile(file))
      const uploadResults = await Promise.all(uploadPromises)

      // Create screenshot entries
      const uploadedScreenshots = uploadResults
        .map(result => {
          if (!result || !result[0] || !result[0].key) return null
          return {
            src: result[0].key,
            sizes: "1280x720",
            type: "image/png",
          }
        })
        .filter(Boolean)

      if (uploadedScreenshots.length > 0) {
        pwaConfig.screenshots = uploadedScreenshots
        notifications.success(
          `Uploaded ${uploadedScreenshots.length} screenshots`
        )
      }
    } catch (error) {
      console.error("Error processing screenshots:", error)
      notifications.error("Failed to upload screenshots")
    }
  }

  const handleSubmit = async () => {
    try {
      saving = true

      const pwaConfigToSave = {
        ...pwaConfig,
        background_color: getCssVariableValue(pwaConfig.background_color),
        theme_color: getCssVariableValue(pwaConfig.theme_color),
      }

      await API.saveAppMetadata($appStore.appId, { pwa: pwaConfigToSave })
      appStore.update(state => ({ ...state, pwa: pwaConfigToSave }))

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
        <Label size="L">App icons</Label>
        <div>
          <File
            title="Upload PWA Builder folder"
            handleFileTooLarge={() =>
              notifications.error("File too large. 20mb limit")}
            extensions={[".png", ".json"]}
            multiple
            directory
            on:multipleFiles={e => {
              if (e.detail && e.detail.length > 0) {
                handlePWABuilderFolder(e.detail)
              }
            }}
            value={pwaBuilderIcons}
            disabled={!pwaEnabled}
          />
        </div>
      </div>

      <div class="field">
        <Label size="L">Screenshots</Label>
        <div>
          <File
            title="Upload screenshots"
            handleFileTooLarge={() =>
              notifications.error("File too large. 20mb limit")}
            extensions={[".png"]}
            multiple
            on:multipleFiles={e => {
              if (e.detail && e.detail.length > 0) {
                handleMultipleScreenshots(e.detail)
              }
            }}
          />
          <div class="optional-text">(Optional)</div>
        </div>
      </div>

      <div class="field">
        <Label size="L">Background color</Label>
        <div>
          <ColorPicker
            value={pwaConfig.background_color}
            on:change={e => (pwaConfig.background_color = e.detail)}
          />
        </div>
      </div>

      <div class="field">
        <Label size="L">Theme color</Label>
        <div>
          <ColorPicker
            value={pwaConfig.theme_color}
            on:change={e => (pwaConfig.theme_color = e.detail)}
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

  .optional-text ul {
    margin-top: var(--spacing-xs);
    padding-left: var(--spacing-l);
  }

  .optional-text li {
    margin-bottom: var(--spacing-xs);
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
