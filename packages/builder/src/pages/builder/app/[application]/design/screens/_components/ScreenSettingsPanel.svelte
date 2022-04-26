<script>
  import SettingsPanel from "components/design/settings/SettingsPanel.svelte"
  import { get } from "svelte/store"
  import { get as deepGet, setWith } from "lodash"
  import {
    Input,
    Layout,
    Button,
    Toggle,
    Checkbox,
    notifications,
  } from "@budibase/bbui"
  import PropertyControl from "components/design/settings/controls/PropertyControl.svelte"
  import RoleSelect from "components/design/settings/controls/RoleSelect.svelte"
  import { selectedScreen, store } from "builderStore"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"

  let errors = {}

  const routeTaken = url => {
    const roleId = get(selectedScreen)?.routing.roleId || "BASIC"
    return get(store).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const roleTaken = roleId => {
    const url = get(selectedScreen)?.routing.route
    return get(store).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const setScreenSetting = (setting, value) => {
    const { key, parser, validate } = setting

    // Parse value if required
    if (parser) {
      value = parser(value)
    }

    // Validate value if required and determine errors
    if (validate) {
      const error = validate(value)
      errors = {
        ...errors,
        [key]: error,
      }
      if (error) {
        return
      }
    } else {
      errors = {
        ...errors,
        [key]: null,
      }
    }

    // Update screen object in store
    store.update(state => {
      setWith(get(selectedScreen), key.split("."), value, Object)
      return state
    })

    // Save new definition
    try {
      store.actions.preview.saveSelected()
    } catch (error) {
      notifications.error("Error saving screen settings")
    }
  }

  const screenSettings = [
    {
      key: "routing.homeScreen",
      control: Checkbox,
      props: {
        text: "Set as home screen",
      },
    },
    {
      key: "routing.route",
      label: "Route",
      control: Input,
      parser: val => {
        if (!val.startsWith("/")) {
          val = "/" + val
        }
        return sanitizeUrl(val)
      },
      validate: route => {
        const existingRoute = get(selectedScreen)?.routing.route
        if (route !== existingRoute && routeTaken(route)) {
          return "That URL is already in use for this role"
        }
        return null
      },
    },
    {
      key: "routing.roleId",
      label: "Access",
      control: RoleSelect,
      validate: role => {
        const existingRole = get(selectedScreen)?.routing.roleId
        if (role !== existingRole && roleTaken(role)) {
          return "That role is already in use for this URL"
        }
        return null
      },
    },
    {
      key: "showNavigation",
      label: "Navigation",
      control: Toggle,
      props: {
        text: "Show navigation",
      },
    },
  ]
</script>

<SettingsPanel
  title={$selectedScreen?.routing.route}
  icon={$selectedScreen.routing.route === "/" ? "Home" : "WebPage"}
>
  <Layout gap="S" paddingX="L" paddingY="XL">
    {#each screenSettings as setting (setting.key)}
      <PropertyControl
        control={setting.control}
        label={setting.label}
        key={setting.key}
        value={deepGet($selectedScreen, setting.key)}
        onChange={val => setScreenSetting(setting, val)}
        props={{ ...setting.props, error: errors[setting.key] }}
      />
    {/each}
    <Button cta>View components</Button>
  </Layout>
</SettingsPanel>
