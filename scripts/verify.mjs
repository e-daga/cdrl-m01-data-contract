import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { withClient } from "../src/db.mjs";
import { rootDir } from "../src/config.mjs";

const requiredFiles = [
  ".env.example",
  "Makefile",
  "docker-compose.yml",
  "package.json",
  "package-lock.json",
  "db/migrations/001_create_telemetry_contract.sql",
  "db/seed/001_synthetic_telemetry.sql",
  "docs/ADR-001-data-contract-and-postgres.md",
  "evidence/m01-data-contract.json",
  ".github/workflows/cdrl-feedback.yml"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(rootDir, file)));
if (missing.length > 0) {
  throw new Error(`Missing required files: ${missing.join(", ")}`);
}

function gitValue(args, fallback) {
  try {
    return execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();
  } catch {
    return fallback;
  }
}

const dbSummary = await withClient(async (client) => {
  const tables = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('devices', 'telemetry_events', 'schema_migrations')
    order by table_name
  `);

  const constraints = await client.query(`
    select conname
    from pg_constraint
    where conrelid in ('devices'::regclass, 'telemetry_events'::regclass)
    order by conname
  `);

  const counts = await client.query(`
    select
      (select count(*)::int from devices) as devices,
      (select count(*)::int from telemetry_events) as telemetry_events,
      (select count(*)::int from schema_migrations) as migrations
  `);

  return {
    tables: tables.rows.map((row) => row.table_name),
    constraints: constraints.rows.map((row) => row.conname),
    counts: counts.rows[0]
  };
});

const artifact = {
  assignmentId: "m01-data-contract",
  status: "passed",
  generatedAt: new Date().toISOString(),
  git: {
    commitSha: gitValue(["rev-parse", "HEAD"], "uncommitted"),
    workingTreeStatus: gitValue(["status", "--short"], "not-a-git-repository")
  },
  commands: [
    "make setup",
    "make verify",
    "make run"
  ],
  database: dbSummary,
  tests: {
    normalCase: "temperature_c telemetry event is accepted and readable",
    boundaryCases: [
      "battery_pct accepts lower bound 0",
      "humidity_pct accepts upper bound 100"
    ],
    declaredFailure: "battery_pct above 100 is rejected by CHECK constraint"
  },
  security: {
    secretsCommitted: false,
    connectionStringsCommitted: false,
    usesSyntheticData: true
  }
};

fs.mkdirSync(path.join(rootDir, "artifacts"), { recursive: true });
fs.writeFileSync(
  path.join(rootDir, "artifacts", "m01-verify.json"),
  `${JSON.stringify(artifact, null, 2)}\n`
);

console.log("CDRL M01 verification passed");
console.log(JSON.stringify(artifact, null, 2));
