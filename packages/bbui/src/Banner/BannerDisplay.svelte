<script>
  import "@spectrum-css/toast/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { banner } from "../Stores/banner"
  import Banner from "./Banner.svelte"
  import { fly } from "svelte/transition"
  import TooltipWrapper from "../Tooltip/TooltipWrapper.svelte"
</script>

<Portal target=".banner-container">
  <div class="banner">
    {#each $banner.messages as message}
      <div transition:fly={{ y: -30 }}>
        <Banner
          type={message.type}
          extraButtonText={message.extraButtonText}
          extraButtonAction={message.extraButtonAction}
          on:change={() => {
            if (message.onChange) {
              message.onChange()
            }
          }}
          showCloseButton={typeof message.showCloseButton === "boolean"
            ? message.showCloseButton
            : true}
        >
          <TooltipWrapper tooltip={message.tooltip} disabled={false}>
            {message.message}
          </TooltipWrapper>
        </Banner>
      </div>
    {/each}
  </div>
</Portal>

<style>
  .banner {
    pointer-events: none;
    width: 100%;
  }
</style>
