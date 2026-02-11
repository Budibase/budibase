<script>
  import {
    keepOpen,
    Label,
    ActionButton,
    ModalContent,
    Multiselect,
    InputDropdown,
    Select,
    RadioGroup,
    PillInput,
    Layout,
    Icon,
  } from "@budibase/bbui"
  import { roles } from "@/stores/builder"
  import { groups } from "@/stores/portal/groups"
  import { licensing } from "@/stores/portal/licensing"
  import { admin } from "@/stores/portal/admin"
  import { organisation } from "@/stores/portal/organisation"
  import { Constants, emailValidator } from "@budibase/frontend-core"
  import { capitalise } from "@/helpers"
  import { OnboardingType } from "@/constants"

  export let showOnboardingTypeModal
  export let workspaceOnly = false
  export let useWorkspaceInviteModal = workspaceOnly
  export let assignToWorkspace = workspaceOnly
  export let inviteTitle = "Invite users to workspace"

  const password = generatePassword(12)
  let userGroups = []
  let emailsInput = []
  let emailError = null
  const maxItems = 15
  let selectedRole = Constants.BudibaseRoles.AppUser
  const builtInEndUserRoles = [Constants.Roles.BASIC, Constants.Roles.ADMIN]
  const excludedRoleIds = [
    ...builtInEndUserRoles,
    Constants.Roles.PUBLIC,
    Constants.Roles.POWER,
    Constants.Roles.CREATOR,
    Constants.Roles.GROUP,
  ]
  $: roleColorLookup = ($roles || []).reduce((acc, role) => {
    acc[role._id] = role.uiMetadata?.color
    return acc
  }, {})
  $: customEndUserRoleOptions = ($roles || [])
    .filter(role => !excludedRoleIds.includes(role._id))
    .map(role => ({
      label: role.uiMetadata?.displayName || role.name || "Custom role",
      value: role._id,
      color:
        role.uiMetadata?.color ||
        "var(--spectrum-global-color-static-magenta-400)",
    }))
  $: endUserRoleOptions = [
    {
      label: "Basic user",
      value: Constants.Roles.BASIC,
      color: roleColorLookup[Constants.Roles.BASIC],
    },
    {
      label: "Admin user",
      value: Constants.Roles.ADMIN,
      color: roleColorLookup[Constants.Roles.ADMIN],
    },
    ...customEndUserRoleOptions,
  ]
  let endUserRole = Constants.Roles.BASIC
  let onboardingType = OnboardingType.EMAIL

  $: userData = [
    {
      email: "",
      role: "appUser",
      password,
      forceResetPassword: true,
    },
  ]
  $: hasError = userData.find(x => x.error != null)
  $: parsedEmails = useWorkspaceInviteModal ? emailsInput : []
  $: userCount =
    $licensing.userCount +
    (useWorkspaceInviteModal ? parsedEmails.length : userData.length)
  $: reached = licensing.usersLimitReached(userCount)
  $: exceeded = licensing.usersLimitExceeded(userCount)
  $: smtpConfigured =
    $admin.loaded && ($admin.cloud || !!$admin.checklist?.smtp?.checked)
  $: emailInviteDisabled = $admin.loaded ? !smtpConfigured : false
  $: passwordInviteDisabled = $organisation.isSSOEnforced
  $: if (emailInviteDisabled && passwordInviteDisabled) {
    onboardingType = null
  } else if (emailInviteDisabled) {
    onboardingType = OnboardingType.PASSWORD
  } else if (passwordInviteDisabled) {
    onboardingType = OnboardingType.EMAIL
  } else if (!onboardingType) {
    onboardingType = OnboardingType.EMAIL
  }
  $: if (!endUserRoleOptions.some(option => option.value === endUserRole)) {
    endUserRole = Constants.Roles.BASIC
  }

  $: internalGroups = $groups?.filter(g => !g?.scimInfo?.isSync)

  function removeInput(idx) {
    userData = userData.filter((e, i) => i !== idx)
  }
  function addNewInput() {
    userData = [
      ...userData,
      {
        email: "",
        role: "appUser",
        password: generatePassword(12),
        forceResetPassword: true,
        error: null,
      },
    ]
  }

  function validateInput(input, index) {
    if (input.email) {
      input.email = input.email.trim()
    }
    const email = input.email
    if (email) {
      const res = emailValidator(email)
      if (res === true) {
        userData[index].error = null
      } else {
        userData[index].error = res
      }
    } else {
      userData[index].error = "Please enter an email address"
    }
    return userData[index].error == null
  }

  function validateWorkspaceEmails() {
    const emails = emailsInput
    if (!emails.length) {
      emailError = null
      return false
    }

    if (emails.length > maxItems) {
      emailError = `Max ${maxItems} users can be invited at once`
      return false
    }

    const invalidEmails = emails.filter(email => emailValidator(email) !== true)

    if (invalidEmails.length) {
      emailError =
        invalidEmails.length === 1
          ? `Invalid email address: ${invalidEmails[0]}`
          : `Invalid email addresses: ${invalidEmails.join(", ")}`
      return false
    }

    emailError = null
    return true
  }

  const handleEmailsChange = () => {
    validateWorkspaceEmails()
  }

  function buildWorkspaceUsers() {
    return emailsInput.map(email => ({
      email,
      role: selectedRole,
      appRole:
        workspaceOnly && selectedRole === Constants.BudibaseRoles.AppUser
          ? endUserRole
          : undefined,
      password: generatePassword(12),
      forceResetPassword: true,
    }))
  }

  function generatePassword(length) {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(36).padStart(2, "0"))
      .join("")
      .slice(0, length)
  }

  const onConfirm = () => {
    if (useWorkspaceInviteModal) {
      const isValid = validateWorkspaceEmails()
      if (!isValid || exceeded || !onboardingType) {
        return keepOpen
      }

      return showOnboardingTypeModal(
        {
          users: buildWorkspaceUsers(),
          groups: userGroups,
          assignToWorkspace,
        },
        onboardingType
      )
    }

    let valid = true
    userData.forEach((input, index) => {
      valid = validateInput(input, index) && valid
    })
    if (!valid) {
      return keepOpen
    }
    showOnboardingTypeModal({
      users: userData,
      groups: userGroups,
      assignToWorkspace,
    })
  }
