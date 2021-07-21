<script>
  import { redirect } from "@roxi/routify"
  import { auth } from "../stores/portal"

  auth.checkQueryString()

  $redirect(`./builder`)
</script>
