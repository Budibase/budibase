<script>
  import { onMount } from "svelte"
  import { ActionButton } from "@budibase/bbui"
  import GoogleLogo from "/assets/google-logo.png"
  import { admin } from "stores/portal"

  let show = false

  $: show = $admin.checklist?.oauth
</script>

{#if show}
  <ActionButton>
    <a target="_blank" href="/api/admin/auth/google">
      <div class="inner">
        <img src={GoogleLogo} alt="google icon" />
        <p>Sign in with Google</p>
      </div>
    </a>
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
  a {
    text-decoration: none;
    color: inherit;
  }
</style>
