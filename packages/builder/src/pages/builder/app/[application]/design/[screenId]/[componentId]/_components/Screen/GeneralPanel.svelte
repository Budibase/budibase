<script>
  import { get } from "svelte/store"
  import {
    Helpers,
    Input,
    Checkbox,
    Banner,
    Select,
    notifications,
  } from "@budibase/bbui"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import RoleSelect from "@/components/design/settings/controls/RoleSelect.svelte"
  import { selectedScreen, screenStore } from "@/stores/builder"
  import sanitizeUrl from "@/helpers/sanitizeUrl"
  import ButtonActionEditor from "@/components/design/settings/controls/ButtonActionEditor/ButtonActionEditor.svelte"
  import { getBindableProperties } from "@/dataBinding"
  import BarButtonList from "@/components/design/settings/controls/BarButtonList.svelte"

  $: bindings = getBindableProperties($selectedScreen, null)
  $: screenSettings = getScreenSettings($selectedScreen)

  let errors = {}

  const getScreenSettings = screen => {
    let settings = [
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
          const existingRoute = screen.routing.route
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
          const existingRole = screen.routing.roleId
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
          disabled: !!screen.layoutId,
        },
      },
      {
        key: "props.layout",
        label: "Layout",
        defaultValue: "flex",
        control: BarButtonList,
        props: {
          options: [
            {
              barIcon: "ModernGridView",
              value: "flex",
            },
            {
              barIcon: "ViewGrid",
              value: "grid",
            },
          ],
        },
      },
    ]

    return settings
  }

  const routeTaken = url => {
    const roleId = get(selectedScreen).routing.roleId || "BASIC"
    return get(screenStore).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const roleTaken = roleId => {
    const url = get(selectedScreen).routing.route
    return get(screenStore).screens.some(
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
      await screenStore.updateSetting(get(selectedScreen), key, value)
    } catch (error) {
      console.error(error)
      notifications.error("Error saving screen settings")
    }
  }

  const removeCustomLayout = async () => {
    return screenStore.removeCustomLayout(get(selectedScreen))
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
    defaultValue={setting.defaultValue}
    {bindings}
  />
{/each}
