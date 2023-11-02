import jwt from "@elysiajs/jwt";
import { readConfig } from "@root/helpers/read-config";
import { Effect } from "effect";
import Elysia from "elysia";

export const signingJwtPlugin = new Elysia()
  .use(
    jwt({
      secret: readConfig("JWT_SECRET").pipe(Effect.runSync),
      name: "jwtAccess",
      exp: "3d"
    })
  )
  .use(
    jwt({
      secret: readConfig("JWT_REFRESH").pipe(Effect.runSync),
      name: "jwtRefresh",
      exp: "90d"
    })
  );
