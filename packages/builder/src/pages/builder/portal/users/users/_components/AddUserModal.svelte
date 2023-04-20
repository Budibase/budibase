<script>
  import {
    Label,
    ActionButton,
    ModalContent,
    Multiselect,
    InputDropdown,
    Layout,
    Icon,
  } from "@budibase/bbui"
  import { groups, licensing } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"
  import { emailValidator } from "helpers/validation"

  import { _ } from "../../../../../../../lang/i18n"

  export let showOnboardingTypeModal

  const password = Math.random().toString(36).substring(2, 22)
  let disabled
  let userGroups = []

  $: userData = [
    {
      email: "",
      role: "appUser",
      password,
      forceResetPassword: true,
    },
  ]
  $: hasError = userData.find(x => x.error != null)

  function removeInput(idx) {
    userData = userData.filter((e, i) => i !== idx)
  }
  function addNewInput() {
    userData = [
      ...userData,
      {
        email: "",
        role: "appUser",
        password: Math.random().toString(36).substring(2, 22),
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
      userData[index].error = $_(
        "pages.builder.portal.users.users._components.AppUserModal.enter_email"
      )
    }
    return userData[index].error == null
  }

  const onConfirm = () => {
    let valid = true
    userData.forEach((input, index) => {
      valid = validateInput(input, index) && valid
    })
    if (!valid) {
      return false
    }
    showOnboardingTypeModal({ users: userData, groups: userGroups })
  }
</script>

<ModalContent
  {onConfirm}
  size="M"
  title={$_(
    "pages.builder.portal.users.users._components.AppUserModal.Add_new_users"
  )}
  confirmText={$_(
    "pages.builder.portal.users.users._components.AppUserModal.Add_users"
  )}
  confirmDisabled={disabled}
  cancelText={$_(
    "pages.builder.portal.users.users._components.AppUserModal.Cancel"
  )}
  showCloseIcon={false}
  disabled={hasError || !userData.length}
>
  <Layout noPadding gap="XS">
    <Label
      >{$_(
        "pages.builder.portal.users.users._components.AppUserModal.Adress"
      )}</Label
    >
    {#each userData as input, index}
      <div
        style="display: flex;
        align-items: center;
        flex-direction: row;"
      >
        <div style="width: 90%">
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
            name="Close"
            hoverable
            size="S"
            on:click={() => removeInput(index)}
          />
        </div>
      </div>
    {/each}
    <div>
      <ActionButton on:click={addNewInput} icon="Add"
        >{$_(
          "pages.builder.portal.users.users._components.AppUserModal.Add_email"
        )}</ActionButton
      >
    </div>
  </Layout>

  {#if $licensing.groupsEnabled}
    <Multiselect
      bind:value={userGroups}
      placeholder={$_(
        "pages.builder.portal.users.users._components.AppUserModal.No_groups"
      )}
      label={$_(
        "pages.builder.portal.users.users._components.AppUserModal.Groups"
      )}
      options={$groups}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />
  {/if}
</ModalContent>

<style>
  .icon {
    width: 10%;
    align-self: flex-start;
    margin-top: 8px;
  }
</style>
