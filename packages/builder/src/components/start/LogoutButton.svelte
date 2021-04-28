<script>
  import { Button } from "@budibase/bbui"
  import { auth } from "stores/backend"
</script>

<Button primary quiet text icon="LogOut" on:click={auth.logout}>Log Out</Button>
