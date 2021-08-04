<script>
  import { ActionButton } from "@budibase/bbui"
  import GoogleLogo from "assets/google-logo.png"
  import { organisation } from "stores/portal"

  $: show = $organisation.google
</script>

{#if show}
  <ActionButton
    on:click={() => window.open("/api/admin/auth/google", "_blank")}
  >
    <div class="inner">
      <img src={GoogleLogo} alt="google icon" />
      <p>Sign in with Google</p>
    </div>
  </ActionButton>
{/if}

<style>
  .inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: var(--spacing-xs);
    padding-bottom: var(--spacing-xs);
  }
  .inner img {
    width: 18px;
    margin: 3px 10px 3px 3px;
  }
  .inner p {
    margin: 0;
  }
</style>
