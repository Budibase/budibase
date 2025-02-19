<script>
  import { Label, Layout, ColorPicker, notifications } from "@budibase/bbui"
  import {
    themeStore,
    componentStore,
    selectedComponent,
  } from "@/stores/builder"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import ButtonRoundnessSelect from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Screen/ButtonRoundnessSelect.svelte"

  const customTheme = $themeStore.customTheme
  const DefaultAppTheme = $themeStore.theme

  const cssVarMap = {
    primaryColor: "--spectrum-semantic-cta-color-background-default",
    primaryColorHover: "--spectrum-semantic-cta-color-background-hover",
    buttonBorderRadius: "--spectrum-button-primary-m-border-radius",
  }

  $: primaryColorValue = $selectedComponent && getCurrentValue("primaryColor")
  $: primaryColorHoverValue =
    $selectedComponent && getCurrentValue("primaryColorHover")
  $: buttonBorderRadiusValue =
    $selectedComponent && getCurrentValue("buttonBorderRadius")

  const getCurrentValue = property => {
    const cssVar = cssVarMap[property]
    return (
      $selectedComponent?._styles?.normal?.[cssVar] ||
      customTheme[property] ||
      DefaultAppTheme[property]
    )
  }

  const update = async (property, value) => {
    try {
      const styles = {
        [cssVarMap[property]]: value,
      }

      if (property === "primaryColorHover") {
        styles["--spectrum-semantic-cta-color-background-down"] = value
      }

      if (property === "buttonBorderRadius") {
        styles[
          "--spectrum-button-primary-s-border-radius"
        ] = `calc(${value} * 0.9)`
        styles[
          "--spectrum-button-primary-l-border-radius"
        ] = `calc(${value} * 1.25)`
        styles[
          "--spectrum-button-primary-xl-border-radius"
        ] = `calc(${value} * 1.5)`
      }

      componentStore.updateStyles(styles)
    } catch (error) {
      notifications.error("Error updating custom theme")
    }
  }
</script>

<Layout gap="XS">
  <Layout noPadding gap="XS">
    <Label>Button roundness</Label>
    <ButtonRoundnessSelect
      customTheme={{
        buttonBorderRadius: buttonBorderRadiusValue,
      }}
      on:change={e => update("buttonBorderRadius", e.detail)}
    />
  </Layout>
  <Layout noPadding gap="XS">
    <PropertyControl
      label="Accent color"
      control={ColorPicker}
      value={primaryColorValue}
      onChange={val => update("primaryColor", val)}
      props={{
        spectrumTheme: $themeStore.theme,
      }}
    />
    <PropertyControl
      label="Hover"
      control={ColorPicker}
      value={primaryColorHoverValue}
      onChange={val => update("primaryColorHover", val)}
      props={{
        spectrumTheme: $themeStore.theme,
      }}
    />
  </Layout>
</Layout>
