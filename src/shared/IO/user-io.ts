import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type { user } from "../database/models/user-model";

export type User = Readonly<InferSelectModel<typeof user>>;

export type CreateUser = Readonly<Omit<InferInsertModel<typeof user>, "id">>;

export type LoginPayload = CreateUser;
