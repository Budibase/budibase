<script>
  import { Avatar } from "@budibase/bbui"
  export let row

  const getInitials = user => {
    let initials = ""
    initials += user.firstName ? user.firstName[0] : ""
    initials += user.lastName ? user.lastName[0] : ""

    return initials === "" ? user.email[0] : initials
  }
</script>

<Avatar size="M" initials={getInitials(row.user)} />
