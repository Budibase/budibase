<script>
  import Panel from "components/design/Panel.svelte"
  import { get } from "svelte/store"
  import { Helpers } from "@budibase/bbui"
  import {
    Input,
    Layout,
    Button,
    Toggle,
    Checkbox,
    Banner,
    Select,
    notifications,
  } from "@budibase/bbui"
  import PropertyControl from "components/design/settings/controls/PropertyControl.svelte"
  import RoleSelect from "components/design/settings/controls/RoleSelect.svelte"
  import { selectedScreen, store } from "builderStore"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { goto } from "@roxi/routify"
  import ButtonActionEditor from "components/design/settings/controls/ButtonActionEditor/ButtonActionEditor.svelte"
  import { getBindableProperties } from "builderStore/dataBinding"

  import { _ } from "lang/i18n"

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
      notifications.error(
        $_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Error_saving"
        )
      )
    }
  }

  $: screenSettings = [
    {
      key: "routing.homeScreen",
      control: Checkbox,
      props: {
        text: $_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Set_home"
        ),
      },
    },
    {
      key: "routing.route",
      label: $_(
        "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Route"
      ),
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
          return $_(
            "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.URL_use"
          )
        }
        return null
      },
    },
    {
      key: "routing.roleId",
      label: $_(
        "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Access"
      ),
      control: RoleSelect,
      validate: role => {
        const existingRole = get(selectedScreen).routing.roleId
        if (role !== existingRole && roleTaken(role)) {
          return $_(
            "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.role_use"
          )
        }
        return null
      },
    },
    {
      key: "onLoad",
      label: $_(
        "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.On_load"
      ),
      control: ButtonActionEditor,
    },
    {
      key: "showNavigation",
      label: $_(
        "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Navigation"
      ),
      control: Toggle,
      props: {
        text: $_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Show_navigation"
        ),
        disabled: !!$selectedScreen.layoutId,
      },
    },
    {
      key: "width",
      label: $_(
        "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Width"
      ),
      control: Select,
      props: {
        options: [
          $_(
            "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Extra_small"
          ),
          $_(
            "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Small"
          ),
          $_(
            "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Medium"
          ),
          $_(
            "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Large"
          ),
          $_(
            "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Max"
          ),
        ],
        placeholder: $_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Width"
        ),
        disabled: !!$selectedScreen.layoutId,
      },
    },
  ]

  const removeCustomLayout = async () => {
    return store.actions.screens.removeCustomLayout(get(selectedScreen))
  }
</script>

<Panel
  title={$selectedScreen.routing.route}
  icon={$selectedScreen.routing.route === "/" ? "Home" : "WebPage"}
  borderLeft
>
  <Layout gap="S" paddingX="L" paddingY="XL">
    {#if $selectedScreen.layoutId}
      <Banner
        type="warning"
        extraButtonText={$_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.Detach_layout"
        )}
        extraButtonAction={removeCustomLayout}
        showCloseButton={false}
      >
        {$_(
          "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.screen_uses"
        )}
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
    <Button secondary on:click={() => $goto("../components")}>
      {$_(
        "pages.builder.app.application.design.screenId.screens._components.ScreenSettingsPanel.View_components"
      )}
    </Button>
  </Layout>
</Panel>
