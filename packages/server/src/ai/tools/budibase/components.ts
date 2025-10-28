import type { ComponentPayload } from "@budibase/types"
import { z } from "zod"
import { newTool } from ".."

const buttonComponentSchema: z.ZodType<ComponentPayload> = z.object({
  componentId: z
    .string()
    .describe("A unique id to keep track of the component"),
  type: z.literal("Button"),
  props: z.object({
    text: z.string(),
    primary: z.boolean(),
    onClick: z
      .string()
      .describe(
        "A valid stringify function, without parameters. It will be executed on click"
      ),
  }),
})

const componentSchema: z.ZodType<ComponentPayload> = z.union([
  buttonComponentSchema,
  buttonComponentSchema,
])

export const componentToolResultSchema = z.object({
  type: z.literal("component"),
  component: componentSchema,
  message: z.string().optional(),
})

export default [
  newTool({
    name: "build_component",
    description:
      "Allow rendering components from the Budibase UI. Call this when you want to present an interactive component to the user.",
    parameters: z.object({
      component: componentSchema.describe("The component to render."),
      message: z
        .string()
        .describe(
          "Optional short assistant message to accompany the component."
        ),
    }),
    handler: async ({
      component,
      message,
    }: {
      component: ComponentPayload
      message?: string
    }) => {
      return JSON.stringify(
        componentToolResultSchema.parse({
          type: "component",
          component,
          message,
        })
      )
    },
  }),
]
