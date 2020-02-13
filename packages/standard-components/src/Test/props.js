export const form = {
  _id: "1",
  _component: "@budibase/standard-components/container",
  type: "main",
  _children: [
    {
      _component: "@budibase/standard-components/heading",
      type: "h1",
      _children: [
        {
          _component: "@budibase/standard-components/text",
          text: "This is an H1 Heading",
        },
      ],
    },
    {
      _component: "@budibase/standard-components/text",
      text: "This just some text",
      type: "strong",
    },
    {
      _component: "@budibase/standard-components/container",
      type: "paragraph",
      _children: [
        {
          _component: "@budibase/standard-components/text",
          formattingTag: "<i>",
          text: "some iatlics in a paragraph",
        },
      ],
    },
    {
      _component: "@budibase/standard-components/heading",
      type: "h2",
      _children: [
        {
          _component: "@budibase/standard-components/text",
          text: "This is an H2 Heading",
        },
      ],
    },
    {
      _component: "@budibase/standard-components/select",
      value: "two",
      _children: [
        {
          _component: "@budibase/standard-components/option",
          text: "number 1",
          value: "one",
        },
        {
          _component: "@budibase/standard-components/option",
          text: "number 2",
          value: "two",
        },
      ],
    },
  ],
}
