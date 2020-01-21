<script>
  let snippets = [];
  let current_snippet = 0;
  let snippet_text = ''
  let id = 0;

  function save_snippet() {
    if (!snippet_text) return;

    const index = snippets.findIndex(({ id }) => current_snippet === id);

    if (index > -1) {
      snippets[index].snippet = snippet_text;
    } else {
      snippets = snippets.concat({ snippet: snippet_text , id: id });
    }
    snippet_text = '';
    current_snippet = ++id;
  }

  function edit_snippet(id) {
    const { snippet, id: _id } = snippets.find(({ id:_id }) => _id === id);
    current_snippet = id
    snippet_text = snippet;
  }
</script>

<h3>Code</h3>

<p>Use the code box below to add snippets of javascript to enhance your webapp</p>

<div class="editor">
  <textarea bind:value={snippet_text} />
  <button on:click={save_snippet}>Save</button>
</div>

<div class="snippets">
  <h3>Snippets added</h3>
  {#each snippets as { id, snippet } }
  <div class="snippet">
    <pre>{snippet}</pre>
    <button on:click={() => edit_snippet(id)}>Edit</button>
  </div>
  {/each}
</div>

<style>
  h3 {
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 700;
    color: #8997ab;
    margin-bottom: 10px;
  }

  p {
    font-size: 12px;
    color: #333;
    margin-top: 0;
  }

  .editor {
    position: relative;
  }

  .editor textarea {
    width: 100%;
    outline: none;
    height: 150px;
    border: none;
    background: #173157;
    border-radius: 5px;
    box-sizing: border-box;
    white-space: pre;
    color: #eee;
    padding: 10px;
    font-family: monospace;
    resize: none;
    overflow-y: scroll;
  }

  button {
    position: absolute;
    box-shadow: 0 0 black;
    color: #eee;
    right: 5px;
    bottom: 10px;
    background: none;
    border: none;
    text-transform: uppercase;
    font-size: 9px;
    font-weight: 600;
    outline: none;
    cursor: pointer;
  }

  .snippets {
    margin-top: 20px;
  }

  .snippet {
    position: relative;
    margin-top: 5px;
  }

  .snippet pre {
    width: 100%;
    outline: none;
    max-height: 150px;
    border: none;
    background: #f9f9f9;
    border-radius: 5px;
    box-sizing: border-box;
    white-space: pre;
    color: #333;
    padding: 10px;
    font-family: monospace;
    resize: none;
    overflow-y: scroll;
    margin: 10px;
  }

  .snippet button {
    color: #ccc;
  }

</style>
