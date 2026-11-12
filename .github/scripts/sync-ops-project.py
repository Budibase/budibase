#!/usr/bin/env python3
"""Add open, Ops-labeled organization issues to the Ops project.

Requires gh authentication (GH_TOKEN in Actions). Defaults to a dry run.
Labels are read from the project's views so intake follows board configuration.
Existing project items, including archived items, are never modified or removed.
"""

import argparse
import json
import shlex
import subprocess


def graphql(document, **variables):
    result = subprocess.run(
        ["gh", "api", "graphql", "--input", "-"],
        input=json.dumps({"query": document, "variables": variables}),
        text=True, capture_output=True,
    )
    if result.returncode:
        raise RuntimeError(result.stderr.strip())
    response = json.loads(result.stdout)
    if response.get("errors"):
        raise RuntimeError(response["errors"])
    return response["data"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    project = graphql('''query {
      organization(login: "Budibase") { projectV2(number: 22) {
        id views(first: 100) {
          pageInfo { hasNextPage }
          nodes { filter }
        }
      } }
    }''')["organization"]["projectV2"]
    if project["views"]["pageInfo"]["hasNextPage"]:
        raise RuntimeError("More than 100 project views; refusing partial intake")
    labels = sorted({
        label
        for view in project["views"]["nodes"]
        for qualifier in shlex.split(view["filter"])
        if qualifier.startswith("label:")
        for label in qualifier[len("label:"):].split(",")
        if label
    })
    if not labels:
        raise RuntimeError("No positive label filters found in Ops views")
    print("Intake labels: " + ", ".join(labels), flush=True)
    matches = {}
    for label in labels:
        cursor = None
        while True:
            result = graphql('''query($query: String!, $cursor: String) {
              search(query: $query, type: ISSUE, first: 100, after: $cursor) {
                issueCount pageInfo { hasNextPage endCursor }
                nodes { ... on Issue { id url } }
              }
            }''', query=f'org:Budibase is:issue is:open archived:false label:{json.dumps(label)}',
                cursor=cursor)["search"]
            if result["issueCount"] > 1000:
                raise RuntimeError(f"Search exceeds GitHub's 1000-item limit for {label}")
            matches.update({item["id"]: item["url"] for item in result["nodes"]})
            if not result["pageInfo"]["hasNextPage"]:
                break
            cursor = result["pageInfo"]["endCursor"]
    existing = set()
    cursor = None
    while True:
        items = graphql('''query($id: ID!, $cursor: String) {
          node(id: $id) { ... on ProjectV2 {
            items(first: 100, after: $cursor, archivedStates: [ARCHIVED, NOT_ARCHIVED]) {
              pageInfo { hasNextPage endCursor }
              nodes { content { ... on Issue { id } } }
            }
          } }
        }''', id=project["id"], cursor=cursor)["node"]["items"]
        existing.update(item["content"]["id"] for item in items["nodes"]
                        if item["content"] and item["content"].get("id"))
        if not items["pageInfo"]["hasNextPage"]:
            break
        cursor = items["pageInfo"]["endCursor"]
    missing = {key: value for key, value in matches.items() if key not in existing}
    print(f"Matching open issues: {len(matches)}; already in Ops: "
          f"{len(matches) - len(missing)}; to add: {len(missing)}", flush=True)
    for index, issue_id in enumerate(missing, start=1):
        if args.apply:
            graphql('''mutation($project: ID!, $issue: ID!) {
              addProjectV2ItemById(input: {projectId: $project, contentId: $issue}) {
                item { id }
              }
            }''', project=project["id"], issue=issue_id)
        action = "Added" if args.apply else "Would add"
        print(f"{action} issue {index}/{len(missing)}", flush=True)


if __name__ == "__main__":
    main()
