import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

import { user } from "./user-model";

export const post = pgTable("post", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  body: text("body").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" })
});

export const postRelations = relations(post, ({ one }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id]
  })
}));
