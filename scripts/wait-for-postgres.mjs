import { setTimeout as sleep } from "node:timers/promises";
import { createClient } from "../src/db.mjs";

const maxAttempts = Number(process.env.POSTGRES_WAIT_ATTEMPTS ?? 30);

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  const client = createClient();
  try {
    await client.connect();
    await client.query("select 1");
    await client.end();
    console.log("PostgreSQL is ready");
    process.exit(0);
  } catch (error) {
    try {
      await client.end();
    } catch {
      // Ignore close errors while the container is still booting.
    }

    if (attempt === maxAttempts) {
      console.error("PostgreSQL did not become ready in time");
      console.error(error.message);
      process.exit(1);
    }

    await sleep(1000);
  }
}
