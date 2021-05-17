<script>
  import { Link } from "@budibase/bbui"
  import GoogleLogo from "/assets/google-logo.png"
</script>

<div class="outer">
  <Link target="_blank" href="/api/admin/auth/google">
    <div class="inner">
      <img src={GoogleLogo} alt="google icon" />
      <p>Sign in with Google</p>
    </div>
  </Link>
</div>

<style>
  .outer {
    border: 1px;
    width: 100%;
  }

  .inner {
    display: flex;
    flex-direction: row;
    align-items: center;

    background-color: var(--background-alt);
    border-radius: 3px;
    padding-top: var(--spacing-xs);
    padding-bottom: var(--spacing-xs);
  }

  .inner img {
    width: 24px;
    margin: 1px 14px 1px 1px;
    border-radius: 2px;
  }

  .inner p {
    margin: 0;
  }

  .outer :global(a) {
    text-decoration: none;
    font-weight: bold;
    color: #fff;
  }
</style>
