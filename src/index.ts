import { api } from "./api";
// import { whenProcessExit } from "./lib/process/when-process-exit";
import fastify from "fastify";
import { env } from "./lib/env";
import { once } from "events";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

(async function () {
  const server = fastify({
    logger: { level: "debug" },
  })
    .register(fastifyCors)
    .register(fastifySwagger, {
      swagger: {
        info: {
          title: "Customer Care ticking API",
          description: "Customer Care ticking API documentation",
          version: "1.0.0",
        },
        host: "localhost:8000",
        basePath: "/api/v1",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
      },
    })
    .register(fastifySwaggerUi, {
      routePrefix: "/docs",
    })
    .register(api, {
      prefix: "/api/v1",
      db: {
        host: env.PGHOST,
        port: env.PGPORT,
        user: env.PGUSER,
        password: env.PGPASSWORD,
        database: env.PGDATABASE,
      },
    });
  try {
    await server.listen({ host: "0.0.0.0", port: 8000 });
    await Promise.race([once(process, "SIGINT"), once(process, "SIGTERM")]);
    server.log.info("Terminating...");
    await server.close();
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
