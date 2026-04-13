module.exports = async ({ github, context, core }) => {
  const owner = context.repo.owner
  const repo = context.repo.repo
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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

  const refreshPullRequest = async prNumber => {
    const maxAttempts = 6
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const { data: pr } = await github.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      })

      if (pr.mergeable_state !== "unknown" || attempt === maxAttempts) {
        return pr
      }

      core.info(
        `PR #${prNumber} mergeable_state is unknown (attempt ${attempt}/${maxAttempts}), retrying...`
      )
      await sleep(10000)
    }
  }

  const updateIfEligible = async pr => {
    if (pr.auto_merge == null) {
      core.info(`Skipping PR #${pr.number}: auto-merge is not enabled`)
      return false
    }

    const fromFork = pr.head.repo.full_name !== `${owner}/${repo}`
    if (fromFork) {
      core.info(`Skipping PR #${pr.number}: branch is from a fork`)
      return false
    }

    if (pr.mergeable_state !== "behind") {
      core.info(
        `Skipping PR #${pr.number}: mergeable_state is ${pr.mergeable_state}`
      )
      return false
    }

    const approved = await isApproved(pr.number)
    if (!approved) {
      core.info(`Skipping PR #${pr.number}: not approved`)
      return false
    }

    try {
      await github.graphql(
        `mutation($pullRequestId: ID!, $expectedHeadOid: GitObjectID) {
          updatePullRequestBranch(input: { pullRequestId: $pullRequestId, expectedHeadOid: $expectedHeadOid }) {
            pullRequest { number }
          }
        }`,
        { pullRequestId: pr.node_id, expectedHeadOid: pr.head.sha }
      )
    } catch (err) {
      core.warning(
        `Failed to request branch update for PR #${pr.number}: ${err.message}`
      )
      return false
    }

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
    const pr = await refreshPullRequest(prSummary.number)
    if (await updateIfEligible(pr)) {
      updated++
    }
  }

  core.info(`Updated ${updated} PR(s)`)
}
