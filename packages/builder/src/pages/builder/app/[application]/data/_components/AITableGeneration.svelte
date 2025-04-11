<script>
  import { Input } from "@budibase/bbui"
</script>

<div class="ai-generation">
  <div class="ai-generation-prompt">
    <Input placeholder="Generate data using AI..." />
  </div>
  <div class="ai-generation-prompt-example">
    Create a table called tickets with title, description, status fields
  </div>
  <div class="ai-generation-prompt-example">
    Create a table called students with name and address fields
  </div>
</div>

<style>
  .ai-generation {
    max-width: 753px;
    display: grid;
    gap: 10px;

    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    margin-bottom: 36px;
  }

  .ai-generation-prompt {
    grid-column: 1 / -1;
  }
  .ai-generation-prompt :global(.spectrum-Textfield-input) {
    background: #1d1d1d;
    border-radius: 20px;
  }

  .ai-generation-prompt-example {
    padding: 2px 8px;
    gap: 10px;

    border: 1px solid #393939;
    border-radius: 14px;
  }
</style>
