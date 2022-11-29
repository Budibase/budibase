<script>
  import { Link } from "@budibase/bbui"
</script>

<Link
  href="https://www.budibase.com/?utm_source=budibase-apps-public-screens&utm_medium=badge&utm_campaign=made-in-budibase"
  target="_blank"
>
  <div>
    <img src="https://i.imgur.com/Xhdt1YP.png" alt="Budibase" />
    <p>Made with Budibase</p>
  </div>
</Link>

<style>
  div {
    position: fixed;
    right: 20px;
    bottom: 20px;
    padding: 10px;
    border-radius: 5px;
    background: var(--spectrum-alias-background-color-primary);
    z-index: 999999 !important;
    visibility: visible !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    border-color: var(--spectrum-global-color-gray-300) !important;
    height: 45px;
  }

  p {
    text-decoration: none;
    color: var(--spectrum-global-color-gray-900);
  }

  img {
    height: 20px;
    margin-right: 10px;
  }
</style>
