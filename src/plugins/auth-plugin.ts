import bearer from "@elysiajs/bearer";
import type { JWTPayloadSpec } from "@elysiajs/jwt";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import * as B from "fp-ts/boolean";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";

import { authError } from "@root/shared/errors/auth-error";
import { encodeError } from "@root/shared/errors/encode";
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
        secret:
          process.env[extract === "access" ? "JWT_SECRET" : "REFRESH_SECRET"]!
      })
    )
    .derive<Promise<{ claims: O & JWTPayloadSpec }>>(({ bearer, jwt, body }) =>
      pipe(
        TE.tryCatch(
          () =>
            pipe(
              extract === "access",
              B.foldW(
                () => (body as { token: string }).token,
                () => bearer
              ),
              jwt.verify
            ),
          e => infrastructureError(JSON.stringify(e))
        ),
        TE.map(claims => claims || null),
        TE.chainW(TE.fromNullable(authError("unauthorized"))),
        TE.match(encodeError, claims => ({
          claims: {
            ...claims,
            id: Number(claims.id)
            //eslint-disable-next-line
          } as any
        }))
      )()
    );
