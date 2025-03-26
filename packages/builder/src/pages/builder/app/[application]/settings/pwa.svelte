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
    start_url: "",
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

  async function handlePWAZip(file: File) {
    try {
      const data = new FormData()
      data.append("file", file as any)
      const result = await API.uploadPWAZip(data)

      pwaConfig.icons = result.icons
      notifications.success(
        `Processed ${pwaConfig.icons.length} icons from PWA Builder`
      )
      pwaBuilderIcons = {
        name: file instanceof File ? file.name : "PWA Icons",
        type: "file",
      }
    } catch (error: any) {
      console.error("Error processing PWA Builder zip:", error)
      notifications.error(
        "Failed to process PWA Builder zip: " +
          (error.message || "Unknown error")
      )
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
            title="Upload PWA Builder zip"
            handleFileTooLarge={() =>
              notifications.error("File too large. 20mb limit")}
            extensions={[".zip"]}
            on:change={e => e.detail && handlePWAZip(e.detail)}
            value={pwaBuilderIcons}
            disabled={!pwaEnabled}
          />
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
