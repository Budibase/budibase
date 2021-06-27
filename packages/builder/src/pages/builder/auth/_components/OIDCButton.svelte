<script>
  import { ActionButton } from "@budibase/bbui"
  import { admin } from "stores/portal"

  let show = true

</script>

{#if show}
  <ActionButton
    on:click={() => window.open("/api/admin/auth/oidc", "_blank")}
  >
    <div class="inner">
      <p>Sign in with OIDC</p>
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
