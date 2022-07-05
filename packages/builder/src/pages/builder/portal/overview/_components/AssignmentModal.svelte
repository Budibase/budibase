<script>
  import { ModalContent, PickerDropdown, ActionButton } from "@budibase/bbui"
  import { users, groups, apps } from "stores/portal"
  import { roles } from "stores/backend"
  import { RoleUtils } from "@budibase/frontend-core"

  export let addData
  $: optionSections = {
    groups: {
      data: $groups,
      getLabel: group => group.name,
      getValue: group => group._id,
      getIcon: group => group.icon,
      getColour: group => group.color,
    },
    users: {
      data: $users,
      getLabel: user => user.email,
      getValue: user => user._id,
      getIcon: user => user.icon,
      getColour: user => user.color,
    },
  }

  $: appData = [{ id: "", role: "" }]

  function addNewInput() {
    appData = [...appData, { id: "", role: "" }]
  }

  $: console.log(appData)
</script>

<ModalContent
  size="M"
  title="Assign users to your app"
  confirmText="Done"
  cancelText="Cancel"
  onConfirm={() => addData(appData)}
  showCloseIcon={false}
>
  {#each appData as input, index}
    <PickerDropdown
      autocomplete
      primaryOptions={optionSections}
      primaryPlaceholder={"Search Users"}
      secondaryOptions={$roles}
      bind:primaryValue={input.id}
      bind:secondaryValue={input.role}
      getPrimaryOptionLabel={group => group.name}
      getPrimaryOptionValue={group => group.name}
      getPrimaryOptionIcon={group => group.icon}
      getPrimaryOptionColour={group => group.colour}
      getSecondaryOptionLabel={role => role.name}
      getSecondaryOptionValue={role => role._id}
      getSecondaryOptionColour={role => RoleUtils.getRoleColour(role._id)}
    />
  {/each}

  <div>
    <ActionButton on:click={addNewInput} icon="Add">Add email</ActionButton>
  </div>
</ModalContent>
