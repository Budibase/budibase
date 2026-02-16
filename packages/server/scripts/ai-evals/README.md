# Agent Eval Runner

This runner evaluates Budibase agent behavior outside Jest so live model calls can run.

## Why outside Jest

`packages/server/src/tests/jestSetup.ts` disables outbound network calls except localhost.
Live provider calls for Budibase AI direct-path models must run in a standalone Node process.

## Commands

- `yarn eval:agent:smoke`
- `yarn eval:agent:full`
- `yarn eval:agent:adhoc --appId <appId> --agentId <agentId> --prompt "..." [--prompt "..."]`
- `yarn eval:agent:report`
- `yarn eval:agent:promptfoo`
- `yarn eval:agent:services:up`
- `yarn eval:agent:services:down`

`eval:agent:promptfoo` uses `promptfoo@latest` and requires a modern Node runtime.
Use Node `22.22.0+` to avoid known compatibility issues in older Node 22 minors.

`eval:agent:smoke` and `eval:agent:full` enforce a quality gate by default.
Override with environment variables:

- `AI_EVAL_ENFORCE=0` to make gate failures non-blocking
- `AI_EVAL_MIN_PASS_RATE` (default: `1` for smoke, `0.8` for full)
- `AI_EVAL_MAX_INCOMPLETE_TOOL_CALLS` (default: `0`)
- `AI_EVAL_MAX_TOOL_ERRORS` (default: `0`)
- `AI_EVAL_MIN_QUALITY_RUBRIC_SCORE` (optional)

## Required environment variables

- `BBAI_OPENAI_API_KEY`
- `BBAI_MISTRAL_API_KEY`
- `MISTRAL_BASE_URL`

Data service defaults are local and can be overridden:

- `COUCH_DB_URL` (default `http://127.0.0.1:4005`)
- `COUCH_DB_SQL_URL` (default `http://127.0.0.1:4006`)
- `MINIO_URL` (default `http://127.0.0.1:4004`)
- `REDIS_URL` (default `127.0.0.1:6379`)
- `REDIS_PASSWORD` (default `budibase`)

Do not set `MOCK_REDIS=1` for eval runs. Quota/licensing paths require real Redis commands.

For current smoke/full/adhoc eval cases, only CouchDB and Redis are required.
MinIO is optional unless you add file/object-store-dependent cases.

## Output

Artifacts are written to:

- `packages/server/.artifacts/ai-evals/<run-id>/report.json`
- `packages/server/.artifacts/ai-evals/<run-id>/summary.md`
- `packages/server/.artifacts/ai-evals/latest/`
- `packages/server/.artifacts/ai-evals/promptfoo/report.json`
- `packages/server/.artifacts/ai-evals/adhoc/latest-report.json`

## Adhoc existing agent usage

Run ad-hoc prompts against an existing agent and inspect tool usage:

```bash
yarn eval:agent:adhoc \
  --appId app_dev_xxx \
  --agentId agent_xxx \
  --prompt "Use list_tables then tell me how many tables exist." \
  --prompt "Reply with exactly: eval-check-ok"
```

You can also load prompts from a file (one prompt per line):

```bash
yarn eval:agent:adhoc \
  --appId app_dev_xxx \
  --agentId agent_xxx \
  --promptsFile ./prompts.txt
```

By default, the command exits non-zero if any prompt fails.
Use `--noFailOnError` to always exit zero.
