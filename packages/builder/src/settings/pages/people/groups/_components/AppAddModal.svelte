<script>
  import { keepOpen, Body, ModalContent, Select } from "@budibase/bbui"
  import { appsStore, groups } from "@/stores/portal"
  import { roles } from "@/stores/builder"
  import RoleSelect from "@/components/common/RoleSelect.svelte"

  export let group

  $: assignedAppIds = groups.getGroupAppIds(group)
  $: appOptions = $appsStore.apps
    .filter(app => !assignedAppIds.includes(appsStore.getProdAppID(app.devId)))
    .map(app => ({
      label: app.name,
      value: app,
    }))
  $: confirmDisabled =
    (!selectingRole && !selectedApp) || (selectingRole && !selectedRoleId)
  let selectedApp, selectedRoleId
  let selectingRole = false

  $: if (
    selectedApp &&
    !appOptions.some(option => option.value.devId === selectedApp.devId)
  ) {
    selectedApp = undefined
  }

  async function appSelected() {
    const prodAppId = appsStore.getProdAppID(selectedApp.devId)
    if (!selectingRole) {
      selectingRole = true
      await roles.fetchByAppId(prodAppId)

      return keepOpen
    } else {
      await groups.addApp(group._id, prodAppId, selectedRoleId)
    }
  }
</script>

<ModalContent
  onConfirm={appSelected}
  size="M"
  title="Assign workspace"
  confirmText={selectingRole ? "Assign" : "Next"}
  showSecondaryButton={selectingRole}
  secondaryButtonText="Back"
  secondaryAction={() => (selectingRole = false)}
  disabled={confirmDisabled}
>
  {#if !selectingRole}
    <Body
      >Select a workspace to assign roles for members of <i>"{group.name}"</i
      ></Body
    >
    <Select bind:value={selectedApp} options={appOptions} />
  {:else}
    <Body
      >Select the role that all members of "<i>{group.name}</i>" will have for
      <i>"{selectedApp.name}"</i></Body
    >
    <RoleSelect allowPublic={false} bind:value={selectedRoleId} />
  {/if}
</ModalContent>
