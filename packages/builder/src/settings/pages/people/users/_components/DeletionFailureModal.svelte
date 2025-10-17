<script>
  import { Body, ModalContent, Table } from "@budibase/bbui"
  import { onMount } from "svelte"

  export let deleteUsersResponse

  let successCount
  let title
  let unsuccessfulUsers
  let message

  const setTitle = () => {
    if (successCount) {
      title = `${successCount} users deleted`
    } else {
      title = "Oops!"
    }
  }

  const setMessage = () => {
    if (successCount) {
      message = "However there was a problem deleting some users."
    } else {
      message = "There was a problem deleting some users."
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
  confirmText="Close"
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
