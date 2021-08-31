<script>
  import { ActionButton } from "@budibase/bbui"
  import WechatLogo from "assets/wechat-logo.svg"
  import { auth, organisation } from "stores/portal"
  import { _ as t } from "svelte-i18n"

  let show

  $: tenantId = $auth.tenantId
  $: show = $organisation.wechat
</script>

{#if show}
  <ActionButton
    on:click={() =>
      window.open(`/api/global/auth/${tenantId}/wechat`, "_blank")}
  >
    <div class="inner">
      <img src={WechatLogo} alt="wechat icon" />
      <p>{$t("sign-in-with-wechat")}</p>
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
