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
</script>

<span class="model-icon">
  <img src={getProviderLogo(row.provider)} alt="" />
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
</style>
