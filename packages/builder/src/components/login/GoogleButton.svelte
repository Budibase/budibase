<script>
  import { ActionButton } from "@budibase/bbui"
  import GoogleLogo from "/assets/google-logo.png"
  import { goto } from "@roxi/routify"
</script>

<ActionButton on:click={() => goto("/api/admin/auth/google")}>
  <div class="inner">
    <img src={GoogleLogo} alt="google icon" />
    <div>Sign in with Google</div>
  </div>
</ActionButton>

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
</style>
