<script>
  import { TextButton } from "@budibase/bbui"
  import { Heading } from "@budibase/bbui"
  import { Spacer } from "@budibase/bbui"
  export let name, _id
</script>

<div class="apps-card">
  <Heading small black>{name}</Heading>
  <Spacer medium />
  <div class="card-footer">
    <TextButton text medium blue href="/_builder/{_id}">
      Open {name} →
    </TextButton>
  </div>
</div>

<style>
  .apps-card {
    background-color: var(--white);
    padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-xl)
      var(--spacing-xl);
    max-width: 300px;
    max-height: 150px;
    border-radius: var(--border-radius-m);
    border: var(--border-dark);
  }

  .card-footer {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
  }
</style>
