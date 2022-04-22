<script>
  import { notifications, Select } from "@budibase/bbui"
  import { store } from "builderStore"
  import { get } from "svelte/store"

  const themeOptions = [
    {
      label: "Lightest",
      value: "spectrum--lightest",
    },
    {
      label: "Light",
      value: "spectrum--light",
    },
    {
      label: "Dark",
      value: "spectrum--dark",
    },
    {
      label: "Darkest",
      value: "spectrum--darkest",
    },
  ]

  const onChangeTheme = async theme => {
    try {
      await store.actions.theme.save(theme)
      await store.actions.customTheme.save({
        ...get(store).customTheme,
        navBackground:
          theme === "spectrum--light"
            ? "var(--spectrum-global-color-gray-50)"
            : "var(--spectrum-global-color-gray-100)",
      })
    } catch (error) {
      notifications.error("Error updating theme")
    }
  }
</script>

<div>
  <Select
    value={$store.theme}
    options={themeOptions}
    placeholder={null}
    on:change={e => onChangeTheme(e.detail)}
  />
</div>

<style>
  div {
    width: 100px;
  }
</style>
