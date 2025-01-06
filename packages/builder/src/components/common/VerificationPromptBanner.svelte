<script>
  import { notifications, Button, Icon, Body } from "@budibase/bbui"
  import { admin, auth } from "@/stores/portal"

  $: user = $auth.user
  let loading = false
  let complete = false

  const resetPassword = async () => {
    if (loading || complete) return
    loading = true

    try {
      await fetch(`${$admin.accountPortalUrl}/api/auth/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      })

      complete = true
    } catch (e) {
      notifications.error("There was an issue sending your validation email.")
    } finally {
      loading = false
    }
  }
</script>

{#if user?.account?.verified === false}
  <section class="banner">
    <div class="icon">
      <Icon name="Info" />
    </div>
    <div class="copy">
      <Body size="S">
        Please verify your account. We've sent the verification link to <span
          class="email">{user.email}</span
        ></Body
      >
    </div>
    <div class="button" class:disabled={loading || complete}>
      <Button on:click={resetPassword}
        >{complete ? "Email sent" : "Resend email"}</Button
      >
    </div>
  </section>
{/if}

<style>
  .banner {
    flex-shrink: 0;
    display: flex;
    background-color: var(--grey-2);
    height: 48px;
    align-items: center;
    padding: 0 15px;
  }

  .icon {
    margin-right: 15px;
    color: var(--ink);
    display: flex;
  }

  .copy {
    flex-grow: 1;
    overflow: hidden;
  }

  .copy :global(p) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email {
    font-weight: 600;
  }

  .button {
    margin-left: 15px;
  }

  .button :global(button) {
    color: var(--ink);
    background-color: var(--grey-3);
    border: none;
  }

  .button :global(button):hover {
    background-color: var(--grey-4);
  }

  .disabled :global(button) {
    pointer-events: none;
    color: var(--ink);
    background-color: var(--grey-4);
    border: none;
  }
</style>
