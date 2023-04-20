<script>
  import { Body, ModalContent, Table } from "@budibase/bbui"
  import { onMount } from "svelte"

  import { _ } from "../../../../../../../lang/i18n"

  export let deleteUsersResponse

  let successCount
  let failureCount
  let title
  let unsuccessfulUsers
  let message

  const setTitle = () => {
    if (successCount) {
      title = `${successCount} ${$_(
        "pages.builder.portal.users.users._components.DeletionFailureModal.users_deleted"
      )} `
    } else {
      title = $_(
        "pages.builder.portal.users.users._components.DeletionFailureModal.Oops"
      )
    }
  }

  const setMessage = () => {
    if (successCount) {
      message = $_(
        "pages.builder.portal.users.users._components.DeletionFailureModal.problem_deleting"
      )
    } else {
      message = $_(
        "pages.builder.portal.users.users._components.DeletionFailureModal.was_problem"
      )
    }
  }

  const setUsers = () => {
    unsuccessfulUsers = deleteUsersResponse.unsuccessful.map(user => {
      return {
        email: user.email,
        reason: user.reason,
      }
    })
  }

  onMount(() => {
    successCount = deleteUsersResponse.successful.length
    failureCount = deleteUsersResponse.unsuccessful.length
    setTitle()
    setMessage()
    setUsers()
  })

  const schema = {
    email: {},
    reason: {},
  }
</script>

<ModalContent
  size="M"
  {title}
  confirmText={$_(
    "pages.builder.portal.users.users._components.DeletionFailureModal.Close"
  )}
  showCloseIcon={false}
  showCancelButton={false}
>
  <Body size="XS">
    {message}
  </Body>
  <Table
    {schema}
    data={unsuccessfulUsers}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={false}
  />
</ModalContent>

<style>
</style>
