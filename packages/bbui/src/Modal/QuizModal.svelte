<script>
  import ModalContent from "./ModalContent.svelte"
  import Input from "../Form/Input.svelte"

  let modal
  let answer
  let error

  export function show() {
    modal.show()
  }
  export function hide() {
    modal.hide
  }

  function resetState() {
    answer = undefined
    error = undefined
  }

  async function answerQuiz() {
    const correct = answer === "8"
    error = !correct
    return correct
  }
</script>

<ModalContent
  title="Quick Maths"
  bind:this={modal}
  confirmText="Submit"
  onConfirm={answerQuiz}
  on:show={resetState}
>
  {#if error}
    <p class="error">Wrong answer! Try again.</p>
  {/if}
  <p>What is 4 + 4?</p>
  <Input label="Answer" bind:value={answer} />
</ModalContent>

<style>
  p {
    margin: 0;
    font-size: var(--font-size-s);
  }
  p.error {
    color: #e26d69;
    background-color: #ffe6e6;
    padding: 8px;
    border-radius: 4px;
  }
</style>
