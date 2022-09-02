<script>
  import { goto } from "@roxi/routify"
  import { Body, ModalContent, notifications } from "@budibase/bbui"

  import { groups } from "stores/portal"

  export let removeGroup

  async function deleteGroup() {
    try {
      await groups.actions.delete(removeGroup)
      notifications.success(`Group ${removeGroup?.name} deleted`)
      $goto("./")
    } catch (error) {
      notifications.error(`Failed to delete group`)
    }
  }
</script>

<ModalContent
  warning
  onConfirm={deleteGroup}
  title="Delete Group"
  confirmText="Delete group"
  cancelText="Cancel"
  showCloseIcon={false}
>
  <Body>
    Are you sure you want to delete <strong>{removeGroup?.name}</strong>
  </Body>
</ModalContent>
