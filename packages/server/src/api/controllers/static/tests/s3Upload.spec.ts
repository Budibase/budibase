import { encodeJSBinding } from "@budibase/string-templates"
import { matchesConfiguredBucket, matchesConfiguredKey } from "../s3Upload"

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
    {
      configuredFileName: encodeJSBinding('return "test.jpg"'),
      requestedKey: "test.jpg",
    },
    {
      configuredFileName: encodeJSBinding(`
        const reportLabel = new Date().getTime() + "_" + helpers.pluck($("ReportForm.Fields.Files"), "name")
        const studyCode = $("StudiesDP.Rows.0.study_code")
        return "ResearchArchive/" + studyCode + "/Reports/" + reportLabel
      `),
      requestedKey: "ResearchArchive/study-42/Reports/1700000000000_notes.pdf",
    },
    {
      configuredFileName: encodeJSBinding('return "test.jpg"'),
      requestedKey: "another-folder/report.pdf",
    },
    {
      configuredFileName: `uploads/${encodeJSBinding('return "report.pdf"')}`,
      requestedKey: "uploads/report.pdf",
    },
  ])(
    "allows browser-selected keys for JavaScript filename bindings (case %#)",
    ({ configuredFileName, requestedKey }) => {
      expect(
        matchesConfiguredKey({
          template: configuredFileName,
          key: requestedKey,
          user,
        })
      ).toBe(true)
    }
  )

  it.each([
    "",
    "uploads/",
    "uploads/../report.pdf",
    "uploads/./report.pdf",
    "a".repeat(1025),
  ])("rejects invalid JavaScript upload keys (case %#)", requestedKey => {
    expect(
      matchesConfiguredKey({
        template: encodeJSBinding('return "report.pdf"'),
        key: requestedKey,
        user,
      })
    ).toBe(false)
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

describe("S3 upload bucket authorization", () => {
  it.each([
    { template: "uploads", bucket: "uploads" },
    { template: "uploads-{{ region }}", bucket: "uploads-eu" },
    { template: "uploads-{{ [settings].[region] }}", bucket: "uploads-us" },
    { template: "uploads-{{{ region }}}", bucket: "uploads-eu" },
    { template: "{{ region }}-uploads", bucket: "eu-uploads" },
    { template: "uploads-{{ region }}-private", bucket: "uploads-eu-private" },
    {
      template: "{{ region }}-uploads-{{ tenant }}",
      bucket: "eu-uploads-team",
    },
    { template: "{{ first }}{{ second }}-uploads", bucket: "eu-uploads" },
    { template: "uploads{{ suffix }}", bucket: "uploads" },
    { template: "{{ bucket }}", bucket: "selected-bucket" },
    { template: "uploads-{{ user.department }}", bucket: "uploads-sales" },
  ])(
    "matches fixed parts of simple bindings (case %#)",
    ({ template, bucket }) => {
      expect(matchesConfiguredBucket({ template, bucket })).toBe(true)
    }
  )

  it.each([
    { template: "uploads", bucket: "other" },
    { template: "uploads-{{ region }}", bucket: "sensitive-eu" },
    { template: "uploads-{{ [settings].[region] }}", bucket: "sensitive-eu" },
    { template: "{{ region }}-uploads", bucket: "eu-sensitive" },
    { template: "uploads-{{ region }}-private", bucket: "uploads-eu-public" },
    {
      template: "{{ region }}-uploads-{{ tenant }}",
      bucket: "eu-sensitive-team",
    },
    { template: "uploads{{ name }}uploads", bucket: "uploads" },
    { template: "uploads-{{ region }}", bucket: "uploads-eu/path" },
    {
      template: "uploads-{{ region }}-private",
      bucket: "uploads-eu-private\n",
    },
  ])("rejects changes to fixed parts (case %#)", ({ template, bucket }) => {
    expect(matchesConfiguredBucket({ template, bucket })).toBe(false)
  })

  it.each([
    "uploads-{{ lowercase region }}",
    "{{#if archive}}archive{{else}}uploads{{/if}}",
    "uploads-{{ region }}-{{ lowercase tenant }}",
    "{{ lowercase tenant }}-{{ region }}-uploads",
  ])("keeps complex expression %s flexible", template => {
    expect(
      matchesConfiguredBucket({ template, bucket: "selected-bucket" })
    ).toBe(true)
  })
})
