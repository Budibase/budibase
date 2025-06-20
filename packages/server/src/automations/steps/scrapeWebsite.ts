import fetch from "node-fetch"
import * as automationUtils from "../automationUtils"
import {
  ScrapeWebsiteStepInputs,
  ScrapeWebsiteStepOutputs,
} from "@budibase/types"

function extractTextFromHTML(html: string): {
  content: string
  title: string
  description: string
} {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : ""

  // Extract meta description
  const descMatch =
    html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i
    ) ||
    html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)/i
    )
  const description = descMatch ? descMatch[1].trim() : ""

  // Extract all text content
  const content = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove styles
    .replace(/<[^>]*>/g, " ") // Remove all HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, " ") // Replace multiple whitespace with single space
    .trim()

  return { content, title, description }
}

export async function run({
  inputs,
}: {
  inputs: ScrapeWebsiteStepInputs
}): Promise<ScrapeWebsiteStepOutputs> {
  if (!inputs.url) {
    return {
      success: false,
      response: {
        message: "Website scraping failed: URL is required.",
      },
    }
  }

  try {
    // Validate URL format
    const url = inputs.url.startsWith("http")
      ? inputs.url
      : `https://${inputs.url}`

    // Fetch the webpage
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      timeout: 30000,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const { content, title, description } = extractTextFromHTML(html)

    return {
      success: true,
      content,
      title,
      description,
    }
  } catch (err: any) {
    console.error("Website scraping error:", err)
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
