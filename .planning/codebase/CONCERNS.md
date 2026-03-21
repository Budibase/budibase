# Codebase Concerns

**Analysis Date:** 2026-03-21

## Tech Debt

**Type Safety & Type Assertions:**
- Issue: Widespread use of `as any` type assertions and `@ts-ignore`/`@ts-expect-error` comments bypassing TypeScript checks. 595+ occurrences of `any` type usage across codebase (216+ files in server/src alone).
- Files: Pervasive across all packages - `packages/server/src`, `packages/frontend-core/src`, `packages/backend-core/src`
- Impact: Reduces type safety guarantees; makes refactoring risky; hides potential runtime errors. Particularly problematic in `packages/client/src/api/patches.ts:109` (TODO comment with @ts-expect-error), `packages/server/src/api/controllers/ai/chatConversations.ts`, various integration files.
- Fix approach: Incremental type safety improvement - audit critical paths first (API endpoints, data transformations), replace `any` with proper types, use proper type unions instead of broad `any` catchalls.

**Large Monolithic Modules:**
- Issue: Multiple files exceed 2000+ lines of code, containing complex business logic that should be split. Notable examples:
  - `packages/builder/src/stores/builder/automations.ts` (3171 lines)
  - `packages/builder/src/stores/builder/restTemplates.ts` (3097 lines)
  - `packages/builder/src/stores/builder/components.ts` (1372 lines) - marked with TODO: "analise and fix all the undefined ! and ?"
  - `packages/backend-core/src/sql/sql.ts` (2063 lines)
- Files: `packages/builder/src/stores/builder/*`, `packages/backend-core/src/sql/sql.ts`, `packages/server/src/api/routes/tests/*`
- Impact: Difficult to test, maintain, and understand. High cognitive load. Bug fixes risk breaking multiple features. Test files are equally large (5094 lines in viewV2.spec.ts), suggesting complex interdependencies.
- Fix approach: Break down using facade pattern or extract smaller focused modules. Consider extracting helper functions and domain logic into separate files.

**Incomplete Async Patterns:**
- Issue: Quote from `packages/pro/src/sdk/quotas/quotas.ts:146`: `return results[0] //TODO What happen if we need to get all the results?` - batch quota operations only return first result.
- Files: `packages/pro/src/sdk/quotas/quotas.ts`
- Impact: Quota increment/decrement operations lose return values when processing multiple actions. May cause silent failures in quota tracking.
- Fix approach: Return full results array or implement proper handling for multi-action returns.

**JSON Parsing Without Error Handling:**
- Issue: Multiple instances of `JSON.parse()` without try-catch in critical paths. Example: `packages/backend-core/src/redis/redis.ts:216` in bulkGet fallback with comment "this is a filthy lie".
- Files: `packages/backend-core/src/redis/redis.ts:216-221`, `packages/backend-core/src/environment.ts`, `packages/backend-core/src/db/couch/DatabaseImpl.ts`
- Impact: Malformed JSON data can crash the application. The workaround comment in redis.ts indicates knowledge of the issue but accepting bad behavior.
- Fix approach: Wrap all JSON.parse calls in try-catch, implement validation schema, log parsing errors, fail gracefully with meaningful error messages.

---

## Known Issues & Bugs

**Automation Test Flag Race Condition:**
- Symptoms: When two automations are tested simultaneously, they interfere with each other - second test overwrites the first's flag.
- Files: `packages/server/src/utilities/redis.ts:106-109`
- Trigger: Run two automation tests concurrently
- Workaround: Tests run serially, so issue doesn't manifest in practice, but impacts parallel test execution
- Root cause: Simple boolean flag in Redis shared between concurrent operations
- Fix approach: Replace boolean flag with atomic counter (increment on test start, decrement on finish, only clear when reaches 0)

**String Thrown as Error:**
- Symptoms: Application throws plain strings instead of Error objects in error handling.
- Files:
  - `packages/server/src/utilities/redis.ts:87` - `throw "User does not hold lock, cannot clear it."`
  - `packages/server/src/utilities/rowProcessor/bbReferenceProcessor.ts:87` - `throw "Subtype must be defined"`
- Impact: Stack traces lost, error handling becomes inconsistent, logging frameworks can't process string throws properly
- Fix approach: Create proper Error instances: `throw new Error("message")` instead of `throw "message"`

