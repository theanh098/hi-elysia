import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type { post } from "../database/models/post-model";

export type Post = InferSelectModel<typeof post>;

export type CreatePost = Readonly<Omit<InferInsertModel<typeof post>, "id">>;
