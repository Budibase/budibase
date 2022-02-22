const filterTests = (testTags, runTest) => {
  // testTags is an array of tags
  // runTest is all tests
  if (Cypress.env("TEST_TAGS")) {
    const tags = Cypress.env("TEST_TAGS").split("/")
    const found = testTags.some($testTags => tags.includes($testTags))

    if (found) {
      runTest()
    }
  } else {
    runTest()
  }
}

export default filterTests
