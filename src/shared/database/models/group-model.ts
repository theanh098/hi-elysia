import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { userToGroup } from "./user-to-group-model";

export const group = pgTable("group", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 26 }).notNull().unique()
});

export const groupRelations = relations(group, ({ many }) => ({
  userToGroups: many(userToGroup)
}));