</script>

<ModalContent
  {onConfirm}
  size="M"
  title={useWorkspaceInviteModal ? undefined : "Add new users"}
  confirmText={useWorkspaceInviteModal ? "Invite users" : "Add users"}
  cancelText="Cancel"
  disableCancelOnConfirm={true}
  showCloseIcon={false}
  disabled={useWorkspaceInviteModal
    ? !parsedEmails.length || exceeded || !onboardingType || !!emailError
    : hasError || !userData.length || exceeded}
>
  <svelte:fragment slot="header">
    {#if useWorkspaceInviteModal}
      <span class="modal-title">
        <Icon
          name="user-plus"
          size="XL"
          color="var(--spectrum-global-color-gray-600)"
        />
        <span>{inviteTitle}</span>
      </span>
    {/if}
  </svelte:fragment>
  {#if useWorkspaceInviteModal}
    <Layout noPadding gap="S">
      <PillInput
        label="Type or paste emails below, separated by commas"
        bind:value={emailsInput}
        error={emailError}
        splitOnSpace={true}
        maxItems={maxItems + 1}
        on:change={handleEmailsChange}
      />

      <div class="role-select">
        <Select
          label="Select role"
          bind:value={selectedRole}
          options={Constants.BudibaseRoleOptions}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          getOptionSubtitle={option => option.subtitle}
          showSelectedSubtitle={true}
        />
      </div>

      {#if workspaceOnly && selectedRole === Constants.BudibaseRoles.AppUser}
        <div class="role-select-compact">
          <Select
            label="Select end user role"
            bind:value={endUserRole}
            options={endUserRoleOptions}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            getOptionColour={option => option.color}
            placeholder={false}
          />
        </div>
      {/if}

      <div class="onboarding">
        <Label>Select onboarding</Label>
        <RadioGroup
          bind:value={onboardingType}
          options={[
            {
              label: "Send email invites",
              subtitle: emailInviteDisabled ? "Requires SMTP setup" : undefined,
              value: OnboardingType.EMAIL,
              disabled: emailInviteDisabled,
            },
            {
              label: "Generate passwords for each user",
              value: OnboardingType.PASSWORD,
              disabled: passwordInviteDisabled,
            },
          ]}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          getOptionSubtitle={option => option.subtitle}
          getOptionDisabled={option => option.disabled}
        />
      </div>

      {#if reached}
        <div class="user-notification">
          <Icon name="info" />
          <span>
            {capitalise($licensing.license.plan.type)} plan is limited to {$licensing.userLimit}
            users. Upgrade your plan to add more users</span
          >
        </div>
      {/if}
    </Layout>
  {:else}
    <Layout noPadding gap="XS">
      <Label>Email address</Label>
      {#each userData as input, index}
        <div
          style="display: flex;
          align-items: center;
          flex-direction: row;"
        >
          <div style="flex: 1 1 auto;">
            <InputDropdown
              inputType="email"
              bind:inputValue={input.email}
              bind:dropdownValue={input.role}
              options={Constants.BudibaseRoleOptions}
              error={input.error}
              on:blur={() => validateInput(input, index)}
            />
          </div>
          <div class="icon">
            <Icon
              name="x"
              hoverable
              size="S"
              on:click={() => removeInput(index)}
            />
          </div>
        </div>
      {/each}

      {#if reached}
        <div class="user-notification">
          <Icon name="info" />
          <span>
            {capitalise($licensing.license.plan.type)} plan is limited to {$licensing.userLimit}
            users. Upgrade your plan to add more users</span
          >
        </div>
      {:else}
        <div>
          <ActionButton on:click={addNewInput} icon="plus"
            >Add email</ActionButton
          >
        </div>
      {/if}
    </Layout>
  {/if}

  {#if !useWorkspaceInviteModal && $licensing.groupsEnabled && internalGroups?.length}
    <Multiselect
      bind:value={userGroups}
      placeholder="No groups"
      label="Groups"
      options={internalGroups}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />
  {/if}
</ModalContent>

<style>
  .user-notification {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--spacing-m);
  }
  .icon {
    width: 10%;
    align-self: flex-start;
    margin-top: 8px;
  }
  .onboarding {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
  .onboarding :global(.spectrum-FieldGroup--vertical) {
    gap: var(--spacing-xs);
  }
  .onboarding :global(.spectrum-Radio-label.radio-label) {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .onboarding :global(.radio-label-subtitle) {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
  .onboarding :global(.spectrum-Radio-button:before) {
    background: var(--spectrum-global-color-black);
    border-color: var(--spectrum-global-color-gray-600);
  }
  .onboarding
    :global(.spectrum-Radio-input:checked + .spectrum-Radio-button:before) {
    border-color: var(--spectrum-global-color-blue-700);
    background:
      radial-gradient(
        circle,
        var(--spectrum-global-color-black) 0 3px,
        transparent 4px
      ),
      var(--spectrum-global-color-blue-700);
  }
  .modal-title {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  .role-select :global(.spectrum-Picker) {
    height: auto;
    align-items: center;
    padding-top: var(--spacing-m);
    padding-bottom: var(--spacing-m);
  }
</style>
