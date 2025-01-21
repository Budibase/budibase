<script>
  import Comma from "./Comma.svelte"
  import Period from "./Period.svelte"
  import Space from "./Space.svelte"

  export let value = null

  const punctuation = [" ", ",", "."]

  // TODO regex might work here now
  const getWords = value => {
    if (typeof value !== "string") {
      return []
    }

    const newWords = []
    let lastIndex = 0

    const makeWord = i => {
      // No word to make, multiple spaces, spaces at start of text etc
      if (i - lastIndex > 0) {
        newWords.push(value.substring(lastIndex, i))
      }

      lastIndex = i + 1
    }

    value.split("").forEach((character, i) => {
      if (punctuation.includes(character)) {
        makeWord(i)
        newWords.push(character)
      }
    })

    makeWord(value.length)

    return newWords
  }

  $: words = getWords(value)
</script>

{#each words as word}
  {#if word === " "}
    <Space />
  {:else if word === ","}
    <Comma />
  {:else if word === "."}
    <Period />
  {:else}
    <span class="text">
      {word}
    </span>
  {/if}
{/each}

<style>
  .text {
    /* invisible properties to match other inline text elements that do have borders. If we don't match here we run into subpixel issues */
    box-sizing: border-box;
    border-bottom: 1px solid transparent;
    padding: 1px 0 2px;
  }
</style>
