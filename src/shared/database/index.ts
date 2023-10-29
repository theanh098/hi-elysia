import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgSchema } from "drizzle-orm/pg-core";
import type { PoolConfig } from "pg";
import { Pool } from "pg";

import {
  group,
  groupRelations
} from "@root/shared/database/models/group-model";
import { post, postRelations } from "@root/shared/database/models/post-model";
import { user, userRelations } from "@root/shared/database/models/user-model";
import {
  userToGroup,
  userToGroupRelations
} from "@root/shared/database/models/user-to-group-model";

type ObjectValues<T> = T[keyof T];

const tables = {
  post,
  user,
  group,
  userToGroup
};

const schema = {
  ...tables,
  userRelations,
  postRelations,
  groupRelations,
  userToGroupRelations
};

export type Database = NodePgDatabase<typeof schema>;

export type ElysiaTable = ObjectValues<typeof tables>;

export const drizzleSchema = pgSchema("drizzle");

export const getDatabase = (config: PoolConfig): Database => {
  const pool = new Pool(config);
  return drizzle(pool, {
    schema
  });
};
