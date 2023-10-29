import type { User } from "@root/shared/IO/user-io";

export type Claims = User;

export type RefreshClaims = Pick<User, "id">;
