<script>
  import {
    Layout,
    Body,
    Heading,
    Divider,
    notifications,
    Input,
    Label,
  } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"
  import { API } from "@/api"

  // Initialize menu settings with proper defaults
  let menuSettings = {
    userLabels: {},
    profileModal: {},
    passwordModal: {},
  }

  // Update menuSettings when app store changes
  $: if ($appStore.menuLabelsSettings) {
    menuSettings = {
      userLabels: $appStore.menuLabelsSettings.userLabels || {},
      profileModal: $appStore.menuLabelsSettings.profileModal || {},
      passwordModal: $appStore.menuLabelsSettings.passwordModal || {},
    }
  }

  let saveTimeout
  const debouncedSave = async () => {
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
      try {
        await API.saveAppMetadata($appStore.appId, {
          menuLabelSettings: menuSettings,
        })
        appStore.update(state => ({
          ...state,
          menuLabelSettings: menuSettings,
        }))
        notifications.success("Settings saved successfully")
      } catch (error) {
        notifications.error("Error updating modal settings")
      }
    }, 2000)
  }

  // Save function that updates specific field
  const saveField = (modalType, settingKey, value) => {
    if (!menuSettings[modalType]) {
      menuSettings[modalType] = {}
    }
    menuSettings[modalType][settingKey] = value
    debouncedSave()
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
          bind:value={menuSettings.userLabels.profileText}
          placeholder="My profile"
          on:input={e => saveField("userLabels", "profileText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Password</Label>
      <div>
        <Input
          bind:value={menuSettings.userLabels.passwordText}
          placeholder="Update password"
          on:input={e =>
            saveField("userLabels", "passwordText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Portal</Label>
      <div>
        <Input
          bind:value={menuSettings.userLabels.portalText}
          placeholder="Go to portal"
          on:input={e => saveField("userLabels", "portalText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Logout</Label>
      <div>
        <Input
          bind:value={menuSettings.userLabels.logoutText}
          placeholder="Log out"
          on:input={e => saveField("userLabels", "logoutText", e.target.value)}
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
          bind:value={menuSettings.profileModal.title}
          placeholder="My profile"
          on:input={e => saveField("profileModal", "title", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Subtitle</Label>
      <div>
        <Input
          bind:value={menuSettings.profileModal.body}
          placeholder="Personalise the platform by adding your first name and last name."
          on:input={e => saveField("profileModal", "body", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Email label</Label>
      <div>
        <Input
          bind:value={menuSettings.profileModal.emailLabel}
          placeholder="Email"
          on:input={e =>
            saveField("profileModal", "emailLabel", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">First name label</Label>
      <div>
        <Input
          bind:value={menuSettings.profileModal.firstNameLabel}
          placeholder="First name"
          on:input={e =>
            saveField("profileModal", "firstNameLabel", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Last name label</Label>
      <div>
        <Input
          bind:value={menuSettings.profileModal.lastNameLabel}
          placeholder="Last name"
          on:input={e =>
            saveField("profileModal", "lastNameLabel", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Save button</Label>
      <div>
        <Input
          bind:value={menuSettings.profileModal.saveText}
          placeholder="Save"
          on:input={e => saveField("profileModal", "saveText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Cancel button</Label>
      <div>
        <Input
          bind:value={menuSettings.profileModal.cancelText}
          placeholder="Cancel"
          on:input={e =>
            saveField("profileModal", "cancelText", e.target.value)}
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
          bind:value={menuSettings.passwordModal.title}
          placeholder="Update password"
          on:input={e => saveField("passwordModal", "title", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Subtitle</Label>
      <div>
        <Input
          bind:value={menuSettings.passwordModal.body}
          placeholder="Enter your new password below."
          on:input={e => saveField("passwordModal", "body", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Password</Label>
      <div>
        <Input
          bind:value={menuSettings.passwordModal.passwordLabel}
          placeholder="Password"
          on:input={e =>
            saveField("passwordModal", "passwordLabel", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Repeat password</Label>
      <div>
        <Input
          bind:value={menuSettings.passwordModal.repeatLabel}
          placeholder="Repeat password"
          on:input={e =>
            saveField("passwordModal", "repeatLabel", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Update password</Label>
      <div>
        <Input
          bind:value={menuSettings.passwordModal.saveText}
          placeholder="Update password"
          on:input={e => saveField("passwordModal", "saveText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Cancel</Label>
      <div>
        <Input
          bind:value={menuSettings.passwordModal.cancelText}
          placeholder="Cancel"
          on:input={e =>
            saveField("passwordModal", "cancelText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Error length</Label>
      <div>
        <Input
          bind:value={menuSettings.passwordModal.minLengthText}
          placeholder="Please enter at least 12 characters. We recommend using machine generated or random passwords."
          on:input={e =>
            saveField("passwordModal", "minLengthText", e.target.value)}
        />
      </div>
    </div>

    <div class="field">
      <Label size="L">Error mismatch</Label>
      <div>
        <Input
          bind:value={menuSettings.passwordModal.mismatchText}
          placeholder="Passwords must match"
          on:input={e =>
            saveField("passwordModal", "mismatchText", e.target.value)}
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
