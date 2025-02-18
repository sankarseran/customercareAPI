import { FastifyInstance } from "fastify";
import * as pg from "pg";
import { db } from "./plugins/db";
import { routes } from "./routes";
import queuePlugin from "./plugins/queue";

type Opts = {
  db: pg.PoolConfig;
};

export async function api(instance: FastifyInstance, opts: Opts) {
  instance.register(db, opts.db).register(queuePlugin).register(routes);
}
