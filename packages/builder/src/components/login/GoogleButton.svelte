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
  .inner {
    display: flex;
    flex-direction: row;
    background-color: #4285f4;
    border-radius: 3px;
    padding-right: 12px;
  }

  .inner img {
    width: 24px;
    margin: 1px 14px 1px 1px;
    border-radius: 2px;
    background-color: #fff;
    padding: 8px;
  }

  .inner p {
    margin: 12px 0 0;
  }

  .outer :global(a) {
    text-decoration: none;
    font-weight: bold;
    color: #fff;
  }
</style>
