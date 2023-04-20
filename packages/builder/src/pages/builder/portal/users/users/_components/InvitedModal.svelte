<script>
  import { Body, ModalContent, Table } from "@budibase/bbui"
  import { onMount } from "svelte"

  import { _ } from "../../../../../../../lang/i18n"

  export let inviteUsersResponse

  let hasSuccess
  let hasFailure
  let title
  let failureMessage

  let unsuccessfulUsers

  const setTitle = () => {
    if (hasSuccess) {
      title = $_(
        "pages.builder.portal.users.users._components.InvitedModal.Users_invited"
      )
    } else if (hasFailure) {
      title = $_(
        "pages.builder.portal.users.users._components.InvitedModal.Oops"
      )
    }
  }

  const setFailureMessage = () => {
    if (hasSuccess) {
      failureMessage = $_(
        "pages.builder.portal.users.users._components.InvitedModal.problem_inviting"
      )
    } else {
      failureMessage = $_(
        "pages.builder.portal.users.users._components.InvitedModal.was_problem"
      )
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

<ModalContent
  size="M"
  showCancelButton={false}
  {title}
  confirmText={$_(
    "pages.builder.portal.users.users._components.InvitedModal.Done"
  )}
>
  {#if hasSuccess}
    <Body size="XS">
      {$_(
        "pages.builder.portal.users.users._components.InvitedModal.receive_invite"
      )}
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
    />
  {/if}
</ModalContent>
