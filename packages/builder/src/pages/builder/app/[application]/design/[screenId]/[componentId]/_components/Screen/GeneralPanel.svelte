<script>
  import { get } from "svelte/store"
  import { Helpers } from "@budibase/bbui"
  import {
    Input,
    Checkbox,
    Banner,
    Select,
    notifications,
  } from "@budibase/bbui"
  import PropertyControl from "components/design/settings/controls/PropertyControl.svelte"
  import RoleSelect from "components/design/settings/controls/RoleSelect.svelte"
  import { selectedScreen, store } from "builderStore"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import ButtonActionEditor from "components/design/settings/controls/ButtonActionEditor/ButtonActionEditor.svelte"
  import { getBindableProperties } from "builderStore/dataBinding"

  $: bindings = getBindableProperties($selectedScreen, null)

  let errors = {}

  const routeTaken = url => {
    const roleId = get(selectedScreen).routing.roleId || "BASIC"
    return get(store).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const roleTaken = roleId => {
    const url = get(selectedScreen).routing.route
    return get(store).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const setScreenSetting = async (setting, value) => {
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

    // Update screen setting
    try {
      await store.actions.screens.updateSetting(get(selectedScreen), key, value)
    } catch (error) {
      console.log(error)
      notifications.error("Error saving screen settings")
    }
  }

  $: screenSettings = [
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
        const existingRoute = get(selectedScreen).routing.route
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
        const existingRole = get(selectedScreen).routing.roleId
        if (role !== existingRole && roleTaken(role)) {
          return "That role is already in use for this URL"
        }
        return null
      },
    },
    {
      key: "onLoad",
      label: "On screen load",
      control: ButtonActionEditor,
    },
    {
      key: "width",
      label: "Width",
      control: Select,
      props: {
        options: ["Extra small", "Small", "Medium", "Large", "Max"],
        placeholder: "Default",
        disabled: !!$selectedScreen.layoutId,
      },
    },
  ]

  const removeCustomLayout = async () => {
    return store.actions.screens.removeCustomLayout(get(selectedScreen))
  }
</script>

{#if $selectedScreen.layoutId}
  <Banner
    type="warning"
    extraButtonText="Detach custom layout"
    extraButtonAction={removeCustomLayout}
    showCloseButton={false}
  >
    This screen uses a custom layout, which is deprecated
  </Banner>
{/if}
{#each screenSettings as setting (setting.key)}
  <PropertyControl
    control={setting.control}
    label={setting.label}
    key={setting.key}
    value={Helpers.deepGet($selectedScreen, setting.key)}
    onChange={val => setScreenSetting(setting, val)}
    props={{ ...setting.props, error: errors[setting.key] }}
    {bindings}
  />
{/each}
