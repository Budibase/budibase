<script>
  import { TextButton as Button, Modal } from "@budibase/bbui"
  import { auth } from "stores/backend"
</script>

<div>
  <Button text on:click={auth.logout}>
    <i class="ri-logout-box-line" />
    <p>Logout</p>
  </Button>
</div>

<style>
  div i {
    font-size: 26px;
    color: var(--grey-7);
    margin-left: 12px;
    margin-top: 10px;
  }

  div p {
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    color: var(--ink);
    font-weight: 400;
    margin: 0 0 0 12px;
  }
</style>