**Silent SCIM Event Drops:**
- Symptoms: SCIM events are silently dropped without logging or notification.
- Files: `packages/backend-core/src/cache/docWritethrough.ts:60-62`
- Trigger: Any SCIM log document processing
- Impact: SCIM operations appear to succeed but are never persisted. Audit trail gaps for user provisioning/deprovisioning.
- Fix approach: Replace HACK with proper design - either implement SCIM writethrough support or log why events are dropped with metrics

**Chat Conversation Logging Incomplete:**
- Symptoms: RAG retrieval failures silently caught without logging
- Files: `packages/server/src/api/controllers/ai/chatConversations.ts:527-530` - TODO comment "implement logging"
- Trigger: When knowledge bases enabled and RAG context retrieval fails
- Impact: Hard to diagnose RAG failures, no visibility into why agent isn't using knowledge bases
- Workaround: Error logged to console via console.error but not through structured logging
- Fix approach: Implement proper logging using existing logging framework

**View Utils Null Returns:**
- Symptoms: View utility functions return null without context about why
- Files: `packages/server/src/api/controllers/view/utils.ts:30,39`
- Impact: Callers must handle null but don't know if it's "not found", "permission denied", or "invalid input"
- Fix approach: Use typed errors or return Result<T> wrapper with failure reasons

---

## Security Considerations

**Plugin Code Execution via eval():**
- Risk: Dynamic code execution in plugin system could execute malicious code
- Files: `packages/pro/src/sdk/plugins/index.ts:48` - `eval(js)`
- Current mitigation: Assumes plugins come from trusted sources (self-hosted or pre-vetted npm packages)
- Recommendations:
  - Document security model for plugins explicitly
  - Consider sandboxing plugin execution (Worker threads, VM2, isolated-vm)
  - Audit all plugin loading paths for injection vulnerabilities
  - Implement plugin permission model

**innerHTML Usage:**
- Risk: Potential XSS vector if user-supplied HTML is rendered
- Files:
  - `packages/client/src/components/app/CodeGenerator.svelte:43` - sets innerHTML from generated SVG
  - `packages/bbui/src/Markdown/MarkdownViewer.svelte:22` - renders markdown as HTML via innerHTML
- Current mitigation: Markdown library (marked.js) should escape, SVG is generated, not user-supplied
- Recommendations: Audit all innerHTML assignments, prefer textContent, validate all HTML before rendering, use DOMPurify for markdown output

**String-based Error Throwing:**
- Risk: Error objects properly logged; strings may leak sensitive data when caught and logged
- Files: `packages/server/src/utilities/redis.ts:87`
- Impact: Error messages not sanitized through error handler, could expose implementation details
- Recommendations: Use proper Error class, ensure error handler sanitizes messages

**Proxy Fetch with Dispatcher:**
- Risk: Proxy configuration bypasses standard security checks
- Files: `packages/pro/src/utilities/fetch.ts`
- Current mitigation: Code documented, dispatcher properly configured
- Recommendations: Ensure rejectUnauthorized defaults to true, validate dispatcher initialization

**Environment Variable Exposure:**
- Risk: 362 instances of process.env access scattered across codebase - could accidentally log or expose vars
- Files: All server/src files reference environment; 88 in environment.ts alone
- Current mitigation: .env file not committed, server-side only
- Recommendations:
  - Centralize all env access in environment.ts
  - Audit logging for secret exposure
  - Use strongly-typed config object instead of raw process.env access

---

## Performance Bottlenecks

**SQL Query Builder Complexity:**
- Problem: `packages/backend-core/src/sql/sql.ts` (2063 lines) handles SQL generation for multiple databases with nested conditionals and complex query building logic
- Files: `packages/backend-core/src/sql/sql.ts`, `packages/backend-core/src/sql/sqlTable.ts`
- Cause: Single file handling cross-database compatibility, complex filtering, aggregations, relationships
- Symptoms: Hard to profile, understand, or optimize individual query paths
- Improvement path:
  - Split by database type (Postgres, MySQL, etc.) into separate builders
  - Extract relationship handling to separate module
  - Profile common query patterns
  - Consider caching compiled query templates

