<script>
  import {
    Label,
    ActionButton,
    ModalContent,
    Multiselect,
    InputDropdown,
    Layout,
  } from "@budibase/bbui"
  import { groups, auth } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  export let showOnboardingTypeModal
  const password = Math.random().toString(36).substring(2, 22)
  let disabled
  let userGroups = []

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
>
  <Layout noPadding gap="XS">
    <Label>Email Address</Label>

    {#each userData as input, index}
      <InputDropdown
        inputType="email"
        bind:inputValue={input.email}
        bind:dropdownValue={input.role}
        options={Constants.BbRoles}
        error={input.error}
      />
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
  :global(.spectrum-Picker) {
    border-top-left-radius: 0px;
  }
</style>
