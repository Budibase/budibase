<script lang="ts">
  import { Body, ModalContent, Table } from "@budibase/bbui"
  import type { InviteUsersResponse } from "@budibase/types"
  import InviteResponseRenderer from "./InviteResponseRenderer.svelte"

  interface Props {
    inviteUsersResponse: InviteUsersResponse
  }

  let { inviteUsersResponse }: Props = $props()
  const hasSuccess = $derived(inviteUsersResponse.successful.length)
  const hasFailure = $derived(inviteUsersResponse.unsuccessful.length)
  const title = $derived(hasSuccess ? "Users invited!" : "Oops!")
  const failureMessage = $derived(
    hasSuccess
      ? "However there was a problem inviting some users."
      : "There was a problem inviting users."
  )
  const unsuccessfulUsers = $derived(
    inviteUsersResponse.unsuccessful.map(user => ({
      email: user.email,
      reason: user.reason,
    }))
  )

  const failedSchema = {
    email: {},
    reason: {},
  }
</script>

<ModalContent size="L" showCancelButton={false} {title} confirmText="Done">
  {#if hasSuccess}
    <Body size="S">
      Your users should now receive an email invite to get access to the
      workspace.
    </Body>
  {/if}
  {#if hasFailure}
    <Body size="S">
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
