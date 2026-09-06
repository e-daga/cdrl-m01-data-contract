# ADR-001 — Contrato de datos de telemetria con PostgreSQL

## Estado

Aceptado para M01.

## Contexto

M01 solicita un contrato de datos de telemetria y una base relacional compatible con cloud, con migraciones, seed sintetico, pruebas automaticas, reporte machine-readable y evidencia. El repositorio debe poder ejecutarse con `make setup`, `make verify` y `make run` sin credenciales ni cadenas de conexion privadas.

## Decision

Se usa PostgreSQL 16 como motor relacional principal y Docker Compose como entorno reproducible local. PostgreSQL es compatible con servicios cloud administrados como Amazon RDS y permite expresar el contrato de datos con tipos, llaves, indices y restricciones `CHECK`.

La automatizacion del hito se implementa con Node.js 20:

- `scripts/migrate.mjs` aplica SQL versionado desde `db/migrations/` y registra checksum en `schema_migrations`.
- `scripts/seed.mjs` carga datos sinteticos deterministas desde `db/seed/`.
- `tests/telemetry-contract.test.mjs` valida un caso normal, dos casos limite y un fallo declarado.
- `scripts/verify.mjs` genera `artifacts/m01-verify.json` con resultado machine-readable.

El contrato inicial define:

- `devices`: catalogo de dispositivos sinteticos.
- `telemetry_events`: eventos de telemetria con tipo, tiempo observado, valor, unidad, severidad, fuente y payload JSON.
- Restricciones para tipos permitidos, severidad permitida, payload como objeto JSON, rango de bateria y rango de humedad.

## Alternativas Consideradas

- Python + pytest + psycopg: buena alternativa, pero la laptop actual no tiene Python instalado. Node.js 20 si esta disponible.
- ORM completo: descartado porque M01 evalua principalmente el contrato relacional y la reproducibilidad; SQL directo es mas facil de revisar y defender.
- DynamoDB local: descartado para M01 porque el objetivo especifica base relacional compatible con cloud.

## Consecuencias

La solucion es pequena, auditable y portable a CI. El equipo puede defender cada restriccion desde SQL sin depender de comportamiento oculto de una aplicacion.

La evidencia final debe incluir el SHA exacto del tag `week-01-final` en Classroom. El archivo `evidence/m01-data-contract.json` conserva el campo `commitSha` como marcador porque incrustar el SHA final dentro de un archivo versionado vuelve el SHA autoreferencial.

## Seguridad

El repositorio solo contiene valores sinteticos de desarrollo en `.env.example`. El archivo `.env` esta ignorado por Git. No se deben subir tokens, credenciales personales, dumps reales ni cadenas de conexion privadas.
