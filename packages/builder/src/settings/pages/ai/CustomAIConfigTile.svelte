<script lang="ts">
  import { ActionButton } from "@budibase/bbui"
  import AnthropicLogo from "assets/llm-icons/anthropic.svg"
  import BudibaseLogo from "assets/llm-icons/bbai.svg"
  import GoogleLogo from "assets/llm-icons/google.svg"
  import GroqLogo from "assets/llm-icons/groq.svg"
  import MistralLogo from "assets/llm-icons/mistral_ai.svg"
  import OpenrouterLogo from "assets/llm-icons/openrouter.svg"
  import OpenAiLogo from "assets/llm-icons/openai.svg"
  import SalesLLMLogo from "assets/llm-icons/salesllm.svg"

  export let provider: string
  export let displayName: string
  export let description: string
  export let isEdition: boolean = false
  export let editHandler: (() => void) | null

  function getProviderLogo(providerName: string) {
    const providerToLogo = {
      anthropic: AnthropicLogo,
      budibase: BudibaseLogo,
      google: GoogleLogo,
      groq: GroqLogo,
      mistral: MistralLogo,
      openai: OpenAiLogo,
      openrouter: OpenrouterLogo,
      salesllm: SalesLLMLogo,
    }

    return providerToLogo[providerName as keyof typeof providerToLogo] || null
  }
</script>

<div class="config-row">
  <div class="row-left">
    <span class="model-icon">
      <img src={getProviderLogo(provider)} alt="" />
    </span>
    <span>{displayName}</span>
  </div>
  <div class="model-description">{description}</div>
  <div class="model-actions">
    <ActionButton size="S" on:click={() => editHandler?.()}
      >{isEdition ? "Edit" : "Connect"}</ActionButton
    >
  </div>
</div>

<style>
  .config-row {
    display: grid;
    grid-template-columns: 240px 1fr 100px;
    align-items: center;
    border: 1px solid var(--grey-2, #2c2c2c);
    border-top: none;
    background: var(--grey-75, #1a1a1a);
    overflow: hidden;
  }

  .config-row:first-child {
    border-top: 1px solid var(--grey-2, #2c2c2c);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .config-row:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .row-left {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    height: 100%;
  }

  .model-description {
    color: var(--grey-7, #a2a2a2);
    font-size: 13px;
    padding: 8px 12px;
  }

  .model-actions {
    display: flex;
    justify-content: flex-end;
    padding: 8px 12px;
  }

  .model-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .model-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
