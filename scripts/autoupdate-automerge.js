module.exports = async ({ github, context, core }) => {
  const owner = context.repo.owner
  const repo = context.repo.repo

  const isApproved = async prNumber => {
    const { data: reviews } = await github.rest.pulls.listReviews({
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    })

    const latestByUser = new Map()
    for (const review of reviews) {
      if (!review.user?.login || !review.submitted_at) {
        continue
      }
      const existing = latestByUser.get(review.user.login)
      if (
        !existing ||
        new Date(review.submitted_at) > new Date(existing.submitted_at)
      ) {
        latestByUser.set(review.user.login, review)
      }
    }

    let hasApproval = false
    let hasChangesRequested = false
    for (const review of latestByUser.values()) {
      if (review.state === "APPROVED") {
        hasApproval = true
      }
      if (review.state === "CHANGES_REQUESTED") {
        hasChangesRequested = true
      }
    }

    return hasApproval && !hasChangesRequested
  }

  const updateIfEligible = async pr => {
    if (pr.auto_merge == null) {
      return false
    }

    const fromFork = pr.head.repo.full_name !== `${owner}/${repo}`
    if (fromFork) {
      return false
    }

    if (pr.mergeable_state !== "behind") {
      return false
    }

    const approved = await isApproved(pr.number)
    if (!approved) {
      return false
    }

    await github.graphql(
      `mutation($pullRequestId: ID!, $expectedHeadOid: GitObjectID) {
        updatePullRequestBranch(input: { pullRequestId: $pullRequestId, expectedHeadOid: $expectedHeadOid }) {
          pullRequest { number }
        }
      }`,
      { pullRequestId: pr.node_id, expectedHeadOid: pr.head.sha }
    )

    core.info(`Branch update requested for PR #${pr.number}`)
    return true
  }

  const prs = await github.paginate(github.rest.pulls.list, {
    owner,
    repo,
    state: "open",
    per_page: 100,
  })

  let updated = 0
  for (const prSummary of prs) {
    if (!prSummary.auto_merge) {
      continue
    }
    const { data: pr } = await github.rest.pulls.get({
      owner,
      repo,
      pull_number: prSummary.number,
    })
    if (await updateIfEligible(pr)) {
      updated++
    }
  }

  core.info(`Updated ${updated} PR(s)`)
}
