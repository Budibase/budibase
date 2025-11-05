# Backend System

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:

- [lerna.json](https://github.com/Budibase/budibase/blob/e981536b/lerna.json)
- [packages/backend-core/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/package.json)
- [packages/backend-core/src/context/index.ts](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/context/index.ts)
- [packages/backend-core/src/db/couch/index.ts](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/db/couch/index.ts)
- [packages/backend-core/src/db/index.ts](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/db/index.ts)
- [packages/backend-core/src/index.ts](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/index.ts)
- [packages/bbui/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/bbui/package.json)
- [packages/builder/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/builder/package.json)
- [packages/cli/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/cli/package.json)
- [packages/client/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/client/package.json)
- [packages/frontend-core/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/frontend-core/package.json)
- [packages/server/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json)
- [packages/string-templates/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/string-templates/package.json)
- [packages/types/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/types/package.json)
- [packages/worker/package.json](https://github.com/Budibase/budibase/blob/e981536b/packages/worker/package.json)

</details>



The Backend System of Budibase forms the core server-side infrastructure that powers the low-code platform. This document describes the architecture and components of the backend system, which consists of the Server API, Worker Service, and shared backend modules. For information about data management and operations, see [Data Management](#3), and for automation details, see [Automation System](#4).

## Overview

Budibase's backend system uses a microservices-like architecture with two primary components:

- **Server API**: Handles HTTP requests, manages application data, and provides API endpoints for the builder and published applications
- **Worker Service**: Processes background tasks, executes automation jobs, and handles resource-intensive operations

Both components share common functionality through the `@budibase/backend-core` package, which provides utilities for database access, authentication, caching, and more.

Sources:
- [packages/server/package.json:1-225](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json#L1-L225)
- [packages/worker/package.json:1-123](https://github.com/Budibase/budibase/blob/e981536b/packages/worker/package.json#L1-L123)
- [packages/backend-core/package.json:1-119](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/package.json#L1-L119)

## Backend Architecture

### High-Level Architecture

```mermaid
flowchart TD
    subgraph "Clients"
        Builder["Builder UI"]
        PublishedApp["Published Applications"]
    end

    subgraph "Backend System"
        Server["Server API\n(@budibase/server)"]
        Worker["Worker Service\n(@budibase/worker)"]
        BackendCore["Backend Core\n(@budibase/backend-core)"]
        
        Server --> |uses| BackendCore
        Worker --> |uses| BackendCore
    end

    subgraph "Data Storage"
        CouchDB[("CouchDB\nApplication Data")]
        Redis[("Redis\nCache & Queues")]
        ObjectStore[("Object Store\nS3/Minio/Local")]
    end

    subgraph "External Services"
        ExternalDB[("External Databases\nSQL, NoSQL, etc.")]
        Auth["Authentication Providers"]
    end

    Builder --> |HTTP Requests| Server
    PublishedApp --> |HTTP Requests| Server
    
    Server --> |stores app data| CouchDB
    Server --> |caching & queuing| Redis
    Server --> |file storage| ObjectStore
    Server --> |queries| ExternalDB
    Server --> |delegates jobs| Worker
    
    Worker --> |executes automations| Worker
    Worker --> |reads/writes| CouchDB
    Worker --> |uses| Redis
    
    Server --> |authenticates| Auth
    Worker --> |authenticates| Auth
```

The Server and Worker components share a common architecture pattern:
- Both run as Node.js services
- Both use the same core libraries from `@budibase/backend-core`
- Both interact with CouchDB for data storage and Redis for caching/messaging

The primary difference is their responsibility: the Server handles real-time API requests while the Worker processes background tasks.

Sources:
- [packages/server/package.json:50-138](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json#L50-L138)
- [packages/worker/package.json:40-78](https://github.com/Budibase/budibase/blob/e981536b/packages/worker/package.json#L40-L78)
- [packages/backend-core/package.json:32-74](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/package.json#L32-L74)

### Package Dependencies

```mermaid
graph TD
    Server["@budibase/server"]
    Worker["@budibase/worker"]
    BackendCore["@budibase/backend-core"]
    Types["@budibase/types"]
    SharedCore["@budibase/shared-core"]
    StringTemplates["@budibase/string-templates"]
    
    Server --> |depends on| BackendCore
    Server --> |depends on| Types
    Server --> |depends on| SharedCore
    Server --> |depends on| StringTemplates
    
    Worker --> |depends on| BackendCore
    Worker --> |depends on| Types
    Worker --> |depends on| SharedCore
    Worker --> |depends on| StringTemplates
    
    BackendCore --> |depends on| Types
    BackendCore --> |depends on| SharedCore
```

The backend packages form a hierarchy with `@budibase/types` providing common type definitions, `@budibase/backend-core` providing shared functionality, and `@budibase/server` and `@budibase/worker` implementing specific services.

Sources:
- [packages/server/package.json:51-138](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json#L51-L138)
- [packages/worker/package.json:40-78](https://github.com/Budibase/budibase/blob/e981536b/packages/worker/package.json#L40-L78)
- [packages/backend-core/package.json:32-74](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/package.json#L32-L74)
- [lerna.json:1-20](https://github.com/Budibase/budibase/blob/e981536b/lerna.json#L1-L20)

## Server Component

The Server component (`@budibase/server`) is the primary entry point for API requests from both the builder interface and published applications. It provides RESTful APIs for:

- Application management (CRUD operations)
- Data management (tables, rows, views)
- User authentication and authorization
- File management
- Real-time data synchronization

### Key Modules

The Server exposes numerous modules for handling different aspects of the application:

```mermaid
flowchart TD
    API["API Layer"] --> Controllers["Controllers"]
    Controllers --> SDK["SDK Layer"]
    SDK --> DataAccess["Data Access Layer"]
    
    subgraph "Controllers"
        AppController["App Controller"]
        RowController["Row Controller"]
        UserController["User Controller"]
        AuthController["Auth Controller"]
        ViewController["View Controller"]
        AutomationController["Automation Controller"]
    end
    
    subgraph "Data Access"
        CouchDB[("CouchDB Access")]
        ExternalDBs[("External DB Access")]
        ObjectStore[("Object Storage")]
    end
    
    subgraph "Supporting Services"
        EventEmitter["Event Emitter"]
        SocketIO["Socket.IO Server"]
        TemplateEngine["Template Engine"]
        JSRunner["JS Runner (Isolated VM)"]
    end
    
    Controllers --> SDK
    SDK --> DataAccess
    SDK --> TemplateEngine
    SDK --> JSRunner
    Controllers --> EventEmitter
    EventEmitter --> |triggers| AutomationQueue["Automation Queue"]
    AutomationQueue --> |sends to| Worker["Worker Service"]
    API --> SocketIO
```

The Server includes several specialized components:
- **JS Runner**: Executes JavaScript in isolated environments using `isolated-vm`
- **Template Engine**: Processes Handlebars templates using `@budibase/string-templates`
- **Socket.IO**: Provides real-time updates to clients

Sources:
- [packages/server/package.json:51-138](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json#L51-L138)
- [packages/backend-core/src/index.ts:1-59](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/index.ts#L1-L59)

## Worker Component

The Worker component (`@budibase/worker`) handles background tasks and resource-intensive operations to prevent blocking the main server. Its primary responsibilities include:

- Executing automation workflows
- Processing queued jobs using Bull
- Handling email notifications
- User management and authentication-related tasks
- Scheduled tasks

### Automation Processing Architecture

```mermaid
flowchart TB
    Server["Server API"] --> |enqueues job| Redis[("Redis Queue")]
    Redis --> |job consumed by| Worker["Worker Service"]
    
    subgraph "Worker Internals"
        JobProcessor["Job Processor"]
        AutomationOrchestrator["Automation Orchestrator"]
        StepExecutor["Step Executor"]
        
        JobProcessor --> |routes job to| AutomationOrchestrator
        AutomationOrchestrator --> |executes steps via| StepExecutor
    end
    
    Worker --> JobProcessor
    
    StepExecutor --> |reads/writes| CouchDB[("CouchDB")]
    StepExecutor --> |makes requests to| ExternalServices["External Services"]
    StepExecutor --> |sends emails via| EmailService["Email Service"]
    
    JobProcessor --> |reports status to| Server
```

The Worker leverages Bull (backed by Redis) for job queue management, ensuring:
- Job persistence in case of crashes
- Retries for failed jobs
- Job scheduling
- Job prioritization

Sources:
- [packages/worker/package.json:40-78](https://github.com/Budibase/budibase/blob/e981536b/packages/worker/package.json#L40-L78)
- [packages/backend-core/package.json:32-74](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/package.json#L32-L74)

## Backend Core

The `@budibase/backend-core` package provides shared functionality used by both the Server and Worker components. It contains modules for:

```mermaid
flowchart LR
    BackendCore["@budibase/backend-core"]
    
    BackendCore --> DB["Database\nAccess"]
    BackendCore --> Auth["Authentication\n& Security"]
    BackendCore --> Cache["Caching"]
    BackendCore --> Queue["Queue\nManagement"]
    BackendCore --> ObjectStore["Object\nStore"]
    BackendCore --> Context["Context &\nTenancy"]
    BackendCore --> Events["Event\nEmission"]
    BackendCore --> Encryption["Encryption"]
    BackendCore --> Utils["Utilities"]
    
    DB --> CouchDB["CouchDB/PouchDB\nConnections"]
    DB --> Views["View\nQueries"]
    DB --> Replication["Database\nReplication"]
    
    Auth --> Sessions["Session\nManagement"]
    Auth --> Roles["Role-based\nAccess Control"]
    Auth --> Permissions["Permission\nChecking"]
    
    Cache --> Redis["Redis\nClient"]
    Queue --> Bull["Bull\nQueues"]
    
    Context --> Identity["Identity\nManagement"]
    Context --> TenantContext["Tenant\nContext"]
```

Key functionality provided by Backend Core:

1. **Database Access**: CouchDB/PouchDB connections, query building, replication
2. **Authentication**: User management, session handling, role-based access control
3. **Caching**: Redis-based caching for performance optimization
4. **Queue Management**: Bull queues backed by Redis
5. **Context Management**: Multi-tenant context handling
6. **Object Storage**: S3-compatible storage abstraction

Sources:
- [packages/backend-core/src/index.ts:1-59](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/index.ts#L1-L59)
- [packages/backend-core/src/context/index.ts:1-4](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/context/index.ts#L1-L4)
- [packages/backend-core/src/db/index.ts:1-13](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/db/index.ts#L1-L13)
- [packages/backend-core/src/db/couch/index.ts:1-5](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/db/couch/index.ts#L1-L5)

## Database Architecture

Budibase uses a multi-database architecture:

1. **CouchDB/PouchDB**: Primary data store for application data
   - Each application has its own database
   - Global database for tenant/user management
   
2. **Redis**: Used for:
   - Caching
   - Job queues
   - Session storage
   - Pub/sub messaging
   
3. **External Databases**: Integrated through connectors:
   - SQL: PostgreSQL, MySQL, SQL Server, Oracle, SQLite
   - NoSQL: MongoDB, DynamoDB, Firestore
   - Spreadsheets: Google Sheets, Airtable
   - Other data sources via REST APIs

### Database Access Layer

```mermaid
flowchart TD
    API["API Request"] --> Controllers["Controllers"]
    Controllers --> |uses| RowSDK["Row SDK"]
    
    RowSDK --> |internal tables| Internal["Internal Database Handler"]
    RowSDK --> |external tables| External["External Database Handler"]
    
    Internal --> |reads/writes| CouchDB[("CouchDB\nPer-App Databases")]
    
    External --> |SQL| SQLDatabases[("PostgreSQL, MySQL,\nSQL Server, etc.")]
    External --> |NoSQL| NoSQLDatabases[("MongoDB, DynamoDB,\nFirestore, etc.")]
    External --> |API| APIDataSources[("REST APIs,\nAirtable, Google Sheets")]
    
    subgraph "Object Storage"
        ObjectStoreSDK["Object Store SDK"]
        ObjectStoreSDK --> |files, attachments| S3Compatible[("S3, MinIO,\nLocal Filesystem")]
    end
    
    Controllers --> |file operations| ObjectStoreSDK
```

The database layer is abstracted to provide a consistent interface regardless of whether data is stored internally in CouchDB or in external data sources.

Sources:
- [packages/server/package.json:51-138](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json#L51-L138)
- [packages/backend-core/src/db/index.ts:1-13](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/db/index.ts#L1-L13)
- [packages/backend-core/package.json:32-74](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/package.json#L32-L74)

## Multi-Tenancy Architecture

Budibase supports multi-tenancy, allowing multiple organizations to use the same Budibase instance with data isolation. The tenant context system ensures data separation:

```mermaid
flowchart TD
    Request["HTTP Request"] --> |contains tenant ID| Context["Context Middleware"]
    Context --> |sets context for request| TenantContext["Tenant Context"]
    
    TenantContext --> |scopes db operations| Database["Database Operations"]
    TenantContext --> |scopes cache operations| Cache["Cache Operations"]
    TenantContext --> |scopes object store operations| ObjectStore["Object Store Operations"]
    
    Database --> |tenant prefixed DB names| CouchDB[("CouchDB\nper-tenant databases")]
    Cache --> |tenant prefixed keys| Redis[("Redis\nNamespaced Keys")]
    ObjectStore --> |tenant prefixed paths| S3[("Object Storage\nNamespaced Paths")]
```

The tenant context system ensures:
- Data isolation between tenants
- Proper routing of requests to tenant-specific resources
- Simplified code that doesn't need to handle tenant routing explicitly

Sources:
- [packages/backend-core/src/context/index.ts:1-4](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/context/index.ts#L1-L4)
- [packages/backend-core/src/index.ts:36-45](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/src/index.ts#L36-L45)

## Real-time Communication

Budibase implements real-time updates using Socket.IO backed by Redis for pub/sub communication:

```mermaid
flowchart TD
    Client["Client Application"] --> |establishes| SocketConnection["Socket.IO Connection"]
    
    SocketConnection --> |authenticated with| Server["Server API"]
    
    Server --> |subscribes client to| AppChannel["Application Channel"]
    
    Database["Database Operation"] --> |emits| DataEvent["Data Change Event"]
    DataEvent --> |published to| Redis[("Redis Pub/Sub")]
    Redis --> |consumed by| Server
    Server --> |broadcasts to| AppChannel
    AppChannel --> |pushes updates to| Client
```

This architecture enables:
- Real-time data synchronization across clients
- Notifications for data changes
- Support for collaborative features

Sources:
- [packages/server/package.json:106-130](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json#L106-L130)
- [packages/backend-core/package.json:57-63](https://github.com/Budibase/budibase/blob/e981536b/packages/backend-core/package.json#L57-L63)

## Integration with Frontend

The backend system provides API endpoints that interface with the frontend components:

1. **Builder Interface**: Makes API calls to design and configure applications
2. **Published Applications**: Makes API calls to fetch and manipulate data
3. **Client Library**: Provides JavaScript bindings for API interaction

The API layer is RESTful with some WebSocket capabilities for real-time updates. Authentication is typically handled through JWT tokens.

Sources:
- [packages/server/package.json:51-138](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json#L51-L138)
- [packages/client/package.json:1-74](https://github.com/Budibase/budibase/blob/e981536b/packages/client/package.json#L1-L74)
- [packages/builder/package.json:1-145](https://github.com/Budibase/budibase/blob/e981536b/packages/builder/package.json#L1-L145)

## Backend Development Workflow

The backend services are built using TypeScript and follow a modular architecture. The development workflow typically involves:

1. Running services with `yarn dev` for hot reloading
2. Building with `yarn build` for production
3. Testing with Jest through `yarn test`

Both server and worker can run independently or together, with communication through Redis for coordination.

Sources:
- [packages/server/package.json:11-44](https://github.com/Budibase/budibase/blob/e981536b/packages/server/package.json#L11-L44)
- [packages/worker/package.json:14-36](https://github.com/Budibase/budibase/blob/e981536b/packages/worker/package.json#L14-L36)