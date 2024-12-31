<script>
  import { FancyButton } from "@budibase/bbui"
  import GoogleLogo from "assets/google-logo.png"
  import { auth, organisation } from "@/stores/portal"

  export let samePage
  let show

  $: tenantId = $auth.tenantId
  $: show = $organisation.google
</script>

{#if show}
  <FancyButton
    icon={GoogleLogo}
    on:click={() => {
      const url = `/api/global/auth/${tenantId}/google`
      if (samePage) {
        window.location = url
      } else {
        window.open(url, "_blank")
      }
    }}
  >
    Log in with Google
  </FancyButton>
{/if}
