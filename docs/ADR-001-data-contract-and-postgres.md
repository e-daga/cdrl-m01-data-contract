# ADR-001 - Contrato de datos de telemetria

## Estado

Aceptado para M01.

## Contexto

Para M01 se pide definir un contrato de datos de telemetria y levantar una base relacional que se pueda reproducir. Tambien se pide dejar migraciones, seed sintetico, pruebas automaticas, un archivo JSON de resultado y evidencia para Classroom.

## Decision

Se usa PostgreSQL 16 porque es relacional, se puede correr localmente con Docker Compose y despues se puede mover a un servicio administrado en cloud, por ejemplo Amazon RDS.

Tambien usamos Node.js 20 para los scripts del hito:

- `scripts/migrate.mjs` aplica SQL versionado desde `db/migrations/` y registra checksum en `schema_migrations`.
- `scripts/seed.mjs` carga datos sinteticos deterministas desde `db/seed/`.
- `tests/telemetry-contract.test.mjs` valida un caso normal, dos casos limite y un fallo declarado.
- `scripts/verify.mjs` genera `artifacts/m01-verify.json`.

Tablas principales:

- `devices`: dispositivos de prueba.
- `telemetry_events`: eventos de telemetria con tipo, tiempo observado, valor, unidad, severidad, fuente y payload JSON.

El contrato se refuerza con restricciones `CHECK` para tipos de evento, severidad, payload JSON, rango de bateria y rango de humedad.

## Alternativas consideradas

- Python + pytest + psycopg: tambien servia, pero en la laptop actual no estaba instalado Python.
- ORM completo: no se uso porque para esta entrega era mas claro dejar el SQL directo.
- DynamoDB local: no se uso porque M01 pide una base relacional.

## Consecuencias

La solucion queda pequena y facil de revisar. La parte mas importante esta en SQL, asi que se puede explicar desde las tablas y restricciones sin depender de una aplicacion grande.

El SHA exacto del tag `week-01-final` se entrega en Classroom. En `evidence/m01-data-contract.json` se deja un marcador porque poner el SHA final dentro del mismo commit cambiaria el SHA otra vez.

## Seguridad

El repo solo trae datos sinteticos y valores locales de ejemplo. No se deben subir tokens, credenciales, dumps reales ni cadenas de conexion privadas.
