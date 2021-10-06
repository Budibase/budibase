<script>
  import { ModalContent, Body } from "@budibase/bbui"
  import { auth } from "stores/portal"
  import CreateAppModal from "./CreateAppModal.svelte"
  import BudiWorldImage from "assets/budiworld.webp"

  let step = 0
  let template

  function nextStep() {
    step += 1
    return false
  }
</script>

{#if step === 0}
  <ModalContent
    title={`Welcome ${$auth.user?.firstName + "!" || "!"}`}
    confirmText="Next"
    onConfirm={nextStep}
    showCancelButton={false}
    showCloseIcon={false}
  >
    <Body size="S">
      <p>Welcome to Budibase!</p>
      <p>
        We're different from other development tools in some really special
        ways, so we'd like to take you through them.
      </p>
    </Body>
    <img
      alt="Budibase community world"
      class="budibase-world-image"
      src={BudiWorldImage}
    />
  </ModalContent>
{:else if step === 1}
  <CreateAppModal {template} />
{/if}

<style>
  .budibase-world-image {
    height: 200px;
  }
</style>
