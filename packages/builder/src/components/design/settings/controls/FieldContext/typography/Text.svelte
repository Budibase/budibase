<script>
  import Comma from "./Comma.svelte";
  import Period from "./Period.svelte";
  import Space from "./Space.svelte";

  export let value = null

  const punctuation = [" ", ",", "."]

  const getWords = (value) => {
    if (typeof value !== "string") {
      return [];
    }

    const newWords = [];
    let lastIndex = 0;

    const makeWord = (i) => {
      // No word to make, multiple spaces, spaces at start of text etc
      if (i - lastIndex > 0) {
        newWords.push(value.substring(lastIndex, i));
      }

      lastIndex = i + 1;
    }

    value.split("").forEach((character, i) => {
      if (punctuation.includes(character)) {
        makeWord(i);
        newWords.push(character);
      }
    })

    makeWord(value.length);

    return newWords;
  }

  $: words = getWords(value)
  $: console.log(words);
</script>

{#if words.length}
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
{:else}
  <span class="text"><slot /></span>
{/if}

<style>
  .text {
    flex-shrink: 0;
    line-height: 26px;
    vertical-align: middle;
  }

  .space {
    margin-right: 5px;
  }

  .punctuation {
    color: red;
    font-size: 20px;
  }
</style>
