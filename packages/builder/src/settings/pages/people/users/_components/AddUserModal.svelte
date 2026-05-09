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
    Avatar,
  } from "@budibase/bbui"
  import { API } from "@/api"
  import { groups } from "@/stores/portal/groups"
  import GlobalRoleSelect from "@/components/common/GlobalRoleSelect.svelte"
  import { licensing } from "@/stores/portal/licensing"
  import { admin } from "@/stores/portal/admin"
  import { organisation } from "@/stores/portal/organisation"
  import { roles } from "@/stores/builder"
  import { Constants, emailValidator } from "@budibase/frontend-core"
  import { capitalise } from "@/helpers"
  import { OnboardingType } from "@/constants"
  import { helpers } from "@budibase/shared-core"
  import { onDestroy } from "svelte"

  export let showOnboardingTypeModal
  export let workspaceOnly = false
  export let useWorkspaceInviteModal = workspaceOnly
  export let assignToWorkspace = workspaceOnly
  export let inviteTitle = "Invite users to workspace"

  const password = generatePassword(12)
  let userGroups = []
  let emailsInput = []
  let parsedEmails = []
  let pendingEmailInput = ""
  let emailError = null
  let suggestedUsers = []
  let isSearchingUsers = false
  let userSearchTimeout
  let userSearchId = 0
  let highlightedUserIndex = -1
  const maxItems = 15
  let selectedRole = Constants.BudibaseRoles.Creator
  const builtInEndUserRoles = [Constants.Roles.BASIC, Constants.Roles.ADMIN]
  const excludedRoleIds = [
    ...builtInEndUserRoles,
    Constants.Roles.PUBLIC,
    Constants.Roles.CREATOR,
    Constants.Roles.GROUP,
  ]
  let roleColorLookup = {}
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
  $: {
    if (!useWorkspaceInviteModal) {
      parsedEmails = []
    } else {
      const pendingEmail = pendingEmailInput.trim()
      parsedEmails =
        emailsInput.length === 0 && emailValidator(pendingEmail) === true
          ? [pendingEmail]
          : emailsInput
    }
  }
  $: userCount =
    $licensing.userCount +
    (useWorkspaceInviteModal ? parsedEmails.length : userData.length)
  $: reached = licensing.usersLimitReached(userCount)
  $: exceeded = licensing.usersLimitExceeded(userCount)
  $: smtpConfigured =
    $admin.loaded && ($admin.cloud || !!$admin.checklist?.smtp?.checked)
  $: emailInviteDisabled = $admin.loaded ? !smtpConfigured : false
  $: passwordInviteDisabled = $organisation.isSSOEnforced
  $: onboardingOptions = [
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
  ]
  $: if (emailInviteDisabled && passwordInviteDisabled) {
    onboardingType = null
  } else if (emailInviteDisabled) {
    onboardingType = OnboardingType.PASSWORD
  } else if (passwordInviteDisabled) {
    onboardingType = OnboardingType.EMAIL
  } else if (!onboardingType) {
    onboardingType = OnboardingType.EMAIL
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

  function validateWorkspaceEmails(emails = emailsInput) {
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

  const searchExistingUsers = async search => {
    const nextSearchId = ++userSearchId
    const trimmedSearch = search.trim()
    if (!trimmedSearch) {
      suggestedUsers = []
      return
    }

    isSearchingUsers = true
    try {
      const response = await API.searchUsers({
        query: { fuzzy: { email: trimmedSearch } },
        limit: 8,
      })
      if (nextSearchId !== userSearchId) {
        return
      }
      suggestedUsers = (response.data || []).filter(user => user.email)
      highlightedUserIndex = suggestedUsers.findIndex(
        user => !isSuggestedUserSelected(user)
      )
    } catch (error) {
      if (nextSearchId === userSearchId) {
        suggestedUsers = []
        highlightedUserIndex = -1
      }
    } finally {
      if (nextSearchId === userSearchId) {
        isSearchingUsers = false
      }
    }
  }

  const clearUserSearch = () => {
    clearTimeout(userSearchTimeout)
    userSearchId += 1
    suggestedUsers = []
    highlightedUserIndex = -1
    isSearchingUsers = false
  }

  const handlePendingEmailInput = () => {
    clearTimeout(userSearchTimeout)
    if (!useWorkspaceInviteModal || !pendingEmailInput.trim()) {
      clearUserSearch()
      return
    }
    userSearchTimeout = setTimeout(
      () => searchExistingUsers(pendingEmailInput),
      350
    )
  }

  const selectSuggestedUser = user => {
    if (!user?.email || isSuggestedUserSelected(user)) {
      return
    }
    const nextEmails = [...emailsInput, user.email]
    emailsInput = nextEmails
    pendingEmailInput = ""
    suggestedUsers = []
    highlightedUserIndex = -1
    validateWorkspaceEmails(nextEmails)
  }

  const updateHighlightedUser = direction => {
    if (!suggestedUsers.length) {
      return
    }
    const startIndex = highlightedUserIndex === -1 ? 0 : highlightedUserIndex
    for (let offset = 1; offset <= suggestedUsers.length; offset++) {
      const nextIndex =
        (startIndex + direction * offset + suggestedUsers.length) %
        suggestedUsers.length
      if (!isSuggestedUserSelected(suggestedUsers[nextIndex])) {
        highlightedUserIndex = nextIndex
        return
      }
    }
    highlightedUserIndex = -1
  }

  const isSuggestedUserSelected = user => {
    const userEmail = user?.email?.trim().toLowerCase()
    return emailsInput.some(email => email.trim().toLowerCase() === userEmail)
  }

  const handleEmailPickerKeydown = event => {
    if (!suggestedUsers.length) {
      return
    }

    if (event.detail?.key === "ArrowDown") {
      event.detail.preventDefault()
      updateHighlightedUser(1)
    } else if (event.detail?.key === "ArrowUp") {
      event.detail.preventDefault()
      updateHighlightedUser(-1)
    } else if (
      ["Enter", "Tab"].includes(event.detail?.key) &&
      highlightedUserIndex >= 0
    ) {
      event.detail.preventDefault()
      selectSuggestedUser(suggestedUsers[highlightedUserIndex])
    }
  }

  onDestroy(() => {
    clearTimeout(userSearchTimeout)
  })

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
    <div class="workspace-invite-modal">
      <Layout noPadding gap="S">
        <div class="user-email-picker">
          <PillInput
            label="Type or paste emails below, separated by commas"
            bind:value={emailsInput}
            bind:inputValue={pendingEmailInput}
            error={emailError}
            splitOnSpace={true}
            maxItems={maxItems + 1}
            on:change={handleEmailsChange}
            on:input={handlePendingEmailInput}
            on:keydown={handleEmailPickerKeydown}
            on:blur={clearUserSearch}
          />

          {#if suggestedUsers.length}
            <div class="user-suggestions" role="listbox">
              {#each suggestedUsers as user, index (user._id || user.email)}
                {@const userSelected = isSuggestedUserSelected(user)}
                <button
                  class="user-suggestion"
                  class:is-highlighted={highlightedUserIndex === index}
                  class:is-selected={userSelected}
                  type="button"
                  role="option"
                  disabled={userSelected}
                  aria-disabled={userSelected}
                  aria-selected={highlightedUserIndex === index}
                  on:mouseenter={() => (highlightedUserIndex = index)}
                  on:mousedown|preventDefault={() => selectSuggestedUser(user)}
                >
                  <Avatar
                    size="S"
                    initials={helpers.getUserInitials(user)}
                    color={helpers.getUserColor(user)}
                  />
                  <span class="user-suggestion-details">
                    <span class="user-suggestion-name">
                      {helpers.getUserLabel(user)}
                    </span>
                    <span class="user-suggestion-email">{user.email}</span>
                  </span>
                  {#if userSelected}
                    <span class="user-suggestion-check">
                      <Icon name="check" size="S" />
                    </span>
                  {/if}
                </button>
              {/each}
            </div>
          {:else if isSearchingUsers}
            <div class="user-suggestions loading">Searching...</div>
          {/if}
        </div>

        <GlobalRoleSelect
          bind:value={selectedRole}
          options={Constants.BudibaseRoleOptions}
          size="L"
        />

        {#if workspaceOnly && selectedRole === Constants.BudibaseRoles.AppUser}
          <Select
            label="Select end user role"
            size="L"
            bind:value={endUserRole}
            options={endUserRoleOptions}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            getOptionColour={option => option.color}
            placeholder={false}
          />
        {/if}

        <div class="onboarding">
          <Label size="L">Select onboarding</Label>
          <RadioGroup
            bind:value={onboardingType}
            options={onboardingOptions}
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
    </div>
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
    gap: 0;
  }
  .onboarding :global(.spectrum-Radio-label.radio-label) {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .onboarding :global(.radio-label-subtitle) {
    color: var(--spectrum-global-color-gray-600);
    font-size: 14px;
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
  .workspace-invite-modal :global(.spectrum-Radio-label),
  .workspace-invite-modal :global(.spectrum-Textfield-input),
  .workspace-invite-modal :global(.spectrum-Tags-itemLabel),
  .workspace-invite-modal :global(.error),
  .workspace-invite-modal :global(.radio-label-subtitle) {
    font-size: 14px;
  }
  .workspace-invite-modal :global(.pill-input) {
    gap: 6px;
    padding: 8px;
  }
  .user-email-picker {
    position: relative;
  }
  .user-suggestions {
    position: absolute;
    z-index: 2;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    padding: 4px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: var(--spectrum-global-dimension-size-50);
    background: var(--spectrum-global-color-gray-50);
    box-shadow: 0 1px 4px var(--drop-shadow);
  }
  .user-suggestions.loading {
    color: var(--spectrum-global-color-gray-600);
    font-size: 14px;
    padding: 8px;
  }
  .user-suggestion {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: 6px 8px;
    border: 0;
    border-radius: var(--spectrum-global-dimension-size-50);
    background: transparent;
    color: var(--spectrum-global-color-gray-800);
    text-align: left;
    cursor: pointer;
  }
  .user-suggestion:hover,
  .user-suggestion.is-highlighted {
    background: var(--spectrum-global-color-gray-100);
  }
  .user-suggestion.is-selected {
    color: var(--spectrum-global-color-gray-600);
    cursor: default;
  }
  .user-suggestion.is-selected:hover,
  .user-suggestion.is-selected.is-highlighted {
    background: transparent;
  }
  .user-suggestion-details {
    min-width: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .user-suggestion-name,
  .user-suggestion-email {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .user-suggestion-name {
    font-size: 14px;
    font-weight: 600;
  }
  .user-suggestion-email {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
  .user-suggestion-check {
    display: inline-flex;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
