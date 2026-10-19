import { matchesConfiguredKey } from "../s3Upload"

describe("S3 upload key authorization", () => {
  const user = { _id: "user-one", globalId: "global-one" }

  it.each([
    { template: "uploads/{{ name }}.pdf", key: "uploads/.pdf" },
    { template: "uploads/{{ first }}{{ last }}.pdf", key: "uploads/a.pdf" },
    {
      template: "uploads/{{ first }}{{ last }}.pdf",
      key: "uploads/📄.pdf",
    },
    { template: "uploads/{{ first }}-{{ last }}.pdf", key: "uploads/a-.pdf" },
    {
      template: "uploads/{{ first }}-{{ last }}.pdf",
      key: "uploads/-a.pdf",
    },
    { template: "fixed.pdf", key: "fixed.pdf" },
    { template: "{{ fileName }}", key: "file.pdf" },
    { template: "{{ [form].[File name] }}", key: "file.pdf" },
    { template: "uploads/{{ fileName }}", key: "uploads/file.pdf" },
    { template: "uploads/{{ name }}.pdf", key: "uploads/file.pdf" },
    { template: "uploads/{{ first }}-{{ last }}.pdf", key: "uploads/a-b.pdf" },
    {
      template: "uploads/{{ first }}-{{ last }}.pdf",
      key: "uploads/a-b-c.pdf",
    },
    { template: "uploads/{{ first }}{{ last }}.pdf", key: "uploads/ab.pdf" },
    {
      template: "uploads/{{ first }}{{ last }}.pdf",
      key: "uploads/é📄.pdf",
    },
    {
      template: "uploads/{{ first }}-{{ last }}.pdf",
      key: "uploads/-a-b.pdf",
    },
    {
      template: "uploads/{{ name }}-{{ user._id }}.pdf",
      key: "uploads/file-user-one.pdf",
    },
    { template: "{{ [user].[_id] }}/{{ fileName }}", key: "user-one/file.pdf" },
    {
      template: "users/{{ user._id }}/{{ fileName }}",
      key: "users/user-one/file.pdf",
    },
    {
      template: "users/{{ [Current User].[_id] }}/{{ fileName }}",
      key: "users/user-one/file.pdf",
    },
    {
      template: "users/{{ this.user._id }}/{{ fileName }}",
      key: "users/user-one/file.pdf",
    },
    {
      template: "{{{ [user].[globalId] }}}/{{ fileName }}",
      key: "global-one/file.pdf",
    },
    { template: "{{ fileName }}", key: "é📄.pdf" },
    { template: "uploads/{{ name }}[1].pdf", key: "uploads/file[1].pdf" },
    { template: "{{ fileName }}", key: "a".repeat(1024) },
  ])("allows an authorized filename (case %#)", ({ template, key }) => {
    expect(matchesConfiguredKey({ template, key, user })).toBe(true)
  })

  it.each([
    { template: "fixed.pdf", key: "other.pdf" },
    { template: "{{ fileName }}", key: "nested/file.pdf" },
    { template: "uploads/{{ fileName }}", key: "other/file.pdf" },
    { template: "uploads/{{ fileName }}", key: "uploads/nested/file.pdf" },
    { template: "uploads/{{ fileName }}", key: "uploads/.." },
    {
      template: "uploads/{{ folder }}/file.pdf",
      key: "uploads/other/file.pdf",
    },
    {
      template: "users/{{ user._id }}/{{ fileName }}",
      key: "users/user-two/file.pdf",
    },
    {
      template: "users/{{ this.user._id }}/{{ fileName }}",
      key: "users/user-two/file.pdf",
    },
    { template: "{{ user._id }}.pdf", key: "user-two.pdf" },
    { template: "{{ user.missing }}.pdf", key: "anything.pdf" },
    { template: "{{ user }}.pdf", key: "anything.pdf" },
    { template: "{{ uppercase user._id }}.pdf", key: "USER-TWO.pdf" },
    { template: "{{ lookup user '_id' }}.pdf", key: "user-two.pdf" },
    { template: "uploads/{{ name }}.pdf", key: "uploads/a.txt" },
    { template: "uploads/{{ name }}.pdf", key: "uploads/a.pdf\n" },
    { template: "prefix{{ name }}prefix", key: "prefix" },
    { template: "{{ fileName }}", key: "é".repeat(513) },
    { template: "{{ fileName }}", key: "a".repeat(100000) },
  ])("rejects unauthorized key (case %#)", ({ template, key }) => {
    expect(matchesConfiguredKey({ template, key, user })).toBe(false)
  })

  it.each([
    {
      template: "uploads/{{ name }}-{{ suffix }}.pdf",
      key: "uploads/report-.pdf",
    },
    { template: "uploads/{{ name }}-{{ suffix }}.pdf", key: "uploads/-.pdf" },
    { template: "uploads/{{ first }}{{ last }}.pdf", key: "uploads/.pdf" },
    { template: "uploads/fixed{{ suffix }}", key: "uploads/fixed" },
    {
      template: "users/{{ user._id }}/{{ name }}-{{ suffix }}.pdf",
      key: "users/user-one/report-.pdf",
    },
  ])(
    "allows empty optional filename fragments (case %#)",
    ({ template, key }) => {
      expect(matchesConfiguredKey({ template, key, user })).toBe(true)
    }
  )

  it.each([
    { template: "{{ name }}", key: "" },
    { template: "uploads/{{ name }}", key: "uploads/" },
    { template: "uploads/{{ first }}{{ last }}", key: "uploads/" },
    { template: "uploads/{{ name }}", key: "uploads/." },
    {
      template: "uploads/{{ name }}-{{ suffix }}.pdf",
      key: "uploads/report/-.pdf",
    },
    {
      template: "uploads/{{ name }}-{{ suffix }}.pdf",
      key: "uploads/report.pdf",
    },
    {
      template: "uploads/{{ name }}-{{ suffix }}.pdf",
      key: "other/report-.pdf",
    },
    {
      template: "users/{{ user._id }}/{{ name }}-{{ suffix }}.pdf",
      key: "users/user-two/report-.pdf",
    },
  ])(
    "preserves destination restrictions with empty fragments (case %#)",
    ({ template, key }) => {
      expect(matchesConfiguredKey({ template, key, user })).toBe(false)
    }
  )

  it("rejects an empty trusted user binding", () => {
    expect(
      matchesConfiguredKey({
        template: "users/{{ user._id }}/{{ name }}.pdf",
        key: "users//report.pdf",
        user: { _id: "" },
      })
    ).toBe(false)
  })

  it("rejects an adversarial suffix with many ambiguous bindings", () => {
    expect(
      matchesConfiguredKey({
        template: `uploads/${"{{ name }}-".repeat(30)}.pdf`,
        key: `uploads/${"a-".repeat(500)}.txt`,
        user,
      })
    ).toBe(false)
  })
})
