<script lang="ts">
  import AnthropicLogo from "assets/llm-icons/anthropic.svg"
  import BudibaseLogo from "assets/llm-icons/bbai.svg"
  import GoogleLogo from "assets/llm-icons/google.svg"
  import GroqLogo from "assets/llm-icons/groq.svg"
  import MistralLogo from "assets/llm-icons/mistral_ai.svg"
  import OpenrouterLogo from "assets/llm-icons/openrouter.svg"
  import OpenAiLogo from "assets/llm-icons/openai.svg"
  import type { AIConfigResponse } from "@budibase/types"

  export let row: AIConfigResponse

  const invertOnLight = new Set(["Anthropic", "Budibase", "OpenAI"])
  const invertOnDark = new Set(["Openrouter"])

  function getProviderLogo(providerName: string) {
    const providerToLogo = {
      Anthropic: AnthropicLogo,
      Budibase: BudibaseLogo,
      Google_AI_Studio: GoogleLogo,
      Groq: GroqLogo,
      MistralAI: MistralLogo,
      OpenAI: OpenAiLogo,
      Openrouter: OpenrouterLogo,
    }

    return providerToLogo[providerName as keyof typeof providerToLogo] || null
  }

  function getThemeClass(providerName: string) {
    if (invertOnLight.has(providerName)) {
      return "invert-on-light"
    }
    if (invertOnDark.has(providerName)) {
      return "invert-on-dark"
    }
    return ""
  }

  $: logo = getProviderLogo(row.provider)
</script>

<span class={`model-icon ${getThemeClass(row.provider)}`}>
  {#if logo}
    <img src={logo} alt="" />
  {/if}
</span>

<style>
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

  :global(.spectrum--light) .model-icon.invert-on-light img,
  :global(.spectrum--lightest) .model-icon.invert-on-light img {
    filter: invert(100%);
  }

  :global(.spectrum--darkest) .model-icon.invert-on-dark img,
  :global(.spectrum--dark) .model-icon.invert-on-dark img,
  :global(.spectrum--nord) .model-icon.invert-on-dark img,
  :global(.spectrum--midnight) .model-icon.invert-on-dark img {
    filter: invert(100%);
  }
</style>
