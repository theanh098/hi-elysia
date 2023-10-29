import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { post } from "./post-model";
import { userToGroup } from "./user-to-group-model";

export const user = pgTable("user", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 26 }).notNull().unique(),
  password: varchar("password").notNull()
});

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  userToGroups: many(userToGroup)
}));
