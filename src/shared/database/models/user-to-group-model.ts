import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { group } from "./group-model";
import { user } from "./user-model";

export const userToGroup = pgTable(
  "user_to_group",
  {
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    groupId: integer("groupId")
      .notNull()
      .references(() => group.id, { onDelete: "cascade", onUpdate: "cascade" })
  },
  table => ({
    userToGroupPkey: primaryKey(table.userId, table.groupId)
  })
);

export const userToGroupRelations = relations(userToGroup, ({ one }) => ({
  group: one(group, {
    fields: [userToGroup.groupId],
    references: [group.id]
  }),
  user: one(user, {
    fields: [userToGroup.userId],
    references: [user.id]
  })
}));
