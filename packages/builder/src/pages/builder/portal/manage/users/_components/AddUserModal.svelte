<script>
  import {
    ActionButton,
    Layout,
    Label,
    ModalContent,
    Multiselect,
    notifications,
    InputDropdown,
  } from "@budibase/bbui"
  import { users, groups } from "stores/portal"
  import analytics, { Events } from "analytics"
  import { Constants } from "@budibase/frontend-core"

  export let disabled
  export let showOnboardingTypeModal
  const options = ["Email onboarding", "Basic onboarding"]
  let selected = options[0]
  let builder, admin

  $: userData = [{ email: "", role: "", error: null }]

  /*
  async function createUserFlow() {
    try {
      const res = await users.invite({ email: "", builder, admin })
      notifications.success(res.message)
      analytics.captureEvent(Events.USER.INVITE, { type: selected })
    } catch (error) {
      notifications.error("Error inviting user")
    }
  }
  */
  function addNewInput() {
    userData = [...userData, { email: "", role: "" }]
  }
</script>

<ModalContent
  onConfirm={showOnboardingTypeModal}
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

  <Multiselect
    placeholder="Select User Groups"
    label="User Groups"
    options={$groups}
    getOptionLabel={option => option.name}
    getOptionValue={option => option.name}
  />
</ModalContent>

<style>
  :global(.spectrum-Picker) {
    border-top-left-radius: 0px;
  }
</style>
