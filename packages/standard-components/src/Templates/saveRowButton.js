export default ({ rows }) =>
  rows.map(r => ({
    name: `Save ${r.name} Button`,
    props: buttonProps(r),
  }))

const buttonProps = row => ({
  _component: "@budibase/standard-components/button",
  _children: [
    {
      _component: "@budibase/standard-components/text",
      text: `Save ${row.name}`,
    },
  ],
  onClick: [
    {
      "##eventHandlerType": "Save Row",
      parameters: {
        statePath: `${row.name}`,
      },
    },
  ],
})
