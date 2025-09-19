<script>
  import {
    Layout,
    Body,
    Heading,
    Divider,
    notifications,
    Input,
    Label,
    Button,
  } from "@budibase/bbui"
  import { navigationStore as nav } from "@/stores/builder"

  // Ensure navigation settings exist
  $: {
    if (!$nav.UserMenuSettings) {
      $nav.UserMenuSettings = {}
    }
    if (!$nav.UserMenuSettings.userMenu) {
      $nav.UserMenuSettings.userMenu = {}
    }
    if (!$nav.UserMenuSettings.profileModal) {
      $nav.UserMenuSettings.profileModal = {}
    }
    if (!$nav.UserMenuSettings.changePasswordModal) {
      $nav.UserMenuSettings.changePasswordModal = {}
    }
  }

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
    <Body size="S">
      Customise the text and labels shown in user interface modals throughout
      your application.
    </Body>

    <Divider noMargin />

    <div class="section">
      <Heading size="S">Menu labels</Heading>
      <Body size="S">
        Customize the text shown in the user menu throughout your application.
      </Body>
    </div>

    <div class="field">
      <Label size="L">Profile</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.userMenu.profileText}
          placeholder="My profile"
          on:change={e =>
            updateModalSetting("userMenu", "profileText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Password</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.userMenu.passwordText}
          placeholder="Update password"
          on:change={e =>
            updateModalSetting("userMenu", "passwordText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Portal</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.userMenu.portalText}
          placeholder="Go to portal"
          on:change={e =>
            updateModalSetting("userMenu", "portalText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Logout</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.userMenu.logoutText}
          placeholder="Log out"
          on:change={e =>
            updateModalSetting("userMenu", "logoutText", e.target.value)}
        />
      </div>
    </div>

    <Divider noMargin />

    <div class="section">
      <Heading size="S">Profile modal</Heading>
      <Body size="S">
        Customize the text and labels shown in the user profile modal.
      </Body>
    </div>

    <div class="field">
      <Label size="L">Modal title</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.profileModal.title}
          placeholder="My profile"
          on:change={e =>
            updateModalSetting("profileModal", "title", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Subtitle</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.profileModal.body}
          placeholder="Personalise the platform by adding your first name and last name."
          on:change={e =>
            updateModalSetting("profileModal", "body", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Email label</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.profileModal.emailLabel}
          placeholder="Email"
          on:change={e =>
            updateModalSetting("profileModal", "emailLabel", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">First name label</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.profileModal.firstNameLabel}
          placeholder="First name"
          on:change={e =>
            updateModalSetting(
              "profileModal",
              "firstNameLabel",
              e.target.value
            )}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Last name label</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.profileModal.lastNameLabel}
          placeholder="Last name"
          on:change={e =>
            updateModalSetting("profileModal", "lastNameLabel", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Save button</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.profileModal.saveText}
          placeholder="Save"
          on:change={e =>
            updateModalSetting("profileModal", "saveText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Cancel button</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.profileModal.cancelText}
          placeholder="Cancel"
          on:change={e =>
            updateModalSetting("profileModal", "cancelText", e.target.value)}
        />
      </div>
    </div>

    <Divider noMargin />

    <div class="section">
      <Heading size="S">Password modal</Heading>
      <Body size="S">
        Customize the text and labels shown in the change password modal.
      </Body>
    </div>

    <div class="field">
      <Label size="L">Modal title</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.changePasswordModal.title}
          placeholder="Update password"
          on:change={e =>
            updateModalSetting("changePasswordModal", "title", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Subtitle</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.changePasswordModal.body}
          placeholder="Enter your new password below."
          on:change={e =>
            updateModalSetting("changePasswordModal", "body", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Password</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.changePasswordModal.passwordLabel}
          placeholder="Password"
          on:change={e =>
            updateModalSetting(
              "changePasswordModal",
              "passwordLabel",
              e.target.value
            )}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Repeat password</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.changePasswordModal.repeatLabel}
          placeholder="Repeat password"
          on:change={e =>
            updateModalSetting(
              "changePasswordModal",
              "repeatLabel",
              e.target.value
            )}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Update password</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.changePasswordModal.saveText}
          placeholder="Update password"
          on:change={e =>
            updateModalSetting(
              "changePasswordModal",
              "saveText",
              e.target.value
            )}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Cancel</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.changePasswordModal.cancelText}
          placeholder="Cancel"
          on:change={e =>
            updateModalSetting(
              "changePasswordModal",
              "cancelText",
              e.target.value
            )}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Error length</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.changePasswordModal.minLengthText}
          placeholder="Please enter at least 12 characters. We recommend using machine generated or random passwords."
          on:change={e =>
            updateModalSetting(
              "changePasswordModal",
              "minLengthText",
              e.target.value
            )}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Error mismatch</Label>
      <div>
        <Input
          bind:value={$nav.UserMenuSettings.changePasswordModal.mismatchText}
          placeholder="Passwords must match"
          on:change={e =>
            updateModalSetting(
              "changePasswordModal",
              "mismatchText",
              e.target.value
            )}
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

  .field {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .field > div {
    max-width: 300px;
  }
</style>
