# CDRL — M01 Contrato de datos y entorno reproducible

Implementacion del hito **[Semana 01] M01** para Cloud Data Reliability Lab. El repositorio define un contrato relacional de telemetria en PostgreSQL 16, migraciones SQL versionadas, seed sintetico reproducible, pruebas automaticas y evidencia machine-readable.

## Interfaz de entrega

```sh
make setup
make verify
make run
```

En Windows, si `make` no esta instalado, los comandos equivalentes son:

```sh
npm ci
npm run setup:db
npm run verify
npm run run
```

## Requisitos

- Docker Desktop con Docker Compose.
- Node.js 20 o superior.
- Git.

## Estructura

```text
db/migrations/        Migraciones SQL versionadas
db/seed/              Seed sintetico determinista
docs/                 ADR y reporte tecnico
scripts/              Automatizacion reproducible
tests/                Pruebas del contrato de datos
artifacts/            Resultado machine-readable
evidence/             Evidencia solicitada por Classroom
```

## Casos cubiertos

- Caso normal: insertar y leer un evento `temperature_c`.
- Caso limite 1: `battery_pct` acepta el limite inferior `0`.
- Caso limite 2: `humidity_pct` acepta el limite superior `100`.
- Fallo declarado: `battery_pct` mayor a `100` se rechaza por restriccion `CHECK`.

## Seguridad

No se guardan credenciales, tokens, datos personales ni cadenas de conexion privadas. `.env.example` contiene valores sinteticos de desarrollo; `.env` esta ignorado por Git.

## Entrega en Classroom

Entregar:

- URL del repositorio de equipo.
- Tag `week-01-final`.
- SHA exacto del tag.
- Salida de `make verify`.
- `evidence/m01-data-contract.json`.
