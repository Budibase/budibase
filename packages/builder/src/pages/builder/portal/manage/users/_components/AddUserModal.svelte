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
  import { groups, auth } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"
  import { emailValidator } from "helpers/validation"

  export let showOnboardingTypeModal
  const password = Math.random().toString(36).substring(2, 22)
  let disabled
  let userGroups = []
  $: errors = []
  $: hasGroupsLicense = $auth.user?.license.features.includes(
    Constants.Features.USER_GROUPS
  )

  $: userData = [
    {
      email: "",
      role: "appUser",
      password,
      forceResetPassword: true,
    },
  ]

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
      },
    ]
  }

  function validateInput(email, index) {
    if (email) {
      if (emailValidator(email) === true) {
        errors[index] = true
        return null
      } else {
        errors[index] = false
        return emailValidator(email)
      }
    }
  }
</script>

<ModalContent
  onConfirm={async () =>
    showOnboardingTypeModal({ users: userData, groups: userGroups })}
  size="M"
  title="Add new user"
  confirmText="Add user"
  confirmDisabled={disabled}
  cancelText="Cancel"
  showCloseIcon={false}
  disabled={errors.some(x => x === false) ||
    userData.some(x => x.email === "" || x.email === null)}
>
  <Layout noPadding gap="XS">
    <Label>Email Address</Label>

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
            options={Constants.BbRoles}
            error={validateInput(input.email, index)}
          />
        </div>
        <div
          class:fix-height={errors.length && !errors[index]}
          class:normal-height={errors.length && !!errors[index]}
          style="width: 10% "
        >
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
      <ActionButton on:click={addNewInput} icon="Add">Add email</ActionButton>
    </div>
  </Layout>

  {#if hasGroupsLicense}
    <Multiselect
      bind:value={userGroups}
      placeholder="Select User Groups"
      label="User Groups"
      options={$groups}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />
  {/if}
</ModalContent>

<style>
  .fix-height {
    margin-bottom: 5%;
  }
  .normal-height {
    margin-bottom: 0%;
  }
</style>
