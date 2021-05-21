<script>
  import { redirect } from "@roxi/routify"
  import { auth, email } from "stores/portal"

  // only admins allowed here
  if (!$auth.isAdmin) {
    $redirect("../../../portal")
  }

  email.templates.fetch()
</script>

<slot />
