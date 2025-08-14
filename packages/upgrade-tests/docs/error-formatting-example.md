# Enhanced Error Formatting Example

When a test fails, instead of seeing:

```
AxiosError: Request failed with status code 500
```

You'll now see a detailed, formatted error like this:

## Example 1: Database Connection Error with Stack Trace

```
Budibase API Error: 500 Internal Server Error

Request Details:
  Method: GET
  URL: /api/tables
  Correlation ID: a47b3c21-8d9e-4f12-b456-789012345678

Response:
  Error: Unable to connect to database
  Message: CouchDB connection refused at localhost:5984
  
  Additional Details:
    code: DB_CONNECTION_FAILED
    timestamp: 2024-01-15T10:30:45.123Z

Server Logs (Correlation ID: a47b3c21-8d9e-4f12-b456-789012345678):
  [10:30:45.120] INFO  Incoming request (method=GET, endpoint=/api/tables)
  [10:30:45.121] DEBUG Checking app context
  [10:30:45.122] ERROR Database connection failed (error=ECONNREFUSED)
           Stack: Error: connect ECONNREFUSED 127.0.0.1:5984
             at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16)
             at CouchDB.connect (couchdb.js:45:15)
             at TableController.fetch (table.controller.js:23:8)
             at processTicksAndRejections (internal/process/task_queues.js:93:5)
  [10:30:45.123] ERROR Request failed (statusCode=500, duration=3ms)
```

## Example 2: Authentication Error

```
Budibase API Error: 401 Unauthorized

Request Details:
  Method: POST
  URL: /api/applications/app_123/tables
  Correlation ID: b58c4d32-9e0f-5023-c567-890123456789
  Request Data: {
    "name": "employees",
    "schema": {
      "name": { "type": "string" }
    }
  }

Response:
  Error: Invalid API key
  Message: The provided API key is not valid for this application
  
Server Logs (Correlation ID: b58c4d32-9e0f-5023-c567-890123456789):
  [10:31:12.450] INFO  Incoming request (method=POST, endpoint=/api/applications/app_123/tables)
  [10:31:12.451] WARN  Invalid API key provided
  [10:31:12.452] ERROR Authentication failed (statusCode=401)
```

## Example 3: Validation Error

```
Budibase API Error: 400 Bad Request

Request Details:
  Method: POST
  URL: /api/rows
  Correlation ID: c69d5e43-0f1a-6134-d678-901234567890

Response:
  Error: Validation failed
  Errors:
    1. Field 'email' must be a valid email address
    2. Field 'age' must be a positive number
    3. Required field 'name' is missing

Server Logs (Correlation ID: c69d5e43-0f1a-6134-d678-901234567890):
  [10:32:45.789] INFO  Incoming request (method=POST, endpoint=/api/rows)
  [10:32:45.790] DEBUG Validating row data
  [10:32:45.791] WARN  Validation errors found (count=3)
  [10:32:45.792] ERROR Request failed (statusCode=400, duration=3ms)
```

## Example 4: Complex Error with Nested Stack Trace

```
Budibase API Error: 500 Internal Server Error

Request Details:
  Method: POST
  URL: /api/automations/test
  Correlation ID: d70e6f54-1g2b-7245-e789-012345678901

Response:
  Error: Automation execution failed
  Message: JavaScript execution error in step 'Calculate Total'
  
  Stack Trace:
    TypeError: Cannot read property 'price' of undefined
      at calculateTotal (automation.js:45:23)
      at AsyncFunction.execute (step-executor.js:78:12)
      at AutomationRunner.run (automation-runner.js:156:34)
      at async processAutomation (automation-processor.js:23:8)
      at async Queue.process (bull-queue.js:234:5)

Server Logs (Correlation ID: d70e6f54-1g2b-7245-e789-012345678901):
  [10:33:21.456] INFO  Incoming request (method=POST, endpoint=/api/automations/test)
  [10:33:21.457] INFO  Starting automation test run
  [10:33:21.458] DEBUG Executing step: Fetch Data (stepId=step_001)
  [10:33:21.512] DEBUG Step completed successfully (duration=54ms)
  [10:33:21.513] DEBUG Executing step: Calculate Total (stepId=step_002)
  [10:33:21.515] ERROR Step execution failed
           Stack: TypeError: Cannot read property 'price' of undefined
             at calculateTotal (automation.js:45:23)
             at AsyncFunction.execute (step-executor.js:78:12)
             at AutomationRunner.run (automation-runner.js:156:34)
           Error details: message: Cannot read property 'price' of undefined, code: STEP_EXECUTION_ERROR, type: TypeError
  [10:33:21.516] ERROR Automation test failed (statusCode=500, duration=60ms)
```

## Features

1. **Clear Error Summary**: Shows HTTP status code and message
2. **Request Context**: Method, URL, and unique request ID for tracking
3. **Formatted Response**: 
   - Extracts common error fields (error, message, errors array)
   - Shows stack traces when available
   - Displays additional fields in a readable format
4. **Correlated Server Logs**:
   - Color-coded log levels (ERROR=red, WARN=yellow, INFO=cyan, DEBUG=gray)
   - Timestamps with millisecond precision
   - Additional context (endpoint, method, statusCode, duration)
   - Filtered by request ID to show only relevant logs
5. **Enhanced Stack Traces**:
   - Properly indented and formatted
   - Function names and file locations highlighted
   - Line and column numbers preserved
   - Works with both response-level and log-level stack traces

This makes debugging much easier by providing all the context needed to understand what went wrong!