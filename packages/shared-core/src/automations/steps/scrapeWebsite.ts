import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Website Scraper",
  icon: "Globe",
  tagline: "Scrape content from a website",
  description:
    "Scrapes text content from a website URL for further processing.",
  stepId: AutomationActionStepId.SCRAPE_WEBSITE,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: AutomationIOType.STRING,
          title: "URL",
          description: "The website URL to scrape content from.",
        },
      },
      required: ["url"],
    },
    outputs: {
      properties: {
        content: {
          type: AutomationIOType.STRING,
          description: "The scraped text content from the website.",
        },
        title: {
          type: AutomationIOType.STRING,
          description: "The page title extracted from the website.",
        },
        description: {
          type: AutomationIOType.STRING,
          description:
            "The meta description extracted from the website (if available).",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the scraping was successful.",
        },
      },
      required: ["content", "success"],
    },
  },
  type: AutomationStepType.ACTION,
}
