import { Screen } from "@budibase/types"

export const ONBOARDING_WELCOME_SCREEN_NAME = "onboarding-welcome-screen"

export function createOnboardingWelcomeScreen(workspaceAppId: string): Screen {
  return {
    showNavigation: false,
    width: "Large",
    routing: { route: "/", roleId: "BASIC", homeScreen: true },
    name: ONBOARDING_WELCOME_SCREEN_NAME,
    workspaceAppId,
    props: {
      _id: "c38f2b9f250fb4c33965ce47e12c02a81",
      _component: "@budibase/standard-components/container",
      _styles: {
        normal: {
          "min-height": "100vh",
          "align-items": "center",
          "justify-content": "center",
          padding: "4rem",
          "background-color": "#f6f7fb",
        },
        hover: {},
        active: {},
        selected: {},
      },
      _children: [
        {
          _id: "cf600445f0b0048c79c0c81606b30d543",
          _component: "@budibase/standard-components/container",
          layout: "flex",
          direction: "column",
          hAlign: "stretch",
          vAlign: "top",
          gap: "L",
          _styles: {
            normal: {
              "background-color": "white",
              "border-radius": "1rem",
              padding: "2.5rem 3.5rem 3.5rem",
              width: "690px",
              display: "flex",
              "flex-direction": "column",
              gap: "1.5rem",
              "border-width": "1px",
              "border-color": "#E1E1E1",
              "border-style": "solid",
            },
            hover: {},
            active: {},
            selected: {},
          },
          _instanceName: "Welcome Card",
          _children: [
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43a6",
              _component: "@budibase/standard-components/iconphosphor",
              _styles: {
                normal: {
                  color: "#111827",
                  "align-self": "flex-start",
                },
                hover: {},
                active: {},
              },
              _instanceName: "Welcome Icon",
              icon: "hand-waving",
              size: 64,
              weight: "regular",
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43a7",
              _component: "@budibase/standard-components/textv2",
              _styles: {
                normal: {},
                hover: {},
                active: {},
              },
              size: "24px",
              _instanceName: "Welcome Title",
              text: "# Welcome to Budibase",
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43a8",
              _component: "@budibase/standard-components/container",
              layout: "flex",
              direction: "column",
              gap: "M",
              _styles: {
                normal: {
                  display: "flex",
                  "flex-direction": "column",
                  gap: "1.25rem",
                  "margin-left": "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _instanceName: "Welcome Summary",
              _children: [
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43a8a",
                  _component: "@budibase/standard-components/container",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "App Building Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43a8c",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#374151",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "App Building Icon",
                      icon: "browser",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43a8b",
                      _component: "@budibase/standard-components/textv2",
                      _styles: {
                        normal: {
                          color: "#4b5563",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "App Building Text",
                      size: "18px",
                      text: "This is the app building interface where you build interfaces such as forms and internal tools.",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43a9",
                  _component: "@budibase/standard-components/container",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Automation Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43a9c",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#374151",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Automation Icon",
                      icon: "path",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43a9b",
                      _component: "@budibase/standard-components/textv2",
                      _styles: {
                        normal: {
                          "font-size": "1.1rem",
                          color: "#4b5563",
                          "line-height": "1.5",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Automation Text",
                      size: "18px",
                      text: "The automation section is for automating manual tasks.",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b0",
                  _component: "@budibase/standard-components/container",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Data Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b0c",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#374151",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Data Icon",
                      icon: "database",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b0b",
                      _component: "@budibase/standard-components/textv2",
                      _styles: {
                        normal: {
                          "font-size": "1.1rem",
                          color: "#4b5563",
                          "line-height": "1.5",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Data Text",
                      size: "18px",
                      text: "Use the data section to connect data to your workflows (APIs, databases, or build your own tables).",
                    },
                  ],
                },
              ],
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43b1group",
              _component: "@budibase/standard-components/container",
              layout: "flex",
              direction: "column",
              _styles: {
                normal: {
                  display: "flex",
                  "flex-direction": "column",
                  gap: "0.5rem",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _instanceName: "Important Docs Header",
              _children: [
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b1",
                  _component: "@budibase/standard-components/textv2",
                  _styles: {
                    normal: {
                      "font-size": "1.25rem",
                      "font-weight": "600",
                      color: "#111827",
                    },
                    hover: {},
                    active: {},
                  },
                  size: "18px",
                  _instanceName: "Important Docs Title",
                  text: "### Important docs to help you get started",
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b1a",
                  _component: "@budibase/standard-components/textv2",
                  _styles: {
                    normal: {
                      color: "#589bf9ff",
                    },
                    hover: {},
                    active: {},
                  },
                  size: "18px",
                  _instanceName: "Important Docs Instruction",
                  text: "To open the links below, click the preview button above.",
                },
              ],
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43b2",
              _component: "@budibase/standard-components/container",
              layout: "flex",
              direction: "column",
              gap: "S",
              _styles: {
                normal: {
                  display: "flex",
                  "flex-direction": "column",
                  gap: "0.75rem",
                  "margin-left": "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _instanceName: "Docs Links",
              _children: [
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b3",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "App Building 101 Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b3a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "App Building Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b3b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "App Building 101 Link",
                      text: "App building 101",
                      url: "https://docs.budibase.com/docs/app-building-101",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b4",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Automations 101 Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b4a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Automations Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b4b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Automations 101 Link",
                      text: "Automations 101",
                      url: "https://docs.budibase.com/docs/automation-steps",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b5",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Set up SSO Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b5a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Set up SSO Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b5b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Set up SSO Link",
                      text: "Set up SSO",
                      url: "https://docs.budibase.com/docs/authentication-and-sso",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b6",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Set up SMTP Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b6a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Set up SMTP Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b6b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Set up SMTP Link",
                      text: "Set up SMTP",
                      url: "https://docs.budibase.com/docs/email",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
              ],
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43b7",
              _component: "@budibase/standard-components/textv2",
              _styles: {
                normal: {
                  "font-size": "1.25rem",
                  "font-weight": "600",
                  color: "#111827",
                },
                hover: {},
                active: {},
              },
              size: "18px",
              _instanceName: "Community Title",
              text: "### Join the community",
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43b8",
              _component: "@budibase/standard-components/container",
              layout: "flex",
              direction: "column",
              gap: "M",
              _styles: {
                normal: {
                  display: "flex",
                  "flex-direction": "column",
                  gap: "0.75rem",
                  "margin-left": "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _instanceName: "Community Links",
              _children: [
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b9",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Discord Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b9a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Discord Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b9b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Discord Link",
                      text: "Discord",
                      url: "https://discord.gg/ZepTmGbtfF",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43ba",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "GitHub Discussions Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43baa",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "GitHub Discussions Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43bab",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "GitHub Discussions Link",
                      text: "Github Discussions",
                      url: "https://github.com/Budibase/budibase/discussions",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43bb",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Public Roadmap Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43bba",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Public Roadmap Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43bbb",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Public Roadmap Link",
                      text: "Public roadmap",
                      url: "https://github.com/orgs/Budibase/projects/15",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          _id: "6018da5d262a4f1975c0398c51ae4cab470c",
          _component: "@budibase/standard-components/embed",
          _styles: {
            normal: {},
            hover: {},
            active: {},
            selected: {},
          },
          _instanceName: "Onboarding Background Embed",
          embed:
            "<style>\n  .main-wrapper {\n    background-color: rgb(240 238 230 / 1)\n  }\n  .screenslot-dom > .component > .flex-container {\n    background-color: rgb(240 238 230 / 1) !important\n  }\n .grid {\n    background-color: rgb(240 238 230 / 1) !important\n  }\n</style>",
        },
      ],
      _instanceName: "Onboarding Welcome",
      layout: "flex",
      direction: "column",
      hAlign: "stretch",
      vAlign: "top",
      size: "grow",
      gap: "M",
    },
  }
}
