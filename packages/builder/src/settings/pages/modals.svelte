<script>
  import { Layout, Body, Heading, Divider, notifications } from "@budibase/bbui"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { getBindableProperties } from "@/dataBinding"
  import {
    selectedScreen,
    componentStore,
    navigationStore as nav,
  } from "@/stores/builder"

  $: bindings = getBindableProperties(
    $selectedScreen,
    $componentStore.selectedComponentId
  )

  const updateModalSetting = async (modalType, settingKey, value) => {
    try {
      let navigation = $nav
      if (!navigation.UserMenuSettings) {
        navigation.UserMenuSettings = {}
      }
      if (!navigation.UserMenuSettings[modalType]) {
        navigation.UserMenuSettings[modalType] = {}
      }
      navigation.UserMenuSettings[modalType][settingKey] = value
      await nav.save(navigation)
    } catch (error) {
      notifications.error("Error updating modal settings")
    }
  }
</script>

<Layout noPadding>
  <div class="settings">
    <Heading size="M">User Interface</Heading>
    <Body>
      Customise the text and labels shown in user interface modals throughout
      your application.
    </Body>

    <Divider />

    <div class="section">
      <Heading size="S">User Menu</Heading>
      <div class="controls">
        <PropertyControl
          label="Profile text"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.userMenu?.profileText}
          onChange={text => updateModalSetting("userMenu", "profileText", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "My profile",
          }}
        />
        <PropertyControl
          label="Password text"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.userMenu?.passwordText}
          onChange={text =>
            updateModalSetting("userMenu", "passwordText", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Update password",
          }}
        />
        <PropertyControl
          label="Portal text"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.userMenu?.portalText}
          onChange={text => updateModalSetting("userMenu", "portalText", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Go to portal",
          }}
        />
        <PropertyControl
          label="Logout text"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.userMenu?.logoutText}
          onChange={text => updateModalSetting("userMenu", "logoutText", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Log out",
          }}
        />
      </div>
    </div>

    <Divider />

    <div class="section">
      <Heading size="S">Profile Modal</Heading>
      <div class="controls">
        <PropertyControl
          label="Modal title"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.profileModal?.title}
          onChange={text => updateModalSetting("profileModal", "title", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "My profile",
          }}
        />
        <PropertyControl
          label="Body text"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.profileModal?.body}
          onChange={text => updateModalSetting("profileModal", "body", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder:
              "Personalise the platform by adding your first name and last name.",
          }}
        />
        <PropertyControl
          label="Email label"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.profileModal?.emailLabel}
          onChange={text =>
            updateModalSetting("profileModal", "emailLabel", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Email",
          }}
        />
        <PropertyControl
          label="First name label"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.profileModal?.firstNameLabel}
          onChange={text =>
            updateModalSetting("profileModal", "firstNameLabel", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "First name",
          }}
        />
        <PropertyControl
          label="Last name label"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.profileModal?.lastNameLabel}
          onChange={text =>
            updateModalSetting("profileModal", "lastNameLabel", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Last name",
          }}
        />
        <PropertyControl
          label="Save button text"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.profileModal?.saveText}
          onChange={text =>
            updateModalSetting("profileModal", "saveText", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Save",
          }}
        />
      </div>
    </div>

    <Divider />

    <div class="section">
      <Heading size="S">Change Password Modal</Heading>
      <div class="controls">
        <PropertyControl
          label="Modal title"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.changePasswordModal?.title}
          onChange={text =>
            updateModalSetting("changePasswordModal", "title", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Update password",
          }}
        />
        <PropertyControl
          label="Body text"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.changePasswordModal?.body}
          onChange={text =>
            updateModalSetting("changePasswordModal", "body", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Enter your new password below.",
          }}
        />
        <PropertyControl
          label="Password label"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.changePasswordModal?.passwordLabel}
          onChange={text =>
            updateModalSetting("changePasswordModal", "passwordLabel", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Password",
          }}
        />
        <PropertyControl
          label="Repeat password label"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.changePasswordModal?.repeatLabel}
          onChange={text =>
            updateModalSetting("changePasswordModal", "repeatLabel", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Repeat password",
          }}
        />
        <PropertyControl
          label="Save button text"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.changePasswordModal?.saveText}
          onChange={text =>
            updateModalSetting("changePasswordModal", "saveText", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Update password",
          }}
        />
        <PropertyControl
          label="Minimum length message"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.changePasswordModal?.minLengthText}
          onChange={text =>
            updateModalSetting("changePasswordModal", "minLengthText", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder:
              "Please enter at least {minLength} characters. We recommend using machine generated or random passwords.",
          }}
        />
        <PropertyControl
          label="Password mismatch message"
          control={DrawerBindableInput}
          value={$nav.UserMenuSettings?.changePasswordModal?.mismatchText}
          onChange={text =>
            updateModalSetting("changePasswordModal", "mismatchText", text)}
          {bindings}
          props={{
            updateOnChange: false,
            placeholder: "Passwords must match",
          }}
        />
      </div>
    </div>
  </div>
</Layout>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