**Redis Connection Pooling:**
- Problem: Multiple separate Redis client instances created (devAppClient, debounceClient, flagClient, recaptchaClient, socketClient)
- Files: `packages/server/src/utilities/redis.ts:13-36`
- Cause: Different use cases requiring isolation of data
- Impact: Connection overhead, memory usage, complexity in initialization and shutdown
- Improvement: Consider connection pool abstraction or unified redis configuration

**Large Test Files:**
- Problem: Test files 2000-5000 lines create long test runs, slow feedback loops
- Files: `packages/server/src/api/routes/tests/viewV2.spec.ts` (5094 lines), `row.spec.ts` (4429), `search.spec.ts` (4205)
- Cause: Comprehensive integration tests in single file rather than split by feature/endpoint
- Improvement: Split tests by feature area, run in parallel, mark slow tests for ci-only

---

## Fragile Areas

**String Template/Handlebars System:**
- Files: `packages/string-templates/src/*`
- Why fragile:
  - Processes user-supplied template strings with Handlebars and JavaScript execution
  - Multiple regex patterns for parsing and validation (`HBS_REGEX` in filters.ts)
  - TODO comments indicating incomplete boolean transformation logic
- Safe modification: Changes to parsing logic require comprehensive test coverage. The regex patterns should be documented with examples. JavaScript execution in templates is inherently risky.
- Test coverage: 377 test files total, but string-templates specific coverage should be verified
- Improvement:
  - Document all regex patterns with examples
  - Add fuzzing tests for template edge cases
  - Consider restricting JavaScript execution capabilities

**Chat/Agent System:**
- Files: `packages/server/src/api/controllers/ai/chatConversations.ts` (large, complex flow), agent tools, RAG integration
- Why fragile:
  - Streaming response architecture with multiple error paths
  - Tool calling with error recovery ("incomplete tool call" state)
  - RAG context integration with silent failure fallback
  - Quota tracking in tool calls with empty fn
- Safe modification: Changes to message flow must maintain streaming contract. Tool error handling must preserve pending state. Test all error paths.
- Test coverage: Separate test file (`packages/server/src/tests/api/chatConversations.spec.ts` - 1254 lines) indicates complexity
- Improvement: Extract streaming logic to separate abstraction, document state machine, add more granular error context

**SCIM Integration:**
- Files: `packages/backend-core/src/cache/docWritethrough.ts:60-62`, various SCIM config and logging code
- Why fragile:
  - SCIM events silently dropped with HACK comment
  - Minimal error handling or logging
  - Integration with user provisioning system
- Safe modification: Any changes to SCIM event handling must preserve backward compatibility. Document the intentional dropping. Consider feature flag for SCIM support.
- Test coverage: 1271 line SCIM test file indicates comprehensive testing
- Improvement: Remove HACK, implement proper SCIM writethrough or documented skip with metrics

**Frontend Grid System:**
- Files: `packages/frontend-core/src/components/grid/*`, stores with complex state
- Why fragile:
  - TODO comments about type inference needing refactor
  - Complex state management in stores
  - Multiple undefined assertions (as any)
- Safe modification: Grid state changes impact all data display. Need comprehensive test coverage before changes.
- Test coverage: Limited visibility into grid-specific tests
- Improvement: Complete type refactoring, extract state management logic

---

## Scaling Limits

**Redis-based Dev Locks:**
- Current capacity: Simple key-value per app ID with 10-minute expiry
- Limit: Doesn't support multiple simultaneous locks (flag race condition), no queue management, simple time-based expiry
- Files: `packages/server/src/utilities/redis.ts:52-90`
- Scaling path:
  - For many concurrent editors: implement queue or exclusive lock per editor
  - Replace time-based expiry with explicit release
  - Add metrics/observability for lock contention

**Quota System:**
- Current capacity: Metered quota tracking with dry-run validation
- Limit: Incremental quota results lost (only returns first result), lock-based concurrency
- Files: `packages/pro/src/sdk/quotas/quotas.ts`
- Scaling path:
  - Implement proper batch result handling
  - Consider distributed counter approach for high-concurrency scenarios
  - Add quota usage forecasting

