<script>
  import { Body, ModalContent, Table } from "@budibase/bbui"
  import { onMount } from "svelte"
  import InviteResponseRenderer from "./InviteResponseRenderer.svelte"

  export let inviteUsersResponse

  let hasSuccess
  let hasFailure
  let title
  let failureMessage

  let unsuccessfulUsers

  const setTitle = () => {
    if (hasSuccess) {
      title = "Users invited!"
    } else if (hasFailure) {
      title = "Oops!"
    }
  }

  const setFailureMessage = () => {
    if (hasSuccess) {
      failureMessage = "However there was a problem inviting some users."
    } else {
      failureMessage = "There was a problem inviting users."
    }
  }

  const setUsers = () => {
    unsuccessfulUsers = inviteUsersResponse.unsuccessful.map(user => {
      return {
        email: user.email,
        reason: user.reason,
      }
    })
  }

  onMount(() => {
    hasSuccess = inviteUsersResponse.successful.length
    hasFailure = inviteUsersResponse.unsuccessful.length
    setTitle()
    setFailureMessage()
    setUsers()
  })

  const failedSchema = {
    email: {},
    reason: {},
  }
</script>

<ModalContent size="L" showCancelButton={false} {title} confirmText="Done">
  {#if hasSuccess}
    <Body size="XS">
      Your users should now receive an email invite to get access to their
      Budibase account
    </Body>
  {/if}
  {#if hasFailure}
    <Body size="XS">
      {failureMessage}
    </Body>
    <Table
      schema={failedSchema}
      data={unsuccessfulUsers}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      customRenderers={[
        { column: "reason", component: InviteResponseRenderer },
      ]}
    />
  {/if}
</ModalContent>
