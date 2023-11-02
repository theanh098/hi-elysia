import bearer from "@elysiajs/bearer";
import type { JWTPayloadSpec } from "@elysiajs/jwt";
import jwt from "@elysiajs/jwt";
import { Boolean, Effect, flow, pipe } from "effect";
import Elysia from "elysia";

import { genericPromise } from "@root/helpers/generic-promise";
import { readConfig } from "@root/helpers/read-config";
import { authError } from "@root/shared/errors/auth-error";
import { infrastructureError } from "@root/shared/errors/infrastructure-error";
import type { Claims, RefreshClaims } from "@root/types/auth";

export const authPlugin = <
  I extends "refresh" | "access",
  O = I extends "refresh" ? RefreshClaims : Claims
>(
  extract = "access" as I
) =>
  new Elysia()
    .use(bearer())
    .use(
      jwt({
        secret: pipe(
          extract === "access",
          Boolean.match({
            onFalse: () => "REFRESH_SECRET",
            onTrue: () => "JWT_SECRET"
          }),
          readConfig,
          Effect.runSync
        )
      })
    )
    .derive<Promise<{ claims: O & JWTPayloadSpec }>>(({ bearer, jwt, body }) =>
      genericPromise(
        pipe(
          extract === "access",
          Boolean.match({
            onFalse: () => (body as { token: string }).token,
            onTrue: () => bearer
          }),
          token =>
            Effect.tryPromise({
              try: () => jwt.verify(token),
              catch: infrastructureError
            }),
          Effect.map(claims => claims || null),
          Effect.flatMap(
            flow(
              Effect.fromNullable,
              Effect.mapError(() => authError("unAuthorized"))
            )
          ),
          Effect.map(claims => ({
            claims: {
              ...claims,
              id: Number(claims.id)
              //eslint-disable-next-line
            } as any
          }))
        )
      )
    );