**Chat Message Stream:**
- Current capacity: Single chat stream response per request
- Limit: Large chats may hit memory limits, tool execution is sequential
- Files: `packages/server/src/api/controllers/ai/chatConversations.ts`
- Scaling path: Implement chunked message loading, parallelize tool execution where safe

---

## Test Coverage Gaps

**Backend API Error Cases:**
- What's not tested: Comprehensive error path coverage in API controllers
- Files: `packages/server/src/api/controllers/*`
- Examples of untested scenarios:
  - Permission denial at different authorization levels
  - Concurrent request handling (race conditions)
  - Partial failures in batch operations
  - Resource cleanup on error paths
- Risk: Error handling regressions go undetected
- Priority: High - errors often the hardest to debug in production

**Frontend Type Safety:**
- What's not tested: Type narrowing and type guard behavior
- Files: `packages/frontend-core/src` (180 instances of any/unknown types)
- Risk: Type assertions mask runtime errors in UI rendering
- Priority: Medium - manifests as UI crashes for users

**Data Transformation Edge Cases:**
- What's not tested: Complete coverage of data type conversions and transformations
- Files: `packages/backend-core/src/sql/sql.ts`, field type transformations
- Examples: NULL handling, timezone edge cases (noted in mongodb.spec.ts:711), numeric type boundaries
- Risk: Data corruption or incorrect results in specific DB/field type combinations
- Priority: High - impacts data integrity

**Plugin System Isolation:**
- What's not tested: Plugin execution isolation and permission boundaries
- Files: `packages/pro/src/sdk/plugins/index.ts`
- Examples: Plugin memory leaks, infinite loops, external call attempts
- Risk: Malicious or buggy plugins crash server or compromise security
- Priority: High - security and stability impact

**SCIM Event Processing:**
- What's not tested: Full SCIM event workflow with all operation types
- Files: `packages/backend-core/src/cache/docWritethrough.ts`, SCIM routes
- Risk: Silent failures in user provisioning/deprovisioning
- Priority: Medium - impacts enterprise deployments

---

## Dependencies at Risk

**Knex.js SQL Builder:**
- Risk: Core to all SQL operations, complex query generation requires deep library knowledge
- Impact: SQL injection vulnerabilities, query optimization issues, version incompatibilities across databases
- Files: `packages/backend-core/src/sql/*.ts`
- Current version: Not specified in analysis
- Migration plan: If needed, evaluate similar libraries (TypeORM, Mikro-ORM) but requires significant refactoring

**LiteLLM Provider:**
- Risk: AI features depend on LiteLLM abstraction layer which may change API or drop providers
- Impact: AI features stop working, need to implement fallbacks
- Files: `packages/server/src/sdk/workspace/ai/llm/litellm.ts`
- Mitigation: Wrap in abstraction layer for portability
- Alternative: Direct provider integration with failover logic

**Marked.js Markdown:**
- Risk: Uses `innerHTML` to render output (XSS vector)
- Impact: Potential for DOM-based XSS if markdown contains malicious HTML
- Files: `packages/bbui/src/Markdown/MarkdownViewer.svelte:22`
- Mitigation: Input validation, output sanitization
- Alternative: Use DOMPurify or replace with safer renderer

**Svelte Framework:**
- Risk: Frontend build and component system entirely dependent on Svelte
- Impact: Framework-specific bugs, upgrade complexity
- Files: Most .svelte files across builder, client, bbui
- Mitigation: Stable version, extensive test coverage
- Risk level: Low (mature framework)

---

## Missing Critical Features

**SCIM Write Support:**
- Problem: SCIM events are silently dropped/not written
- Blocks: Enterprise user provisioning/deprovisioning integration
- Impact: Users can't use SCIM with Budibase, blocks enterprise deployments
- Status: Partially implemented with known HACK in code

**Plugin Sandboxing:**
- Problem: No sandbox isolation for plugin execution
- Blocks: Safe plugin marketplace, third-party plugin support
- Impact: Single malicious plugin can crash server or access all data
- Status: Not implemented

**Batch Operation Result Handling:**
- Problem: Quota operations lose results beyond first action
- Blocks: Complex quota workflows, reliable batch processing
- Impact: Unpredictable behavior in quota-tracked operations
- Status: Incomplete (TODO in code)

---

*Concerns audit: 2026-03-21*
