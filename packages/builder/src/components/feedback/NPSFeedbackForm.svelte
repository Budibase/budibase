<script>
  import analytics from "analytics"
  import { createEventDispatcher } from "svelte"
  import { fade, fly } from "svelte/transition"
  import {
    ActionButton,
    ClearButton,
    RadioGroup,
    TextArea,
    ButtonGroup,
    Button,
    Heading,
    Detail,
    Divider,
    Layout,
  } from "@budibase/bbui"
  import { auth } from "stores/portal"

  let step = 0
  let ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let options = [
    "Importing / managing data",
    "Designing",
    "Automations",
    "Managing users / groups",
    "Deployment / hosting",
    "Documentation",
  ]

  const dispatch = createEventDispatcher()

  // Data to send off
  let rating
  let improvements
  let comment

  function selectNumber(n) {
    rating = n
    step = 1
  }

  function submitFeedback() {
    analytics.submitFeedback({
      rating,
      improvements,
      comment,
    })
    auth.updateSelf({
      flags: {
        feedbackSubmitted: true,
      },
    })
    dispatch("complete")
  }

  function cancelFeedback() {
    auth.updateSelf({
      flags: {
        feedbackSubmitted: true,
      },
    })
    dispatch("complete")
  }
</script>

<div
  class="position"
  in:fade={{ duration: 200 }}
  out:fade|local={{ duration: 200 }}
>
  <div
    class="feedback-frame"
    in:fly={{ y: 30, duration: 200 }}
    out:fly|local={{ y: 30, duration: 200 }}
  >
    <div class="close">
      <ClearButton on:click={cancelFeedback} />
    </div>
    <Layout gap="XS">
      {#if step === 0}
        <Heading size="XS"
          >How likely are you to recommend Budibase to a colleague?</Heading
        >
        <Divider />
        <div class="ratings">
          {#each ratings as number}
            <ActionButton
              size="L"
              emphasized
              selected={number === rating}
              on:click={() => selectNumber(number)}
            >
              {number}
            </ActionButton>
          {/each}
        </div>
        <div class="footer">
          <Detail size="S">NOT LIKELY</Detail>
          <Detail size="S">EXTREMELY LIKELY</Detail>
        </div>
      {:else if step === 1}
        <Heading size="XS">What could be improved most in Budibase?</Heading>
        <Divider />
        <RadioGroup bind:value={improvements} {options} />
        <div class="footer">
          <Detail size="S">STEP 2 OF 3</Detail>
          <ButtonGroup>
            <Button secondary on:click={() => (step -= 1)}>Previous</Button>
            <Button
              disabled={!improvements}
              primary
              on:click={() => (step += 1)}>Next</Button
            >
          </ButtonGroup>
        </div>
      {:else}
        <Heading size="XS">How can we improve your experience?</Heading>
        <Divider />
        <TextArea bind:value={comment} placeholder="Add comments" />
        <div class="footer">
          <Detail size="S">STEP 3 OF 3</Detail>
          <ButtonGroup>
            <Button secondary on:click={() => (step -= 1)}>Previous</Button>
            <Button disabled={!comment} cta on:click={submitFeedback}
              >Complete</Button
            >
          </ButtonGroup>
        </div>
      {/if}
    </Layout>
  </div>
</div>

<style>
  .feedback-frame :global(textarea) {
    min-height: 180px !important;
  }

  .position {
    position: absolute;
    right: var(--spacing-l);
    bottom: calc(5 * var(--spacing-xl));
  }
  .feedback-frame {
    position: absolute;
    bottom: 0;
    right: 0;
    min-width: 510px;
    background: var(--background);
    border-radius: var(--spectrum-global-dimension-size-50);
    border: 2px solid var(--spectrum-global-color-blue-400);
    padding: var(--spacing-xl);
  }
  .ratings {
    display: flex;
    justify-content: space-between;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
