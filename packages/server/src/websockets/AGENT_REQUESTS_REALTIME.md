# Plan: actualización en tiempo real de la tabla de Agent Requests (Activity)

Contexto: la rama `operations/status-ws` parte de `operations/status` (PR
[#19124](https://github.com/Budibase/budibase/pull/19124)), que ya implementa
el ciclo de vida real de `AgentRequestStatus`
(`active | needs_input | completed | failed`,
`packages/types/src/documents/global/agentRequests.ts`). Esta tarea añade
WebSockets para que la tabla de Activity
(`packages/builder/src/pages/builder/workspace/[application]/activity/index.svelte`)
se actualice en vivo, siguiendo el mismo patrón ya usado en el resto de la
app (colaboración builder / grid) en vez de hacer polling.

Este documento describe el plan original y se va actualizando con el
progreso real. Estado actual: Fases 0, 1 y 2 completas (backend +
frontend), incluyendo un bug de mismatch dev/prod encontrado y corregido
durante las pruebas manuales, y una mejora añadida fuera del plan original
(columna "Updated" con tick periódico). Fase 3 pendiente, pero
probablemente ya cubierta sin trabajo adicional (ver esa sección).

## Hallazgos de la investigación

### Arquitectura de WebSockets existente

- `socket.io` (`packages/server/package.json`) + `@socket.io/redis-adapter`
  para multi-instancia. Solo `packages/server` implementa sockets;
  `packages/worker` no tiene ninguno.
- Tres singletons montados sobre el mismo `http.Server`, multiplexados por
  `path` (`packages/server/src/websockets/index.ts`):
  - `builderSocket` → `/socket/builder`, room = `appId` (workspace).
  - `gridSocket` → `/socket/grid`, room = `${appId}-${resourceId}`.
  - `clientAppSocket` → `/socket/client`.
- Clase base `BaseSocket` (`websocket.ts`) centraliza auth de handshake,
  gestión de rooms (`joinRoom`/`leaveRoom`), presencia en Redis y
  `emitToRoom(ctx, room, event, payload, options)`.
- Autenticación de la conexión: en el handshake se construye un contexto Koa
  "falso" (`middleware.ts: createContext`) a partir de las cookies reales de
  la petición HTTP de upgrade, y corre el mismo middleware `authenticated()`
  que usa el resto de la API REST (`packages/backend-core/src/middleware/authenticated.ts`).
  Esta parte es correcta y consistente en los tres sockets.
- Eventos definidos en `packages/shared-core/src/constants/index.ts`
  (`SocketEvent`, `GridSocketEvent`, `BuilderSocketEvent`).
- Patrón de emisión: siempre se dispara desde el **controller HTTP**, justo
  después de persistir el cambio en la capa `sdk` (nunca desde dentro del
  `sdk`), p. ej. `builderSocket?.emitRoleUpdate(ctx, role)` en
  `packages/server/src/api/controllers/role.ts`. El caso más parecido a
  "progreso incremental de una tarea en curso" es
  `BuilderSocketEvent.AutomationTestProgress`
  (`packages/server/src/api/controllers/automation.ts`).
- Cliente: `packages/frontend-core/src/utils/websocket.ts` (`createWebsocket`)
  crea la conexión (solo transporte `websocket`, reconexión limitada,
  heartbeat). Cada consumidor (builder, grid) crea su propia instancia y
  gestiona su ciclo de vida (`init()` al montar, `disconnect()` al salir). El
  store `packages/builder/src/stores/builder/websocket.ts` centraliza los
  handlers de ~15 eventos del builder, actualizando stores locales
  directamente sin refetch.
- La conexión de `builderSocket` ya está viva cuando se visita Activity,
  porque `[application]/_layout.workspace.svelte` llama a `initialise()` →
  `builderStore.init()` para todo el workspace.

### Gap de seguridad encontrado y confirmado (`BuilderSocket`)

`BuilderSocket` comprueba permisos en dos momentos, y solo el primero es
riguroso:

1. **Handshake** (`builder.ts` constructor, vía `BaseSocket`): corre
   `authorized(permissions.BUILDER)` pero **sin `appId` todavía** (no se pasa
   `options.appId` a `createContext()`). Dentro de
   `packages/server/src/middleware/authorized.ts` (`checkAuthorized`), al no
   haber `appId` (`context.getWorkspaceId()` es `undefined`), cae en la rama
   genérica `users.hasBuilderPermissions(ctx.user)` — solo comprueba que el
   usuario es builder de **algún** workspace, no del que va a pedir después.
2. **Evento `SelectApp`** (`builder.ts:30-31`): hace
   `await this.joinRoom(socket, appId)` directamente con el `appId` que
   manda el cliente, **sin volver a comprobar permisos** para ese `appId`
   concreto. `joinRoom()` (`websocket.ts`) no contiene ninguna comprobación
   de autorización.

**Consecuencia**: un usuario builder del Workspace A (sin ningún acceso al
Workspace B) puede emitir `SelectApp` con el `appId` del Workspace B y
unirse a su room sin que el servidor lo bloquee. A partir de ahí recibe la
lista de usuarios conectados a ese workspace (`callback({ users: sessions
})`) y todos los eventos futuros de ese room (`TableChange`, `RoleChange`,
`DatasourceChange`, `AutomationChange`, etc.).

`GridSocket` **no** tiene este problema: en `SelectDatasource`
(`grid.ts:71-101`) reconstruye el contexto Koa con el `appId`/`resourceId`
reales y ejecuta la cadena completa
`[userAgent, auth.buildAuthMiddleware(...), currentWorkspace, authorized(TABLE, READ)]`
en cada intento de unión a un room, desconectando el socket
(`socket.disconnect(true)`) si falla.

**Decisión confirmada con el usuario**: corregir este gap en `BuilderSocket`
(replicando el patrón de `GridSocket`) es un prerequisito (Fase 0) antes de
añadir un evento nuevo a ese canal, porque `AgentRequest` puede contener
prompts/contexto de conversación sensible por workspace y no tiene sentido
ampliar deliberadamente una fuga de datos ya real.

### Gap de arquitectura: `emitToRoom` exige `ctx`, pero no todos los orígenes de escritura lo tienen

Todos los `emit*` existentes exigen un `ctx: Ctx` de Koa real
(`emitToRoom(ctx, room, event, payload, options)`,
`websocket.ts:280-292`), porque hoy siempre se llaman desde un controller
HTTP. `AgentRequest.status` se muta desde tres sitios
(`packages/server/src/sdk/workspace/ai/agentRequests/crud.ts:
updateRequestStatus`), y dos de ellos **no tienen `ctx`**:

| Origen | Tiene `ctx` Koa | Notas |
|---|---|---|
| `packages/server/src/api/controllers/ai/chatConversations.ts` | Sí | Controller HTTP, streaming SSE — el `ctx` vive durante todo el stream. |
| `packages/server/src/sdk/workspace/ai/agentRequests/queue.ts` | No | Procesador de cola Bull (`context.doInWorkspaceContext(workspaceId, ...)`), sin request HTTP. |
| `packages/server/src/escalation/queue.ts` | No | Cola de escalación (aprobar/rechazar desde Slack/Discord/Teams), puede ejecutarse minutos/horas después de la petición original. |

**Decisión confirmada con el usuario**: en vez de replicar la llamada de
emit en los tres call sites (arriesgando que algún caller nuevo la olvide),
se dispara desde el **único punto de persistencia común**:
`saveRequest()` en `crud.ts` (todas las mutaciones de `AgentRequest` pasan
por ahí). Esto es una desviación deliberada de la convención "emit solo en
controllers", justificada porque aquí no existe un único controller que
cubra todos los caminos de escritura. Se necesita un método de emit que no
dependa de `ctx` (solo `workspaceId` + payload), usando
`context.getWorkspaceId()` dentro de `saveRequest()` para resolver el room.

## Plan de implementación

### Fase 0 — Prerequisito: seguridad + fontanería (sin esto no se empieza el resto)

1. ✅ **Hecho.** Fix de `BuilderSocket.SelectApp` (`builder.ts`): reconstruye
   el contexto Koa con el `appId` real (`createContext(this.app, socket, {
   appId })`) y ejecuta
   `[userAgent, auth.buildAuthMiddleware([], { publicAllowed: true }), currentWorkspace, authorized(permissions.BUILDER)]`
   antes de `joinRoom`, desconectando el socket si falla — mismo patrón que
   `GridSocket.SelectDatasource`. Cubierto por `builder.spec.ts` (caso
   bloqueado + caso legítimo, 9/9 tests en verde). Extraído a su propia rama
   (`fix/builder-socket-select-app-authz`, desde `master`) y PR draft
   independiente: [#19140](https://github.com/Budibase/budibase/pull/19140),
   `Addresses` →
   [Budibase/vulns#115](https://github.com/Budibase/vulns/issues/115). El
   mismo commit sigue también en `operations/status-ws` porque el resto de
   esta feature depende de él.
2. ✅ **Hecho.** Nuevo evento `AgentRequestChange` en `BuilderSocketEvent`
   (`packages/shared-core/src/constants/index.ts`).
3. ✅ **Hecho.** Método de emit sin `ctx` en `BuilderSocket`:
   `emitAgentRequestChange(workspaceId: string, payload)` (`builder.ts`),
   que llama directamente a `this.io.in(workspaceId).emit(...)` sin pasar
   por `emitToRoom(ctx, ...)`.
4. ✅ **Hecho.** Enganchado en `saveRequest()` de
   `packages/server/src/sdk/workspace/ai/agentRequests/crud.ts`, usando
   `builderSocket?.` (igual que el resto del código: en tests el socket es
   `undefined`). Ver más abajo ("Bug encontrado en pruebas manuales") por
   qué el room no se resuelve con `context.getWorkspaceId()` a secas.

### Fase 1 — Solo cambio de estado de una request existente ✅ Hecho

- Backend: `saveRequest()` emite siempre (no solo en updates de estado) el
  `AgentRequest` completo (no un payload mínimo) — más simple que
  condicionar el emit según el tipo de mutación, y ya resuelve de raíz lo
  que pedía Fase 2 (documento completo en creación) sin tener que volver
  a tocar `emitAgentRequestChange`/`saveRequest()`. `AgentRequestEntry` no
  guarda prompts ni contenido de conversación (solo `operationNames`,
  `source`, timestamps, `status`, `error`), así que emitir el documento
  entero no expone nada sensible.
- Frontend: **desviación del plan original.** `allRequests` en
  `index.svelte` es estado local del componente (`$state`), no un store
  compartido en `@/stores/builder` como `tables`/`datasources`/`roles`. No
  existe (ni existía) un `agentRequestsStore`. Centralizar el handler en
  `stores/builder/websocket.ts` habría exigido crear ese store solo para
  esta lista paginada de una única página.
  Decisión (por defecto, sin respuesta del usuario a tiempo, a confirmar):
  `index.svelte` escucha `BuilderSocketEvent.AgentRequestChange`
  directamente sobre `builderStore.websocket` dentro de un `$effect` (con
  cleanup vía `socket.off` en el retorno del efecto), actualizando
  `allRequests` con un `map` inmutable por `request._id === requestId`. Se
  usa `socket.on` (no el `onOther` habitual) porque el payload no lleva
  `apiSessionId` (ese campo solo lo añade `emitToRoom(ctx, ...)`, y este
  emit no pasa por ahí — ver punto 3 de Fase 0).
- Los tiles de resumen (`summaryMetrics` en `index.svelte`) y el panel
  lateral (`selectedRequest`) ya son `$derived.by` sobre `allRequests`, así
  que se actualizan solos sin tocarlos — confirmado en pruebas manuales.
- Tests: `crud.spec.ts` cubre que `updateRequestStatus` dispara el emit con
  el room y payload correctos (mock de `builderSocket` vía `Proxy` para no
  romper otras llamadas `emit*` que ocurren durante el bootstrap del test).

#### Bug encontrado en pruebas manuales: mismatch de room dev/prod

Tras implementar Fase 1, las pruebas manuales (aceptando un escalation real
vía Slack) mostraban el estado congelado en la UI hasta refrescar la
página, sin ningún frame WS visible en DevTools. Logs de diagnóstico
temporales confirmaron que el emit se disparaba correctamente en cada
mutación (`saveRequest` con `workspaceId` resuelto, `builderSocket`
definido) pero **`roomSize: 0` en todos los casos**, incluida la primera
transición a `active`.

Causa: la actividad de agentes (chat, escalations) corre en el contexto
del workspace **prod** (`context.getWorkspaceId()` devuelve el id sin
prefijo, p. ej. `app_xxxx...`), mientras que `BuilderSocket` siempre une al
cliente a la room del workspace **dev** (`application.appId` que llega a
`builderStore.init()` viene de una ruta de builder, que por definición
edita en dev, con prefijo `app_dev_xxxx...`). El resto de eventos
`BuilderSocketEvent` (`TableChange`, `RoleChange`, etc.) nunca habían
topado con esto porque siempre se disparan desde una petición HTTP del
propio builder (inherentemente en contexto dev) — `AgentRequestChange` es
el primer evento cuyo origen de escritura es actividad "en vivo" fuera del
builder.

Fix: en `saveRequest()`, emitir siempre a `context.getDevWorkspaceId()` en
vez de `context.getWorkspaceId()` a secas (`getDevWorkspaceId()` es un
idempotente string-transform en `@budibase/backend-core`: si ya es un id
dev lo devuelve tal cual). Test actualizado en `crud.spec.ts` para
verificar el emit contra `config.getDevWorkspaceId()` (antes comprobaba,
incorrectamente sin darse cuenta, contra el id prod porque en el test
ambos coincidían con lo que se pasaba a `doInContext`).

### Fase 2 — Nueva request aparece en la lista ✅ Hecho

- Backend: ya cubierto por el cambio de Fase 1 (documento completo emitido
  desde `saveRequest()` en toda mutación, incluida la creación vía
  `initActiveRequest`/`createNewRequest`). Test nuevo en `crud.spec.ts`
  verificando que la creación emite el `AgentRequest` completo (título ya
  generado incluido).
- Frontend (`index.svelte`): si `request._id` no existe en `allRequests`,
  se inserta al principio y se recorta a `PAGE_SIZE` (evita que la tabla
  crezca sin límite mientras el usuario permanece en la página 1). Si el
  `_id` ya existe, se reemplaza la fila entera (no un merge parcial). Solo
  se inserta en vivo si `currentPage === 1`; en otra página no hace nada
  (se verá al navegar a página 1 o refrescar).
  Decisión tomada (sin aviso tipo "N nuevas solicitudes"): se descartó el
  aviso/banner para el alcance de esta iteración, por simplicidad — es una
  mejora de UX que se puede añadir después sin tocar el backend.
- Al insertar, se llama a `hydrateUserNames([request])` para resolver el
  nombre de usuario sin esperar a un refetch completo.

### Fase 3 — Edición de una request existente actualiza tiles y panel lateral ✅ Cubierta sin trabajo adicional

- Confirmado: como Fase 1/2 emiten el `AgentRequest` completo, `$derived.by`
  para `summaryMetrics` y `selectedRequest` se recalculan solos sobre
  `allRequests` sin ningún cambio adicional. `ActivitySidePanel.svelte` usa
  formato absoluto (`dayjs(...).format(...)`) para sus fechas, no relativo,
  así que no necesitaba el fix de la columna "Updated" (ver más abajo).

### Extra (fuera del plan original) — Columna "Updated" con refresco periódico

Encontrado durante pruebas manuales: `paginatedRows` (con
`dayjs(updatedAt).fromNow()`) es un `$derived.by` sobre `allRequests`, así
que solo se recalculaba cuando los datos cambiaban (fetch o evento de
socket) — el texto relativo ("hace unos segundos") se quedaba congelado
para *todas* las filas mientras no llegara ningún cambio real, no solo
para la fila afectada.

Fix: nuevo estado `now` (`$state<number>`) que hace tick cada
`RELATIVE_TIME_REFRESH_MS` (30s) vía `setInterval` dentro de un `$effect`
con su `clearInterval` en el cleanup. `paginatedRows` usa
`dayjs(updatedAt).from(now)` en vez de `.fromNow()`, así que `now` se usa
de verdad como referencia temporal (no es una lectura "dummy" solo para
forzar recomputo) y el `$derived.by` se recalcula en cada tick para todas
las filas visibles.

## Orden de implementación

1. ✅ Fase 0 (seguridad + fontanería) — completa (puntos 1-4).
2. ✅ Fase 1 (status change) — completa, backend + frontend, incluido el
   fix del mismatch dev/prod. Verificado end-to-end con un escalation real
   (Slack) tras el fix.
3. ✅ Fase 2 (nueva request) — completa, sin trabajo de backend adicional.
4. ✅ Fase 3 — confirmada sin trabajo adicional, como se esperaba.

## Decisiones ya confirmadas con el usuario

- Corregir el gap de autorización de `BuilderSocket` **ahora**, como parte
  de esta feature (Fase 0), no como ticket aparte.
- Emitir desde un único punto (`saveRequest()` en `crud.ts`), no desde cada
  controller/cola por separado.
- Reutilizar el socket/room `builderSocket` (path `/socket/builder`, room =
  `workspaceId`) existente en vez de crear un socket nuevo. La room siempre
  es el workspace **dev** (ver "Bug encontrado en pruebas manuales" en Fase
  1) — cualquier emit futuro relacionado con `AgentRequest` debe resolver
  el room con `context.getDevWorkspaceId()`, no `getWorkspaceId()`.

## Pendiente de decidir

- Frontend: el listener sigue viviendo en `index.svelte` (no en
  `stores/builder/websocket.ts`). Con Fase 2 implementada (inserción
  incluida) sigue siendo manejable sin un store dedicado, así que se deja
  así salvo que aparezca otro consumidor de `AgentRequest` en tiempo real
  fuera de esta página.
- UX: no hay aviso tipo "N nuevas solicitudes" cuando el usuario no está en
  página 1 — posible mejora futura, no bloqueante.