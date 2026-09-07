# CDRL - M01 contrato de datos

Repositorio del equipo para el hito **M01 - Contrato de datos y entorno reproducible**.

La idea de esta entrega es dejar una base relacional sencilla para recibir telemetria. Usamos PostgreSQL 16 con Docker Compose, migraciones SQL, datos de prueba sinteticos y pruebas automaticas para comprobar que el contrato acepta datos validos y rechaza un caso invalido.

## Como correrlo

```sh
make setup
make verify
make run
```

En Windows puede pasar que `make` no este instalado. En ese caso se puede correr lo mismo con npm:

```sh
npm ci
npm run verify
npm run run
```

`make verify` tambien levanta PostgreSQL, aplica migraciones y carga el seed antes de correr pruebas. Esto ayuda cuando se ejecuta la verificacion directamente en otra computadora.

## Requisitos usados

- Docker Desktop con Docker Compose.
- Node.js 20 o superior.
- Git.

## Carpetas principales

```text
db/migrations/        migraciones SQL
db/seed/              datos sinteticos iniciales
docs/                 decisiones tecnicas
scripts/              scripts para setup, verify y run
tests/                pruebas automaticas
artifacts/            salida JSON de verificacion
evidence/             evidencia para Classroom
```

## Pruebas incluidas

- Caso normal: insertar y leer un evento `temperature_c`.
- Caso limite 1: `battery_pct` acepta el limite inferior `0`.
- Caso limite 2: `humidity_pct` acepta el limite superior `100`.
- Fallo declarado: `battery_pct` mayor a `100` se rechaza por restriccion `CHECK`.

## Seguridad

No se suben credenciales, tokens, datos personales ni cadenas de conexion privadas. El archivo `.env.example` trae valores locales de ejemplo y `.env` queda fuera de Git.

## Entrega en Classroom

- URL del repositorio de equipo.
- Tag `week-01-final`.
- SHA exacto del tag.
- Salida de `make verify`.
- `evidence/m01-data-contract.json`.
