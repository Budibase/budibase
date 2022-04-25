<script>
  import { selectedScreen } from "builderStore"
  import SettingsPanel from "components/design/SettingsPanel/SettingsPanel.svelte"
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
  import PropertyControl from "components/design/PropertiesPanel/PropertyControls/PropertyControl.svelte"
  import RoleSelect from "components/design/PropertiesPanel/PropertyControls/RoleSelect.svelte"
  import { currentAsset, store, selectedAccessRole } from "builderStore"
  import { FrontendTypes } from "constants"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"

  let errors = {}

  const routeTaken = url => {
    const roleId = get(selectedAccessRole) || "BASIC"
    return get(store).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const roleTaken = roleId => {
    const url = get(currentAsset)?.routing.route
    return get(store).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const setAssetProps = (name, value, parser, validate) => {
    if (parser) {
      value = parser(value)
    }
    if (validate) {
      const error = validate(value)
      errors = {
        ...errors,
        [name]: error,
      }
      if (error) {
        return
      }
    } else {
      errors = {
        ...errors,
        [name]: null,
      }
    }

    const selectedAsset = get(currentAsset)
    store.update(state => {
      if (
        name === "_instanceName" &&
        state.currentFrontEndType === FrontendTypes.SCREEN
      ) {
        selectedAsset.props._instanceName = value
      } else {
        setWith(selectedAsset, name.split("."), value, Object)
      }
      return state
    })

    try {
      store.actions.preview.saveSelected()
    } catch (error) {
      notifications.error("Error saving settings")
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
      validate: val => {
        const exisingValue = get(currentAsset)?.routing.route
        if (val !== exisingValue && routeTaken(val)) {
          return "That URL is already in use for this role"
        }
        return null
      },
    },
    {
      key: "routing.roleId",
      label: "Access",
      control: RoleSelect,
      validate: val => {
        const exisingValue = get(currentAsset)?.routing.roleId
        if (val !== exisingValue && roleTaken(val)) {
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
    {#each screenSettings as def (def.key)}
      <PropertyControl
        control={def.control}
        label={def.label}
        key={def.key}
        value={deepGet($currentAsset, def.key)}
        onChange={val => setAssetProps(def.key, val, def.parser, def.validate)}
        props={{ ...def.props, error: errors[def.key] }}
      />
    {/each}
    <Button cta>View components</Button>
  </Layout>
</SettingsPanel>
