<script lang="ts">
  import { Table, notifications, Layout } from "@budibase/bbui"
  import { licensing } from "@/stores/portal/licensing"
  import { users } from "@/stores/portal/users"
  import { auth } from "@/stores/portal/auth"
  import GroupsTableRenderer from "./_components/GroupsTableRenderer.svelte"
  import RoleTableRenderer from "./_components/RoleTableRenderer.svelte"
  import EmailTableRenderer from "./_components/EmailTableRenderer.svelte"
  import DeleteRowsButton from "@/components/backend/DataTable/buttons/DeleteRowsButton.svelte"
  import { onMount } from "svelte"
  import {
    type InviteWithCode,
    type GetUserInvitesResponse,
  } from "@budibase/types"
  import { sdk } from "@budibase/shared-core"
  import { routeActions } from "../.."

  type ParsedInvite = {
    _id: string
    email: string
    builder?: {
      apps: string[]
    }
    userGroups?: string[]
    apps?: string[]
  }

  let selectedInvites: ParsedInvite[] = []
  let invitesLoaded = false
  let pendingInvites: GetUserInvitesResponse = []
  let parsedInvites: ParsedInvite[] = []
  let customRenderers = [
    { column: "email", component: EmailTableRenderer },
    { column: "userGroups", component: GroupsTableRenderer },
    // { column: "apps", component: AppsTableRenderer },
    { column: "role", component: RoleTableRenderer },
  ]

  $: schema = {
    email: {
      sortable: false,
      width: "2fr",
      minWidth: "200px",
    },
    role: {
      displayName: "Access",
      sortable: false,
      width: "1fr",
    },
    ...($licensing.groupsEnabled && {
      userGroups: { sortable: false, displayName: "Groups", width: "1fr" },
    }),
    apps: {
      sortable: false,
      width: "1fr",
    },
  }

  $: pendingSchema = getPendingSchema(schema)
  $: readonly = $auth.user ? !sdk.users.isAdmin($auth.user) : false
  $: parsedInvites = invitesToSchema(pendingInvites)

  const invitesToSchema = (invites: InviteWithCode[]): ParsedInvite[] => {
    return invites.map(invite => {
      const { admin, builder, userGroups, apps } = invite.info

      return {
        _id: invite.code,
        email: invite.email,
        builder,
        admin,
        userGroups: userGroups,
        apps: apps ? [...new Set(Object.keys(apps))] : undefined,
      }
    })
  }

  const getPendingSchema = (tblSchema: any) => {
    if (!tblSchema) {
      return {}
    }
    let pendingSchema = JSON.parse(JSON.stringify(tblSchema))
    pendingSchema.email.displayName = "Pending Users"
    return pendingSchema
  }

  const deleteUsers = async () => {
    try {
      if (selectedInvites.length > 0) {
        await users.removeInvites(
          selectedInvites.map(invite => ({
            code: invite._id,
          }))
        )
        selectedInvites = []
        pendingInvites = await users.getInvites()
      }

      notifications.success(
        `Successfully deleted ${selectedInvites.length} users`
      )
    } catch (error) {
      notifications.error("Error deleting users")
    }
  }

  onMount(async () => {
    try {
      pendingInvites = await users.getInvites()
      invitesLoaded = true
    } catch (err) {
      notifications.error("Error fetching user invitations")
    }
  })
</script>

<Layout noPadding>
  {#if selectedInvites.length > 0}
    <div use:routeActions class="delete-btn">
      <DeleteRowsButton
        item="user"
        on:updaterows
        selectedRows={[...selectedInvites]}
        deleteRows={deleteUsers}
      />
    </div>
  {/if}
  <Table
    bind:selectedRows={selectedInvites}
    schema={pendingSchema}
    data={parsedInvites}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={!readonly}
    {customRenderers}
    loading={!invitesLoaded}
    allowClickRows={false}
  />
</Layout>

<style>
  .delete-btn {
    justify-content: end;
    display: flex;
  }
</style>
