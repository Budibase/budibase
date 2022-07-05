<script>
  import {
    ActionButton,
    Layout,
    Label,
    ModalContent,
    Multiselect,
    InputDropdown,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { groups } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  export let disabled
  export let showOnboardingTypeModal

  const dispatch = createEventDispatcher()

  $: userData = [{ email: "", role: "", groups: [], error: null }]

  function addNewInput() {
    userData = [...userData, { email: "", role: "" }]
  }

  function setValue(e) {
    userData.groups = e.detail
  }
</script>

<ModalContent
  onConfirm={() => {
    showOnboardingTypeModal()
    dispatch("change", userData)
  }}
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
    on:change={e => setValue(e)}
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
